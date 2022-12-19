import { Drawer } from "./Drawer";
import "./style.scss";
import { Line as LineTool } from "./tools/Line";
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
  const lineTool = new LineTool(drawer);
  const penTool = new PenTool(drawer);

  lineBtn?.addEventListener("click", () => {
    console.log("asa1");
    penTool.disable();
    lineTool.activate();
  });

  penBtn?.addEventListener("click", () => {
    console.log("asa");
    lineTool.disable();
    penTool.activate();
  });
}

init();
