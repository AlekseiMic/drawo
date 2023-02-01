/* eslint-disable no-unused-vars */
import { ScratchState } from './interfaces';
import { Action } from './interfaces/Action';
import { Color } from './interfaces/Color';
import { ITool } from './interfaces/ITool';
import { Manager } from './Manager';
import { RedrawState } from './RedrawState';

export class ToolPanel {
  public thickness: number = 3;

  public active?: string;

  private _activeTool: ITool | null = null;

  private _tools: Record<string, ITool> = {};

  public color: Color = { r: 255, g: 255, b: 255, a: 255 };

  private _colorHex: string = '#ffffffff';

  set colorHex(color: string) {
    this._colorHex = color;

    const num = Number('0x' + color.slice(1, 9));
    this.color = {
      r: (num >> 24) & 255,
      g: (num >> 16) & 255,
      b: (num >> 8) & 255,
      a: num & 255,
    };
  }

  get colorHex() {
    return this._colorHex;
  }

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
        case 'removeScratch': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          if (!s.isMarked(a.layerId, a.id)) {
            s.addRectToRedraw(a.layerId, scratch.rect);
            s.markChanged(a.layerId, a.id);
          }
          m.layers!.layers[a.layerId].remove(a.id);
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
        case 'hoverStart': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          scratch.state = ScratchState.hovered;
          if (a.user !== this.manager.user) return;
          m.layers!.layers.preview.add(scratch);
          s.addNewScratchToDraw('preview', a.id);
          break;
        }
        case 'hoverEnd': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          scratch.state = ScratchState.active;
          if (a.user !== this.manager.user) return;
          s.addRectToRedraw('preview', scratch.rect);
          m.layers!.layers.preview.remove(scratch.id);
          break;
        }
        case 'dragStart': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          scratch.state = ScratchState.dragged;
          m.layers!.layers.preview.add(scratch);
          s.addNewScratchToDraw('preview', a.id);
          s.addRectToRedraw(a.layerId, scratch.rect);
          break;
        }
        case 'drag': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          if (!s.isMarked('preview', a.id)) {
            s.addRectToRedraw('preview', scratch.rect);
            s.markChanged('preview', a.id);
          }
          scratch.move(a.payload.move);
          break;
        }
        case 'dragEnd': {
          const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
          if (!scratch) return;
          scratch.state = ScratchState.active;
          s.addRectToRedraw('preview', scratch.rect);
          m.layers!.layers.preview.remove(scratch.id);
          s.markChanged(a.layerId, a.id);
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

  addTools(...tools: (new (manager: Manager) => ITool)[]) {
    tools.forEach((tool) => this.addTool(tool));
  }
}
