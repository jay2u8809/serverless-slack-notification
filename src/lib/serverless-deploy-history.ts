import {
  Hooks,
  Options,
  Serverless,
  ServerlessApp,
} from './serverless/config/interface/serverless-config.interface';
import { ConfigRepository } from './config/config.repository';

export class ServerlessDeployHistory {
  private readonly TAG = ServerlessDeployHistory.name;

  private readonly sls: Serverless;
  private readonly hooks: Hooks;

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
    console.debug(this.TAG, `init-plugin`);
    // processing to get custom settings from serverless.yaml
    ConfigRepository.setConfig(this.sls.app.service);
  }

  beforeDeploy() {
    console.debug(this.TAG, `before-deploy`);
  }

  afterDeploy() {
    console.debug(this.TAG, `after-deploy`);
  }
}
