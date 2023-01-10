import { Action } from "./interfaces/Action";
import { Manager } from "./Manager";
import { RedrawState } from "./RedrawState";

export default (m: Manager, s: RedrawState, a: Action) => {
  switch (a.type) {
    case "moveObserver": {
      if (!a.id) return;
      m.move(a.id, a.payload.x, a.payload.y);
      const shouldResize = m.updateDrawerRect();
      if (shouldResize) {
        Object.keys(m.layers).forEach((l) => {
          s.makeFullRedraw(l);
        });
      }
      break;
    }
    default:
      break;
  }
};

