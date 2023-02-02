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
      m.layers!.layers[a.layerId].add(scratch);
      s.addNewScratchToDraw(a.layerId, a.id);
      break;
    }
    case ActionType.RemoveScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      if (!s.isMarked(a.layerId, a.id)) {
        s.addRectToRedraw(a.layerId, scratch.rect);
        s.markChanged(a.layerId, a.id);
      }
      m.layers!.layers[a.layerId].remove(a.id);
      break;
    }
    case ActionType.TranslateScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      if (!s.isMarked(a.layerId, a.id)) {
        s.addRectToRedraw(a.layerId, scratch.rect);
        s.markChanged(a.layerId, a.id);
      }
      scratch.move(a.payload.move);
      break;
    }
    case ActionType.ChangeScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      if (!s.isMarked(a.layerId, a.id)) {
        s.addRectToRedraw(a.layerId, scratch.rect);
        s.markChanged(a.layerId, a.id);
      }
      scratch.change(a.payload);
      break;
    }
    case ActionType.HoverScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.hovered;
      if (a.user !== m.user) return;
      m.layers!.layers.preview.add(scratch);
      s.addNewScratchToDraw('preview', a.id);
      break;
    }
    case ActionType.UnhoverScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.active;
      if (a.user !== m.user) return;
      s.addRectToRedraw('preview', scratch.rect);
      m.layers!.layers.preview.remove(scratch.id);
      break;
    }
    case ActionType.DragScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.dragged;
      m.layers!.layers.preview.add(scratch);
      s.addNewScratchToDraw('preview', a.id);
      s.addRectToRedraw(a.layerId, scratch.rect);
      break;
    }
    case ActionType.DropScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch) return;
      scratch.state = ScratchState.active;
      s.addRectToRedraw('preview', scratch.rect);
      m.layers!.layers.preview.remove(scratch.id);
      s.markChanged(a.layerId, a.id);
      scratch.change(a.payload);
      break;
    }
    case ActionType.MoveScratch: {
      const scratch = m.layers!.layers[a.layerId].getScratch(a.id);
      if (!scratch || !m.layers!.layers[a.payload.layerId]) return;
      s.addRectToRedraw(a.layerId, scratch.rect);
      scratch.change(a.payload);
      m.layers!.layers[a.payload.layerId].add(scratch);
      s.addNewScratchToDraw(a.payload.layerId, a.id);
      m.layers!.layers[a.layerId].remove(scratch.id);
      break;
    }
    default:
      break;
  }
};
