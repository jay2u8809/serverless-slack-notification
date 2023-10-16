import Serverless from 'serverless';
import { ServerlessDeployHistoryDto } from '../../interface/serverless-deploy-history.dto';
import { DeployHistoryCustom } from '../../interface/deploy-history-custom.interface';
import { Config } from '../../interface/deploy-history.config';
import { DeployHistoryHelper } from '../helper/deploy-history.helper';
import { MessageHelper } from '../helper/message.helper';

const TAG = 'ServerlessDeployHistoryService';

export class ServerlessDeployHistoryRunner {
  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {}

  async exec(): Promise<boolean> {
    const dto: ServerlessDeployHistoryDto = await this.initDeployHistoryDto();
    return this.sendNotification(dto);
  }

  // === private ===
  private async sendNotification(
    dto: ServerlessDeployHistoryDto,
  ): Promise<boolean> {
    // slack webhook url
    const url = this.getSlsCustomInfo().slack.webhook;

    const helper: MessageHelper = new MessageHelper();
    // make rich message
    const data = helper.makeRichMessageTemplate(
      dto,
      this.getSlsCustomInfo().slack.title || Config.Slack.title,
    );
    // send slack message
    return helper.sendSlackMessage(url, data);
  }

  private async initDeployHistoryDto(): Promise<ServerlessDeployHistoryDto> {
    const helper: DeployHistoryHelper = new DeployHistoryHelper();
    return helper.generateDeployHistoryDto(
      this.serverless.service.service,
      this.options.stage,
    );
  }

  private getSlsCustomInfo(): DeployHistoryCustom {
    return this.serverless.service.custom[Config.Title] as DeployHistoryCustom;
  }
}
