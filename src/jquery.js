window.$ = window.jQuery = function (selectorOrArray) {
    let elements;
    if (typeof selectorOrArray === "string") {
        elements = document.querySelectorAll(selectorOrArray);
    } else if (selectorOrArray instanceof Array) {
        elements = selectorOrArray;
    }

    const api = this.Object.create(jQuery.prototype);
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArray.oldApi,
    });
    return api;
};

$.fn = jQuery.prototype = {
    constructor: jQuery,
    jquery: true,

    get(index) {
        return this.elements[index];
    },

    appendTo(node) {
        if (node instanceof Element) {
            this.each((el) => node.appendChild(el)); // 遍历 elements，对每个 el 进行 node.appendChild 操作
        } else if (node.jquery === true) {
            this.each((el) => node.get(0).appendChild(el)); // 遍历 elements，对每个 el 进行 node.get(0).appendChild(el))  操作
        }
    },

    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i);
        }
        return this;
    },

    parent() {
        const arr = [];
        this.each((node) => {
            if (arr.indexOf(node.parentNode) === -1) {
                arr.push(node.parentNode);
            }
        });
        return jQuery(arr);
    },

    print() {
        console.log(this.elements);
    },

    children() {
        const array = [];
        this.each((node) => {
            array.push(...node.children);
        });
        return jQuery(array);
    },

    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className);
        }
        return this;
    },

    find(selector) {
        let array = [];
        //遍历这些元素，转换成数组
        for (let i = 0; i < this.elements.length; i++) {
            const elements2 = Array.from(this.elements[i].querySelectorAll(selector));
            array = array.concat(elements2);
            //数组=元素+空数组
        }
        array.oldApi = this; //this就是旧Api
        return jQuery(array);
    },

    end() {
        return this.oldApi; //    this就是新Api
    },
};