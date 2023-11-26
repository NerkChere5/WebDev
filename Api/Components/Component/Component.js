// 25.12.2020


export class Component extends HTMLElement {
    static _defined = null;
    static _dom = null;


    static attributes = [];
    static components = [];
    static css = '';
    static html = '';
    static observedAttributes = null;
    static tag_prefix = 'x';
    static url = '';


    static async _dom__create() {
        await this._resources__define();

        if (typeof this.css != 'string') {
            this.css = '';
        }

        if (typeof this.html != 'string') {
            this.html = '';
        }

        if (!this.css && !this.html) return null;

        let template = document.createElement('template');

        if (this.html) {
            template.innerHTML = this.html;
        }

        if (this.css) {
            let style = document.createElement('style');
            style.textContent = this.css;
            template.content.append(style);
        }

        return template.content;
    }

    static _observedAttributes__define() {
        this.observedAttributes = [];

        for (let attribute of this.attributes) {
            let attribute_lowCase = attribute.toLowerCase();
            this.observedAttributes[attribute_lowCase] = attribute;
            this.observedAttributes.push(attribute_lowCase);
        }
    }

    static async _resources__define() {
        if (!this.url || !this.css && !this.html) return;

        let promises = [];
        let url_part = this.url.replace(/\.\w+$/, '');

        if (this.css === true) {
            promises[0] = fetch(`${url_part}.css`).then((response) => response.text());
        }

        if (this.html === true) {
            promises[1] = fetch(`${url_part}.html`).then((response) => response.text());
        }

        let promises_results = await Promise.allSettled(promises);
        this.css = promises_results[0]?.value || this.css;
        this.html = promises_results[1]?.value || this.html;
    }


    static attribute__get(element, attribute_name) {
        let attribute_value = element.getAttribute(attribute_name);

        if (attribute_value == null) {
            return null;
        }
        else if (attribute_value == '') {
            return true;
        }

        let attribute_value_num = parseFloat(attribute_value);

        if (!isNaN(attribute_value_num)) {
            attribute_value = attribute_value_num;
        }

        return attribute_value;
    }

    static attribute__set(element, attribute_name, attribute_value = null) {
        if (!attribute_value && attribute_value !== 0 && attribute_value !== '') {
            element.removeAttribute(attribute_name);

            return;
        }

        if (attribute_value === true) {
            attribute_value = '';
        }

        element.setAttribute(attribute_name, attribute_value);
    }

    static attribute_number__get(element, attribute_name) {
        let attribute_value = element.getAttribute(attribute_name);
        let attribute_value_num = parseFloat(attribute_value);

        if (isNaN(attribute_value_num)) return null;

        return attribute_value_num;
    }

    static css__get(element, prop_name) {
        return getComputedStyle(element)[prop_name];
    }

    static css_num__get(element, prop_name) {
        let prop_value = this.css__get(...arguments);
        let prop_value_num = parseFloat(prop_value);

        return isNaN(prop_value_num) ? prop_value : prop_value_num;
    }

    static height_inner__get(element) {
        return element.clientHeight - this.css_num__get(element, 'paddingTop') - this.css_num__get(element, 'paddingBottom');
    }

    static height_inner__set(element, height = null) {
        if (!height && height !== 0) {
            element.style.height = '';

            return;
        }

        let css_height = height;

        if (this.css__get(element, 'boxSizing') == 'border-box') {
            css_height += this.css_num__get(element, 'borderTopWidth') + this.css_num__get(element, 'borderBottomWidth') + this.css_num__get(element, 'paddingTop') + this.css_num__get(element, 'paddingBottom');
        }

        element.style.height = `${css_height}px`;
    }

    static height_outer__get(element) {
        if (!this.visible__get(element)) return 0;

        return element.offsetHeight + this.css_num__get(element, 'marginTop') + this.css_num__get(element, 'marginBottom');
    }

    static height_outer__set(element, height = null) {
        if (!height && height !== 0) {
            element.style.height = '';

            return;
        }

        let css_height = height - this.css_num__get(element, 'marginTop') - this.css_num__get(element, 'marginBottom');

        if (this.css__get(element, 'boxSizing') != 'border-box') {
            css_height -= this.css_num__get(element, 'borderTopWidth') + this.css_num__get(element, 'borderBottomWidth') + this.css_num__get(element, 'paddingTop') + this.css_num__get(element, 'paddingBottom');
        }

        css_height = Math.max(css_height, 0);
        element.style.height = `${css_height}px`;
    }

    static async init() {
        if (customElements.getName(this)) return;

        let promise_resolve = null;
        this._defined = new Promise((resolve) => promise_resolve = resolve);
        this._dom = await this._dom__create();
        this._observedAttributes__define();

        let promises = this.components.map((item) => item._defined);
        await Promise.all(promises);

        let tag = `${this.tag_prefix}-${this.name.toLowerCase()}`;
        customElements.define(tag, this);

        promise_resolve();
    }

    static left__get(element) {
        if (!element.offsetParent) return 0;

        return element.offsetLeft - this.css_num__get(element, 'marginLeft') - this.css_num__get(element.offsetParent, 'paddingLeft');
    }

    static left__set(element, left = null) {
        if (!left && left !== 0) {
            element.style.left = '';

            return;
        }

        let css_left_prev = this.css_num__get(element, 'left');
        let left_prev = this.left__get(element);

        if (css_left_prev == 'auto') {
            css_left_prev = this.css__get(element, 'position') == 'relative' ? 0 : left_prev;
        }

        let css_left = css_left_prev + left - left_prev;
        element.style.left = `${css_left}px`;
    }

