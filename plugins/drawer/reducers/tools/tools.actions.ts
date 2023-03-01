import { ActionType } from '../../interfaces/ActionType';

export const addScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.AddScratch,
    layerId,
    id,
    payload,
  };
};

export const moveScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.MoveScratch,
    layerId,
    id,
    payload,
  };
};

export const changeScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.ChangeScratch,
    layerId,
    id,
    payload,
  };
};

export const dragScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.DragScratch,
    layerId,
    id,
    payload,
  };
};

export const dropScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.DropScratch,
    layerId,
    id,
    payload,
  };
};

export const hoverScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.HoverScratch,
    layerId,
    id,
    payload,
  };
};

export const unhoverScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.UnhoverScratch,
    layerId,
    id,
    payload,
  };
};

export const translateScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.TranslateScratch,
    layerId,
    id,
    payload,
  };
};

export const removeScratch = (id: string, payload: {}, layerId = 'preview') => {
  return {
    type: ActionType.RemoveScratch,
    layerId,
    id,
    payload,
  };
};
