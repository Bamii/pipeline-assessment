interface ResponseShape {
  results: Array<DataArrayShape>;
}

interface DataArrayShape {
  [propName: string | number]: Array<DataShape> | Paging;
}

type Paging = {
  next: string;
};

type DataShape = {
  id: string;
  row: number;
  age: number;
  gender: string;
}

type AppElement<T = Element> = T | null;

interface InitTableProps {
  table: string;
  error: string;
}

interface InitNavProps {
  next: string;
  page: string;
  prev: string;
}

interface Buttons {
  prev: AppElement<HTMLButtonElement>;
  next: AppElement<HTMLButtonElement>;
}

interface InitAppProps extends InitNavProps, InitTableProps {}


class App {
  #page: number = 1;
  #maxpage: number = 0;
  #table: AppElement = null;
  #error: AppElement = null;
  #pageview: AppElement = null;
  #url: string = "https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=1";
  #data = {};
  #buttons: Buttons = { prev: null, next: null };

  constructor() {}

  get pagedata(): DataShape { return this.#data[this.#page] }

  get page(): number { return this.#page }

  async initialise({ table, next, prev, page, error }: InitAppProps) {
    try {
      this.initialiseTable({ table, error });
      this.initialiseNavigationButtons({ next, prev, page });
      await this.fetchData();
      this.render();
    } catch (error) {
      this.displayError(error)
    }
  }

  initialiseTable({ table, error }: InitTableProps) {
    this.#table = document.querySelector(table);
    this.#error = document.querySelector(error);
  }

  initialiseNavigationButtons({ next, prev, page }: InitNavProps) {
    const nextBtn: AppElement<HTMLButtonElement> = document.querySelector(next);
    const prevBtn: AppElement<HTMLButtonElement> = document.querySelector(prev);

    this.#buttons = { next: nextBtn, prev: prevBtn };
    this.#pageview = document.querySelector(page);
    nextBtn?.addEventListener("click", async () => { await this.next() })
    prevBtn?.addEventListener("click", () => { this.prev() })
  }

  async fetchData() {
    try {
      this.renderLoading(true);
      const response: Response = await fetch(this.#url)
      const { results: [{ paging, ...results }] }: ResponseShape = await response.json();      
      
      this.#data = { ...this.#data, ...results };
      this.#url = (paging as Paging).next;
      this.#maxpage += 2;
    } catch (error) {
      this.displayError(error);
    } finally {
      this.renderLoading(false);
    }
  }

  renderLoading(status) {
    const action = status ? "add" : "remove";
    this.#table?.classList[action]("loading");
    this.controlNextButton(status);
  }

  render() {
    this.renderList();
    this.updatePageView();
    this.controlPrevButton();
  }

  renderList() {
    const rows: Array<HTMLTableRowElement> = Array.from(this.#table?.getElementsByTagName("tr") || []);
    const fields: Array<string> = ["row", "gender", "age"];

    rows.forEach((row, rowIndex) => {
      const rowFields: Array<HTMLTableCellElement> = Array.from(row.getElementsByTagName("td"))
      const rowData: DataShape = this.pagedata[rowIndex];
      // console.log(rowData)
      // console.log()
      row.setAttribute("data-entryid", rowData.id)
      
      rowFields.forEach((rowField, index) => {
        const key: string = fields[index];
        rowField.textContent = rowData[key];
      });
    });
  }

  updatePageView() {
    if(this.#pageview)
      this.#pageview.textContent = `Showing Page ${this.#page}`;
  }

  controlPrevButton() {
    if(this.#buttons.prev) {
      if(this.#page === 1)
        this.#buttons.prev.setAttribute("disabled", "");
      else
        this.#buttons.prev.removeAttribute("disabled");
    }
  }

  controlNextButton(status) {
    if(this.#buttons.next) {
      if(status) { 
        this.#buttons.next.setAttribute('disabled', '')
      } else {
        this.#buttons.next.removeAttribute('disabled')
      }
    }
  }

  async next() {
    try {
      if(this.#page == this.#maxpage)
        await this.fetchData();

      if(this.#page < this.#maxpage)
        ++this.#page;        
    } catch (error) {
      this.displayError(error);      
    } finally {
      this.render();
    }
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
    table: "[data-sink]",
    error: "[data-error]",
    next: "[data-nextbtn]",
    prev: "[data-prevbtn]",
    page: "[data-pageview]"
  });
};

document.addEventListener("DOMContentLoaded", startApp);
