class HashRouter {
    constructor() {
        this.routes = {};
        this.currentUrl = '';
        this.refresh = this.refresh.bind(this);
        window.addEventListener('load', this.refresh);
        window.addEventListener('hashchange', this.refresh);
    }
    route(path, callback) {
        this.routes[path] = callback;
    }
    refresh() {
        this.currentUrl = location.hash.slice(1) || '/';
        const callback = this.routes[this.currentUrl];
        if (callback) {
            callback();
        } else {
            console.log('404 Not Found');
        }
    }
}

class HistoryRouter {
    constructor() {
        this.routes = {};
        this.refresh = this.refresh.bind(this);
        window.addEventListener('popstate', this.refresh);
        window.addEventListener('load', this.refresh);
    }
    route(path, callback) {
        this.routes[path] = callback;
    }
    push(path) {
        history.pushState({}, null, path);
        this.refresh();
    }
    refresh() {
        const path = location.pathname;
        
        const callback = this.routes[path];

        if (callback) {
            callback();
        } else {
            console.log('404 Not Found');
        }
    }
}