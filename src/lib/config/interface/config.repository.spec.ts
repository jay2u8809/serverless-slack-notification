import { Custom } from '../../serverless/interface/serverless-config.interface';
import { ConfigRepository } from './config.repository';

const TAG = 'ConfigRepositoryTest';

describe('ConfigRepositoryTest', () => {
  // beforeEach(async () => {});

  it('get plugin(custom) config', () => {
    // serverless framework config(serverless.yaml) data
    const custom: any = {
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
    };
    const result = ConfigRepository.getPluginConfig(custom as Custom);
    console.debug(TAG, 'result', result);

    expect(result).toEqual(custom['serverless-deploy-history']);
  });
});
