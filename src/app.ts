// Import React and ReactDOM
import React from "react";
import { createRoot } from "react-dom/client";

// zaui.css phai duoc import TRUOC tailwind.css: zmp-ui/Box luon gan class co san
// ".zaui-box { padding: 0; margin: 0; }" - neu file nay nap SAU, no se de len va vo hieu hoa
// cac class Tailwind cung do specificity nhu p-4/mt-3 (thang theo thu tu nap sau trong cascade),
// khien moi the (card) dung Box + className Tailwind bi mat padding/margin ma khong bao loi.
import "zmp-ui/zaui.css";
// Import tailwind styles
import "./css/tailwind.css";

import "./css/app.scss";

// Import App Component
import App from "./components/app";
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
    window.APP_CONFIG = appConfig;
}

window.isBack = false;

// Mount React App
const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(React.createElement(App));
