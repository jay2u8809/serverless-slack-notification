import { DeployHistoryHelper } from './deploy-history.helper';

const TAG = 'DeployHistoryHelperUnitTest';

describe('deploy history helper unit test', () => {
  describe('execCommand', () => {
    it('OK: get git user name', async () => {
      const command = 'git config user.name';
      const result = await DeployHistoryHelper.execGitPrintCommand(command);
      console.debug(TAG, result);

      expect(result).toBeDefined();
    });

    it('OK: get current branch name', async () => {
      const command = 'git branch --show-current';
      const result = await DeployHistoryHelper.execGitPrintCommand(command);
      console.debug(TAG, result);

      expect(result).toBeDefined();
    });

    it('OK: get git revision', async () => {
      const command = 'git rev-parse HEAD';
      const result = await DeployHistoryHelper.execGitPrintCommand(command);
      console.debug(TAG, result);

      expect(result).toBeDefined();
    });
  });

  describe('generateDeployHistoryDto', () => {
    it('OK', async () => {
      const name = 'dev.ian';
      const result = await DeployHistoryHelper.generateDeployHistoryDto(name);
      console.debug(TAG, result);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('stage');
      expect(result).toHaveProperty('endAt');
      expect(result).toHaveProperty('localEndAt');
      expect(result).toHaveProperty('userName');
      expect(result).toHaveProperty('branch');
      expect(result).toHaveProperty('revision');
      expect(result.name).toEqual(name);
    });
  });
});
