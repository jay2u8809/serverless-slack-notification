export class ServerlessDeployHistoryDto {
  name: string;
  stage: string;
  userName?: string;
  revision?: string;
  branch?: string;
  endAt?: string;
  localEndAt?: string;
}
