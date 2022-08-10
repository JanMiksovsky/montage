import { templateFrom } from "../elix/src/core/htmlLiterals.js";
import { template } from "../elix/src/core/internal.js";
import ReactiveElement from "../elix/src/core/ReactiveElement.js";

export default class Slide extends ReactiveElement {
  get [template]() {
    return templateFrom.html`
      <slot></slot>
    `;
  }
}
