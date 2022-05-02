import { MouseHandler } from './MouseHandler.js'

class UsersEventHandle {
    //objChartsModel: objValueModel, canvas
    //callDraw: sender, callback
    constructor(objChartsModel, objSlider, callDraw) {
        this._objChartsModel = objChartsModel;
        this._objSlider = objSlider;
        this._callDraw = callDraw;

        this._directionMove = null;
        this._stepSlider = 0;
        this._stepCharts = 0;
        this.lengthGraphics = 0;
        this._k = 0;
        this._mouseHandler = new MouseHandler;
        this._mouseHandler.setEvent({ event: "mousedown", canvas: this._objChartsModel.canvas });
        this._mouseHandler.setEvent({ event: "mousemove", canvas: this._objChartsModel.canvas, sender: this, callback: this.moveMouseValueCharts });
        this._mouseHandler.setEvent({ event: "mouseup", canvas: this._objChartsModel.canvas });
        this._mouseHandler.setEvent({ event: "mouseout", canvas: this._objChartsModel.canvas });

        this._mouseHandler.setEvent({ event: "mousedown", canvas: this._objSlider.canvas });
        this._mouseHandler.setEvent({ event: "mousemove", canvas: this._objSlider.canvas, sender: this, callback: this.moveMouseSlider });
        this._mouseHandler.setEvent({ event: "mouseup", canvas: this._objSlider.canvas });
        this._mouseHandler.setEvent({ event: "mouseout", canvas: this._objSlider.canvas });


    }

    mouseValueCharts(move) {
        let x = move.prevX - move.currentX;
        let y = move.prevY - move.currentY;

        if (x != 0) {
            this._moveElements("scaleMarksX", x);
            this._objChartsModel.objValueModel.moveChartsCanvas.x -= x;
        }

        if (y != 0) {
            this._objChartsModel.objValueModel.moveChartsCanvas.y -= y;
            this._moveElements("scaleMarksY", y);
        }
    }

    moveMouseValueCharts(move) {
        this.mouseValueCharts(move);
        this._callDraw.callback.call(this._callDraw.sender);
    }

    mouseSliderValueCharts(move) {
        let x = move.prevX - move.currentX;
        if (x > 0) {
            this._moveElements("scaleMarksX", this._stepCharts * -1);
            this._objChartsModel.objValueModel.moveChartsCanvas.x += this._stepCharts;
        } else if (x < 0) {
            this._moveElements("scaleMarksX", this._stepCharts);
            this._objChartsModel.objValueModel.moveChartsCanvas.x -= this._stepCharts;
        }
    }

    moveSlider(axis, num) {
        if (axis == 'left') {
            if (this._objSlider.move.slider - num < 0) {
                this._objSlider.move.slider = 1;
            } else {
                this._objSlider.move.slider -= num;
            }
        } else if (axis == 'right') {
            let rightBorder = this._objSlider.canvas.width - this._objSlider.lengthMarkSlider;
            if (this._objSlider.move.slider - num > rightBorder) {
                this._objSlider.move.slider = rightBorder;
            } else {
                this._objSlider.move.slider += num;
            }
        }
    }

    isStopSlider(num) {
        let rightBorder = this._objSlider.canvas.width - this._objSlider.lengthMarkSlider;
        let step = Math.abs(this._objChartsModel.objValueModel.objValTime.valTime) - Math.abs(this.lengthGraphics);
        if ((this._objSlider.move.slider - num >= 0 && this._objSlider.move.slider - num <= rightBorder) &&
            step == 0 || step == 3 || step == 4 || step == 5) {
            return true;
        }
        return false;
    }

    isBorderSlider() {
        if (this._objSlider.move.slider == 0 ||
            this._objSlider.move.slider == this._objSlider.canvas.width - this._objSlider.lengthMarkSlider) {
            return true;
        }
        return false;
    }

    mouseSlider(move) {
        if (move.currentX >= this._objSlider.move.slider &&
            move.currentX <= this._objSlider.move.slider + this._objSlider.lengthMarkSlider) {
            let x = move.prevX - move.currentX;

            if (this._objSlider.move.slider - x > 0 &&
                this._objSlider.move.slider - x < this._objSlider.canvas.width - this._objSlider.lengthMarkSlider) {
                if (this._directionMove != move.direction || this.isStopSlider(this._stepSlider)) {

                    this.stepMoveSlider(move.direction);
                    this._directionMove = move.direction;
                }

                if (!this.isBorderSlider()) {
                    this._k = 0;
                }

                if (x > 0) {
                    this.moveSlider('left', this._stepSlider);
                } else if (x < 0) {
                    this.moveSlider('right', this._stepSlider);
                }
                return true;
            }
        }
        return false;
    }

    stepMoveSlider(direction) {
        this.lengthGraphics = this._objChartsModel.objValueModel.objValTime.valTime;
        if (Math.abs(this._objChartsModel.objValueModel.moveChartsCanvas.x) > this.lengthGraphics) {
            this.lengthGraphics = Math.abs(this._objChartsModel.objValueModel.moveChartsCanvas.x);
        }

        if (direction == 'right' && this.lengthGraphics > 1000) {
            this.lengthGraphics += 300;
        }
        let widthCanvasSlider = this._objSlider.canvas.width;
        if (direction == 'right') {
            this.lengthGraphics += this._k;
        } else if (direction == 'left') {
            widthCanvasSlider += this._k;
        }
        this._stepCharts = this.lengthGraphics / widthCanvasSlider;
        this._stepSlider = 1;

        this._stepCharts *= 5;
        this._stepSlider *= 5;
    }

    moveMouseSlider(move) {
        if (this.mouseSlider(move)) {
            this.mouseSliderValueCharts(move);
            this._callDraw.callback.call(this._callDraw.sender);
        }
    }

    _moveElements(axis, num) {
        switch (axis) {
            case "scaleMarksX":
                for (const el of this._objChartsModel.objValueModel.scaleMarksX) {
                    el.x -= num;
                }
                break;
            case "scaleMarksY":
                for (const el of this._objChartsModel.objValueModel.scaleMarksY) {
                    el.y -= num;
                }
                break;
        }
    }

    moveKeyboardValueCharts(key, num = 1) {
        switch (key) {
            case "ArrowLeft":
                this._moveElements("scaleMarksX", num);
                this._objChartsModel.objValueModel.moveChartsCanvas.x -= num;
                this._k += num;
                break;
            case "ArrowRight":
                this._moveElements("scaleMarksX", num);
                this._objChartsModel.objValueModel.moveChartsCanvas.x += num;
                break;
            case "ArrowUp":
                this._objChartsModel.objValueModel.moveChartsCanvas.y -= num;
                this._moveElements("scaleMarksY", num);
                break;
            case "ArrowDown":
                this._objChartsModel.objValueModel.moveChartsCanvas.y += num;
                this._moveElements("scaleMarksY", num);
                break;
        }
        this._callDraw.callback.call(this._callDraw.sender);
    }
}


export { UsersEventHandle };