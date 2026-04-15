'use strict';

class FakeClassList {
    constructor(initial) {
        this.classes = new Set(initial || []);
    }

    add(name) {
        this.classes.add(name);
    }

    remove(name) {
        this.classes.delete(name);
    }

    contains(name) {
        return this.classes.has(name);
    }

    toggle(name, force) {
        if (force === true) {
            this.classes.add(name);
            return true;
        }

        if (force === false) {
            this.classes.delete(name);
            return false;
        }

        if (this.classes.has(name)) {
            this.classes.delete(name);
            return false;
        }

        this.classes.add(name);
        return true;
    }
}

class FakeElement {
    constructor(options) {
        options = options || {};
        this.id = options.id || '';
        this.dataset = options.dataset || {};
        this.type = options.type || '';
        this.value = options.value || '';
        this.hidden = !!options.hidden;
        this.disabled = !!options.disabled;
        this.textContent = options.textContent || '';
        this.parentElement = options.parentElement || null;
        this.closestMap = options.closestMap || {};
        this.attributes = Object.assign({}, options.attributes || {});
        this.listeners = {};
        this.querySelectorMap = options.querySelectorMap || {};
        this.querySelectorAllMap = options.querySelectorAllMap || {};
        this.classList = new FakeClassList(options.classes);
        this.style = options.style || {};
        this.rect = options.rect || { top: 0, height: 0 };
        this.wasFocused = false;
    }

    addEventListener(type, handler) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(handler);
    }

    dispatchEvent(type, event) {
        var handlers = this.listeners[type] || [];
        handlers.forEach(function (handler) {
            handler.call(this, event);
        }, this);
    }

    click(event) {
        this.dispatchEvent('click', event || createEvent());
    }

    getAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    querySelector(selector) {
        return this.querySelectorMap[selector] || null;
    }

    querySelectorAll(selector) {
        return this.querySelectorAllMap[selector] || [];
    }

    closest(selector) {
        return this.closestMap[selector] || null;
    }

    focus() {
        this.wasFocused = true;
    }

    getBoundingClientRect() {
        return this.rect;
    }
}

class FakeDocument {
    constructor(options) {
        options = options || {};
        this.elementsById = options.elementsById || {};
        this.querySelectorMap = options.querySelectorMap || {};
        this.querySelectorAllMap = options.querySelectorAllMap || {};
        this.listeners = {};
        this.body = options.body || { style: {} };
        this.readyState = options.readyState || 'complete';
        this.referrer = options.referrer || '';
        this.title = options.title || '';
    }

    addEventListener(type, handler) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(handler);
    }

    dispatchEvent(type, event) {
        var handlers = this.listeners[type] || [];
        handlers.forEach(function (handler) {
            handler.call(this, event);
        }, this);
    }

    getElementById(id) {
        return this.elementsById[id] || null;
    }

    querySelector(selector) {
        return this.querySelectorMap[selector] || null;
    }

    querySelectorAll(selector) {
        return this.querySelectorAllMap[selector] || [];
    }
}

function createEvent(overrides) {
    return Object.assign({
        defaultPrevented: false,
        preventDefault: function () {
            this.defaultPrevented = true;
        }
    }, overrides || {});
}

function flushPromises() {
    return new Promise(function (resolve) {
        setImmediate(resolve);
    });
}

module.exports = {
    FakeClassList: FakeClassList,
    FakeDocument: FakeDocument,
    FakeElement: FakeElement,
    createEvent: createEvent,
    flushPromises: flushPromises
};