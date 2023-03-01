export class RefreshService {
  public isRunning = false;

  private _prevTS: number = 0;

  private _callback?: (...args: any[]) => void;

  constructor() {
    this.update = this.update.bind(this);
  }

  setUpdateCallback(callback: typeof this._callback) {
    this._callback = callback;
  }

  start() {
    this.isRunning = true;
    window.requestAnimationFrame(this.update);
  }

  stop() {
    this.isRunning = false;
  }

  private update(ts: number) {
    if (!this.isRunning || !this._callback) return;
    window.requestAnimationFrame(this.update);
    // if (ts - this._prevTS < ) return;
    this._prevTS = ts;
    this._callback();
  }
}
