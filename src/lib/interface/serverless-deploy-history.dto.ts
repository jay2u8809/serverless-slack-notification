import {z} from 'zod';

const DeployInfoSchema = z.object({
  name: z.string().describe('required: sls service name'),
  stage: z.string().describe('required: sls stage name'),
  userName: z.string().nullish().describe('git user name'),
  revision: z.string().nullish().describe('git revision'),
  branch: z.string().nullish().describe('git branch name'),
  endAt: z.string().nullish().describe('deployment end time'),
  localEndAt: z.string().nullish().describe('deployment end time'),
});

export type DeployInfoType = z.infer<typeof DeployInfoSchema>
