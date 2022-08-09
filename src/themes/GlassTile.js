import { templateFrom } from "../../node_modules/elix/src/core/htmlLiterals.js";
import { render, template } from "../../node_modules/elix/src/core/internal.js";
import ReactiveElement from "../../node_modules/elix/src/core/ReactiveElement.js";

export default class GlassTile extends ReactiveElement {
  [render](changed) {
    console.log("render");
    super[render](changed);
  }

  get [template]() {
    console.log("template");
    return templateFrom.html`
      <div>Hello</div>
    `;
  }
}

customElements.define("montage-glass-tile", GlassTile);
console.log("component defined");
