import { BaseTool } from './BaseTool';
import { nanoid } from 'nanoid';

export abstract class BaseCreationalTool extends BaseTool {
  protected id: string | undefined;

  protected start() {
    this.active = true;
    this.id = nanoid();
  }

  protected end() {
    this.id = undefined;
    this.active = false;
  }

  protected getDefaultCreateOptions() {
    return {
      tool: this.constructor.name,
      ...this.manager.settings.getToolSettings(),
    };
  }
}
