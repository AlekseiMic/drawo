import { Manager } from "./Manager";
import "./style.scss";
import { LineTool } from "./tools/LineTool";
import { MoveTool } from "./tools/MoveTool";
import { PenTool } from "./tools/PenTool";

function init() {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;
  const manager = new Manager("user123", app);
  initToolbar(manager);
  manager.start();
}

function initToolbar(manager: Manager) {
  const lineBtn = document.querySelector<HTMLButtonElement>("#line_tool");
  const penBtn = document.querySelector<HTMLButtonElement>("#pen_tool");
  const moveBtn = document.querySelector<HTMLButtonElement>("#move_tool");
  manager.toolPanel.addTool("line", LineTool);
  manager.toolPanel.addTool("move", MoveTool);
  manager.toolPanel.addTool("pen", PenTool);

  lineBtn?.addEventListener("mousedown", (e) => {
    manager.toolPanel.setActive("line");
    e.stopPropagation();
    e.stopImmediatePropagation();
  });

  penBtn?.addEventListener("mousedown", (e) => {
    manager.toolPanel.setActive("pen");
    e.stopPropagation();
    e.stopImmediatePropagation();
  });

  moveBtn?.addEventListener("mousedown", (e) => {
    manager.toolPanel.setActive("move");
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
}

init();
