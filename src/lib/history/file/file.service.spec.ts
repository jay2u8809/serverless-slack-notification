import { FileService } from './file.service';
import * as fs from 'fs';
import { FileConfig } from '../../config/interface/config.interface';

const TAG = 'FileServiceTest';

const data: any = {
  name: 'test-service',
  localBeginAt: '2023-03-23T03:43:34:353Z',
  localEndAt: '2023-03-23T03:47:32:833Z',
  beginAt: '2023-03-22T18:43:34:353Z',
  endAt: '2023-03-22T18:47:32:833Z',
  stage: 'dev',
  branch: 'feature/temp-deploy-dev',
  user: 'temp-user',
  hash: 'temp-hash',
  provider: 'aws',
  functions: [
    'temp-lambda-dev-main',
    'temp-lambda-dev-convertImage',
    'temp-lambda-dev-uploadS3',
  ],
};

describe('FileServiceTest', () => {
  let service: FileService;
  let dto: any;

  beforeEach(() => {
    service = new FileService();
    dto = { ...data };
  });

  it('defined', () => {
    expect(service).toBeDefined();
    expect(dto).toBeDefined();
  });

  describe('write csv', () => {
    it('OK: write history csv', async () => {
      const csvDto = { ...data };
      const filename = await service.writeCsv(csvDto, './csv-history.csv');
      console.debug(TAG, 'write-history-csv', filename);
      expect(filename).toContain('csv-history.csv');
      fs.rmSync(filename);
    });

    it('OK: write history csv without path', async () => {
      const csvDto = { ...data };
      const filename = await service.writeCsv(csvDto);
      console.debug(TAG, 'write-history-csv', filename);
      expect(filename).toContain(`${FileConfig.CsvFileName()}`);
      fs.rmSync(filename);
    });
  });
});
