import {
  Hooks,
  Options,
  Serverless,
  ServerlessApp,
} from './serverless/interface/serverless-config.interface';
import { ConfigRepository } from './config/interface/config.repository';

export class ServerlessDeployHistory {
  private readonly TAG = ServerlessDeployHistory.name;

  private readonly sls: Serverless;
  private hooks: Hooks;

  constructor(serverless: ServerlessApp, options: Options) {
    this.sls = {
      app: serverless,
      options: options,
    };

    this.hooks = {
      initialize: () => this.init(),
    };
  }

  init() {
    console.log(this.TAG, `init-plugin`);

    // processing to get custom settings from serverless.yaml
    ConfigRepository.getPluginConfig(this.sls.app.service.custom);
  }

  beforeDeploy() {
    console.log(this.TAG, `before-deploy`);
  }

  afterDeploy() {
    console.log(this.TAG, `after-deploy`);
  }
}
