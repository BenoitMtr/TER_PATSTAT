module.exports.formatTime = ts => {
    if (ts >= 3.6e6) {
        const h = Math.floor(ts / 3.6e6);
        ts -= h * 3.6e6;
        const m = Math.floor(ts / 6e4);
        ts -= m * 6e4;
        const s = Math.floor(ts / 1e3);
        ts -= s * 1e3;
        return `${h}h ${m}m ${s}s ${ts}ms`;
    }
    if (ts >= 6e4) {
        const m = Math.floor(ts / 6e4);
        ts -= m * 6e4;
        const s = Math.floor(ts / 1e3);
        ts -= s * 1e3;
        return `${m}m ${s}s ${ts}ms`;
    }
    if (ts >= 1e3) {
        const s = Math.floor(ts / 1e3);
        ts -= s * 1e3;
        return `${s}s ${ts}ms`;
    }
    return `${ts}ms`;
};