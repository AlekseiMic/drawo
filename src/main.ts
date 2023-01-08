import { Manager } from "./Manager";
import ObserverReducer from "./ObserverReducer";
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
  manager.toolPanel.addTool(LineTool);
  manager.toolPanel.addTool(MoveTool);
  manager.toolPanel.addTool(PenTool);
  manager.addReducer(ObserverReducer);
  manager.addReducer(manager.toolPanel.gerReducer());

  lineBtn?.addEventListener("mousedown", (e) => {
    manager.toolPanel.setActive(LineTool.name);
    e.stopPropagation();
    e.stopImmediatePropagation();
  });

  penBtn?.addEventListener("mousedown", (e) => {
    manager.toolPanel.setActive(PenTool.name);
    e.stopPropagation();
    e.stopImmediatePropagation();
  });

  moveBtn?.addEventListener("mousedown", (e) => {
    manager.toolPanel.setActive(MoveTool.name);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
}

init();
