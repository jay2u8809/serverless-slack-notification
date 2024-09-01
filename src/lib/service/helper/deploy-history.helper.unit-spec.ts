import { DeployHistoryHelper } from "./deploy-history.helper";

const TAG = 'DeployHistoryHelperUnitTest';

describe('deploy history helper unit test', () => {
  let helper: DeployHistoryHelper;

  beforeAll(async () => {
    helper = new DeployHistoryHelper();
  })

  describe('execCommand', () => {
    it('OK: get git user name', async () => {

      const command = 'git config user.name';
      const result = await helper.execCommand(command);
      
      expect(result).toBeDefined();
    });

    it('OK: get current branch name', async () => {

      const command = 'git branch --show-current';
      const result = await helper.execCommand(command);
      
      expect(result).toBeDefined();
    });

    it('OK: get git revision', async () => {

      const command = 'git rev-parse HEAD';
      const result = await helper.execCommand(command);
      
      expect(result).toBeDefined();
    });
  });
});