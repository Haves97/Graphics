import { MIN_VAL, MAX_VAL, MAX_DATE } from '../constans.js'

class BackgroundChartsModel {
    //stepMark - Это количество пикселей между метками, т.е. от 0 до метки и т.д.
    constructor(canvas, valueChartsCanvas, stepMark = 50) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");
        this._scaleMarksX = [];
        this._scaleMarksY = [];
        this._valueChartsCanvas = valueChartsCanvas;
        let y = this._valueChartsCanvas.canvas.height / 2 + 5;

        this._moveChartsCanvas = { x: 0, y: -y };
        this._stepMark = stepMark;
        this._initScaleMarks();
    }

    get canvas() {
        return this._canvas;
    }

    get ctx() {
        return this._ctx;
    }

    pushValueCharts() {
        this._valueChartsCanvas.pushValueCharts();
    }

    getValueModel() {

        let obj = {};
        obj.moveChartsCanvas = this._moveChartsCanvas;
        obj.scaleMarksX = this._scaleMarksX;
        obj.scaleMarksY = this._scaleMarksY;
        obj.objValTime = this._valueChartsCanvas.getValueTime();
        return obj;
    }

    _initScaleMarks() {
        let start = -5;
        let buffer = ["-100", "-50", "0", "50", "100"];
        for (let i = 0; i < 5; ++i) {
            this._addScaleMarks('Y', 0, start, buffer[i]);
            start -= this._stepMark;
        }

        let xCount = this._valueChartsCanvas.canvas.width / this._stepMark;
        if (!Number.isInteger(xCount)) {
            xCount = Math.round(xCount);
        }
        for (let i = 1; i <= xCount; ++i) {
            this._addScaleMarks('X', i * this._stepMark, 0, i * this._stepMark);
        }
    }

    _addScaleMarks(axis, x, y, value) {
        let obj = {};
        obj.x = x;
        obj.y = y;
        obj.value = value;
        axis == 'X' ? this._scaleMarksX.push(obj) : this._scaleMarksY.push(obj);
    }

    drawValueCharts() {
        this._valueChartsCanvas.drawCharts();
    }

    drawCharts() {
        this._ctx.save();
        let indent = this._getIndent('maxmin');
        this._ctx.translate(indent, this._canvas.height - 25);

        this._ctx.beginPath();
        this._ctx.moveTo(1, 1);
        this._ctx.lineTo(1, -this._canvas.height + 25);
        this._ctx.lineTo(this._canvas.width - indent, -this._canvas.height + 25);
        this._ctx.lineTo(this._canvas.width - indent, 1);
        this._ctx.lineTo(1, 1);
        this._ctx.clip();

        if (this._valueChartsCanvas.resizeWidth) {
            this._resizeScaleMarksX();
        }
        let coordTranslate = this._valueChartsCanvas.getCoordTranslate();
        this._ctx.drawImage(this._valueChartsCanvas.canvas, coordTranslate.x + this._moveChartsCanvas.x, -coordTranslate.y + this._moveChartsCanvas.y);

        this._ctx.restore();
    }

    _resizeScaleMarksX() {
        let count = this._valueChartsCanvas.canvas.width / 2 / this._stepMark;
        if (!Number.isInteger(count)) {
            count = Math.round(count);
        }
        let lastValue = this._scaleMarksX[this._scaleMarksX.length - 1].value;
        let lastX = this._scaleMarksX[this._scaleMarksX.length - 1].x;
        for (let i = 1; i <= count; ++i) {
            lastX += this._stepMark;
            lastValue += this._stepMark;
            this._addScaleMarks('X', lastX, 0, lastValue);
        }
        this._valueChartsCanvas.resizeWidth = false;
    }

    drawBackgroundY() {
        this._ctx.save();
        let indent = this._getIndent('maxmin');
        this._ctx.translate(indent, this._canvas.height - 25);
        this._ctx.font = "15px Arial";
        this._ctx.lineWidth = 1;

        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(-indent, 0);
        this._ctx.lineTo(-indent, -this._canvas.height + 25);
        this._ctx.lineTo(0, -this._canvas.height + 25);
        this._ctx.lineTo(0, 0);
        this._ctx.clip();

        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(0, -this._canvas.height);
        for (const scaleMark of this._scaleMarksY) {
            this._ctx.moveTo(-5, scaleMark.y);
            this._ctx.lineTo(0, scaleMark.y);
            this._ctx.fillText(scaleMark.value, scaleMark.x - scaleMark.x - this._getIndent(scaleMark.value) - 5, scaleMark.y + 5);
        }
        this._ctx.stroke();
        this._ctx.closePath();
        this._ctx.restore();
    }

    drawBackgroundX() {
        this._ctx.save();
        let indent = this._getIndent('maxmin');
        this._ctx.translate(indent, this._canvas.height - 25);
        this._ctx.font = "15px Arial";
        this._ctx.lineWidth = 1;

        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(0, 22);
        this._ctx.lineTo(this._canvas.width - indent, 22);
        this._ctx.lineTo(this._canvas.width - indent, 0);
        this._ctx.lineTo(0, 0);
        this._ctx.clip();

        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(this._canvas.width, 0);
        for (const scaleMark of this._scaleMarksX) {
            this._ctx.moveTo(scaleMark.x, 5);
            this._ctx.lineTo(scaleMark.x, 0);
            this._ctx.fillText(scaleMark.value, scaleMark.x - Math.round(this._getIndent(scaleMark.value) / 2 - 2), scaleMark.y + 20);
        }
        this._ctx.stroke();
        this._ctx.closePath();
        this._ctx.restore();
    }

    _getIndent(value) {
        if (value == 'maxmin') {
            let strMaxVal = String(MAX_VAL);
            let strMinVal = String(MIN_VAL);
            let indent = 10;
            if (strMaxVal.length || strMinVal.length < 6) {
                indent *= 6;
            } else {
                indent *= strMaxVal.length;
            }
            return indent;
        }
        else {
            return String(value).length * 10;
        }
    }

    isExitBorder() {
        let num = this._canvas.width + Math.abs(this._moveChartsCanvas.x) - this._getIndent('maxmin') - this._stepMark;
        if (this._valueChartsCanvas.getValueTime().valTime > num) {
            return false;
        }
        if (this._valueChartsCanvas.getValueTime().valTime + MAX_DATE > num) {
            return true;
        }
        return false;
    }
}

export { BackgroundChartsModel };