// 15.04.2023


import {Component} from '../Component/Component.js';
import {Common} from '../../Units/Common/Common.js';
import {Model} from '../../Units/Model/Model.js';


export class Repeater extends Component {
    static attributes = ['model', 'replacement'];

    static Manager = class Manager {
        _elements = null;
        _item = null;
        _key = null;
        _model = null;
        _model_item = null;


        _elements__define() {
            let elements = this._item.querySelectorAll('[id]');
            this._elements = {};

            for (let element of elements) {
                this._elements[element.id] = element;
            }
        }


        constructor({item, key, model} = {}) {
            this._item = item;
            this._key = key;
            this._model = model;
            this._model_item = this._model.get(this._key);
            this._elements__define();

            this.init();
        }

        data__apply() {}

        data__update() {}

        index__apply() {}

        init() {}
    };


    static {
        this.init();
    }


    _content_initial = null;
    _delegate = null;
    _delegate_html = '';
    _delegate_selector = 'template[Repeater__delegate]';
    _item_template = document.createElement('template');
    _items = new Map();
    _model = new Model();
    _model_selector = 'template[Repeater__model]';
    _replacement = null;
    _replacement_regExp = /\$\{\s*(.*?)\s*:\s*(.+?)\s*\}/g;

    _model_eventListeners = [
        ['added', this._model__on_added.bind(this)],
        ['cleared', this._model__on_cleared.bind(this)],
        ['deleted', this._model__on_deleted.bind(this)],
        ['filled', this._model__on_filled.bind(this)],
        ['filtered', this._model__on_filtered.bind(this)],
        ['ordered', this._model__on_ordered.bind(this)],
        ['updated', this._model__on_updated.bind(this)],
    ];


    Manager = this.constructor.Manager;


    get delegate() {
        return this._delegate;
    }
    set delegate(arg) {
        block:
        if (arg instanceof HTMLTemplateElement) {
            let [delegate, script] = arg.content.children;

            this._delegate = delegate || null;

            if (!script) break block;

            this.Manager = Common.execute_expression(script.text, {Repeater: this.constructor}) || this.Manager;
        }
        else {
            this._delegate = arg;
        }

        this._delegate_html = this._replacement ? this._delegate?.outerHTML || '' : '';
    }

    get model() {
        return this._model;
    }
    set model(model) {
        if (this._model instanceof Model) {
            Component.eventListeners__remove(this._model, this._model_eventListeners);
        }

        this._model = model;

        if (this._model instanceof Model) {
            this.attribute__set('model');
            Component.eventListeners__add(this._model, this._model_eventListeners);
        }
        else {
            this.attribute__set('model', this._model);
            this._items__define();
        }
    }

    get replacement() {
        return this._replacement;
    }
    set replacement(replacement) {
        this._replacement = replacement;
        this.attribute__set('replacement', this._replacement);
    }


    _content_initial__define() {
        let template = document.createElement('template');
        template.innerHTML = this.innerHTML;
        this._content_initial = template.content;
    }

    _init() {
        this._content_initial__define();
        this.delegate = this._content_initial.querySelector(this._delegate_selector);
        this._model_data__define();

        this.attributes__refresh();
        this.refresh();
    }

    _item__create(key, model_item = null) {
        model_item ||= this._model.get(key);
        let item = null;

        if (this._delegate_html && this._replacement) {
            let f = (match, group_name, group_path) => group_name == this._replacement ? Common.extract(model_item, group_path) ?? '' : match;
            this._item_template.innerHTML = this._delegate_html.replace(this._replacement_regExp, f);
            item = this._item_template.content.children[0];
        }
        else if (this._delegate) {
            item = this._delegate.cloneNode(true);
        }

        if (item) {
            if (this._model instanceof Model) {
                item.Repeater__manager = new this.Manager({item, key, model: this._model});
            }

            let item_prev = this._items.get(key);
            this._items.set(key, item);
            item_prev ? item_prev.replaceWith(item) : this.append(item);
        }

        return item;
    }

    _item__update(key) {
        if (this._replacement) {
            this._item__create(key);

            return;
        }

        let item = this._items.get(key);
        item.Repeater__manager.data__apply();
    }

    _items__add(model_items) {
        for (let key of model_items.keys()) {
            this._item__create(key);
        }
    }

    _items__clear() {
        this.textContent = '';
        this._items.clear();
    }

    _items__define() {
        this._items__clear();

        if (!(this._model instanceof Model)) {
            for (let i = 0; i < this._model; i++) {
                let model_item = {
                    _index: i,
                    data: i + 1,
                };
                this._item__create(i, model_item);
            }

            return;
        }

        for (let key of this._model._items_keys) {
            this._item__create(key);
        }
    }

    _items__delete(model_items) {
        if (this._replacement) {
            this._items__define();

            return;
        }

        for (let key of model_items.keys()) {
            let item = this._items.get(key);

            if (!item) continue;

            item.remove();
            this._items.delete(key);
        }

        this._items_indexes__apply();
    }

    _items__filter() {
        for (let [key, item] of this._items) {
            let model_item = this._model.get(key);
            this.constructor.attribute__set(item, 'Repeater__filtered', model_item._filtered);
        }
    }

    _items__order() {
        if (this._replacement) {
            this._items__define();

            return;
        }

        for (let key of this._model._items_keys) {
            let item = this._items.get(key);
            this.append(item);
        }

        this._items_indexes__apply();
    }

    _items_indexes__apply() {
        for (let item of this._items.values()) {
            item.Repeater__manager.index__apply();
        }
    }

    _model__on_added(event) {
        this._items__add(event.detail.items);
    }

    _model__on_cleared() {
        this._items__clear();
    }

    _model__on_deleted(event) {
        this._items__delete(event.detail.items);
    }

    _model__on_filled() {
        this._items__define();
    }

    _model__on_filtered() {
        this._items__filter();
    }

    _model__on_ordered() {
        this._items__order();
    }

    _model__on_updated(event) {
        this._item__update(event.detail.key);
    }

    _model_data__define() {
        if (!(this._model instanceof Model)) return;

        let template = this._content_initial.querySelector(this._model_selector);
        let script = template?.content.children[0];

        if (!script) return;

        let items = Common.execute_expression(script.text) || [];
        this._model.fill(items);
    }


    refresh() {
        this._items__define();
    }
}
