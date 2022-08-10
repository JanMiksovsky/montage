import { templateFrom } from "../../elix/src/core/htmlLiterals.js";
import { template } from "../../elix/src/core/internal.js";
import ReactiveElement from "../../elix/src/core/ReactiveElement.js";

export default class Label extends ReactiveElement {
  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
      </style>
      <slot></slot>
    `;
  }
}
