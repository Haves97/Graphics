import { MIN_VAL, MAX_VAL, MIN_DATE, MAX_DATE } from '../constans.js'

class ValueChartsCanvas {
    constructor(widthMainCanvas, stepMark) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = widthMainCanvas * 4;
        this._canvas.height = (Math.abs(MAX_VAL) + 1) + (Math.abs(MIN_VAL) + 1);
        this._ctx = this._canvas.getContext("2d");
        let y = Number.isInteger(this._canvas.height / 2) ? this._canvas.height / 2 : Math.round(this._canvas.height / 2);
        this._coordTranslate = { x: 1, y: y };
        this._reCoordTranslate = { x: 1, y: y };
        this.resizeWidth = false;
        this._stepMark = stepMark;
        this.valueCharts = [];
        this._objTime = { valTime: 0 };
    }

    drawCharts() {
        this._ctx.save();
        this._ctx.translate(this._coordTranslate.x, this._coordTranslate.y);
        this._ctx.beginPath();

        if (this.valueCharts.length == 1) {
            this._ctx.moveTo(0, 0);
            this._ctx.lineTo(this.valueCharts[0].time, this.valueCharts[0].value);
        } else {
            this._ctx.moveTo(this.valueCharts[this.valueCharts.length - 2].time,
                this.valueCharts[this.valueCharts.length - 2].value);
            this._ctx.lineTo(this.valueCharts[this.valueCharts.length - 1].time,
                this.valueCharts[this.valueCharts.length - 1].value);
        }

        this._ctx.stroke();
        this._ctx.closePath();
        this._ctx.restore();
        if (this.valueCharts[this.valueCharts.length - 1].time + this._canvas.width / 4 >= this._canvas.width) {
            this._canvas.width *= 2;
            this.resizeWidth = true;
            this._reDrawCharts();
        }

    }

    _reDrawCharts() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.save();
        this._ctx.translate(this._reCoordTranslate.x, this._reCoordTranslate.y);
        this._ctx.beginPath();
        for (let valueChart of this.valueCharts) {
            this._ctx.lineTo(valueChart.time, valueChart.value);
        }
        this._ctx.stroke();
        this._ctx.closePath();
        this._ctx.restore();
    }

    get canvas() {
        return this._canvas;
    }

    getCoordTranslate() {
        return this._coordTranslate;
    }

    pushValueCharts() {
        this.valueCharts.push(this._getBinaryData());
    }

    _getBinaryData() {
        let binData = {};
        binData.value = this._getRandomFloat(MIN_VAL, MAX_VAL);
        this._objTime.valTime += this._getRandomInt(MIN_DATE, MAX_DATE);
        binData.time = this._objTime.valTime;
        return binData;
    }

    _getRandomFloat(min, max) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(1));
    }

    _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getValueTime() {
        return this._objTime;
    }

}


export { ValueChartsCanvas };