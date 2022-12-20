import { Drawer } from "./Drawer";
import "./style.scss";
import { LineTool } from "./tools/LineTool";
import { MoveTool } from "./tools/MoveTool";
import { PenTool } from "./tools/PenTool";

function init() {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;
  const drawer = new Drawer(app);
  drawer.createLayer();
  initToolbar(drawer);
}

function initToolbar(drawer: Drawer) {
  const lineBtn = document.querySelector<HTMLButtonElement>("#line_tool");
  const penBtn = document.querySelector<HTMLButtonElement>("#pen_tool");
  const moveBtn = document.querySelector<HTMLButtonElement>("#move_tool");
  const lineTool = new LineTool(drawer);
  const moveTool = new MoveTool(drawer);
  const penTool = new PenTool(drawer);

  lineBtn?.addEventListener("click", () => {
    penTool.disable();
    moveTool.disable();
    lineTool.activate();
  });

  penBtn?.addEventListener("click", () => {
    lineTool.disable();
    moveTool.disable();
    penTool.activate();
  });

  moveBtn?.addEventListener("click", () => {
    lineTool.disable();
    moveTool.activate();
    penTool.disable();
  });
}

init();
