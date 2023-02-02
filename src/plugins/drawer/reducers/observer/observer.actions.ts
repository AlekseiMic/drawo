import { ActionType } from '../../interfaces/ActionType';

export const moveObserver = (id: string, payload: {}) => ({
  type: ActionType.MoveObserver,
  id,
  payload,
});

