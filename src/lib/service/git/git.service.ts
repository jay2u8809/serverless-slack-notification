import * as childProcess from 'node:child_process';
import * as os from 'os';
import { GitInfo } from './interface/git-info.interface';
import { ChildProcess } from 'child_process';
import { ConfigRepository } from '../../config/config.repository';

export class GitService {
  private readonly TAG = GitService.name;

  public async fetchGitInfo(): Promise<GitInfo> {
    try {
      const [branchName, config, hash] = await Promise.all([
        this.commandExec('git branch --show-current'), // or git name-rev --name-only HEAD
        this.commandExec('git config --list'),
        this.commandExec('git rev-parse HEAD'),
      ]);
      return {
        userName: this.fetchUserName(config),
        branchName: branchName,
        hash: hash,
        revision: hash.slice(0, 7),
      } as GitInfo;
    } catch (e) {
      console.error(this.TAG, 'git-command', e);
      return;
    }
  }

  // === private ===
  private async commandExec(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const result: ChildProcess = childProcess.exec(cmd, {
        encoding: 'utf8',
      });
      result.stdout
        .on('error', (err: Error) => {
          console.error(this.TAG, 'command-exec-error', err);
          reject(false);
        })
        .on('data', (data) => {
          resolve(data);
        });
    });
  }

  private fetchUserName(param: string): string {
    let userName = ConfigRepository.getCustom()?.userName;
    if (!userName) {
      // convert new-line character
      const convert: string = Array.from(param || '')
        .map((item: string) => (item === '\r' || item === '\r\n' ? '\n' : item))
        .join('');
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
