import { Custom } from '../../serverless/config/interface/serverless-config.interface';

interface Stages {
  [stage: string]: boolean;
}

export type DeployHistoryType = 'slack' | 'file';
export type DeployHistorySettingType = SlackSetting | FileSetting;
export type DeployHistory = Record<DeployHistoryType, DeployHistorySettingType>;
interface DeployHistorySetting {
  enable: boolean;
}
interface SlackSetting extends DeployHistorySetting {
  // slack Token
  token: string;

  // slack channel name
  channel: string;
}

export type FileType = 'csv' | 'tsv';
interface FileSetting extends DeployHistorySetting {
  type: FileType;
  path: string;
}

export interface Config extends Custom {
  // deploy history stages
  stages: Stages;

  // deploy history type
  deployHistory: DeployHistory;

  userName?: string;

  // UTC time zone - ex) JST: 9, EST: -5, ACST: 9.5
  timezone?: number;
}
export const CONFIG_TITLE = 'serverless-deploy-history';
