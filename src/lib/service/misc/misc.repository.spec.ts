import { MiscRepository } from './misc.repository';
import * as dayjs from 'dayjs';

const TAG = 'MiscRepositoryTest';

describe('MiscRepositoryTest', () => {
  describe('dayjs', () => {
    it('OK: getLocalDateString', () => {
      const stamp: dayjs.Dayjs = dayjs();
      const result = MiscRepository.getLocalDateString(stamp);
      // console.debug(TAG, 'result', result);  // 2023-04-24T23:14:36+09:00
      expect(result).toBeDefined();
    });

    it('OK: getLocalDateString with param', () => {
      const stamp: dayjs.Dayjs = dayjs();
      const result = MiscRepository.getLocalDateString(
        stamp,
        'YYYY-MM-DD-THH:mm:ss.SSS',
      );
      // console.debug(TAG, 'result', result); // 2023-04-24-T23:14:36.977
      expect(result).toBeDefined();
    });

    it('OK: getUtcDateString', () => {
      const stamp: dayjs.Dayjs = dayjs();
      const result = MiscRepository.getUtcDateString(stamp);
      // console.debug(TAG, 'result', result); // 2023-04-24T14:17:35Z
      expect(result).toBeDefined();
    });

    it('OK: getUtcDateString with param', () => {
      const stamp: dayjs.Dayjs = dayjs();
      const result = MiscRepository.getUtcDateString(
        stamp,
        'YYYY-MM-DD-THH:mm:ss.SSS',
      );
      // console.debug(TAG, 'result', result); // 2023-04-24-T14:17:35.370
      expect(result).toBeDefined();
    });
  });

  describe('command exec', () => {
    it('OK: command exec', async () => {
      const cmd = 'echo hello deploy-history';
      const result = await MiscRepository.commandExec(cmd);
      // console.debug(TAG, 'result', result);
      expect(result).toEqual('hello deploy-history\n');
    });
  });

  describe('etc', () => {
    it('OK: convert character', () => {
      const str = 'echo hello\r\n deploy-history';
      const result = MiscRepository.convertChar(str, '\r\n', '-');
      // console.debug(TAG, 'result', result);
      expect(result).toEqual('echo hello- deploy-history');
    });
  });
});
