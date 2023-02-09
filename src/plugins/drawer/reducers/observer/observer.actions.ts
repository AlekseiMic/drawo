import { ActionType } from '../../interfaces/ActionType';

export const moveObserver = (id: string, payload: {}) => ({
  type: ActionType.MoveObserver,
  id,
  payload,
});

export const addObserver = (id: string, payload: {}) => ({
  type: ActionType.AddObserver,
  id,
  payload,
});

export const removeObserver = (id: string, payload: {}) => ({
  type: ActionType.RemoveObserver,
  id,
  payload,
});
