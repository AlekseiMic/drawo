import { Action } from '../interfaces/Action';
import { Manager } from './Manager';
import { RedrawState } from '../entities/RedrawState';
import { Reducer } from '../interfaces/Reducer';

type Actions = {
  history: Action[];
  pending: Action[];
};

export class ActionManager {
  protected _actions: Record<'internal' | 'external', Actions> = {
    internal: { history: [], pending: [] },
    external: { history: [], pending: [] },
  };

  public manager: Manager;
  protected _reducers: Reducer[] = [];

  constructor(manager: Manager) {
    this.manager = manager;
  }

  serialize() {
    return {
      internal: this._actions.internal.pending,
      external: this._actions.external.pending,
    };
  }

  deserialize(data: any) {
    this._actions.external.pending = data?.external ?? [];
    this._actions.internal.pending = data?.internal ?? [];
  }

  clear() {
    this._actions = {
      internal: { history: [], pending: [] },
      external: { history: [], pending: [] },
    };
  }

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
        a.user = this.manager.user.id;
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

    const state = new RedrawState();

    if (actions.length) {
      for (const a of actions) {
        for (const r of this._reducers) {
          r(this.manager, state, a);
        }
      }

      for (const [layerId, changes] of state.getChanges()) {
        for (const scratchId of Object.keys(changes.changed)) {
          if (!this.manager.layers.isScratchOnTop(layerId, scratchId)) {
            state.addNewScratchToDraw(layerId, scratchId);
          } else {
            const scratch = this.manager.scratches.get(scratchId);
            if (!scratch) continue;
            state.addRectToRedraw(layerId, scratch.rect);
          }
        }
      }
    }

    return state;
  }
}
