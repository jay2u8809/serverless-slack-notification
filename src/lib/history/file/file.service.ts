import * as fs from 'fs';
import { CsvDto } from './dto/csv.dto';
import { FileConfig } from '../../config/interface/config.interface';

export class FileService {
  private TAG = FileService.name;

  public async writeCsv(data: CsvDto, path?: string): Promise<string> {
    // file name
    const filename = this.generateFileName(path);
    try {
      // convert to csv
      const csv = this.convertCsv(data);
      // write file
      fs.writeFileSync(filename, csv);
    } catch (e) {
      console.error(this.TAG, 'write-csv', JSON.stringify(e));
      throw Error(`Write CSV File Error: ${e.name}`);
    }
    return filename;
  }

  // === private ===
  private generateFileName(path: string): string {
    const filePath = path || `${FileConfig.CsvPath()}`;
    const paths: string[] = filePath.split('/');
    const filename = paths.pop() || `${FileConfig.CsvFileName()}`;
    return `${paths.join('/')}/${new Date().getTime()}_${filename}`;
  }

  private convertCsv(data: CsvDto): string {
    const keys: string[] = Object.keys(data);
    const header = keys.join(',');
    const contents = keys
      .map((key: string) =>
        Array.isArray(data[key]) ? [...data[key]].join(';') : data[key],
      )
      .join(',');
    return header + '\n' + contents;
  }
}
