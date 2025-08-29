import { CONFIG } from './config.js';

export class ElicitationHelper {
  constructor(server) {
    this.server = server;
  }

  async elicitWithProgress(message, schema, inputs) {
    const progressId = setInterval(async () => {
      await inputs.sendNotification?.({
        method: "notifications/progress",
        params: { progressToken: inputs._meta?.progressToken, progress: 50 }
      });
    }, CONFIG.PROGRESS_INTERVAL);

    try {
      console.warn(`Elicitation: ${message}`);
      const result = await this.server.server.elicitInput({
        message,
        requestedSchema: schema
      }, { timeout: CONFIG.ELICITATION_TIMEOUT });
      
      console.warn('Elicitation result:', result);
      return result;
    } finally {
      clearInterval(progressId);
    }
  }
}
