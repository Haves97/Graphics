import { ValueChartsCanvas } from './Model/ValueChartsCanvas.js'
import { SliderCanvasModel } from './Model/SliderCanvasModel.js'
import { BackgroundChartsModel } from './Model/BackgroundChartsModel.js'
import { CanvasView } from './View/CanvasView.js'


const mainCanvas = document.getElementById("mainCanvas");
const sideCanvas = document.getElementById("sideCanvas");
const valueChartsCanvas = new ValueChartsCanvas(mainCanvas.width);
const sliderCanvasModel = new SliderCanvasModel(sideCanvas, valueChartsCanvas.valueCharts);
const backgroundChartsModel = new BackgroundChartsModel(mainCanvas, valueChartsCanvas);
const canvasView = new CanvasView(backgroundChartsModel, sliderCanvasModel);
canvasView.drawChartsModel();
