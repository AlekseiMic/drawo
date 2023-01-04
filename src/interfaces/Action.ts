export interface Action {
  type: string;

  payload: Record<string, any>;

  timestamp?: number;

  user?: string;
}
