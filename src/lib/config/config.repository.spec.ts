import {
  Options,
  ServerlessService,
} from '../serverless/config/interface/serverless-config.interface';
import { ConfigRepository } from './config.repository';

const TAG = 'ConfigRepositoryTest';

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

const cliOptions: any = {
  stage: 'staging',
  config: 'serverless.ts',
};

describe('ConfigRepositoryTest', () => {
  let sls: ServerlessService;
  let cli: Options;

  beforeEach(async () => {
    sls = { ...config } as ServerlessService;
    cli = { ...cliOptions } as Options;
  });

  it('defined', () => {
    expect(sls).toBeDefined();
    expect(cli).toBeDefined();
  });

  describe('get config', () => {
    beforeEach(() => {
      ConfigRepository.setConfig(sls);
    });

    it('OK: get service name', () => {
      const result = ConfigRepository.getServiceName();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(sls.service);
    });

    // it is test getting custom item in serverless.yaml file
    it('OK: get custom config', () => {
      const result = ConfigRepository.getCustom();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(sls.custom['serverless-deploy-history']);
    });

    // it is test getting provider item in serverless.yaml file
    it('OK: get provider config', () => {
      const result = ConfigRepository.getProvider();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(sls.provider);
    });

    // it is test getting functions item in serverless.yaml file
    it('OK: get functions config', () => {
      const result = ConfigRepository.getFunctions();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(sls.functions);
    });

    it('OK: get cli options', () => {
      const result = ConfigRepository.getCliOptions();
      console.debug(TAG, 'result', result);
      expect(result).toEqual({});
    });

    it('OK: get cli options', () => {
      // set config
      ConfigRepository.setConfig(sls, cli);
      const result = ConfigRepository.getCliOptions();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(cli);
    });
  });

  describe('set config', () => {
    it('OK: set serverless config', () => {
      const result = ConfigRepository.setConfig(sls);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(true);
    });

    it('OK: set serverless config with cli options', () => {
      const result = ConfigRepository.setConfig(sls, cli);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual(true);
    });
  });
});
