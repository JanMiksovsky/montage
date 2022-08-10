import { fragmentFrom } from "../../elix/src/core/htmlLiterals.js";
import { template } from "../../elix/src/core/internal.js";
import Label from "../Label.js";

export default class GlassLabel extends Label {
  get [template]() {
    const result = super[template];

    // Wrap default slot with some divs we can style.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <div class="GlassTile_edge">
          <div class="GlassTile_inner">
            <div class="GlassTile_edgeGlow GlassTile_upperGlow"></div>
            <div class="GlassTile_container">
              <div class="GlassTile_content">
                <slot></slot>
              </div>
            </div>
            <div class="GlassTile_edgeGlow GlassTile_lowerGlow"></div>
          </div>
        </div>
        <div class="GlassTile_reflection"></div>
      `);
    }

    result.content.append(fragmentFrom.html`
      <style>
        :host {
          border: 1px solid rgba(64, 64, 64, 0.25);
          box-shadow: 0 8px 16px 0px rgba(0, 0, 0, 0.5);
          display: inline-block;
          position: relative;
        }

        .GlassTile_edge {
          /* border is for older browsers that don't grok border-image gradients. */
          border: 1px solid rgba(255, 255, 255, .2);
          border-image-source: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1));
          border-image-width: 1px;
          border-image-repeat: stretch;
          border-image-slice: 1;
          /* box-shadow: inset 0 0 16px black; */
          box-shadow: inset 0 0 16px rgb(0, 0, 0, 0.75);
        }

        .GlassTile_inner {
          border: 1px solid rgba(32, 32, 32, .25);
        }

        .GlassTile_edgeGlow {
          background: transparent;
          height: 10px;
          position: absolute;
          width: 100%;
        }

        .GlassTile_upperGlow {
          box-shadow: 0 10px 20px 0 rgba(255, 255, 255, .2);
          top: -10px;
        }

        .GlassTile_lowerGlow {
          bottom: -10px;
          box-shadow: 0 -10px 20px 0 rgba(255, 255, 255, .2);
        }

        .GlassTile_container {
          background: radial-gradient(farthest-corner circle at 50% 50%, rgba(255, 255, 255, .1), rgba(255, 255, 255, 0));
          padding: 0.75em 1em;
        }

        .GlassTile_content {
          color: white;
          margin: 0 auto;
          text-align: center;
          text-shadow: 0px 2px 4px black;
        }

        .GlassTile_reflection {
          background: linear-gradient( 66deg, transparent, transparent 70%, rgba(255,255,255,.1) 70%, transparent );
          height: 100%;
          position: absolute;
          top: 0;
          width: 100%;
        }
      </style>
    `);

    return result;
  }
}
