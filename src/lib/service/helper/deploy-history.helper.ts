import * as childProcess from 'node:child_process';
import { ChildProcess } from 'node:child_process';
import { ServerlessDeployHistoryDto } from '../../interface/serverless-deploy-history.dto';
import { Config } from '../../interface/deploy-history.config';

export class DeployHistoryHelper {
  async execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const result: ChildProcess = childProcess.exec(command, {
        encoding: 'utf8',
      });
      result.stdout
        .on('error', (err: Error) => {
          console.error('command-exec-error', command, err);
          reject(undefined);
        })
        .on('data', (data: string) => {
          // remove new-line character
          const result: string = [...data].filter(c => c !== '\n').join('');
          resolve(result);
        });
    });
  }

  async generateDeployHistoryDto(name: string, stage?: string): Promise<ServerlessDeployHistoryDto> {
    const [userName, branch, revision]: string[] = await Promise.all([
      this.execCommand(Config.GitCommand.USER_NAME),
      this.execCommand(Config.GitCommand.BRANCH_NAME),
      this.execCommand(Config.GitCommand.REVISION),
    ]);
    const now = new Date();
    return {
      name: name,
      stage: stage || 'dev',
      endAt: now.toISOString(),
      localEndAt: now.toLocaleString(),
      userName,
      branch,
      revision,
    } as ServerlessDeployHistoryDto;
  }
}