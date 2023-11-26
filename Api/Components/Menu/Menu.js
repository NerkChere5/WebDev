import {Component} from '../Component/Component.js';


export class Menu extends Component {
    static css = true;
    static html = true;
    static url = import.meta.url;


    static {
        this.init();
    }
}
