import {Component} from '../Component/Component.js';


export class Switch extends Component {
    static attributes = ['disabled', 'on', 'vertical'];
    static css = true;
    static html = true;
    static url = import.meta.url;


    static {
        this.init();
    }


    _disabled = false;
    _on = false;
    _vertical = false;


    get disabled() {
        return this._disabled;
    }
    set disabled(disabled) {
        this._disabled = !!disabled;
        this.attribute__set('disabled', this._disabled);
    }

    get on() {
        return this._on;
    }
    set on(on) {
        this._on = !!on;
        this.attribute__set('on', this._on);
    }

    get vertical() {
        return this._vertical;
    }
    set vertical(vertical) {
        this._vertical = !!vertical;
        this.attribute__set('vertical', this._vertical);
    }


    _init() {
        this.addEventListener('pointerdown', this._on_pointerDown);
        this.addEventListener('transitionend', this._on_transitionEnd);

        this.attributes__refresh();
    }

    _on_pointerDown() {
        if (this.disabled) return;

        this.toggle();

        this.attribute__set('_transition', true);
        this.dispatchEvent(new CustomEvent('toggle'));
    }

    _on_transitionEnd() {
        this.attribute__set('_transition');
    }


    toggle() {
        this.on = !this._on;
    }
}
