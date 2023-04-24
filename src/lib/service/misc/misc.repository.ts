import * as dayjs from 'dayjs';
// import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as utc from 'dayjs/plugin/utc';
import * as childProcess from 'node:child_process';
import { ChildProcess } from 'node:child_process';
import { Dayjs } from 'dayjs';

dayjs.extend(utc);
// dayjs.extend(localizedFormat);

const TAG = 'MiscRepository';

export class MiscRepository {
  public static getLocalDateString(day: Dayjs, format?: string): string {
    return (
      day
        .utc()
        .local()
        // .format(format || 'L LTS')
        .format(format)
        .toString()
    );
  }

  public static getUtcDateString(day: Dayjs, format?: string): string {
    return day.utc().format(format);
  }

  public static async commandExec(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const result: ChildProcess = childProcess.exec(cmd, {
        encoding: 'utf8',
      });
      result.stdout
        .on('error', (err: Error) => {
          console.error(TAG, 'command-exec-error', err);
          reject(false);
        })
        .on('data', (data) => {
          resolve(data);
        });
    });
  }

  public static convertChar(
    str: string,
    targets: string,
    changed: string,
  ): string {
    if (str.length === 0) {
      return '';
    }
    return str.replace(targets, changed);
  }
}
