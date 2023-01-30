import { Observer } from './Observer';

export class ObserverPanel {
  public active: Observer | null = null;

  public observers: Observer[] = [];

  create(id: string) {
    const observer = new Observer(id);
    this.observers.push(observer);
    return observer;
  }

  remove(id: string) {
    this.observers = this.observers.filter((o) => o.id !== id);
  }
}
