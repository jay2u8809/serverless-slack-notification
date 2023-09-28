import * as childProcess from 'node:child_process';
import { ChildProcess } from 'node:child_process';
import Serverless from 'serverless';
import axios from 'axios';
import { ServerlessDeployHistoryDto } from '../interface/serverless-deploy-history.dto';
import { DeployHistoryCustom } from '../interface/deploy-history-custom.interface';
import { Info } from '../interface/deploy-history-info.interface';

const TAG = 'ServerlessDeployHistoryService';

type DeployHistoryParam = {
  name: string;
  stage: string;
}

export class ServerlessDeployHistoryService {
  private serverless: Serverless;
  private options: Serverless.Options;

  constructor(serveless: Serverless, options: Serverless.Options) {
    this.serverless = serveless;
    this.options = options;
  }

  async begin(): Promise<ServerlessDeployHistoryDto> {
    const param: DeployHistoryParam = {
      name: this.serverless.service.service,
      stage: this.options.stage,
    }
    // make initial dto
    return this.initDeployHistoryDto(param);
  }

  async end(dto: ServerlessDeployHistoryDto): Promise<boolean> {
    // deploy end time
    const now = new Date();
    dto.end = now.toISOString();
    dto.localEnd = now.toLocaleString();
    // api url
    const apiUrl = this.getConfigInfo().slack.apiUrl;
    // send slack message
    return this.sendSlack(apiUrl, dto);
  }

  async sendSlack(url: string, dto: ServerlessDeployHistoryDto): Promise<boolean> {
    // make rich message
    const data = this.makeRichMessageTemplate(dto, this.getConfigInfo().slack.title);
    try {
      // send slack message
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data === 'ok';
    } catch (err) {
      console.error(TAG, 'fail-send-slack', err.message);
      return false;
    }
  }

  // === private ===
  private async execCommand(command: string): Promise<string> {
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

  private async initDeployHistoryDto(param: DeployHistoryParam): Promise<ServerlessDeployHistoryDto> {
    const [userName, branch, revision]: string[] = await Promise.all([
      this.execCommand(Info.GIT_COMMAND.USER_NAME),
      this.execCommand(Info.GIT_COMMAND.BRANCH_NAME),
      this.execCommand(Info.GIT_COMMAND.REVISION),
    ]);
    const now = new Date();
    return {
      name: param.name,
      stage: param.stage || 'dev',
      begin: now.toISOString(),
      localBegin: now.toLocaleString(),
      userName,
      branch,
      revision,
    } as ServerlessDeployHistoryDto;
  }

  private getConfigInfo(): DeployHistoryCustom {
    const PLUGIN_NAME = Info.PLUGIN_NAME;
    return this.serverless.service.custom[PLUGIN_NAME] as DeployHistoryCustom;
  }

  private makeRichMessageTemplate(
    dto: ServerlessDeployHistoryDto,
    title: string
  ): object {
    const map = new Map<string, string>()
      .set('name', dto.name).set('stage', dto.stage)
      .set('branch', dto.branch).set('revision', dto.revision)
      .set('begin', dto.begin).set('end', dto.end)
      .set('local_begin', dto.localBegin).set('local_end', dto.localEnd)
      .set('user', dto.userName);
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `[${dto.stage}] *${title || Info.SLACK.TITLE}*`,
          },
        },
        {
          type: 'section',
          fields: [...map.entries()].map(
            (item: [string, string]) => {
              return {
                type: 'mrkdwn',
                text: `*${item[0].toUpperCase()}: *\n ${item[1]}`,
              };
            }),
        },
      ],
    }
  }
}