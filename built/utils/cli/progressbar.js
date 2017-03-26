"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ev = require("events");
const readline = require("readline");
const chalk = require("chalk");
/**
 * Progress bar
 */
class default_1 extends ev.EventEmitter {
    constructor(max, text = null) {
        super();
        this.max = max;
        this.value = 0;
        this.text = text;
        this.indicator = 0;
        this.draw();
        const iclock = setInterval(() => {
            this.indicator = (this.indicator + 1) % 4;
            this.draw();
        }, 200);
        this.on('complete', () => {
            clearInterval(iclock);
        });
    }
    increment() {
        this.value++;
        this.draw();
        // Check if it is fulfilled
        if (this.value === this.max) {
            this.indicator = null;
            cll();
            process.stdout.write(`${this.render()} -> ${chalk.bold('Complete')}\n`);
            this.emit('complete');
        }
    }
    draw() {
        const str = this.render();
        cll();
        process.stdout.write(str);
    }
    render() {
        const width = 30;
        const t = this.text ? this.text + ' ' : '';
        const v = Math.floor((this.value / this.max) * width);
        const vs = new Array(v + 1).join('*');
        const p = width - v;
        const ps = new Array(p + 1).join(' ');
        const percentage = Math.floor((this.value / this.max) * 100);
        const percentages = chalk.gray(`(${percentage}%)`);
        let i;
        switch (this.indicator) {
            case 0:
                i = '-';
                break;
            case 1:
                i = '\\';
                break;
            case 2:
                i = '|';
                break;
            case 3:
                i = '/';
                break;
            case null:
                i = '+';
                break;
        }
        return `${i} ${t}[${vs}${ps}] ${this.value}/${this.max} ${percentages}`;
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
