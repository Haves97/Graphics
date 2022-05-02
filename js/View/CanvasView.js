import { UsersEventHandle } from '../input/UsersEventHandle.js'

class CanvasView {
    constructor(backgroundChartsModel, sliderCanvasModel) {
        this._backgroundChartsModel = backgroundChartsModel;
        this._sliderCanvasModel = sliderCanvasModel;
        this._objValueModel = this._backgroundChartsModel.getValueModel();
        this._usersEventHandle = new UsersEventHandle({
            objValueModel: this._objValueModel,
            canvas: this._backgroundChartsModel.canvas,
        }, {
            move: this._sliderCanvasModel.move,
            canvas: this._sliderCanvasModel.canvas,
            lengthMarkSlider: this._sliderCanvasModel.lengthMarkSlider,
            valueCharts: this._sliderCanvasModel.valueCharts,
        }, {
            sender: this,
            callback: this.drawCharts,
        }
        );
    }

    drawChartsModel() {
        if (!this._backgroundChartsModel.isExitBorder()) {
            this._backgroundChartsModel.pushValueCharts();
            this._backgroundChartsModel.drawValueCharts();
        }
        this._usersEventHandle.moveKeyboardValueCharts("ArrowLeft", 1);
        this.drawCharts();
        setTimeout(this.drawChartsModel.bind(this), 250);
    }

    drawCharts() {
        this._backgroundChartsModel.ctx.clearRect(
            0, 0,
            this._backgroundChartsModel.canvas.width,
            this._backgroundChartsModel.canvas.height
        );
        this._sliderCanvasModel.ctx.clearRect(
            0, 0,
            this._sliderCanvasModel.canvas.width,
            this._sliderCanvasModel.canvas.height
        );
        this._backgroundChartsModel.drawBackgroundX();
        this._backgroundChartsModel.drawBackgroundY();
        this._backgroundChartsModel.drawCharts();
        this._sliderCanvasModel.drawBackground();
        this._sliderCanvasModel.drawSlider();
    }
}

export { CanvasView };