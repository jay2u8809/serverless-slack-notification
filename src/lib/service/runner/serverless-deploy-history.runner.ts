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
    if (this.checkStage()) {
      return this.sendNotification(dto);
    }
    return false;
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

  private checkStage(): boolean {
    const {exclude, include} = this.getSlsCustomInfo().stage || {};

    if (exclude && include) {
      console.error('Invalid setting. Please select either exclude or include');
      return false;
    }
    else if (!exclude && !include) {
      return true;
    }
    else if (exclude && !include) {
      return !exclude.find(item => item === this.options.stage);
    }
    else if (!exclude && include) {
      return !!include.find(item => item === this.options.stage);
    }
  }
}
