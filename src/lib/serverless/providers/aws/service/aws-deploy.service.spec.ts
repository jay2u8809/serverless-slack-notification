import {
  FunctionRuntimeType,
  Functions,
  Provider,
  ServerlessService,
} from '../../../config/interface/serverless-config.interface';
import { AwsRegionType } from '../config/interface/aws-config.interface';
import { ConfigRepository } from '../../../../config/config.repository';
import { AwsDeployService } from './aws-deploy.service';

const TAG = 'AwsDeployServiceTest';

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
      userName: 'temp-user-name',
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

describe('AwsDeployServiceTest', () => {
  let sls: ServerlessService;
  let service: AwsDeployService;
  let isSetConfig: boolean;

  beforeEach(async () => {
    sls = { ...config } as ServerlessService;
    service = new AwsDeployService();
    isSetConfig = ConfigRepository.setConfig(sls);
  });

  it('defined', () => {
    expect(sls).toBeDefined();
    expect(service).toBeDefined();
    expect(isSetConfig).toBeTruthy();
  });

  describe('fetchFunctionNames', () => {
    it('OK-fetch aws lambda names', () => {
      const param: Functions = { ...sls.functions } as Functions;
      const result: string[] = service.fetchFunctionNames(param);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual([
        'temp-lambda-dev-main',
        'temp-lambda-dev-convertImage',
        'temp-lambda-dev-uploadS3',
      ]);
    });

    it('OK-fetch aws lambda names: without param', () => {
      const result: string[] = service.fetchFunctionNames();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual([
        'temp-lambda-dev-main',
        'temp-lambda-dev-convertImage',
        'temp-lambda-dev-uploadS3',
      ]);
    });

    it('NG-fetch aws lambda names: empty param', () => {
      const param: Functions = {} as Functions;
      const result: string[] = service.fetchFunctionNames(param);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('NG-fetch aws lambda names: add fields', () => {
      const param: Functions = { ...sls.functions } as Functions;
      // add field
      param['main']['etc'] = 'etc';
      // console.debug(TAG, 'param', param);
      const result: string[] = service.fetchFunctionNames(param);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual([
        'temp-lambda-dev-main',
        'temp-lambda-dev-convertImage',
        'temp-lambda-dev-uploadS3',
      ]);
    });
  });

  describe('fetchFunctionRuntime', () => {
    it('OK-fetch aws lambda runtime', () => {
      const param: Provider = { ...sls.provider } as Provider;
      const result: FunctionRuntimeType = service.fetchFunctionRuntime(param);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual('nodejs14.x');
    });

    it('OK-fetch aws lambda runtime: without param', () => {
      const result: FunctionRuntimeType = service.fetchFunctionRuntime();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual('nodejs14.x');
    });
  });

  describe('fetchRegion', () => {
    it('OK-fetch aws region', () => {
      const param: Provider = { ...sls.provider } as Provider;
      const result: AwsRegionType = service.fetchRegion(param);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual('us-east-1');
    });

    it('OK-fetch aws region: without param', () => {
      const result: AwsRegionType = service.fetchRegion();
      // console.debug(TAG, 'result', result);
      expect(result).toEqual('us-east-1');
    });
  });
});
