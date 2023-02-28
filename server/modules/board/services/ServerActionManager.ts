import { Action, ActionManager, RedrawState } from '@plugins/drawer';

export class ServerActionManager extends ActionManager {
  dispatch(action: Action | Action[]) {
    const actions = Array.isArray(action) ? action : [action];
    this._actions.external.pending.push(...actions);
    setTimeout(() => this.getPendingUpdates(), 1);
  }

  public getPendingUpdates() {
    const actions = this._actions.external.pending;
    this._actions.external.pending = [];
    const state = new RedrawState();

    if (actions.length) {
      for (const a of actions) {
        for (const r of this._reducers) {
          r(this.manager, state, a);
        }
      }
    }

    return state;
  }
}
