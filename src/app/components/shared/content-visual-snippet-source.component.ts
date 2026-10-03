/**
 * ContentVisualSnippetSourceComponent — DEV-ONLY source-of-truth for the snippet
 * @case visuals the committed static WebP were made from. The kit no longer ships the
 * baker that screenshotted them (scripts/build-thumbnails.js and /dev/bake are gone), so
 * this markup is reference only and is swapped for a stub in prod; the runtime
 * <app-content-visual-snippet> shows only the baked WebP.
 *
 * Authoring: a new snippet needs its light + dark WebP committed under
 * src/assets/images/thumbnails/ and its type listed in BAKED_SNIPPET
 * (baked-thumbnails.manifest.ts); until then <app-thumbnail> shows its fallback tile.
 *
 * Types (15): demos, glossary, home, impressum, learningPaths, lessons, news, roadmap,
 * sources, timeline, tools, qs-evolution-genetic, qs-glossary-term, qs-prompting-race,
 * qs-timeline-event
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content-visual-snippet-source',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vs-container" [class]="'vs-size-' + size" [attr.aria-hidden]="true">
      @switch (type) {
        @case ('learningPaths') {
          <div style="width:140px;height:124px;display:flex;gap:4px;padding:4px">
            <div style="width:8px;background:var(--surface-200);border-radius:4px;overflow:hidden;position:relative">
              <div
                style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(0deg,var(--primary-400),var(--primary-300));border-radius:4px"
              ></div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;gap:3px">
              <div
                style="flex:1;background:var(--primary-100);border-radius:3px;padding:3px 5px;box-shadow:1px 1px 2px rgba(0,0,0,.1);display:flex;align-items:center;gap:4px"
              >
                <div style="font-size:7px;font-weight:900;color:var(--primary-500);width:14px">01</div>
                <div style="flex:1">
                  <div style="height:3px;width:80%;background:var(--primary-300);border-radius:1px"></div>
                </div>
                <div
                  style="width:8px;height:8px;border-radius:50%;background:var(--primary-400);display:flex;align-items:center;justify-content:center"
                >
                  <div
                    style="width:4px;height:3px;border-left:1px solid white;border-bottom:1px solid white;transform:rotate(-45deg);margin-top:-1px"
                  ></div>
                </div>
              </div>
              <div
                style="flex:1;background:var(--green-100,#dcfce7);border-radius:3px;padding:3px 5px;box-shadow:1px 1px 2px rgba(0,0,0,.1);display:flex;align-items:center;gap:4px"
              >
                <div style="font-size:7px;font-weight:900;color:var(--green-600,#16a34a);width:14px">02</div>
                <div style="flex:1">
                  <div style="height:3px;width:70%;background:var(--green-300,#86efac);border-radius:1px"></div>
                </div>
                <div
                  style="width:8px;height:8px;border-radius:50%;background:var(--green-400,#4ade80);display:flex;align-items:center;justify-content:center"
                >
                  <div
                    style="width:4px;height:3px;border-left:1px solid white;border-bottom:1px solid white;transform:rotate(-45deg);margin-top:-1px"
                  ></div>
                </div>
              </div>
              <div
                style="flex:1;background:var(--blue-100,#dbeafe);border-radius:3px;padding:3px 5px;box-shadow:1px 1px 2px rgba(0,0,0,.1);display:flex;align-items:center;gap:4px"
              >
                <div style="font-size:7px;font-weight:900;color:var(--blue-600,#2563eb);width:14px">03</div>
                <div style="flex:1">
                  <div style="height:3px;width:60%;background:var(--blue-300,#93c5fd);border-radius:1px"></div>
                </div>
                <div style="width:8px;height:8px;border-radius:50%;border:1.5px solid var(--blue-400,#60a5fa)"></div>
              </div>
              <div
                style="flex:1;background:var(--orange-100,#ffedd5);border-radius:3px;padding:3px 5px;box-shadow:1px 1px 2px rgba(0,0,0,.1);display:flex;align-items:center;gap:4px"
              >
                <div style="font-size:7px;font-weight:900;color:var(--orange-600,#ea580c);width:14px">04</div>
                <div style="flex:1">
                  <div style="height:3px;width:55%;background:var(--orange-300,#fdba74);border-radius:1px"></div>
                </div>
                <div style="width:8px;height:8px;border-radius:50%;border:1.5px solid var(--orange-400,#fb923c)"></div>
              </div>
              <div
                style="flex:1;background:var(--purple-100,#f3e8ff);border-radius:3px;padding:3px 5px;box-shadow:1px 1px 2px rgba(0,0,0,.1);display:flex;align-items:center;gap:4px"
              >
                <div style="font-size:7px;font-weight:900;color:var(--purple-600,#9333ea);width:14px">05</div>
                <div style="flex:1">
                  <div style="height:3px;width:40%;background:var(--purple-300,#d8b4fe);border-radius:1px"></div>
                </div>
                <div style="width:8px;height:8px;border-radius:50%;border:1.5px solid var(--purple-400,#c084fc)"></div>
              </div>
            </div>
          </div>
        }
        @case ('demos') {
          <div
            style="width:120px;height:110px;background:var(--vs-demos-bg,#f1f5f9);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:4px"
          >
            <div style="display:flex;gap:3px">
              <span style="width:7px;height:7px;border-radius:50%;background:#ef4444;display:block"></span
              ><span style="width:7px;height:7px;border-radius:50%;background:#eab308;display:block"></span
              ><span style="width:7px;height:7px;border-radius:50%;background:#22c55e;display:block"></span>
            </div>
            <div
              style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:3px"
            >
              <div
                style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px;display:flex;align-items:center;justify-content:center"
              >
                <div style="width:10px;height:10px;border-radius:50%;background:var(--primary-400)"></div>
              </div>
              <div style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px"></div>
              <div
                style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px;display:flex;align-items:center;justify-content:center"
              >
                <div style="width:10px;height:10px;border-radius:50%;background:#4ade80"></div>
              </div>
              <div style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px"></div>
              <div style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px"></div>
              <div
                style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px;display:flex;align-items:center;justify-content:center"
              >
                <div style="width:10px;height:10px;border-radius:50%;background:var(--primary-400)"></div>
              </div>
              <div style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px"></div>
              <div
                style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px;display:flex;align-items:center;justify-content:center"
              >
                <div style="width:10px;height:10px;border-radius:50%;background:#fb923c"></div>
              </div>
              <div
                style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px;display:flex;align-items:center;justify-content:center"
              >
                <div style="width:10px;height:10px;border-radius:50%;background:#4ade80"></div>
              </div>
              <div style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px"></div>
              <div
                style="background:rgba(var(--primary-color-rgb),.15);border:1px dashed var(--primary-400);border-radius:3px"
              ></div>
              <div style="background:var(--vs-demos-cell,#cbd5e1);border-radius:3px"></div>
            </div>
          </div>
        }
        @case ('lessons') {
          <div style="width:140px;height:120px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px">
            <div
              style="background:var(--yellow-200,#fef08a);border-radius:3px;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,.12)"
            >
              <div style="height:3px;width:80%;background:var(--yellow-500,#eab308);border-radius:1px"></div>
              <div
                style="height:2px;background:var(--yellow-400,#facc15);border-radius:1px;margin-top:2px;opacity:.7"
              ></div>
            </div>
            <div
              style="background:var(--blue-200,#bfdbfe);border-radius:3px;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,.12)"
            >
              <div style="height:3px;width:70%;background:var(--blue-500,#3b82f6);border-radius:1px"></div>
              <div
                style="height:2px;background:var(--blue-400,#60a5fa);border-radius:1px;margin-top:2px;opacity:.7"
              ></div>
            </div>
            <div
              style="background:var(--green-200,#bbf7d0);border-radius:3px;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,.12)"
            >
              <div style="height:3px;width:60%;background:var(--green-500,#22c55e);border-radius:1px"></div>
              <div
                style="height:2px;background:var(--green-400,#4ade80);border-radius:1px;margin-top:2px;opacity:.7"
              ></div>
            </div>
            <div
              style="background:var(--orange-200,#fed7aa);border-radius:3px;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,.12)"
            >
              <div style="height:3px;width:75%;background:var(--orange-500,#f97316);border-radius:1px"></div>
              <div
                style="height:2px;background:var(--orange-400,#fb923c);border-radius:1px;margin-top:2px;opacity:.7"
              ></div>
            </div>
            <div
              style="background:var(--purple-200,#e9d5ff);border-radius:3px;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,.12)"
            >
              <div style="height:3px;width:65%;background:var(--purple-500,#a855f7);border-radius:1px"></div>
              <div
                style="height:2px;background:var(--purple-400,#c084fc);border-radius:1px;margin-top:2px;opacity:.7"
              ></div>
            </div>
            <div
              style="background:var(--surface-100);border-radius:3px;border:1px dashed var(--surface-400);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--surface-500)"
            >
              +
            </div>
          </div>
        }
        @case ('tools') {
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:138px;height:118px">
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div
                style="width:100%;aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,var(--teal-200,#99f6e4),var(--teal-400,#2dd4bf));border:1px solid var(--surface-border)"
              ></div>
              <div style="display:flex;gap:1px">
                <i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i
                ><i class="vs-star"></i>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div
                style="width:100%;aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,var(--green-200,#bbf7d0),var(--green-400,#4ade80));border:1px solid var(--surface-border)"
              ></div>
              <div style="display:flex;gap:1px">
                <i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i
                ><i class="vs-star vs-sf"></i>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div
                style="width:100%;aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,var(--blue-200,#bfdbfe),var(--blue-400,#60a5fa));border:1px solid var(--surface-border)"
              ></div>
              <div style="display:flex;gap:1px">
                <i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i><i class="vs-star"></i><i class="vs-star"></i>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div
                style="width:100%;aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,var(--orange-200,#fed7aa),var(--orange-400,#fb923c));border:1px solid var(--surface-border)"
              ></div>
              <div style="display:flex;gap:1px">
                <i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i
                ><i class="vs-star"></i>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div
                style="width:100%;aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,var(--purple-200,#e9d5ff),var(--purple-400,#c084fc));border:1px solid var(--surface-border)"
              ></div>
              <div style="display:flex;gap:1px">
                <i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i
                ><i class="vs-star vs-sf"></i>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div
                style="width:100%;aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,var(--red-200,#fecaca),var(--red-400,#f87171));border:1px solid var(--surface-border)"
              ></div>
              <div style="display:flex;gap:1px">
                <i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i><i class="vs-star vs-sf"></i
                ><i class="vs-star"></i>
              </div>
            </div>
          </div>
        }
        @case ('timeline') {
          <div style="width:148px;height:132px;padding:6px 8px 6px 6px;position:relative">
            <div
              style="position:absolute;left:14px;top:4px;bottom:4px;width:3px;background:var(--surface-300);border-radius:2px"
            ></div>
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;position:relative;z-index:2">
              <div
                style="width:22px;height:22px;border-radius:50%;background:var(--blue-400,#60a5fa);flex-shrink:0;border:3px solid var(--surface-card);box-shadow:0 0 0 2px var(--blue-300,#93c5fd)"
              ></div>
              <div>
                <div style="font-size:8px;font-weight:800;color:var(--blue-500,#3b82f6)">1956</div>
                <div
                  style="height:3px;width:60px;background:var(--blue-200,#bfdbfe);border-radius:2px;margin-top:2px"
                ></div>
                <div style="height:2px;width:42px;background:var(--surface-200);border-radius:2px;margin-top:2px"></div>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;position:relative;z-index:2">
              <div
                style="width:22px;height:22px;border-radius:50%;background:var(--green-400,#4ade80);flex-shrink:0;border:3px solid var(--surface-card);box-shadow:0 0 0 2px var(--green-300,#86efac)"
              ></div>
              <div>
                <div style="font-size:8px;font-weight:800;color:var(--green-500,#22c55e)">1997</div>
                <div
                  style="height:3px;width:54px;background:var(--green-200,#bbf7d0);border-radius:2px;margin-top:2px"
                ></div>
                <div style="height:2px;width:38px;background:var(--surface-200);border-radius:2px;margin-top:2px"></div>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;position:relative;z-index:2">
              <div
                style="width:22px;height:22px;border-radius:50%;background:var(--orange-400,#fb923c);flex-shrink:0;border:3px solid var(--surface-card);box-shadow:0 0 0 2px var(--orange-300,#fdba74)"
              ></div>
              <div>
                <div style="font-size:8px;font-weight:800;color:var(--orange-500,#f97316)">2017</div>
                <div
                  style="height:3px;width:48px;background:var(--orange-200,#fed7aa);border-radius:2px;margin-top:2px"
                ></div>
                <div style="height:2px;width:36px;background:var(--surface-200);border-radius:2px;margin-top:2px"></div>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:8px;position:relative;z-index:2">
              <div
                style="width:22px;height:22px;border-radius:50%;background:var(--red-400,#f87171);flex-shrink:0;border:3px solid var(--surface-card);box-shadow:0 0 0 2px var(--red-300,#fca5a5)"
              ></div>
              <div>
                <div style="font-size:8px;font-weight:800;color:var(--red-500,#ef4444)">2024</div>
                <div
                  style="height:3px;width:56px;background:var(--red-200,#fecaca);border-radius:2px;margin-top:2px"
                ></div>
                <div style="height:2px;width:40px;background:var(--surface-200);border-radius:2px;margin-top:2px"></div>
              </div>
            </div>
          </div>
        }
        @case ('glossary') {
          <div style="width:140px;height:120px;display:flex;gap:4px">
            <div style="width:18px;display:flex;flex-direction:column;gap:2px;padding:4px 0">
              <div
                style="width:18px;height:16px;background:var(--purple-400,#c084fc);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:white"
              >
                A
              </div>
              <div
                style="width:18px;height:16px;background:var(--green-400,#4ade80);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:white"
              >
                B
              </div>
              <div
                style="width:18px;height:16px;background:var(--blue-400,#60a5fa);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:white"
              >
                C
              </div>
              <div
                style="width:18px;height:16px;background:var(--orange-400,#fb923c);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:white"
              >
                D
              </div>
            </div>
            <div
              style="flex:1;border:1.5px solid var(--surface-border);border-radius:6px;padding:5px;display:flex;flex-direction:column;gap:4px"
            >
              <div>
                <div style="height:3px;width:50%;background:var(--purple-400,#c084fc);border-radius:2px"></div>
                <div style="height:2px;background:var(--purple-200,#e9d5ff);border-radius:2px;margin-top:2px"></div>
                <div
                  style="height:2px;width:70%;background:var(--purple-100,#f3e8ff);border-radius:2px;margin-top:1px"
                ></div>
              </div>
              <div style="height:1px;background:var(--surface-border)"></div>
              <div>
                <div style="height:3px;width:60%;background:var(--green-400,#4ade80);border-radius:2px"></div>
                <div style="height:2px;background:var(--green-200,#bbf7d0);border-radius:2px;margin-top:2px"></div>
              </div>
              <div style="height:1px;background:var(--surface-border)"></div>
              <div>
                <div style="height:3px;width:40%;background:var(--blue-400,#60a5fa);border-radius:2px"></div>
                <div
                  style="height:2px;width:80%;background:var(--blue-200,#bfdbfe);border-radius:2px;margin-top:2px"
                ></div>
              </div>
              <div style="height:1px;background:var(--surface-border)"></div>
              <div>
                <div style="height:3px;width:55%;background:var(--orange-400,#fb923c);border-radius:2px"></div>
                <div
                  style="height:2px;width:65%;background:var(--orange-200,#fed7aa);border-radius:2px;margin-top:2px"
                ></div>
              </div>
            </div>
          </div>
        }
        @case ('sources') {
          <div
            style="width:100%;height:100%;box-sizing:border-box;background:linear-gradient(160deg,var(--surface-0) 0%,var(--surface-100) 100%);display:flex;flex-direction:column;gap:5px;padding:6px;position:relative;overflow:hidden"
          >
            <svg width="0" height="0" style="position:absolute">
              <defs>
                <filter id="snip__sources-v1-snip-sv1-drop">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(96,165,250,.25)" />
                </filter>
                <linearGradient id="snip__sources-v1-snip-sv1-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="var(--primary-500)" />
                  <stop offset="100%" stop-color="var(--primary-300)" />
                </linearGradient>
              </defs>
            </svg>
            <div
              style="position:absolute;top:-10px;right:-10px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.12) 0%,transparent 70%);pointer-events:none"
            ></div>
            <div
              style="padding:7px;background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:8px;box-shadow:0 4px 12px rgba(59,130,246,.14),0 1px 3px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.9);filter:url(#snip__sources-v1-snip-sv1-drop)"
            >
              <div
                style="height:4px;width:60%;background:url(#snip__sources-v1-snip-sv1-grad);background:linear-gradient(90deg,var(--primary-500),var(--primary-300));border-radius:2px;box-shadow:0 1px 4px rgba(96,165,250,.35)"
              ></div>
              <div style="height:3px;background:var(--surface-200);border-radius:2px;margin-top:3px"></div>
              <div style="display:flex;align-items:center;gap:3px;margin-top:3px">
                <div
                  style="width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,var(--blue-100),var(--blue-200));display:flex;align-items:center;justify-content:center;box-shadow:0 0 4px rgba(59,130,246,.25)"
                >
                  <div style="width:4px;height:4px;border:1.5px solid var(--blue-500);border-radius:50%"></div>
                </div>
                <div
                  style="height:2px;width:50%;background:linear-gradient(90deg,var(--blue-400),var(--blue-200));border-radius:1px"
                ></div>
              </div>
            </div>
            <div
              style="padding:7px;background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:8px;box-shadow:0 4px 12px rgba(59,130,246,.1),0 1px 3px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.9)"
            >
              <div
                style="height:4px;width:50%;background:linear-gradient(90deg,var(--primary-400),var(--primary-200));border-radius:2px;box-shadow:0 1px 3px rgba(96,165,250,.25)"
              ></div>
              <div style="height:3px;width:80%;background:var(--surface-200);border-radius:2px;margin-top:3px"></div>
              <div style="display:flex;align-items:center;gap:3px;margin-top:3px">
                <div
                  style="width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,var(--blue-100),var(--blue-200));display:flex;align-items:center;justify-content:center;box-shadow:0 0 4px rgba(59,130,246,.2)"
                >
                  <div style="width:4px;height:4px;border:1.5px solid var(--blue-500);border-radius:50%"></div>
                </div>
                <div
                  style="height:2px;width:40%;background:linear-gradient(90deg,var(--blue-400),var(--blue-200));border-radius:1px"
                ></div>
              </div>
            </div>
            <div
              style="padding:7px;background:var(--surface-0);border:1.5px solid var(--surface-border);border-radius:8px;box-shadow:0 4px 12px rgba(59,130,246,.07),0 1px 3px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.9)"
            >
              <div
                style="height:4px;width:45%;background:linear-gradient(90deg,var(--primary-300),var(--primary-100));border-radius:2px"
              ></div>
              <div style="height:3px;width:65%;background:var(--surface-200);border-radius:2px;margin-top:3px"></div>
              <div style="display:flex;align-items:center;gap:3px;margin-top:3px">
                <div
                  style="width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,var(--blue-100),var(--blue-200));display:flex;align-items:center;justify-content:center"
                >
                  <div style="width:4px;height:4px;border:1.5px solid var(--blue-500);border-radius:50%"></div>
                </div>
                <div
                  style="height:2px;width:35%;background:linear-gradient(90deg,var(--blue-300),var(--blue-100));border-radius:1px"
                ></div>
              </div>
            </div>
          </div>
        }
        @case ('roadmap') {
          <div style="width:140px;height:120px;padding:6px">
            <svg width="128" height="108" viewBox="0 0 128 108">
              <!-- Launch trail -->
              <line
                x1="40"
                y1="100"
                x2="40"
                y2="8"
                stroke="var(--surface-300,#475569)"
                stroke-width="2"
                stroke-dasharray="3 3"
              />
              <!-- Phase 1: Released -->
              <rect x="50" y="88" width="60" height="10" rx="2" fill="var(--green-400,#4ade80)" opacity="0.7" />
              <text x="82" y="95" text-anchor="middle" fill="white" font-size="5" font-weight="600">3 Pfade</text>
              <!-- Phase 2: Biweekly -->
              <rect
                x="50"
                y="72"
                width="45"
                height="10"
                rx="2"
                fill="var(--teal-400,#2dd4bf)"
                opacity="0.5"
                stroke="var(--teal-400,#2dd4bf)"
                stroke-width="0.5"
              />
              <text x="74" y="79" text-anchor="middle" fill="var(--teal-400,#2dd4bf)" font-size="4.5">Mai–Jul</text>
              <!-- Phase 3: Weekly sprint -->
              <rect
                x="50"
                y="56"
                width="55"
                height="10"
                rx="2"
                fill="var(--blue-400,#60a5fa)"
                opacity="0.3"
                stroke="var(--blue-400,#60a5fa)"
                stroke-width="0.5"
                stroke-dasharray="2 1"
              />
              <text x="79" y="63" text-anchor="middle" fill="var(--blue-400,#60a5fa)" font-size="4.5">Aug–Sep</text>
              <!-- Goal -->
              <rect
                x="50"
                y="38"
                width="65"
                height="12"
                rx="3"
                fill="none"
                stroke="var(--surface-400,#64748b)"
                stroke-width="1"
                stroke-dasharray="2 1"
              />
              <text x="84" y="46" text-anchor="middle" fill="var(--surface-400,#64748b)" font-size="5">18 / 18</text>
              <!-- Rocket (SVG drawn) at current position -->
              <g transform="translate(40,72) rotate(-45)">
                <path
                  d="M0,-8 C2,-8 4,-5 4,0 L4,3 L2,5 L0,3 L-2,5 L-4,3 L-4,0 C-4,-5 -2,-8 0,-8Z"
                  fill="var(--teal-400,#2dd4bf)"
                />
                <ellipse cx="0" cy="-5" rx="1.5" ry="2" fill="var(--surface-card,#1e293b)" />
                <path d="M-4,1 L-6,4 L-4,3Z" fill="var(--green-400,#4ade80)" opacity="0.7" />
                <path d="M4,1 L6,4 L4,3Z" fill="var(--green-400,#4ade80)" opacity="0.7" />
                <path d="M-2,5 L0,8 L2,5" fill="var(--orange-400,#fb923c)" opacity="0.8" />
              </g>
              <!-- Labels -->
              <text x="40" y="106" text-anchor="middle" fill="var(--surface-400,#64748b)" font-size="4.5">Start</text>
              <text x="84" y="34" text-anchor="middle" fill="var(--surface-400,#64748b)" font-size="4.5">
                Ziel: Sep 2026
              </text>
            </svg>
          </div>
        }
        @case ('qs-evolution-genetic') {
          <div
            style="width:140px;height:120px;border-radius:8px;position:relative;overflow:hidden;box-shadow:inset 0 0 12px rgba(0,0,0,.4),0 2px 6px rgba(0,0,0,.15);background:#1a120c"
          >
            <img
              src="assets/images/evolution-demo-teaser.png"
              alt=""
              loading="lazy"
              style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 28%;display:block"
            />
            <div
              style="position:absolute;bottom:5px;left:6px;background:rgba(255,255,255,.92);color:#1f140c;font-size:7px;font-weight:800;padding:2px 6px;border-radius:8px;letter-spacing:.05em;font-family:monospace"
            >
              GEN 142
            </div>
            <div style="position:absolute;top:6px;right:6px;display:flex;gap:2px">
              <div style="width:5px;height:5px;border-radius:50%;background:#fbbf24"></div>
              <div style="width:5px;height:5px;border-radius:50%;background:#fbbf24;opacity:.6"></div>
              <div style="width:5px;height:5px;border-radius:50%;background:#fbbf24;opacity:.3"></div>
            </div>
          </div>
        }
        @case ('qs-glossary-term') {
          <div
            style="width:100%;height:100%;box-sizing:border-box;background:linear-gradient(150deg,var(--surface-0) 0%,var(--surface-50) 100%);border:1.5px solid var(--p-indigo-300);border-radius:11px;padding:9px 10px;display:flex;flex-direction:column;gap:5px;position:relative;overflow:hidden;box-shadow:0 0 0 3px rgba(99,102,241,.07),0 6px 20px rgba(99,102,241,.14),0 2px 6px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.95)"
          >
            <svg width="0" height="0" style="position:absolute">
              <defs>
                <filter id="snip__qs-glossary-term-v1-snip-gtv1-glow">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <div
              style="position:absolute;top:-12px;right:-12px;width:55px;height:55px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.14) 0%,transparent 70%)"
            ></div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
              <div style="font-size:12px;font-weight:800;color:var(--text-color);letter-spacing:-.02em">
                Transformer
              </div>
              <div
                style="font-size:6px;font-weight:700;color:white;background:linear-gradient(135deg,var(--p-indigo-500),var(--p-indigo-700));padding:2px 5px;border-radius:6px;text-transform:uppercase;letter-spacing:.06em;box-shadow:0 2px 6px rgba(99,102,241,.4)"
              >
                DL
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:2.5px">
              <div
                style="height:3px;width:96%;background:linear-gradient(90deg,var(--surface-300),var(--surface-200));border-radius:2px"
              ></div>
              <div style="height:3px;width:88%;background:var(--surface-200);border-radius:2px"></div>
              <div style="height:3px;width:72%;background:var(--surface-200);border-radius:2px"></div>
            </div>
            <div>
              <div
                style="font-size:5px;font-weight:800;color:var(--text-color-secondary);text-transform:uppercase;letter-spacing:.12em"
              >
                Example
              </div>
              <div
                style="height:3px;width:82%;background:linear-gradient(90deg,var(--p-indigo-400),var(--p-indigo-300));border-radius:2px;margin-top:2.5px;box-shadow:0 1px 4px rgba(99,102,241,.3)"
              ></div>
              <div style="height:3px;width:58%;background:var(--p-indigo-200);border-radius:2px;margin-top:2.5px"></div>
            </div>
            <div style="display:flex;gap:3px;margin-top:auto;flex-wrap:wrap">
              <div
                style="font-size:6px;background:linear-gradient(135deg,var(--p-indigo-50),var(--p-indigo-100));color:var(--p-indigo-700);padding:2px 5px;border-radius:5px;font-weight:700;border:1px solid var(--p-indigo-200);box-shadow:0 1px 3px rgba(99,102,241,.15),inset 0 1px 0 rgba(255,255,255,.9)"
              >
                Attention
              </div>
              <div
                style="font-size:6px;background:linear-gradient(135deg,var(--p-indigo-50),var(--p-indigo-100));color:var(--p-indigo-700);padding:2px 5px;border-radius:5px;font-weight:700;border:1px solid var(--p-indigo-200);box-shadow:0 1px 3px rgba(99,102,241,.15),inset 0 1px 0 rgba(255,255,255,.9)"
              >
                GPT
              </div>
              <div
                style="font-size:6px;background:linear-gradient(135deg,var(--p-indigo-50),var(--p-indigo-100));color:var(--p-indigo-700);padding:2px 5px;border-radius:5px;font-weight:700;border:1px solid var(--p-indigo-200);box-shadow:0 1px 3px rgba(99,102,241,.15),inset 0 1px 0 rgba(255,255,255,.9)"
              >
                BERT
              </div>
            </div>
          </div>
        }
        @case ('qs-timeline-event') {
          <div
            style="width:100%;height:100%;box-sizing:border-box;padding:8px 10px;display:flex;gap:10px;align-items:flex-start;position:relative;background:var(--surface-0);overflow:hidden"
          >
            <svg width="0" height="0" style="position:absolute">
              <defs>
                <filter id="snip__qs-timeline-event-v2-snip-tev2-bloom">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feComposite in="b" in2="SourceGraphic" operator="over" />
                </filter>
              </defs>
            </svg>
            <div
              style="position:absolute;left:6px;top:14px;width:100px;height:50px;background:radial-gradient(ellipse at 0% 50%,rgba(6,182,212,.1) 0%,transparent 70%);pointer-events:none"
            ></div>
            <div
              style="position:absolute;left:14px;top:10px;width:3px;background:linear-gradient(180deg,var(--p-cyan-500) 0%,var(--p-cyan-300) 40%,var(--surface-200) 72%,transparent);height:100px;border-radius:2px"
            ></div>
            <div
              style="position:absolute;left:6px;top:14px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,var(--p-cyan-300),var(--p-cyan-600));border:3px solid var(--surface-0);box-shadow:0 0 0 2.5px var(--p-cyan-200),0 0 16px rgba(6,182,212,.55),0 4px 10px rgba(0,0,0,.18)"
            ></div>
            <div
              style="margin-left:24px;flex:1;background:var(--surface-0);border:1px solid var(--p-cyan-200);border-radius:9px;padding:6px 9px;box-shadow:0 0 0 3px rgba(6,182,212,.07),0 6px 20px rgba(6,182,212,.18),0 2px 6px rgba(0,0,0,.09),inset 0 1px 0 rgba(255,255,255,.95)"
            >
              <div
                style="font-size:14px;font-weight:900;background:linear-gradient(135deg,var(--p-cyan-600),var(--p-cyan-800));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-.02em;line-height:1"
              >
                1950
              </div>
              <div style="font-size:7px;font-weight:800;color:var(--text-color);margin-top:3px;letter-spacing:.01em">
                Turing Test
              </div>
              <div style="height:2px;width:90%;background:var(--surface-200);border-radius:1px;margin-top:4px"></div>
              <div style="height:2px;width:72%;background:var(--surface-200);border-radius:1px;margin-top:2px"></div>
              <div style="display:flex;align-items:center;gap:3px;margin-top:4px">
                <div style="font-size:5px;color:var(--p-cyan-700);font-weight:800;letter-spacing:.06em">A. TURING</div>
              </div>
            </div>
            <div style="position:absolute;left:11.5px;bottom:8px;display:flex;flex-direction:column;gap:3.5px">
              <div style="width:8px;height:8px;border-radius:50%;background:var(--surface-200);opacity:.65"></div>
              <div style="width:8px;height:8px;border-radius:50%;background:var(--surface-200);opacity:.4"></div>
              <div style="width:8px;height:8px;border-radius:50%;background:var(--surface-200);opacity:.2"></div>
            </div>
          </div>
        }
        @case ('qs-prompting-race') {
          <div
            style="width:100%;height:100%;box-sizing:border-box;background:linear-gradient(150deg,var(--surface-0) 0%,var(--surface-50) 100%);border:1.5px solid var(--p-orange-300);border-radius:11px;padding:8px 9px;display:flex;flex-direction:column;gap:4.5px;position:relative;overflow:hidden;box-shadow:0 0 0 3px rgba(249,115,22,.07),0 6px 18px rgba(249,115,22,.14),0 2px 6px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.95)"
          >
            <svg width="0" height="0" style="position:absolute">
              <defs>
                <filter id="snip__qs-prompting-race-v1-snip-prv1-glow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <div
              style="position:absolute;top:-10px;right:-10px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.12) 0%,transparent 70%)"
            ></div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:4px">
                <div
                  style="width:15px;height:15px;border-radius:3.5px;background:linear-gradient(135deg,var(--p-orange-400),var(--p-orange-600));display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900;color:white;box-shadow:0 2px 6px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.25)"
                >
                  P
                </div>
                <div
                  style="font-size:7px;font-weight:800;color:var(--text-color);letter-spacing:.06em;text-transform:uppercase"
                >
                  Prompt
                </div>
              </div>
              <div
                style="font-size:6px;font-weight:700;color:var(--p-orange-700);background:linear-gradient(135deg,var(--p-orange-50),var(--p-orange-100));padding:1px 5px;border-radius:5px;border:1px solid var(--p-orange-200);box-shadow:0 1px 3px rgba(249,115,22,.15)"
              >
                RACE
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;margin-top:2px">
              <div style="font-size:8px;font-weight:900;color:var(--p-orange-700);width:10px;text-align:center">R</div>
              <div
                style="height:3.5px;flex:1;background:linear-gradient(90deg,var(--p-orange-500),var(--p-orange-300));border-radius:2px;max-width:74px;box-shadow:0 1px 4px rgba(249,115,22,.3)"
              ></div>
            </div>
            <div style="display:flex;align-items:center;gap:5px">
              <div style="font-size:8px;font-weight:900;color:var(--p-orange-700);width:10px;text-align:center">A</div>
              <div
                style="height:3.5px;flex:1;background:linear-gradient(90deg,var(--p-orange-400),var(--p-orange-200));border-radius:2px;max-width:96px"
              ></div>
            </div>
            <div style="display:flex;align-items:center;gap:5px">
              <div style="font-size:8px;font-weight:900;color:var(--p-orange-700);width:10px;text-align:center">C</div>
              <div
                style="height:3.5px;flex:1;background:linear-gradient(90deg,var(--p-orange-400),var(--p-orange-200));border-radius:2px;max-width:62px"
              ></div>
            </div>
            <div style="display:flex;align-items:center;gap:5px">
              <div style="font-size:8px;font-weight:900;color:var(--p-orange-700);width:10px;text-align:center">E</div>
              <div
                style="height:3.5px;flex:1;background:linear-gradient(90deg,var(--p-orange-500),var(--p-orange-300));border-radius:2px;max-width:84px;box-shadow:0 1px 4px rgba(249,115,22,.25)"
              ></div>
            </div>
            <div
              style="margin-top:auto;align-self:flex-end;width:78%;padding:4px 7px;background:linear-gradient(135deg,var(--p-orange-50),var(--p-orange-100));border:1px solid var(--p-orange-200);border-radius:8px 8px 2px 8px;box-shadow:0 2px 8px rgba(249,115,22,.12),inset 0 1px 0 rgba(255,255,255,.8)"
            >
              <div style="height:2px;width:90%;background:var(--p-orange-400);border-radius:1px"></div>
              <div style="height:2px;width:72%;background:var(--p-orange-300);border-radius:1px;margin-top:2px"></div>
              <div style="height:2px;width:60%;background:var(--p-orange-200);border-radius:1px;margin-top:2px"></div>
            </div>
          </div>
        }
        @case ('home') {
          <div
            style="width:140px;height:120px;background:linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#1a120c 100%);border-radius:4px;position:relative;overflow:hidden"
          >
            <!-- Sterne-Partikel -->
            <div
              style="position:absolute;top:7px;left:11px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,.9)"
            ></div>
            <div
              style="position:absolute;top:16px;left:33px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,.55)"
            ></div>
            <div
              style="position:absolute;top:5px;left:60px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,.8)"
            ></div>
            <div
              style="position:absolute;top:20px;left:90px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,.5)"
            ></div>
            <div
              style="position:absolute;top:10px;left:116px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,.7)"
            ></div>
            <div
              style="position:absolute;top:30px;left:16px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,.4)"
            ></div>
            <div
              style="position:absolute;top:34px;left:52px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,.6)"
            ></div>
            <div
              style="position:absolute;top:26px;left:78px;width:2px;height:2px;border-radius:50%;background:rgba(255,255,255,.45)"
            ></div>
            <div
              style="position:absolute;top:40px;left:108px;width:1.5px;height:1.5px;border-radius:50%;background:rgba(255,255,255,.65)"
            ></div>
            <div
              style="position:absolute;top:48px;left:26px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,.35)"
            ></div>
            <div
              style="position:absolute;top:14px;left:76px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,.5)"
            ></div>
            <div
              style="position:absolute;top:44px;left:68px;width:1px;height:1px;border-radius:50%;background:rgba(255,255,255,.3)"
            ></div>
            <!-- Glow-Halo hinter Kompass -->
            <div
              style="position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);width:64px;height:64px;border-radius:50%;background:radial-gradient(circle,rgba(251,191,36,.18) 0%,rgba(251,146,60,.08) 55%,transparent 75%)"
            ></div>
            <!-- Kompass-Icon -->
            <div
              style="position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);display:flex;align-items:center;justify-content:center"
            >
              <i
                class="pi pi-compass"
                style="font-size:46px;background:linear-gradient(145deg,#fcd34d 0%,#fb923c 50%,#f59e0b 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 6px rgba(251,191,36,.55))"
              ></i>
            </div>
            <!-- Sektion-Dots -->
            <div
              style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:5px;align-items:center"
            >
              <div style="width:5px;height:5px;border-radius:50%;background:#60a5fa;opacity:.85"></div>
              <div style="width:5px;height:5px;border-radius:50%;background:#4ade80;opacity:.85"></div>
              <div
                style="width:6px;height:6px;border-radius:50%;background:#fcd34d;opacity:.95;box-shadow:0 0 5px rgba(252,211,77,.5)"
              ></div>
              <div style="width:5px;height:5px;border-radius:50%;background:#c084fc;opacity:.85"></div>
              <div style="width:5px;height:5px;border-radius:50%;background:#2dd4bf;opacity:.85"></div>
            </div>
          </div>
        }
        @case ('news') {
          <div style="width:140px;height:120px;padding:6px 7px;display:flex;flex-direction:column;gap:4px">
            <!-- Masthead -->
            <div
              style="display:flex;align-items:center;gap:4px;border-bottom:2px solid var(--primary-400);padding-bottom:3px"
            >
              <div
                style="font-size:6px;font-weight:900;letter-spacing:.12em;color:var(--primary-500);text-transform:uppercase"
              >
                vibecore
              </div>
              <div style="margin-left:auto;font-size:5px;color:var(--text-color-secondary);font-weight:600">NEWS</div>
            </div>
            <!-- Lead story -->
            <div
              style="background:var(--surface-card);border-radius:4px;padding:4px 5px;border-left:3px solid var(--primary-400);flex:2;display:flex;flex-direction:column;justify-content:center;gap:2px"
            >
              <div style="height:4px;width:92%;background:var(--primary-300);border-radius:2px"></div>
              <div style="height:3px;width:78%;background:var(--surface-300);border-radius:2px"></div>
              <div style="height:3px;width:84%;background:var(--surface-300);border-radius:2px"></div>
              <div style="display:flex;align-items:center;gap:3px;margin-top:2px">
                <div style="height:2px;width:36px;background:var(--primary-200);border-radius:1px"></div>
                <div
                  style="font-size:5px;font-weight:700;color:var(--primary-500);background:var(--primary-50,#fff7ed);padding:1px 4px;border-radius:4px;border:1px solid var(--primary-200)"
                >
                  NEW
                </div>
              </div>
            </div>
            <!-- Sub-story 1 -->
            <div
              style="display:flex;align-items:center;gap:4px;background:var(--surface-card);border-radius:3px;padding:3px 5px"
            >
              <div style="flex:1;display:flex;flex-direction:column;gap:1.5px">
                <div style="height:2.5px;width:80%;background:var(--surface-400);border-radius:1px"></div>
                <div style="height:2.5px;width:58%;background:var(--surface-300);border-radius:1px"></div>
              </div>
              <div style="font-size:5px;font-weight:700;color:var(--text-color-secondary);white-space:nowrap">
                May 27
              </div>
            </div>
            <!-- Sub-story 2 -->
            <div
              style="display:flex;align-items:center;gap:4px;background:var(--surface-card);border-radius:3px;padding:3px 5px"
            >
              <div style="flex:1;display:flex;flex-direction:column;gap:1.5px">
                <div style="height:2.5px;width:72%;background:var(--surface-400);border-radius:1px"></div>
                <div style="height:2.5px;width:50%;background:var(--surface-300);border-radius:1px"></div>
              </div>
              <div style="font-size:5px;font-weight:700;color:var(--text-color-secondary);white-space:nowrap">
                May 25
              </div>
            </div>
          </div>
        }
        @case ('impressum') {
          <div
            style="width:140px;height:120px;background:var(--surface-card);border:1.5px solid var(--surface-border);border-radius:8px;padding:8px 10px;display:flex;gap:8px;align-items:flex-start;box-shadow:0 2px 6px rgba(0,0,0,.08)"
          >
            <!-- § Symbol -->
            <div
              style="font-size:36px;font-weight:900;color:var(--blue-200,#bfdbfe);line-height:1;flex-shrink:0;margin-top:2px;letter-spacing:-.04em;font-family:Georgia,serif"
            >
              §
            </div>
            <!-- Adressblock rechts -->
            <div style="flex:1;display:flex;flex-direction:column;gap:4px;padding-top:4px">
              <!-- Trennlinie oben (Briefkopf-Linie) -->
              <div style="height:2px;background:var(--blue-400,#60a5fa);border-radius:1px;margin-bottom:2px"></div>
              <!-- Name-Zeile -->
              <div style="height:4px;width:85%;background:var(--surface-400);border-radius:2px"></div>
              <!-- Adresszeilen -->
              <div style="height:3px;width:70%;background:var(--surface-300);border-radius:2px"></div>
              <div style="height:3px;width:60%;background:var(--surface-300);border-radius:2px"></div>
              <div style="height:3px;width:55%;background:var(--surface-300);border-radius:2px"></div>
              <!-- Kleine Lücke -->
              <div style="height:2px"></div>
              <!-- Kontakt-Zeile mit kleinem Icon-Indikator -->
              <div style="display:flex;align-items:center;gap:3px">
                <div
                  style="width:5px;height:5px;border-radius:50%;background:var(--blue-300,#93c5fd);flex-shrink:0"
                ></div>
                <div style="height:2px;width:65%;background:var(--blue-200,#bfdbfe);border-radius:1px"></div>
              </div>
              <div style="display:flex;align-items:center;gap:3px">
                <div style="width:5px;height:5px;border-radius:50%;background:var(--surface-300);flex-shrink:0"></div>
                <div style="height:2px;width:55%;background:var(--surface-200);border-radius:1px"></div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .vs-container {
        width: 160px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius-lg, 12px);
        background: var(--surface-ground);
        padding: 0.5rem;
      }
      .vs-size-sm {
        width: 100px;
        height: 90px;
        transform: scale(0.625);
        transform-origin: center;
      }
      .vs-size-lg {
        width: 200px;
        height: 180px;
        transform: scale(1.25);
        transform-origin: center;
      }

      /* Star rating helper for tools */
      .vs-star {
        display: block;
        width: 6px;
        height: 6px;
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        background: var(--surface-300);
      }
      .vs-sf {
        background: var(--yellow-400, #facc15);
      }

      /* Demos snippet: light "screen" in light mode (matches the airy feel of
       all other snippets), inverted to a dark "monitor" mock in dark mode. */
      .dark-theme .vs-container {
        --vs-demos-bg: #1a1a2e;
        --vs-demos-cell: #2a2a3e;
      }
    `,
  ],
})
export class ContentVisualSnippetSourceComponent {
  @Input() type = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
