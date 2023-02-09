import { Action } from '../../interfaces/Action';
import { Manager, RedrawState, User } from '../../';
import { ActionType } from '../../interfaces/ActionType';

export default (m: Manager, s: RedrawState, a: Action) => {
  if (!a.id) return;
  switch (a.type) {
    case ActionType.MoveObserver: {
      m.users.move(a.id, a.payload.x, a.payload.y);
      break;
    }
    case ActionType.AddObserver: {
      const oldUser = m.users.getById(a.id);
      if (oldUser) {
        oldUser.change(a?.payload);
        if (a?.payload?.center) oldUser.setCenter(a.payload.center);
      } else {
        const user = new User(
          a.id,
          a.payload.name,
          a.payload.isObserver,
          a.payload.center
        );
        m.users.add(user);
      }
      break;
    }
    case ActionType.RemoveObserver: {
      if (a.id === m.user.id) return;
      m.users.remove(a.id);
      break;
    }
    case ActionType.ChangeObserver: {
      m.users.getById(a.id)?.change(a.payload);
      if ('x' in a.payload && 'y' in a.payload.y) {
        m.users.move(a.id, a.payload.x, a.payload.y);
      }
      break;
    }
    default:
      break;
  }
};
