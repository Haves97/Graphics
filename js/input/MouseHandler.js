

class MouseHandler {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._isMove = false;
        this._direction;
    }
    /*
    params включает: event, sender, canvas,callback
    event и canvas включают все params
    sender и callback только event: mousemove
    */
    setEvent(params) {
        switch (params.event) {
            case "mousedown":
                params.canvas.addEventListener('mousedown', evt => {
                    const rect = params.canvas.getBoundingClientRect();
                    this._x = evt.clientX - rect.left;
                    this._y = evt.clientY - rect.top;
                    this._isMove = true;
                });
                break;
            case "mousemove":
                params.canvas.addEventListener('mousemove', evt => {
                    if (this._isMove) {
                        const rect = params.canvas.getBoundingClientRect();
                        let currentX = evt.clientX - rect.left;
                        let currentY = evt.clientY - rect.top;

                        if (currentX < this._x) {
                            this._direction = 'left';
                        } else if (currentX > this._x) {
                            this._direction = 'right';
                        }
                        params.callback.call(params.sender, {
                            prevX: this._x,
                            prevY: this._y,
                            currentX: currentX,
                            currentY: currentY,
                            direction: this._direction,
                        });
                        this._x = currentX;
                        this._y = currentY;
                    }
                });
                break;
            case "mouseup":
                params.canvas.addEventListener('mouseup', evt => {
                    if (this._isMove) {
                        this._x = 0;
                        this._y = 0;
                        this._isMove = false;
                    }
                });
            case "mouseout":
                params.canvas.addEventListener('mouseout', evt => {
                    if (this._isMove) {
                        this._x = 0;
                        this._y = 0;
                        this._isMove = false;
                    }
                });
        }
    }
}


export { MouseHandler };