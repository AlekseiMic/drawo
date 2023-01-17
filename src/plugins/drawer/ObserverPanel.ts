import { Observer } from './Observer';

export class ObserverPanel {
  public active: Observer | null = null;
  public observers: Observer[] = [];

  create(user: string) {
    const observer = new Observer(user);
    this.observers.push(observer);
    return observer;
  }
}