    static path__get(element, root = null) {
        let path = [];
        let aim = element;

        while (aim && aim != root) {
            path.push(aim);
            aim = aim.parentElement;
        }

        path.reverse();

        return path;
    }

    static top__get(element) {
        if (!element.offsetParent) return 0;

        return element.offsetTop - this.css_num__get(element, 'marginTop') - this.css_num__get(element.offsetParent, 'paddingTop');
    }

    static top__set(element, top = null) {
        if (!top && top !== 0) {
            element.style.top = '';

            return;
        }

        let css_top_prev = this.css_num__get(element, 'top');
        let top_prev = this.top__get(element);

        if (css_top_prev == 'auto') {
            css_top_prev = this.css__get(element, 'position') == 'relative' ? 0 : top_prev;
        }

        let css_top = css_top_prev + top - top_prev;
        element.style.top = `${css_top}px`;
    }

    static visible__get(element) {
        return element.offsetHeight && element.offsetWidth;
    }

    static width_inner__get(element) {
        return element.clientWidth - this.css_num__get(element, 'paddingLeft') - this.css_num__get(element, 'paddingRight');
    }

    static width_inner__set(element, width = null) {
        if (!width && width !== 0) {
            element.style.width = '';

            return;
        }

        let css_width = width;

        if (this.css__get(element, 'boxSizing') == 'border-box') {
            css_width += this.css_num__get(element, 'borderLeftWidth') + this.css_num__get(element, 'borderRightWidth') + this.css_num__get(element, 'paddingLeft') + this.css_num__get(element, 'paddingRight');
        }

        element.style.width = `${css_width}px`;
    }

    static width_outer__get(element) {
        if (!this.visible__get(element)) return 0;

        return element.offsetWidth + this.css_num__get(element, 'marginLeft') + this.css_num__get(element, 'marginRight');
    }

    static width_outer__set(element, width = null) {
        if (!width && width !== 0) {
            element.style.width = '';

            return;
        }

        let css_width = width - this.css_num__get(element, 'marginLeft') - this.css_num__get(element, 'marginRight');

        if (this.css__get(element, 'boxSizing') != 'border-box') {
            css_width -= this.css_num__get(element, 'borderLeftWidth') + this.css_num__get(element, 'borderRightWidth') + this.css_num__get(element, 'paddingLeft') + this.css_num__get(element, 'paddingRight');
        }

        css_width = Math.max(css_width, 0);
        element.style.width = `${css_width}px`;
    }


    static {
        this.init();
    }


    _built = false;
    _elements = null;
    _shadow = null;


    _attributes__init() {
        for (let attribute of this.constructor.attributes) {
            let prop = `_${attribute}`;
            this[prop] = this.attribute__get(attribute) ?? this[prop];
        }
    }

    _build() {
        if (this._built) return;

        let dom = this.constructor._dom?.cloneNode(true);

        if (dom) {
            this._shadow = this.attachShadow({mode: 'closed'});
            this._shadow.append(dom);
            this._elements__define();
        }

        this._attributes__init();
        this._init();

        this._built = true;
    }

    _elements__define() {
        let elements = this._shadow.querySelectorAll('[id]');
        this._elements = {};

        for (let element of elements) {
            this._elements[element.id] = element;
        }
    }

    _init() {}


    attributeChangedCallback(name, value_prev, value) {
        if (!this._built || value == value_prev) return;

        name = this.constructor.observedAttributes[name];
        this[name] = this.attribute__get(name);
    }

    attribute__get(attribute_name) {
        return this.constructor.attribute__get(this, ...arguments);
    }

    attribute__set(attribute_name, attribute_value = null) {
        return this.constructor.attribute__set(this, ...arguments);
    }

    attribute_number__get(element, attribute_name) {
        return this.constructor.attribute_number__get(this, ...arguments);
    }

    attributes__refresh() {
        for (let attribute of this.constructor.attributes) {
            this[attribute] = this[`_${attribute}`];
        }
    }

    connectedCallback() {
        this._build();
    }

    css__get(prop_name) {
        return this.constructor.css__get(this, ...arguments);
    }

    css_num__get(prop_name) {
        return this.constructor.css_num__get(this, ...arguments);
    }

    dispatchEvent_async(event) {
        setTimeout(() => this.dispatchEvent(event));
    }

    height_inner__get() {
        return this.constructor.height_inner__get(this);
    }

    height_inner__set(height = null) {
        return this.constructor.height_inner__set(this, ...arguments);
    }

    height_outer__get() {
        return this.constructor.height_outer__get(this);
    }

    height_outer__set(height = null) {
        return this.constructor.height_outer__set(this, ...arguments);
    }

    left__get() {
        return this.constructor.left__get(this);
    }

    left__set(left = null) {
        return this.constructor.left__set(this, ...arguments);
    }

    path__get(root = null) {
        return this.constructor.path__get(this, ...arguments);
    }

    top__get() {
        return this.constructor.top__get(this);
    }

    top__set(top = null) {
        return this.constructor.top__set(this, ...arguments);
    }

    visible__get() {
        return this.constructor.visible__get(this);
    }

    width_inner__get() {
        return this.constructor.width_inner__get(this);
    }

    width_inner__set(width = null) {
        return this.constructor.width_inner__set(this, ...arguments);
    }

    width_outer__get() {
        return this.constructor.width_outer__get(this);
    }

    width_outer__set(width = null) {
        return this.constructor.width_outer__set(this, ...arguments);
    }
}
