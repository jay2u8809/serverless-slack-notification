import { History } from '../../history/interface/history.infterface';
import { ProviderInterface } from '../../serverless/providers/interface/provider-service.interface';
import { ConfigRepository } from '../../config/config.repository';
import { GitService } from '../git/git.service';
import { GitInfo } from '../git/interface/git-info.interface';
import {
  FunctionRuntimeType,
  RegionType,
} from '../../serverless/config/interface/serverless-config.interface';
import * as dayjs from 'dayjs';
import { MiscRepository } from '../misc/misc.repository';

interface GitResult {
  user: string;
  branch: string;
  hash: string;
  revision: string;
}

interface ProviderResult {
  functions: string[];
  region: RegionType;
  runtime: FunctionRuntimeType;
}

export class GenerateDeployHistoryRunner {
  private readonly TAG = GenerateDeployHistoryRunner.name;

  constructor(private readonly providerService: ProviderInterface) {
    // console.debug(this.TAG, 'constructor');
  }

  public async run(): Promise<History> {
    return this.generateDeployHistory(this.initDeployHistory());
  }

  // === private ===
  private initDeployHistory(): History {
    const stamp: dayjs.Dayjs = dayjs();
    return {
      name: ConfigRepository.getServiceName(),
      beginAt: MiscRepository.getUtcDateString(stamp),
      localBeginAt: MiscRepository.getLocalDateString(stamp),
      provider: ConfigRepository.getProvider().name,
      stage: ConfigRepository.getCliOptions().stage,
    } as History;
  }

  private async fetchGitInfo(): Promise<GitResult> {
    const gitService: GitService = new GitService();
    const info: GitInfo = await gitService.fetchGitInfo();
    return {
      user: info.userName,
      branch: info.branchName,
      hash: info.hash,
      revision: info.revision,
    } as GitResult;
  }

  private fetchProviderInfo(): ProviderResult {
    return {
      functions: this.providerService.fetchFunctionNames(),
      region: this.providerService.fetchRegion(),
      runtime: this.providerService.fetchFunctionRuntime(),
    } as ProviderResult;
  }

  private async generateDeployHistory(param: History): Promise<History> {
    const git: GitResult = await this.fetchGitInfo();
    const provider: ProviderResult = this.fetchProviderInfo();
    return {
      ...param,
      ...git,
      ...provider,
    } as History;
  }
}
