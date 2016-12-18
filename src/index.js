// TODO:
// circular arcs of a particular length
// oval shaped bezier curves
// cutting oval shaped bezier curves at particular lengths

import React from 'react';
import ReactDOM from 'react-dom';

class Point {
    constructor(x, y) {
        Object.assign(this, {x, y});
    }

    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    perp(cw = false) {
        return cw ? new Point(this.y, -this.x) : new Point(-this.y, this.x);
    }

    scale(sx, sy = sx) {
        return new Point(sx * this.x, sy * this.y);
    }

    toString() {
        return `${this.x} ${this.y}`;
    }
}

const kappa = 4 * (Math.sqrt(2) - 1) / 3;

const ovalPath = (center, w, h, cw = false) => {
    const angle = 0;    // This can be anything
    const da = cw ? -Math.PI / 2 : Math.PI / 2;

    const n = [];
    const p = [];
    for (let i = 0; i < 4; i++) {
        n[i] = new Point(Math.cos(angle + i * da), Math.sin(angle + i * da));
        p[i] = center.add(n[i].scale(w, h));
    }
    n[4] = n[0];
    p[4] = p[0];

    const c1 = [];
    const c2 = [];
    for (let i = 0; i < 4; i++) {
        c1[i] = p[i].add(n[i].perp(cw).scale(kappa * w, kappa * h));
        c2[i] = p[i+1].add(n[i+1].perp(!cw).scale(kappa * w, kappa * h));
    }

    let d = `M${p[0]}`;

    for (let i = 0; i < 4; i++) {
        d += `C${c1[i]},${c2[i]},${p[i+1]}`;
    }

    return d;
}

class Oval extends React.Component {
    render() {
        const w = 100;
        const h = 133;

        const center = new Point(300, 300);

        const thickness = 20;
        const d = ovalPath(center, w, h) +
                  ovalPath(center, w - thickness, h - thickness, true);

        console.log(`d = ${d}`);
        console.log("hello, world");

        return <path d={d} stroke='black'/>;
    }
}

class Test extends React.Component {
    render() {
        const thickness = 20;
        return <svg width={1024} height={768} viewBox="0 0 1024 768">
            <g transform={'translate(0,768) scale(1,-1)'}>
                <Oval/>;
                <rect x={300 - 100} y={300 - 133} width={thickness} height={500} fill='black' />
            </g>
        </svg>
    }
}

const container = document.querySelector('#container');

ReactDOM.render(<Test/>, container);