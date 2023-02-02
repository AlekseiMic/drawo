import { RedrawState } from "../entities";
import { Manager } from "../services";
import { Action } from "./Action";

export type Reducer = (m: Manager, s: RedrawState, a: Action) => void;
