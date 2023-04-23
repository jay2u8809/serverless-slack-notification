interface Stages {
  [stage: string]: boolean;
}

interface SlackSetting {
  token: string; // slack Token
  channel: string; // slack channel name
  enable: boolean;
}

interface FileSetting {
  path: string;
  enable: boolean;
}

export type DeployHistory = {
  slack: SlackSetting;
  csv: FileSetting;
};

export interface Config {
  stages: Stages; // deploy history stages
  deployHistory: DeployHistory; // deploy history type
  userName?: string;
}

export const CONFIG_TITLE = 'serverless-deploy-history';
