// 06.11.2022


export class Common {
    static execute(js, args = {}) {
        try {
            return new Function(Object.keys(args), js)(...Object.values(args));
        }
        catch {}

        return null;
    }

    static execute_expression(js_expression, args = {}) {
        return this.execute(`return (${js_expression});`, args);
    }

    static extract(object, path) {
        if (!object || typeof path != 'string') return null;

        let aim = object;
        let props = path.split('.');

        for (let prop of props) {
            if (!(aim instanceof Object)) return null;

            aim = aim[prop];
        }

        return aim;
    }

    static inRange(num, min, max) {
        return num >= min && num <= max;
    }

    static toRange(num, min, max) {
        return num < min ? min : (num > max ? max : num);
    }
}
