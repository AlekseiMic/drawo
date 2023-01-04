import { ITool } from "./interfaces/ITool";
import { Manager } from "./Manager";

export class ToolPanel {
  private _activeTool: ITool | null = null;

  private _tools: Record<string, ITool> = {};

  get tools() {
    return Object.keys(this._tools);
  }

  constructor(private manager: Manager) {}

  setActive(name: string) {
    console.log(name);
    const tool = this._tools[name];
    if (!tool) return;
    if (this._activeTool) this._activeTool.disable();
    this._activeTool = tool;
    this._activeTool.activate();
  }

  addTool(name: string, tool: new (manager: Manager) => ITool) {
    this._tools[name] = new tool(this.manager);
  }
}
