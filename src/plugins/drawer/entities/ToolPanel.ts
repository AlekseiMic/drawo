/* eslint-disable no-unused-vars */
import { RGBA } from '../interfaces/Color';
import { ITool } from '../interfaces/ITool';
import { Manager } from './Manager';
import { hexToRGBA } from '../utils/hexToRGBA';

export class ToolPanel {
  public thickness: number = 3;

  public active?: string;

  public rgba: RGBA = { r: 255, g: 255, b: 255, a: 255 };

  private _tools: Record<string, ITool> = {};

  private _color: string = '#ffffffff';

  set color(color: string) {
    this._color = color;
    this.rgba = hexToRGBA(color);
  }

  get color() {
    return this._color;
  }

  get tools() {
    return Object.keys(this._tools);
  }

  constructor(private manager: Manager) {}

  setActive(name: string) {
    const tool = this._tools[name];
    if (!tool) return;
    if (this.active) this._tools[this.active]?.disable();
    tool.activate();
    this.active = name;
  }

  get(name: string) {
    return this._tools[name];
  }

  add(...tools: (new (manager: Manager) => ITool)[]) {
    tools.forEach((tool) => {
      this._tools[tool.name] = new tool(this.manager);
    });
  }

  getSettings() {
    return {
      color: this.rgba,
      thickness: this.thickness,
    };
  }
}
