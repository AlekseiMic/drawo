import { Canvas } from "./Canvas";
import { Drawer } from "./Drawer";
import { Layer } from "./Layer";
import "./style.scss";
import { Line } from "./tools/Line";
import { PenTool } from "./tools/PenTool";

function init() {
  const canvasEl = document.querySelector<HTMLCanvasElement>("#canvas");
  if (!canvasEl) return;
  const canvas = new Canvas(canvasEl);
  canvas.init();
  const drawer = new Drawer(canvas);
  const layer = new Layer();
  layer.drawer = drawer;
  const tool = new PenTool(layer);
  tool.activate();
}

init();
