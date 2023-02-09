import { Action } from '../../interfaces';
import { ActionType } from '../../interfaces/ActionType';

export const createLayer = (id: string, z: number, payload: {}) =>
  ({
    type: ActionType.CreateLayer,
    id,
    payload: { z, ...payload },
  } as Action);

export const removeLayer = (id: string, payload: {}) =>
  ({
    type: ActionType.RemoveLayer,
    id,
    payload,
  } as Action);
