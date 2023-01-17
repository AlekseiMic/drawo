/* eslint-disable no-unused-vars */
import { Action } from './interfaces/Action';
import { Color } from './interfaces/Color';
import { ITool } from './interfaces/ITool';
import { Manager } from './Manager';
import { RedrawState } from './RedrawState';

export class ToolPanel {
  public color: Color = { r: 33, g: 33, b: 100, a: 200 };

  public thickness: number = 3;

  public active?: string;

  private _activeTool: ITool | null = null;

  private _tools: Record<string, ITool> = {};

  gerReducer() {
    return (m: Manager, s: RedrawState, a: Action) => {
      if (!a.layerId || !a.id || !a.user) return;
      switch (a.type) {
        case 'addScratch': {
          const scratch = this._tools[a.payload.tool].create?.(a);
          if (!scratch) return;
          m.layers!.layers[a.layerId].add(scratch);
          s.addNewScratchToDraw(a.layerId, a.id);
          break;
        }
        case 'translateScratch': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          if (!s.isMarked(a.layerId, a.id)) {
            s.addRectToRedraw(a.layerId, scratch.rect);
            s.markChanged(a.layerId, a.id);
          }
          scratch.move(a.payload.move);
          break;
        }
        case 'changeScratch': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          if (!s.isMarked(a.layerId, a.id)) {
            s.addRectToRedraw(a.layerId, scratch.rect);
            s.markChanged(a.layerId, a.id);
          }
          scratch.change(a.payload);
          break;
        }
        case 'moveScratch': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch || !m.layers!.layers[a.payload.layerId]) return;

          s.addRectToRedraw(a.layerId, scratch.rect);
          scratch.change(a.payload);
          m.layers!.layers[a.payload.layerId].add(scratch);
          s.addNewScratchToDraw(a.payload.layerId, a.id);
          m.layers!.layers[a.layerId].remove(scratch.id);
          break;
        }
        default:
          break;
      }
    };
  }

  get tools() {
    return Object.keys(this._tools);
  }

  constructor(private manager: Manager) {}

  setActive(name: string) {
    const tool = this._tools[name];
    if (!tool) return;
    if (this._activeTool) this._activeTool.disable();
    this._activeTool = tool;
    this._activeTool.activate();
    this.active = name;
  }

  addTool(tool: new (manager: Manager) => ITool) {
    this._tools[tool.name] = new tool(this.manager);
  }
}
