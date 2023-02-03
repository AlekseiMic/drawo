import { Action } from '../interfaces/Action';
import { Rect } from '../interfaces/Rect';

export type BaseRedrawState = {
  changed: Record<string, boolean>;
  isFull: boolean;
  redraw: Rect[];
  add: string[];
  resize: boolean;
};

export class RedrawState {
  private _state: Record<string, BaseRedrawState> = {};

  static filter(actions: Action[]) {
    return actions;
  }

  public getChanges(
    full: boolean = false,
    layers?: string[]
  ): [string, BaseRedrawState][] {
    if (full && layers) {
      return layers.map((l) => {
        return [
          l,
          { resize: true, isFull: true, redraw: [], changed: {}, add: [] },
        ];
      });
    }
    return Object.entries(this._state);
  }

  makeFullRedraw(layerId: string) {
    this.prepareLayerToRedraw(layerId);
    this._state[layerId].isFull = true;
  }

  addRectToRedraw(layerId: string, rect: Rect) {
    this.prepareLayerToRedraw(layerId);
    this._state[layerId].redraw.push(rect);
  }

  markChanged(layerId: string, scratchId: string) {
    this.prepareLayerToRedraw(layerId);
    this._state[layerId].changed[scratchId] = true;
  }

  isMarked(layerId: string, scratchId: string) {
    return this._state[layerId]?.changed[scratchId] ?? false;
  }

  addNewScratchToDraw(layerId: string, scratchId: string) {
    this.prepareLayerToRedraw(layerId);
    this._state[layerId].add.push(scratchId);
  }

  prepareLayerToRedraw(layerId: string) {
    if (!this._state[layerId]) {
      this._state[layerId] = {
        changed: {},
        isFull: false,
        redraw: [],
        add: [],
        resize: false,
      };
    }
  }
}
