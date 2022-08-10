import { templateFrom } from "../elix/src/core/htmlLiterals.js";
import {
  defaultState,
  render,
  setState,
  state,
  template,
} from "../elix/src/core/internal.js";
import ReactiveElement from "../elix/src/core/ReactiveElement.js";

export default class Image extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      src: "",
    });
  }

  [render](changed) {
    super[render](changed);
    if (changed.src) {
      const { src } = this[state];
      const escaped = src.replaceAll("'", "%27");
      const backgroundImage = `url('${escaped}')`;
      this.style.backgroundImage = backgroundImage;
    }
  }

  // Provide a public property that gets/sets state.
  get src() {
    return this[state].src;
  }
  set src(src) {
    this[setState]({ src });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          background-size: cover;
        }
      </style>
    `;
  }
}
