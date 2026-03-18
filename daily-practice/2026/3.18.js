function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

function throttle(fn, delay) {
    let lastTime = 0;
    return function(...args) {
        let now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            fn.apply(this, args);
        }
    }
}

function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);

    const cloneTarget = Array.isArray(obj) ? [] : {};
    hash.set(obj, cloneTarget);

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloneTarget[key] = deepClone(obj[key], hash);
        }
    }
    return cloneTarget;
}