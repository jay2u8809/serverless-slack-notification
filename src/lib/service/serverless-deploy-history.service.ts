import * as childProcess from 'node:child_process';
import { ChildProcess } from 'node:child_process';

export class ServerlessDeployHistoryService {

  async fetchBranchName(): Promise<string> {
    const command = 'git branch --show-current';
    return this.execCommand(command);
  }

  async fetchRevision(): Promise<string> {
    const command = 'git rev-parse HEAD';
    return this.execCommand(command);
  }

  // === private ===
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
        .on('data', (data) => {
          resolve(data);
        });
    });
  }
}