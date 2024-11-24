import Serverless from 'serverless';
import { DeployInfoDto } from './interface/serverless-deploy-history.dto';
import { ServerlessDeployHistoryRunner } from './service/runner/serverless-deploy-history.runner';

type Hooks = { [key: string]: () => void };

export class ServerlessDeployHistory {
  hooks: Hooks;
  dto: DeployInfoDto;
  runner: ServerlessDeployHistoryRunner;

  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {
    this.hooks = {
      'after:deploy:deploy': this.afterDeploy.bind(this),
    };
    this.runner = new ServerlessDeployHistoryRunner(
      this.serverless,
      this.options,
    );
  }

  async afterDeploy() {
    const result = await this.runner.exec();
    console.assert(result, 'Fail to send deployment history');
  }
}
