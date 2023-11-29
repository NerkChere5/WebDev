import {Component} from '../Component/Component.js';


export class Footer extends Component {
    static css = true;
    static html = true;
    static url = import.meta.url;

    _images = {
        icon_vk: 'Vk.svg',
        icon_youtube: 'Youtube.svg',
    }


    static {
        this.init();
    }

    _init() {
        this._set_img();
        this._set_date();
    }

    _set_date() {
        let date_container = this._shadow.querySelector('.date');
        let date = new Date();
        date_container.textContent = '2023 — ' + date.getFullYear() + ' гг.';
    }

    _set_img() {
        for (let img_name in this._images) {
            let img = this._shadow.querySelector(`#${img_name}`);
            img.setAttribute('src', `${import.meta.url}/../${this._images[img_name]}`);
        }
    }
}
