import {
  Hooks,
  Options,
  Serverless,
  ServerlessApp,
} from './serverless/interface/serverless-config.interface';

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
  }

  beforeDeploy() {
    console.log(this.TAG, `before-deploy`);
  }

  afterDeploy() {
    console.log(this.TAG, `after-deploy`);
  }
}
