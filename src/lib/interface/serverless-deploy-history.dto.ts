export class ServerlessDeployHistoryDto {
  name: string;
  stage: string;
  userName?: string;
  revision?: string;
  branch?: string;
  begin?: string;
  end?: string;
  localBegin?: string;
  localEnd?: string;
}