import Serverless from 'serverless';
import { ServerlessDeployHistoryDto } from './interface/serverless-deploy-history.dto';
import { ServerlessDeployHistoryService } from './service/serverless-deploy-history.service';

export class ServerlessDeployHistory {
  hooks: { [key: string]: () => void };
  dto: ServerlessDeployHistoryDto;

  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {
    this.hooks = {
      // 'before:package:createDeploymentArtifacts': this.beforeCreateDeploymentArtifacts.bind(this),
      // 'after:package:createDeploymentArtifacts': this.afterCreateDeploymentArtifacts.bind(this),
      'package:initialize': this.beforeCreateDeploymentArtifacts.bind(this),
      'package:finalize': this.afterCreateDeploymentArtifacts.bind(this),
    };
  }

  async beforeCreateDeploymentArtifacts() {
    const service = new ServerlessDeployHistoryService();
    this.dto = {
      name: this.serverless.service.service,
      stage: this.options.stage || 'dev',
      userName: this.serverless.service.custom['serverless-deploy-history'].userName,
      begin: new Date().toISOString(),
      revision: await service.fetchRevision(),
      branch: await service.fetchBranchName(),
    };
    console.debug('before-deploy-dto', this.dto);
  }

  afterCreateDeploymentArtifacts() {
    // generate deploy history: send slack, put s3, ...
    const apiUrl = this.serverless.service.custom['serverless-deploy-history'].slack.apiUrl;
    console.debug('after-deploy-apiUrl', apiUrl);
    this.dto.end = new Date().toISOString();
    console.debug('after-deploy-dto', this.dto);
  }
}