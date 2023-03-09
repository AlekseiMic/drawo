const container = document.querySelector<HTMLDivElement>('#benchmark');
const statsContainer = document.querySelector('.stats');

const statsWindow = {
  show() {
    if (!container) return;
    container.style.display = 'block';
  },
  hide() {
    if (!container) return;
    container.style.display = 'none';
  },
  clear() {
    document.querySelectorAll('.row:not(.header)').forEach((element) => {
      element.remove();
    });
  },
  addHeader(text: string) {
    const testHeader = document.createElement('h2');
    testHeader.textContent = text + ' results';
    statsContainer?.appendChild(testHeader);
  },
  addRow(data: {
    type: string;
    count: string;
    min: string;
    max: string;
    avg: string;
  }) {
    const rowEl = document.createElement('div');
    rowEl.classList.add('row');

    const type = document.createElement('span');
    const count = document.createElement('span');
    const min = document.createElement('span');
    const avg = document.createElement('span');
    const max = document.createElement('span');

    type.textContent = data.type;
    count.textContent = data.count;
    min.textContent = data.min;
    avg.textContent = data.avg;
    max.textContent = data.max;

    rowEl.append(type, count, min, avg, max);
    statsContainer?.appendChild(rowEl);
  },
  addResults(
    name: string,
    results: {
      all: number;
      diff: number;
      draw: number;
    }[]
  ) {
    const calculations = results.reduce(
      (
        acc: Record<
          string,
          {
            type: string;
            min: number;
            max: number;
            sum: number;
          }
        >,
        item: any
      ) => {
        for (const k in item) {
          if (!acc[k]) acc[k] = { sum: 0, type: k, min: Infinity, max: 0 };
          acc[k].sum += item[k];
          acc[k].min = item[k] < acc[k].min ? item[k] : acc[k].min;
          acc[k].max = item[k] > acc[k].max ? item[k] : acc[k].max;
        }
        return acc;
      },
      {}
    );

    this.addHeader(name);
    for (const item in calculations) {
      this.addRow({
        count: results.length + '',
        min: calculations[item].min + '',
        max: calculations[item].max + '',
        avg: (calculations[item].sum / results.length).toPrecision(3) + '',
        type: item,
      });
    }
  },
};

export default statsWindow;
