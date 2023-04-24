import * as os from 'os';
import { GitInfo } from './interface/git-info.interface';
import { ConfigRepository } from '../../config/config.repository';
import { MiscRepository } from '../misc/misc.repository';

export class GitService {
  private readonly TAG = GitService.name;

  public async fetchGitInfo(): Promise<GitInfo> {
    try {
      const [branchName, config, hash] = await Promise.all([
        MiscRepository.commandExec('git branch --show-current'), // or git name-rev --name-only HEAD
        MiscRepository.commandExec('git config --list'),
        MiscRepository.commandExec('git rev-parse HEAD'),
      ]);
      return {
        userName: this.fetchUserName(config),
        branchName: MiscRepository.convertChar(branchName, '\n', ''),
        hash: MiscRepository.convertChar(hash, '\n', ''),
        revision: hash.slice(0, 7),
      } as GitInfo;
    } catch (e) {
      console.error(this.TAG, 'git-command', e);
      return;
    }
  }

  // === private ===
  private fetchUserName(param: string): string {
    let userName = ConfigRepository.getCustom()?.userName;
    if (!userName) {
      // convert new-line character
      const convert = MiscRepository.convertChar(param, '\r', '\n');
      // extract username from git config (or hostname of OS, default)
      userName =
        convert
          .split('\n')
          .find((item: string) => item.indexOf('user.name') !== -1)
          ?.split('=')[1] ||
        os.hostname() ||
        'NO_NAME';
      // console.debug(this.TAG, 'd', userName);
      return userName;
    }
    return userName;
  }
}
