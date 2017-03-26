"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
/**
 * Indicator
 */
class default_1 {
    constructor(text) {
        let i = 0; // Dots counter
        draw();
        this.clock = setInterval(draw, 300);
        function draw() {
            cll();
            i = (i + 1) % 4;
            const dots = new Array(i + 1).join('.');
            process.stdout.write(text + dots); // Write text
        }
    }
    end() {
        clearInterval(this.clock);
        cll();
    }
}
exports.default = default_1;
/**
 * Clear current line
 */
function cll() {
    readline.clearLine(process.stdout, 0); // Clear current text
    readline.cursorTo(process.stdout, 0, null); // Move cursor to the head of line
}
