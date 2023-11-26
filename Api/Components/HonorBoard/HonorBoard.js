import {Component} from '../Component/Component.js';


export class HonorBoard extends Component {
    static attributes = ['header'];
    static css = true;
    static html = true;
    static url = import.meta.url;


    static {
        this.init();
    }


    _board = null;
    _items_container = null;
    _header = '';
    _header_container = null;
    _count = 4;
    _template = null;


    get header() {
        return this._header;
    }
    set header(value) {
        this._disabled = value;
        this._set_header();
    }


    _assemble_items() {
        let items_container = this._template.querySelector('.items').cloneNode(true);
        let count_items = 0;
        let count_lines = 0;

        for (let child of this.children) {
            count_items++;

            if (((count_items / this._count) - count_lines) > 1) {
                count_lines++;
                this._board.append(items_container);
                items_container = this._template.querySelector('.items').cloneNode(true);
            }


            let item = this._template.querySelector('.item').cloneNode(true);

            for (let property in child.dataset) {
                let elem = this._template.querySelector('.item_' + property).cloneNode(true);

                if (property == 'image') {
                    elem.setAttribute('src', child.dataset[property]);
                }
                else {
                    elem.textContent = child.dataset[property];
                }

                item.append(elem);
            }

            items_container.append(item);
        }

        this._board.append(items_container);
    }

    _init() {
        this._board = this._shadow.querySelector('#board');
        this._items_container = this._shadow.querySelector('#items');
        this._template = this._shadow.querySelector('template').content;

        this.refresh();
    }

    _set_header() {
        if (!this._header_container) {
            this._header_container = this._template.querySelector('.header').cloneNode(true);
            this._board.prepend(this._header_container);
        }

        this._header_container.textContent = this._header;
    }

    // _grid_tune() {
    //     if (this._count_items < 5) {
    //         this._items_container.style.gridAutoFlow = 'column';
    //     }
    // }


    refresh() {
        !this._header || this._set_header();
        this._assemble_items();
        // this._grid_tune();
    }
}
