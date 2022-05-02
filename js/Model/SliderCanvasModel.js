

class SliderCanvasModel {
    constructor(canvas, valueCharts) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");

        this.valueCharts = valueCharts;
        let start = this._canvas.width - this.lengthMarkSlider;
        this.move = { slider: start, chart: 0 };

    }


    drawSlider() {
        let y = this._canvas.height;
        let x = this.move.slider;

        this._ctx.beginPath();
        this._ctx.moveTo(0 + x, y / 2);
        this._ctx.lineTo(8 + x, y / 2);
        this._ctx.lineTo(12 + x, y / 2 - 15);
        this._ctx.lineTo(16 + x, y / 2 + 15);
        this._ctx.lineTo(20 + x, y / 2 - 15);
        this._ctx.lineTo(24 + x, y / 2);
        this._ctx.lineTo(28 + x, y / 2 - 15);
        this._ctx.lineTo(32 + x, y / 2 + 15);
        this._ctx.lineTo(36 + x, y / 2 - 15);
        this._ctx.lineTo(40 + x, y / 2);
        this._ctx.lineTo(48 + x, y / 2);

        this._ctx.stroke();
        this._ctx.closePath();
    }


    drawBackground() {
        let radius = 5;
        this._ctx.fillStyle = '#E0E0E0';
        let width = this._canvas.width;
        let height = this._canvas.height - 20;
        let x = 0, y = 10;
        this._ctx.beginPath();
        this._ctx.moveTo(x + radius, y);
        this._ctx.lineTo(x + width - radius, y);
        this._ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this._ctx.lineTo(x + width, y + height - radius);
        this._ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this._ctx.lineTo(x + radius, y + height);
        this._ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this._ctx.lineTo(x, y + radius);
        this._ctx.quadraticCurveTo(x, y, x + radius, y);
        this._ctx.fill();
        this._ctx.fillStyle = 'black';
    }

    get lengthMarkSlider() {
        return 48;
    }

    get canvas() {
        return this._canvas;
    }

    get ctx() {
        return this._ctx;
    }
}

export { SliderCanvasModel };