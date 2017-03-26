"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (res, x, y) => {
    if (x === undefined) {
        res.sendStatus(204);
    }
    else if (typeof x === 'number') {
        res.status(x).send({
            error: x === 500 ? 'INTERNAL_ERROR' : y
        });
    }
    else {
        res.send(x);
    }
};
