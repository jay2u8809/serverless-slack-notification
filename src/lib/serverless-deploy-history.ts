import Serverless from 'serverless';
import { ServerlessDeployHistoryDto } from './interface/serverless-deploy-history.dto';
import { ServerlessDeployHistoryService } from './service/serverless-deploy-history.service';

export class ServerlessDeployHistory {
  hooks: { [key: string]: () => void };
  dto: ServerlessDeployHistoryDto;
  service: ServerlessDeployHistoryService;

  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {
    this.hooks = {
      'before:package:createDeploymentArtifacts': this.beforeCreateDeploymentArtifacts.bind(this),
      'after:deploy:deploy': this.afterCreateDeploymentArtifacts.bind(this),
    };
    this.service = new ServerlessDeployHistoryService(this.serverless, this.options);
  }

  async beforeCreateDeploymentArtifacts() {
    this.dto = await this.service.begin();
  }

  async afterCreateDeploymentArtifacts() {
    const result = await this.service.end(this.dto);
    console.assert(result, 'Fail to send deployment history');
    console.log('=== SERVERLESS DEPLOY HISTORY: COMPLETE ===');
  }
}