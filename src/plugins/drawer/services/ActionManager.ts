import { Action } from '../interfaces/Action';
import { Manager } from './Manager';
import { RedrawState } from '../entities/RedrawState';
import { Reducer } from '../interfaces/Reducer';

type Actions = {
  history: Action[];
  pending: Action[];
};

export class ActionManager {
  private _actions: Record<'internal' | 'external', Actions> = {
    internal: { history: [], pending: [] },
    external: { history: [], pending: [] },
  };

  private _reducers: Reducer[] = [];

  constructor(private manager: Manager) {}

  public getInternalHistory() {
    return this._actions.internal.history;
  }

  public clearInternalHistory() {
    this._actions.internal.history = [];
  }

  public dispatch(action: Action | Action[], internal = true) {
    let arr = this._actions.external;
    let actions = Array.isArray(action) ? action : [action];
    if (internal) {
      arr = this._actions.internal;
      actions = actions.map((a) => {
        a.timestamp = Date.now();
        a.user = this.manager.user;
        return a;
      });
    }
    arr.pending.push(...actions);
  }

  public addReducer(...reducers: Reducer[]) {
    reducers.forEach((reducer) => {
      this._reducers.push(reducer);
    });
  }

  public getPendingUpdates() {
    const internal = this._actions.internal.pending;
    const external = this._actions.external.pending;

    this._actions.internal.history.push(...internal);

    this._actions.internal.pending = [];
    this._actions.external.pending = [];

    const actions = [...internal, ...external];

    if (!actions.length) return null;

    const state = new RedrawState();

    for (const a of actions) {
      for (const r of this._reducers) {
        r(this.manager, state, a);
      }
    }

    for (const [layerId, changes] of state.getChanges()) {
      for (const scratchId of Object.keys(changes.changed)) {
        const layer = this.manager.layers.get(layerId);
        if (!layer?.isOnTop(scratchId)) {
          state.addNewScratchToDraw(layerId, scratchId);
        } else {
          const scratch = this.manager.scratches.get(scratchId);
          if (!scratch) continue;
          state.addRectToRedraw(layerId, scratch.rect);
        }
      }
    }

    return state;
  }
}
