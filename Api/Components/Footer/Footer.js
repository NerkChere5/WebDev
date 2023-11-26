import {Component} from '../Component/Component.js';


export class Footer extends Component {
    static css = true;
    static html = true;
    static url = import.meta.url;


    static {
        this.init();
    }

    _init() {
        let date_container = this._shadow.querySelector('.date');
        let date = new Date();
        date_container.textContent = '2023 — ' + date.getFullYear() + ' гг.';
    }
}
