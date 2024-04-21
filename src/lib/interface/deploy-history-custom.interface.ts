export interface DeployHistoryCustom {
  stage: {
    exclude: string[];
    include: string[];
  },
  slack: {
    webhook: string;
    title: string;
  };
}
