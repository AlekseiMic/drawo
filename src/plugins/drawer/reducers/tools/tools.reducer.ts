import { ScratchState, Action } from '../../interfaces';
import { Manager, RedrawState } from '../../';
import { ScratchFactory } from '../../scratches/ScratchFactory';
import { ActionType } from '../../interfaces/ActionType';

export default (m: Manager, s: RedrawState, a: Action) => {
  if (!a.layerId || !a.id || !a.user) return;
  switch (a.type) {
    case ActionType.AddScratch: {
      const scratch = ScratchFactory.create(a);
      if (!scratch) return;
      m.scratches.add(scratch);
      m.layers!.addScratch(a.layerId, scratch.id);
      s.addNewScratchToDraw(a.layerId, a.id);
      break;
    }
    case ActionType.RemoveScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      if (!s.isMarked(a.layerId, a.id)) {
        s.addRectToRedraw(a.layerId, scratch.rect);
        s.markChanged(a.layerId, a.id);
      }
      m.layers!.removeScratch(a.layerId, scratch.id);
      break;
    }
    case ActionType.TranslateScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      if (!s.isMarked(a.layerId, a.id)) {
        s.addRectToRedraw(a.layerId, scratch.rect);
        s.markChanged(a.layerId, a.id);
      }
      scratch.move(a.payload.move);
      break;
    }
    case ActionType.ChangeScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      if (!s.isMarked(a.layerId, a.id)) {
        s.addRectToRedraw(a.layerId, scratch.rect);
        s.markChanged(a.layerId, a.id);
      }
      scratch.change(a.payload);
      break;
    }
    case ActionType.HoverScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.hovered;
      if (a.user !== m.user.id) return;
      m.layers!.addScratch('preview', scratch.id);
      s.addNewScratchToDraw('preview', a.id);
      break;
    }
    case ActionType.UnhoverScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.active;
      if (a.user !== m.user.id) return;
      s.addRectToRedraw('preview', scratch.rect);
      m.layers!.removeScratch('preview', scratch.id);
      break;
    }
    case ActionType.DragScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.dragged;
      m.layers!.addScratch('preview', scratch.id);
      s.addNewScratchToDraw('preview', a.id);
      s.addRectToRedraw(a.layerId, scratch.rect);
      break;
    }
    case ActionType.DropScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.active;
      s.addRectToRedraw('preview', scratch.rect);
      m.layers!.removeScratch('preview', scratch.id);
      s.markChanged(a.layerId, a.id);
      scratch.change(a.payload);
      break;
    }
    case ActionType.MoveScratch: {
      const scratch = m.scratches.get(a.id);
      if (!scratch) return;
      scratch.change(a.payload);
      s.addRectToRedraw(a.layerId, scratch.rect);
      s.addNewScratchToDraw(a.payload.layerId, a.id);
      m.layers!.addScratch(a.payload.layerId, scratch.id);
      m.layers!.removeScratch(a.layerId, scratch.id);
      break;
    }
    default:
      break;
  }
};
