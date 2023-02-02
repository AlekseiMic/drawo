import { Action } from '../../interfaces/Action';
import { Manager, RedrawState } from '../../';
import { ActionType } from '../../interfaces/ActionType';

export default (m: Manager, s: RedrawState, a: Action) => {
  switch (a.type) {
    case ActionType.MoveObserver: {
      if (!a.id) return;
      m.users.move(a.id, a.payload.x, a.payload.y);
      break;
    }
    default:
      break;
  }
};
