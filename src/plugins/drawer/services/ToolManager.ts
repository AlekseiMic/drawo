/* eslint-disable no-unused-vars */
import { ITool } from '../interfaces/ITool';
import { Manager } from './Manager';

export class ToolManager {
  public active?: string;

  public tools: ITool[] = [];

  constructor(private manager: Manager) {}

  setActive(name: string) {
    const tool = this.findByName(name);
    if (tool) {
      this.getActive()?.disable();
      this.active = name;
      tool.activate();
    }
  }

  getActive() {
    if (!this.active) return undefined;
    return this.findByName(this.active);
  }

  add(...tools: (new (manager: Manager) => ITool)[]) {
    const existingToolNames = this.tools.map((t) => t.constructor.name);
    [...new Set(tools)].forEach((tool) => {
      if (existingToolNames.includes(tool.name)) return;
      this.tools.push(new tool(this.manager));
    });
  }

  findByName(name: string) {
    return this.tools.find((t) => t.constructor.name === name);
  }
}
