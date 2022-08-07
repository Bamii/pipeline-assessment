
interface ResponseShape {
  results: Array<String>
}

type DataArrayShape<T,V> = {
  [Property in keyof T]: V
}

type DataShape = {

}

class App {
  #maxpage = 0;
  #page: number = 1;
  #pageview: Element | null = null;
  #table: Element | null = null;
  #url = 'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=1';
  #data = {};
  #error: Element | null = null;

  constructor() {}

  get pagedata() { return this.#data[this.#page] }

  get page() { return this.#page }

  async initialise({ table, next, prev, page, error }) {
    try {
      this.initialiseTable({ table, error });
      this.initialiseNavigationButtons({ next, prev, page });
      await this.fetchData();
      this.render();
    } catch (error) {
      this.displayError(error)
    }
  }

  initialiseTable({ table, error }) {
    this.#table = document.querySelector(table);
    this.#error = document.querySelector(error);
  }

  initialiseNavigationButtons({ next, prev, page }) {
    const nextBtn = document.querySelector(next);
    const prevBtn = document.querySelector(prev);

    this.#pageview = document.querySelector(page);
    nextBtn.addEventListener('click', () => { this.next() })
    prevBtn.addEventListener('click', () => { this.prev() })
  }

  async fetchData() {
    try {
      const response: Response = await fetch(this.#url)
      const { results: [{ paging, ...results }] } = await response.json();
  
      this.#data = { ...this.#data, ...results };
      this.#url = paging.next;
      this.#maxpage += 2;
    } catch (error) {
      throw new Error(error);
    }
  }

  render() {
    this.renderList();
    this.updatePageView();
  }

  renderList() {
    const rows = Array.from(this.#table?.getElementsByTagName('tr') || []);
    const fields = ['row', 'gender', 'age'];
    const data = this.pagedata;

    rows.forEach((row, rowIndex) => {
      const rowFields = Array.from(row.getElementsByTagName('td'))
      const rowData = data[rowIndex];
      
      rowFields.forEach((rowField, index) => {
        const key = fields[index];
        rowField.textContent = rowData[key];
      });
    });
  }

  updatePageView() {
    if(this.#pageview)
      this.#pageview.textContent = `${this.#page}`;
  }

  next() {
    ++this.#page;
    this.render();
    
    if(this.#page == this.#maxpage)
      this.fetchData();
  }

  prev() {
    if(this.#page === 1)
      return;

    --this.#page;
    this.render();
  }

  displayError(error) {
    if(this.#error)
      this.#error.textContent = error.message;
  }
}

const startApp = async () => {
  const app = new App();

  app.initialise({
    table: '[data-sink]',
    error: '[data-error]',
    next: '[data-nextbtn]',
    prev: '[data-prevbtn]',
    page: '[data-pageview]'
  });
};

document.addEventListener('DOMContentLoaded', startApp);
