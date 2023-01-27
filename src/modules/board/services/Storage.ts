export class Storage {
  public name: string = '';
  public id: string = '';

  constructor() {
    this.loadData();
  }

  private loadData() {
    const data = JSON.parse(window.localStorage.getItem('session') ?? '{}');
    this.name = data?.name ?? '';
    this.id = data?.id ?? '';
  }

  public saveData({ name, id }: { name?: string; id?: string }) {
    if (name && this.name !== name) this.name = name;
    if (id && this.id !== id) this.id = id;

    window.localStorage.setItem(
      'session',
      JSON.stringify({ name: name || this.name, id: id || this.id })
    );
  }
}
