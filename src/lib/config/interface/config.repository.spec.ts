import { ServerlessService } from '../../serverless/interface/serverless-config.interface';
import { ConfigRepository } from './config.repository';

const TAG = 'ConfigRepositoryTest';

const config: object = {
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
      deployHistory: {
        slack: {
          enable: true,
          token: 'sls-deploy-token',
          channel: 'sls-deploy-channel',
        },
        file: {
          enable: false,
          type: 'csv',
          path: './',
        },
      },
      timezone: 9,
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

describe('ConfigRepositoryTest', () => {
  let sls: ServerlessService;

  beforeEach(async () => {
    sls = { ...config } as ServerlessService;
  });

  it('set serverless config', () => {
    const result = ConfigRepository.setConfig(sls);
    // console.debug(TAG, 'result', result);
    expect(result).toEqual(true);
  });

  // it is test getting custom item in serverless.yaml file
  it('get custom config', () => {
    const result = ConfigRepository.getCustom();
    // console.debug(TAG, 'result', result);
    expect(result).toEqual(sls.custom['serverless-deploy-history']);
  });

  // it is test getting provider item in serverless.yaml file
  it('get provider config', () => {
    const result = ConfigRepository.getProvider();
    // console.debug(TAG, 'result', result);
    expect(result).toEqual(sls.provider);
  });

  // it is test getting functions item in serverless.yaml file
  it('get functions config', () => {
    const result = ConfigRepository.getFunctions();
    // console.debug(TAG, 'result', result);
    expect(result).toEqual(sls.functions);
  });
});
