/* eslint-disable no-unused-vars */
import { ITool } from '../interfaces/ITool';
import { Manager } from '../';

export abstract class BaseTool implements ITool {
  protected active: boolean = false;

  protected activated: boolean = false;

  protected abstract applyListeners(): void;

  protected abstract disableListeners(): void;

  constructor(protected manager: Manager) {}

  activate(): void {
    if (this.activated) return;
    this.activated = true;
    this.applyListeners();
  }

  disable(): void {
    if (!this.activated) return;
    this.activated = false;
    this.disableListeners();
  }
}
