import { Action } from '../../interfaces/Action';
import { Layer, Manager, RedrawState } from '../../';
import { ActionType } from '../../interfaces/ActionType';

export default (m: Manager, s: RedrawState, a: Action) => {
  switch (a.type) {
    case ActionType.CreateLayer: {
      if (!a.id) return;
      m.layers.add(new Layer(a.payload.z, a.id));
      break;
    }
    case ActionType.RemoveLayer: {
      if (!a.id) return;
      if (a.id !== 'preview') {
        m.layers.getScratches(a.id).forEach((s) => {
          m.scratches.remove(s);
        });
      }
      m.layers.remove(a.id);
      break;
    }
    default:
      break;
  }
};
