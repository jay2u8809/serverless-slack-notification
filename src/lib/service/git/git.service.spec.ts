import { ServerlessService } from '../../serverless/config/interface/serverless-config.interface';
import { ConfigRepository } from '../../config/config.repository';
import { GitInfo } from './interface/git-info.interface';
import { GitService } from './git.service';

const TAG = 'GitServiceTest';

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

describe('GitServiceTest', () => {
  let service: GitService;
  let sls: ServerlessService;

  beforeEach(() => {
    service = new GitService();
    sls = { ...config } as ServerlessService;
  });

  it('defined', () => {
    expect(service).toBeDefined();
    expect(sls).toBeDefined();
  });

  describe('fetchGitInfo', () => {
    it('OK-fetch git info: without username ', async () => {
      const result: GitInfo = await service.fetchGitInfo();
      // console.debug(TAG, 'result', result);
      expect(result.userName).not.toEqual(
        sls.custom['serverless-deploy-history'].userName,
      );
    });

    it('OK-fetch git info', async () => {
      ConfigRepository.setConfig(sls);
      const result: GitInfo = await service.fetchGitInfo();
      // console.debug(TAG, 'result', result);
      expect(result.userName).toEqual(
        sls.custom['serverless-deploy-history'].userName,
      );
    });
  });
});
