import { ProviderInterface } from '../../serverless/providers/interface/provider-service.interface';
import { AwsDeployService } from '../../serverless/providers/aws/service/aws-deploy.service';
import { GenerateDeployHistoryRunner } from './generate-deploy-history.runner';
import { History } from '../../history/interface/history.infterface';
import { ServerlessService } from '../../serverless/config/interface/serverless-config.interface';
import { ConfigRepository } from '../../config/config.repository';

const TAG = 'GenerateDeployHistoryRunnerTest';

const config: any = {
  service: 'temp-lambda',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    architecture: 'x86_64',
    stage: 'dev',
  },
  custom: {
    'serverless-offline': {
      httpPort: 3100,
    },
    'serverless-deploy-history': {
      stages: {
        dev: true,
      },
      userName: 'temp-user-name',
      deployHistory: {
        slack: {
          enable: true,
          token: 'sls-deploy-token',
          channel: 'sls-deploy-channel',
        },
        file: {
          enable: false,
          path: './',
        },
      },
    },
  },
  functions: {
    main: {
      name: 'temp-lambda-dev-main',
    },
    convertImage: {
      name: 'temp-lambda-dev-convertImage',
    },
    uploadS3: {
      name: 'temp-lambda-dev-uploadS3',
    },
  },
};

describe('GenerateDeployHistoryRunnerTest', () => {
  let sls: ServerlessService;
  let provider: ProviderInterface;

  beforeAll(() => {
    sls = { ...config } as ServerlessService;
    ConfigRepository.setConfig(sls);

    provider = new AwsDeployService();
  });

  it('defined', () => {
    expect(sls).toBeDefined();
    expect(provider).toBeDefined();
  });

  it('runner', async () => {
    const runner: GenerateDeployHistoryRunner = new GenerateDeployHistoryRunner(
      provider,
    );
    const result: History = await runner.run();
    console.debug(TAG, 'result', result);

    expect(result).toBeDefined();
    expect(result.name).toEqual(config.service);
    expect(result.provider).toEqual(config.provider.name);
    expect(result.stage).toEqual(config.provider.stage);
    expect(result.region).toEqual(config.provider.region);
    expect(result.runtime).toEqual(config.provider.runtime);
  });
});
