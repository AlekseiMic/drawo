export class Storage {
  set name(name: string) {
    this.saveData({ ...this.loadData(), name });
  }

  get name() {
    return this.loadData().name ?? '';
  }

  set userId(id: string) {
    this.saveData({ ...this.loadData(), id });
  }

  get userId() {
    return this.loadData().id ?? '';
  }

  private loadData(): { id?: string; name?: string } {
    return JSON.parse(window.localStorage.getItem('session') ?? '{}');
  }

  private saveData(data: { name?: string; id?: string }) {
    window.localStorage.setItem('session', JSON.stringify(data));
  }
}
