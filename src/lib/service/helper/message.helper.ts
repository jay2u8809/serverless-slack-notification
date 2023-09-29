import axios from 'axios';
import { ServerlessDeployHistoryDto } from 'src/lib/interface/serverless-deploy-history.dto';

export class MessageHelper {
  async sendSlackMessage(url: string, data: any): Promise<boolean> {
    try {
      // send slack message
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data === 'ok';
    } catch (err) {
      console.error('fail-send-slack', err.message);
      return false;
    }
  }

  makeRichMessageTemplate(
    dto: ServerlessDeployHistoryDto,
    title: string
  ): object {
    const map = new Map<string, string>()
      .set('name', dto.name).set('stage', dto.stage)
      .set('branch', dto.branch).set('revision', dto.revision)
      .set('endAt', dto.endAt).set('localEndAt', dto.localEndAt)
      .set('user', dto.userName);
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `[${dto.stage}] *${title}*`,
          },
        },
        {
          type: 'section',
          fields: [...map.entries()].map(
            (item: [string, string]) => {
              return {
                type: 'mrkdwn',
                text: `*${item[0].toUpperCase()}: *\n ${item[1]}`,
              };
            }),
        },
      ],
    }
  }
}