import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConstrainedInputsArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './constrained-inputs-article.component';

/**
 * German twin of the Constrained Inputs guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs constrained-inputs`).
 */
@Component({
  selector: 'app-constrained-inputs-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'constrained-inputs'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Vier Controls mit einer Gemeinsamkeit: Sie entscheiden, dass manche Tastendrücke nicht ins Feld gehören. Was
          sie unterscheidet, ist, was sie über den Wert wissen — eine ganze geschriebene Form, eine Länge, ein Geheimnis
          oder nur eine Zeichenklasse — und wie viel von diesem Wissen beim Nutzer ankommt, der tippt.
        </p>

        <h3>Eine feste geschriebene Form</h3>
        <div class="stage stage--col">
          <label class="field-label" for="ci-tel">Telefon</label>
          <p-inputmask
            inputId="ci-tel"
            mask="(999) 999-9999"
            [autoClear]="false"
            [(ngModel)]="tel"
            [pt]="telPt" />
          <span class="hint" id="ci-tel-hint">{{ m.maskHint }}</span>
          <span class="note">Model-Wert: <code>{{ tel() || 'null' }}</code></span>
        </div>

        <h3>Dieselbe Maske, Model ohne Maske</h3>
        <div class="stage stage--col">
          <label class="field-label" for="ci-tel2">Telefon, im Model nur Ziffern</label>
          <p-inputmask inputId="ci-tel2" mask="(999) 999-9999" [autoClear]="false" [unmask]="true" [(ngModel)]="tel2" />
          <span class="note">Model-Wert: <code>{{ tel2() || 'null' }}</code></span>
          <span class="hint">{{ m.unmaskHint }}</span>
        </div>

        <h3>Ein Einmalcode</h3>
        <div class="stage stage--col">
          <span class="field-label" id="ci-otp-label">Bestätigungscode</span>
          <div role="group" aria-labelledby="ci-otp-label" aria-describedby="ci-otp-hint">
            <p-inputOtp [length]="6" [integerOnly]="true" [(ngModel)]="otp" />
          </div>
          <span class="hint" id="ci-otp-hint">{{ m.otpHint }}</span>
        </div>

        <h3>Ein Geheimnis</h3>
        <div class="stage stage--row stage--wrap">
          <div class="col">
            <label class="field-label" for="ci-pw1">Mit Stärkeanzeige und Aufdecken</label>
            <p-password inputId="ci-pw1" [toggleMask]="true" autocomplete="new-password" [(ngModel)]="pw1" />
            <span class="hint">{{ m.pwMeterHint }}</span>
          </div>
          <div class="col">
            <label class="field-label" for="ci-pw2">Stärkeanzeige aus</label>
            <p-password inputId="ci-pw2" [feedback]="false" autocomplete="current-password" [(ngModel)]="pw2" />
            <span class="hint">{{ m.pwPlainHint }}</span>
          </div>
        </div>

        <h3>Eine Zeichenklasse</h3>
        <div class="stage stage--row stage--wrap">
          <div class="col">
            <label class="field-label" for="ci-kf1">Positive Ganzzahl (blockierend)</label>
            <input pInputText id="ci-kf1" pKeyFilter="pint" inputmode="numeric" [ngModel]="kf1()" (ngModelChange)="kf1.set($event)" />
            <span class="hint">{{ m.kfBlockHint }}</span>
          </div>
          <div class="col">
            <label class="field-label" for="ci-kf2">Hex (nur validieren)</label>
            <input pInputText id="ci-kf2" pKeyFilter="hex" [pValidateOnly]="true" [ngModel]="kf2()" (ngModelChange)="kf2.set($event)" />
            <span class="hint">{{ m.kfValidateHint }}</span>
          </div>
        </div>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Einschränkung zu welchem Wert passt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was du über den Wert weißt</th>
                <th>Control</th>
                <th>Was es erzwingt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eine feste geschriebene Form, für jeden Besucher gleich</td>
                <td><code>p-inputmask</code></td>
                <td>Zeichenklassen Position für Position plus Literale; geprüft wird die Vollständigkeit, nicht die Bedeutung.</td>
              </tr>
              <tr>
                <td>Ein kurzer Code bekannter Länge, von anderswo abgetippt</td>
                <td><code>p-inputOtp</code></td>
                <td>Die Länge und, mit <code>integerOnly</code>, Ziffern; sonst nichts.</td>
              </tr>
              <tr>
                <td>Ein Geheimnis</td>
                <td><code>p-password</code></td>
                <td>Nichts. Es maskiert, deckt auf Wunsch auf und bewertet auf Wunsch.</td>
              </tr>
              <tr>
                <td>Nur eine Zeichenklasse</td>
                <td><code>[pKeyFilter]</code></td>
                <td>Welche Zeichen getippt oder eingefügt werden dürfen; keine Länge, keine Form, standardmäßig kein Formularfehler.</td>
              </tr>
              <tr>
                <td>Eine Zahl, mit der du rechnen wirst</td>
                <td><code>p-inputnumber</code></td>
                <td>Gebietsschema-Trennzeichen, min/max, Schrittweite — der Guide <code>inputnumber</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Durchsetzung ist aus den ausgelieferten Bundles abgelesen: die Tests pro Position der Maske in
          <code>openng-optimus-ui-inputmask.mjs:900</code>–<code>935</code>, die Tastensperre des OTP in
          <code>openng-optimus-ui-inputotp.mjs:282</code>–<code>288</code> und die regulären Ausdrücke des Filters in
          <code>openng-optimus-ui-keyfilter.mjs:12</code>–<code>22</code>.
        </p>

        <h3>Ein Control ohne Label-Fläche benennen</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — sechs Kästchen mit einer Überschrift daneben</span>
            <div class="dd__stage">
              <span class="field-label">Bestätigungscode</span>
              <p-inputOtp [length]="4" [integerOnly]="true" [(ngModel)]="ddOtpBad" />
            </div>
            <p class="dd__why">
              Die Kästchen tragen keine <code>id</code>, kein <code>aria-label</code> und keine Gruppenrolle, also ist
              die Überschrift nur benachbarter Text, und jedes Kästchen wird als unbenanntes Textfeld angesagt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine benannte Gruppe um die Kästchen</span>
            <div class="dd__stage">
              <span class="field-label" id="ci-dd-otp">Bestätigungscode</span>
              <div role="group" aria-labelledby="ci-dd-otp">
                <p-inputOtp [length]="4" [integerOnly]="true" [(ngModel)]="ddOtpGood" />
              </div>
            </div>
            <p class="dd__why">
              Der Wrapper trägt Rolle und Namen, also wird das ganze Control einmal angesagt, mit den Kästchen als seinen
              Kindern.
            </p>
          </div>
        </div>

        <h3>Ein maskiertes Feld halb ausgefüllt verlassen</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — autoClear im Standard</span>
            <div class="dd__stage">
              <label class="field-label" for="ci-dd-m1">Telefon</label>
              <p-inputmask inputId="ci-dd-m1" mask="(999) 999-9999" [(ngModel)]="ddMaskBad" />
              <span class="note">{{ m.ddMaskBadNote }}</span>
            </div>
            <p class="dd__why">
              Tipp drei Ziffern und drück <kbd>Tab</kbd> oder <kbd>Enter</kbd>: Die Eingabe wird verworfen und das Model
              geleert, ohne Meldung und ohne Möglichkeit, es rückgängig zu machen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — behalte die Eingabe, lass das Formular sie beurteilen</span>
            <div class="dd__stage">
              <label class="field-label" for="ci-dd-m2">Telefon</label>
              <p-inputmask inputId="ci-dd-m2" mask="(999) 999-9999" [autoClear]="false" [(ngModel)]="ddMaskGood" />
              <span class="note">{{ m.ddMaskGoodNote }}</span>
            </div>
            <p class="dd__why">
              Der unvollständige Wert übersteht den Blur, also kann ein Validator benennen, was fehlt, statt dass sich das
              Feld still selbst leert.
            </p>
          </div>
        </div>

        <h3>Wo jedes davon aufhört</h3>
        <ul>
          <li>
            <strong>Die Maske hört bei der Vielfalt auf.</strong> Telefonnummern, Postleitzahlen und Kennungen sehen in
            jedem Land anders aus. Eine Maske bedient eine Form; ein Besucher, dessen Nummer nicht passt, kann sie gar nicht
            eingeben.
          </li>
          <li>
            <strong>Das OTP hört bei der Zusammensetzung auf.</strong> Es ist für einen Code, den jemand abschreibt, nicht
            für einen, den er sich ausdenkt: Die Kästchen enden bei <code>length</code>, jedes ist ein eigener Tab-Stopp,
            und es gibt keinen Platz für eine Beschriftung.
          </li>
          <li>
            <strong>Das Passwort hört bei der Richtlinie auf.</strong> Die Stärkeanzeige antwortet mit drei festen Wörtern
            aus zwei regulären Ausdrücken; sie kann „keine Wiederverwendung“, „nicht deine E-Mail-Adresse“ oder eine reine
            Längenregel nicht ausdrücken.
          </li>
          <li>
            <strong>Der Filter hört bei der Sprache auf.</strong> Eine Zeichenklasse, die für einen Lizenzschlüssel
            richtig ist, ist für einen Namen falsch — siehe den Tab „Internationalisierung (i18n)“.
          </li>
        </ul>

        <h4>Quellen</h4>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 SC 3.3.2, Labels or Instructions</a>
            — das Kriterium, an dem eine Maske scheitert, wenn ihre Platzhalterzeichen die einzige Angabe des Formats sind.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 SC 2.1.1, Keyboard</a>
            — das Kriterium, an dem das mitgelieferte Aufdecken des Passworts scheitert; deshalb verlangt dieser Guide
            einen eigenen Button.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 SC 1.3.5, Identify Input Purpose</a>
            — die <code>autocomplete</code>-Tokens, auch das eine, das die OTP-Komponente nicht setzen kann.
          </li>
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener noreferrer">NIST SP 800-63B, Digital Identity Guidelines</a>
            — die Primärquelle dafür, Länge vor Zusammensetzungsregeln zu stellen, und genau dort widersprechen die beiden
            Stärke-Ausdrücke der Bibliothek der aktuellen Empfehlung.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event" target="_blank" rel="noopener noreferrer">MDN, <code>keypress</code> event (deprecated)</a>
            — das Event, auf dem der Key-Filter immer noch blockiert, und der Grund, warum Kompositionseingaben ihm
            entgehen.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete" target="_blank" rel="noopener noreferrer">MDN, <code>autocomplete</code> attribute</a>
            — das Token <code>one-time-code</code> und die Passwort-Tokens, die diese Felder tragen sollten.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Woher die Farbe kommt</h3>
        <p>
          Darunter sind alle vier gewöhnliche Textfelder — die drei Komponenten rendern ein
          <code>&lt;input pInputText&gt;</code>, und der Key-Filter sitzt auf deinem eigenen —, also übernehmen sie die
          ganze Token-Familie <code>inputtext</code> für Rahmen, Füllung, Radius und Padding und damit auch die Kit-Schicht:
          Die Regel <code>html.style-&lt;name&gt; input.p-inputtext</code> pro Stil in <code>src/styles.scss</code> setzt
          die Randfarbe pro Stil und auch ihre Breite (2px in werkbund und lernwerkstatt, 1.5px in skizzenbuch;
          blaupause behält die Standardbreite; dunkles lernwerkstatt fällt auf <code>--control-border</code> zurück), und der dunkle <code>.p-inputtext</code>-Block
          biegt Füllung, Text, Rand und Placeholder auf Kit-Tokens um. Die Kit-Regel
          <code>.p-inputtext:focus-visible</code> gibt jedem davon, jedes OTP-Kästchen eingeschlossen, den 2px-Ring in
          <code>--primary-color-fg</code> mit 2px Abstand, den Auras auf null gesetzter Formularfeld-Ring weglässt. Nur die
          Teile, die jedem Control eigen sind, haben eigene Tokens.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teil</th>
                <th>Token-Kette</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OTP-Abstand zwischen den Kästchen</td>
                <td><code>inputotp.gap</code></td>
                <td>{{ m.otpGap }}</td>
              </tr>
              <tr>
                <td>OTP-Kästchenbreite</td>
                <td><code>inputotp.input.width</code> / <code>.sm</code> / <code>.lg</code></td>
                <td>{{ m.otpWidth }}</td>
              </tr>
              <tr>
                <td>Spur der Stärkeleiste</td>
                <td><code>password.meter.height</code>, <code>password.meter.background</code></td>
                <td>{{ m.meterTrack }}</td>
              </tr>
              <tr>
                <td>Füllung der Stärkeleiste</td>
                <td><code>password.strength.weak|medium|strong.background</code></td>
                <td>{{ m.meterFill }}</td>
              </tr>
              <tr>
                <td>Stärke-Overlay</td>
                <td><code>password.overlay.*</code></td>
                <td>{{ m.pwOverlay }}</td>
              </tr>
              <tr>
                <td>Icon zum Aufdecken und Leeren</td>
                <td><code>password.icon.color</code>, <code>form.field.padding.x</code>, <code>icon.size</code></td>
                <td>{{ m.pwIcon }}</td>
              </tr>
              <tr>
                <td>Maskiertes Feld</td>
                <td>— keine —</td>
                <td>{{ m.maskTokens }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und Standardwerte aus <code>&#64;openng/optimus-ui-themes/dist/aura/password/index.mjs</code> und
          <code>.../aura/inputotp/index.mjs</code>; die Regeln, die sie verwenden, aus
          <code>&#64;openng/optimus-ui-styles/dist/password/index.mjs</code> und <code>.../dist/inputotp/index.mjs</code>.
          Im Theme-Paket gibt es keinen Eintrag <code>aura/inputmask</code>.
        </p>

        <h3>Die Stärkeanzeige, gezeichnet</h3>
        <p>{{ m.meterProse }}</p>
        <p class="src-note">
          Breiten und die Zuordnung der Beschriftungen aus <code>openng-optimus-ui-password.mjs:801</code>–<code>833</code>; die
          Breiten-Transition von 1s aus <code>.p-password-meter-label</code> im Passwort-Stylesheet.
        </p>

        <h3>Icons liegen über dem Text</h3>
        <p>{{ m.iconOverlapProse }}</p>
        <p class="src-note">
          Die Reservierungsregeln sind die Selektoren <code>:has(.p-password-toggle-mask-icon)</code> und
          <code>:has(.p-password-clear-icon)</code> im Passwort-Stylesheet; das eigene Leeren-Icon des maskierten Felds
          wird von <code>.p-inputmask-clear-icon</code> in den eingebetteten Regeln unter
          <code>openng-optimus-ui-inputmask.mjs:20</code>–<code>56</code> positioniert.
        </p>

        <h3>Kontrast</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Das Feld, das jedes der vier rendert, <code>input.p-inputtext</code> auf
              <code>inputtext.background</code>, pro visuellem Stil und Modus
            </caption>
            <thead>
              <tr>
                <th>Stil</th>
                <th>Modus</th>
                <th>Werttext (SC 1.4.3, 4,5:1)</th>
                <th>Placeholder (SC 1.4.3, 4,5:1)</th>
                <th>Rand in Ruhe (SC 1.4.11, 3:1)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>hell</td><td>10,35:1</td><td>4,76:1</td><td>18,73:1</td></tr>
              <tr><td>werkbund</td><td>dunkel</td><td>13,32:1</td><td>5,91:1</td><td>13,32:1</td></tr>
              <tr><td>lernwerkstatt</td><td>hell</td><td>10,35:1</td><td>4,76:1</td><td>14,97:1</td></tr>
              <tr><td>lernwerkstatt</td><td>dunkel</td><td>11,63:1</td><td>5,93:1</td><td>4,42:1</td></tr>
              <tr><td>skizzenbuch</td><td>hell</td><td>10,35:1</td><td>4,76:1</td><td>3,62:1</td></tr>
              <tr><td>skizzenbuch</td><td>dunkel</td><td>10,08:1</td><td>4,79:1</td><td>4,53:1</td></tr>
              <tr><td>blaupause</td><td>hell</td><td>10,35:1</td><td>4,76:1</td><td>4,09:1</td></tr>
              <tr><td>blaupause</td><td>dunkel</td><td>9,35:1</td><td>5,14:1</td><td>3,25:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilen aus <code>docs/generated/CONTRAST.MD</code>, Gruppen „form field text“ (<code>inputtext.color</code>,
          <code>inputtext.placeholder.color</code>) und „form field edge“ (der Rahmen von <code>input.p-inputtext</code>
          pro Stil auf <code>inputtext.background</code>), jeder Stilblock, beide Modi.
          Der helle Werttext ist in jedem Stil Auras Standard-<code>form.field.color</code>; dunkel biegt ihn auf
          <code>--text-color</code> um. Das Icon zum Aufdecken und Leeren des Passworts nimmt <code>--text-color-secondary</code>
          (Kit-Regel <code>.p-password</code>, statt Auras surface.400): 4,79&#8211;7,78:1 auf dem Feld, „form
          field icon“ (<code>password.icon.color</code>). Der Fehlerrand, <code>--semantic-red-fg</code>, liegt bei
          5,66&#8211;7,93:1 auf derselben Füllung („form field edge“, <code>inputtext.invalid.border.color</code>).
        </p>
        <p>{{ m.contrastProse }}</p>

        <h3>Wie die Fehlerfärbung jedes Feld erreicht</h3>
        <p>{{ m.invalidProse }}</p>
        <p class="src-note">
          Das weitergereichte Input unter <code>openng-optimus-ui-inputmask.mjs:1336</code>,
          <code>openng-optimus-ui-password.mjs:936</code> und <code>openng-optimus-ui-inputotp.mjs:349</code>; die
          Formularklassen-Regeln eingebettet unter <code>openng-optimus-ui-inputmask.mjs:39</code>–<code>42</code> und
          <code>openng-optimus-ui-password.mjs:31</code>–<code>32</code>; <code>.p-inputtext.p-invalid</code> in
          <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>; die Regeln für
          <code>input.p-inputtext</code> pro Stil und die Kit-Regel <code>input.p-inputtext.p-invalid</code> in
          <code>src/styles.scss</code>.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>{{ m.responsiveProse }}</p>
        <p class="src-note">
          Breiten und Abstand aus der Token-Datei <code>inputotp</code> oben; <code>display: flex</code> ohne
          Wrap-Angabe und <code>.p-password &#123; display: inline-flex &#125;</code> aus den beiden Stylesheets;
          <code>width: 100%</code> von <code>p-inputmask</code> unter <code>:has(.p-inputtext-fluid)</code> aus den
          eingebetteten Masken-Regeln.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Zwei Formen pro Familie</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Import</th>
                <th>Selektoren</th>
                <th>Was es ist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>InputMaskModule</code></td>
                <td><code>p-inputmask</code>, <code>p-inputMask</code>, <code>p-input-mask</code></td>
                <td>Komponente mit einem <code>ControlValueAccessor</code>; besitzt <code>unmask</code> und das Leeren-Icon.</td>
              </tr>
              <tr>
                <td><code>InputMaskModule</code></td>
                <td><code>[pInputMask]</code></td>
                <td>
                  Direktive auf deinem eigenen <code>&lt;input&gt;</code>. Signal-Inputs, kein <code>unmask</code>, ein
                  zusätzliches <code>(onUnmaskedChange)</code> und keine Inputs für einen editierbaren Halter.
                </td>
              </tr>
              <tr>
                <td><code>InputOtpModule</code></td>
                <td><code>p-inputOtp</code>, <code>p-inputotp</code>, <code>p-input-otp</code></td>
                <td>Nur Komponente.</td>
              </tr>
              <tr>
                <td><code>PasswordModule</code></td>
                <td><code>p-password</code></td>
                <td>Komponente mit Stärkeanzeige, Overlay und Aufdecken.</td>
              </tr>
              <tr>
                <td><code>PasswordModule</code></td>
                <td><code>[pPassword]</code></td>
                <td>
                  Direktive, die ihr Overlay imperativ in <code>document.body</code> baut; ihre vier Stärke-Texte sind
                  fest auf Englisch eingebaut, ohne Abfrage einer Konfiguration.
                </td>
              </tr>
              <tr>
                <td><code>KeyFilterModule</code></td>
                <td><code>[pKeyFilter]</code></td>
                <td>Nur Direktive — es gibt keine Element-Form.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selektorlisten und Metadaten: <code>openng-optimus-ui-inputmask.mjs:678</code> und <code>:1327</code>,
          <code>openng-optimus-ui-inputotp.mjs:337</code>, <code>openng-optimus-ui-password.mjs:452</code> und
          <code>:914</code>, <code>openng-optimus-ui-keyfilter.mjs:225</code>. Das imperative Panel der Direktive steht unter
          <code>openng-optimus-ui-password.mjs:273</code>–<code>290</code>.
        </p>

        <h3>Masken-Syntax</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zeichen in <code>mask</code></th>
                <th>Akzeptiert</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>9</code></td><td><code>[0-9]</code></td></tr>
              <tr><td><code>a</code></td><td><code>characterPattern</code>, Standard <code>[A-Za-z]</code></td></tr>
              <tr><td><code>*</code></td><td><code>characterPattern</code> oder eine Ziffer</td></tr>
              <tr><td><code>?</code></td><td>Kein Platz: Alles danach ist für die Vollständigkeit optional.</td></tr>
              <tr><td>alles andere</td><td>Ein Literal, das in den Puffer geschrieben und vom Cursor übersprungen wird.</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aufgebaut in <code>initMask()</code>, <code>openng-optimus-ui-inputmask.mjs:892</code>–<code>935</code>. Weil
          <code>characterPattern</code> sowohl <code>a</code> als auch <code>*</code> speist, erweitert es beide, wenn du
          es für Akzente erweiterst.
        </p>

        <h3>Tastatur</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th><code>p-inputmask</code></th>
                <th><code>p-inputOtp</code></th>
                <th><code>p-password</code> / <code>[pKeyFilter]</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>Ein Stopp.</td>
                <td>Ein Stopp <em>pro Kästchen</em> — ein sechsstelliger Code kostet sechs.</td>
                <td>Ein Stopp; das Icon zum Aufdecken ist gar nicht in der Reihenfolge.</td>
              </tr>
              <tr>
                <td><kbd>Backspace</kbd></td>
                <td>Neu implementiert: leert den vorigen Platz und verhindert das Standardverhalten.</td>
                <td>In einem leeren Kästchen springt der Fokus ein Kästchen zurück.</td>
                <td>Nativ.</td>
              </tr>
              <tr>
                <td><kbd>Delete</kbd></td>
                <td>Neu implementiert: leert den nächsten Platz.</td>
                <td>Auch bei voller Länge erlaubt.</td>
                <td>Nativ.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Führt den Blur-Pfad an Ort und Stelle aus — mit eingeschaltetem <code>autoClear</code> leert das das Feld.</td>
                <td>Nichts Besonderes; sendet das Formular ab.</td>
                <td>Passwort: nichts Besonderes. Filter: wird durchgereicht.</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>Stellt den Wert wieder her, den das Feld beim Fokussieren hatte.</td>
                <td>Nichts.</td>
                <td>Passwort: schließt das Stärke-Overlay bis zum nächsten Tastendruck.</td>
              </tr>
              <tr>
                <td><kbd>←</kbd> <kbd>→</kbd></td>
                <td>Native Cursorbewegung.</td>
                <td>Wechselt zwischen den Kästchen, Standardverhalten verhindert.</td>
                <td>Nativ.</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd> <kbd>↓</kbd></td>
                <td>Nativ.</td>
                <td>Verschluckt.</td>
                <td>Nativ.</td>
              </tr>
              <tr>
                <td>Fokus</td>
                <td>Der Cursor springt auf den ersten freien Platz; ein vollständiger Wert wird ganz markiert.</td>
                <td>Der Inhalt des Kästchens wird markiert, Tippen ersetzt ihn also.</td>
                <td>Passwort: öffnet das Overlay, wenn <code>feedback</code> eingeschaltet ist.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>onInputKeydown</code> unter <code>openng-optimus-ui-inputmask.mjs:1077</code>–<code>1120</code> und der
          Cursor beim Fokus unter <code>:1233</code>–<code>:1253</code>; <code>onKeyDown</code> unter
          <code>openng-optimus-ui-inputotp.mjs:258</code>–<code>291</code> und das Markieren beim Fokus unter <code>:251</code>;
          die Fokus- und Keyup-Behandlung des Passwort-Overlays unter
          <code>openng-optimus-ui-password.mjs:773</code>–<code>800</code>.
        </p>

        <h3>Inputs, die kompilieren und nichts tun</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Binding</th>
                <th>Was tatsächlich passiert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;p-password [showTransitionOptions]="…"&gt;</code></td>
                <td>{{ m.deadPwTransition }}</td>
              </tr>
              <tr>
                <td><code>&lt;p-password [pattern]="…"&gt;</code>, <code>[min]</code>, <code>[max]</code>, <code>[step]</code></td>
                <td>{{ m.deadBaseInputs }}</td>
              </tr>
              <tr>
                <td><code>&lt;p-inputOtp [mask]="'999'"&gt;</code></td>
                <td>{{ m.deadOtpMask }}</td>
              </tr>
              <tr>
                <td><code>&lt;input pKeyFilter="pint" pattern="[0-9]*"&gt;</code></td>
                <td>{{ m.deadKfPattern }}</td>
              </tr>
              <tr>
                <td><code>&lt;input pKeyFilter="integer"&gt;</code> (falsch geschriebene Maske)</td>
                <td>{{ m.deadKfTypo }}</td>
              </tr>
              <tr>
                <td><code>&lt;input pKeyFilter="pint" [(ngModel)]="v"&gt;</code></td>
                <td>{{ m.deadKfBanana }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Passwort-Deklarationen unter <code>openng-optimus-ui-password.mjs:609</code> und <code>:615</code> gegenüber
          dem <code>p-overlay</code>-Binding unter <code>:977</code>; der OTP-Getter <code>mask</code> unter
          <code>openng-optimus-ui-inputotp.mjs:151</code>–<code>153</code>; der öffentliche Input-Name des Filters in den
          Metadaten der Direktive unter <code>openng-optimus-ui-keyfilter.mjs:225</code> und der Rückfall auf <code>/./</code> in
          seinem Setter <code>pattern</code>.
        </p>

        <h3>An ein Formular anbinden</h3>
        <p>{{ m.formsProse }}</p>
        <pre class="code-block"><code>{{ formSnippet }}</code></pre>
        <p class="src-note">
          Die Value Accessors sind <code>INPUTMASK_VALUE_ACCESSOR</code>, <code>INPUT_OTP_VALUE_ACCESSOR</code> und
          <code>Password_VALUE_ACCESSOR</code> in den drei Bundles; der Validator des Filters ist
          <code>KEYFILTER_VALIDATOR</code> unter <code>openng-optimus-ui-keyfilter.mjs:7</code>–<code>11</code>.
        </p>

        <h3>Die Elemente erreichen, die die Templates privat halten</h3>
        <p>{{ m.ptProse }}</p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          Das OTP-Kästchen bindet <code>[pt]="ptm('pcInputText')"</code> unter
          <code>openng-optimus-ui-inputotp.mjs:362</code>; der Pass-through-Schlüssel ist der Klassenname in der
          <code>classes</code>-Map derselben Datei unter <code>:16</code>–<code>:19</code>.
        </p>

        <h3>Barrierefreiheit</h3>
        <ul>
          <li>
            <strong>Beschrifte, was sich beschriften lässt.</strong> <code>p-inputmask</code> und <code>p-password</code> rendern ein
            echtes <code>&lt;input&gt;</code> mit <code>inputId</code>, also greift <code>&lt;label for&gt;</code>.
            <code>p-inputOtp</code> rendert nichts davon: Gib ihm einen Wrapper mit <code>role="group"</code> und
            <code>aria-labelledby</code>.
          </li>
          <li>
            <strong>Liefere dein eigenes Aufdecken mit.</strong> Das mitgelieferte ist ein <code>&lt;svg&gt;</code> mit einem Klick-Handler,
            und die Bibliothek blendet im selben Stylesheet den nativen Aufdecken-Button des Browsers aus — ein Tastaturnutzer
            kann die Maske also gar nicht aufheben. Ein <code>&lt;button type="button"&gt;</code> mit einem
            <code>aria-pressed</code>-Zustand und einem übersetzten Namen behebt das.
          </li>
          <li>
            <strong>Sag die Stärke selbst an, wenn sie zählt.</strong> Die Beschriftung der Stärkeanzeige ist ein schlichtes
            <code>div</code> in einem Overlay ohne Rolle; render dieselbe Bewertung in deine eigene
            <code>aria-live="polite"</code>-Region, oder schalte <code>feedback</code> aus.
          </li>
          <li>
            <strong>Schreib das Format als Text.</strong> Die Platzhalterzeichen sind der Wert, keine Beschreibung — wer
            einen Screenreader nutzt, hört Unterstriche, nicht „drei Ziffern, dann vier“.
          </li>
          <li>
            <strong>Setz <code>autocomplete</code>.</strong> <code>current-password</code> oder
            <code>new-password</code> am Passwort; <code>one-time-code</code> am OTP, das dafür
            <code>[pt]</code> braucht.
          </li>
          <li>
            <strong>Lass eine Verweigerung nie die einzige Rückmeldung sein.</strong> Ein blockierter Tastendruck erzeugt
            kein Event, keine Meldung und keinen Ton.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Masken- und Passwortfelder haben <code>inputId</code> und ein echtes <code>&lt;label for&gt;</code>.</li>
          <li>☐ Das OTP sitzt in einem benannten Wrapper mit <code>role="group"</code>, der auch die erwartete Länge nennt.</li>
          <li>☐ Das akzeptierte Format ist sichtbarer Text, verknüpft per <code>aria-describedby</code> am inneren Input (über <code>pt</code>) oder am Gruppen-Wrapper des OTP — nicht am Host-Element und nicht nur über Platzhalterzeichen.</li>
          <li>☐ Ein Passwort lässt sich per Tastatur aufdecken, mit einem benannten Button.</li>
          <li>☐ <code>[autoClear]="false"</code> überall, wo ein unvollständiger Wert einen Blur oder ein <kbd>Enter</kbd> überstehen muss.</li>
          <li>☐ Die Gültigkeit kommt aus dem Formularmodell, nicht aus der Maske oder dem Filter.</li>
          <li>☐ <code>autocomplete</code> ist an Passwort- und OTP-Feldern gesetzt.</li>
          <li>☐ Kein Zeichenfilter sitzt auf einem Namens-, Orts- oder Freitextfeld.</li>
          <li>☐ Der Fokus ist an jedem dieser Felder in <strong>beiden</strong> Themes sichtbar.</li>
        </ul>

        <h4>Teste es</h4>
        <p>{{ m.testProse }}</p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Vier Texte, die du nicht geschrieben hast</h3>
        <p>
          Drei dieser Controls liefern überhaupt keinen sichtbaren Text mit. <code>p-password</code> ist die Ausnahme: Mit
          eingeschaltetem <code>feedback</code> zeigt das Overlay eine Aufforderung und eines von drei Urteilen.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Text</th>
                <th>Input, der ihn überschreibt</th>
                <th>Rückfall</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aufforderung, sichtbar, solange das Feld leer ist</td>
                <td><code>promptLabel</code></td>
                <td>Konfigurationsschlüssel der Bibliothek <code>passwordPrompt</code></td>
              </tr>
              <tr>
                <td>Schwach</td>
                <td><code>weakLabel</code></td>
                <td>Konfigurationsschlüssel der Bibliothek <code>weak</code></td>
              </tr>
              <tr>
                <td>Mittel</td>
                <td><code>mediumLabel</code></td>
                <td>Konfigurationsschlüssel der Bibliothek <code>medium</code></td>
              </tr>
              <tr>
                <td>Stark</td>
                <td><code>strongLabel</code></td>
                <td>Konfigurationsschlüssel der Bibliothek <code>strong</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die vier Rückfälle sind <code>promptText()</code>, <code>weakText()</code>, <code>mediumText()</code> und
          <code>strongText()</code> unter <code>openng-optimus-ui-password.mjs:853</code>–<code>869</code>; sie lesen die
          Schlüssel, die in <code>openng-optimus-ui-api.mjs:811</code>–<code>814</code> deklariert sind. Die Direktive
          <code>[pPassword]</code> hat dieselben vier Inputs, aber keine Abfrage — ihre Standardwerte sind englische
          Literale unter <code>:193</code>–<code>:208</code>.
        </p>
        <p>{{ m.i18nPwProse }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Die Maske ist Gebietsschema-Datum, kein Markup</h3>
        <ul>
          <li>
            <strong>Der Masken-String gehört ins Sprach-Bundle.</strong> Gruppierungen von Telefonnummern, Formen von
            Postleitzahlen und nationale Kennungen unterscheiden sich von Land zu Land; ebenso der Hinweis, der sie
            wiedergibt, und ebenso kann es <code>slotChar</code>, das Zeichen, das man in jedem leeren Platz sieht.
          </li>
          <li>
            <strong>Tausch sie nicht unter einem ausgefüllten Feld aus.</strong> Eine neue Zuweisung von <code>mask</code>
            leert den Wert, also verliert ein Sprachwechsel in einem halb ausgefüllten Formular die Eingabe. Erzeug das
            Feld neu, oder löse die Maske einmal auf, wenn das Formular gebaut wird.
          </li>
          <li>
            <strong><code>characterPattern</code> ist standardmäßig lateinisch.</strong> Es ist <code>[A-Za-z]</code> und
            speist sowohl das Masken-Token <code>a</code> als auch <code>*</code> — erweitere es, bevor du irgendetwas
            maskierst, das jemand mit Akzenten schreiben könnte.
          </li>
        </ul>

        <h3>Ein Zeichenfilter kann eine Sprachentscheidung sein</h3>
        <p>{{ m.i18nFilterProse }}</p>
        <p class="src-note">
          Die benannten Masken sind das Objekt <code>DEFAULT_MASKS</code> unter
          <code>openng-optimus-ui-keyfilter.mjs:12</code>–<code>22</code>; <code>alpha</code> ist
          <code>/^[a-z_]*$/i</code> und <code>alphanum</code> <code>/^[a-z0-9_]*$/i</code>.
        </p>

        <h3>Länge und Layout</h3>
        <ul>
          <li>
            <strong>Die drei Urteile sind auf Englisch einzelne Wörter und in anderen Sprachen Wendungen.</strong> Das
            Overlay richtet seine Größe nach dem Feld, unter dem es hängt, also bricht ein längeres Urteil um, statt
            abgeschnitten zu werden — prüf es aber am schmalsten Feld, das du auslieferst.
          </li>
          <li>
            <strong>Name und Hinweis der OTP-Gruppe sind die ganze Ansage.</strong> Nichts im Control selbst ist lesbar,
            also tragen diese beiden Texte in jeder Sprache die gesamte Bedeutung.
          </li>
          <li>
            <strong>Ein Hinweis, der ein Format nennt, muss als Format übersetzt werden.</strong> „10 Ziffern“ wird nicht
            transliteriert — die Zahl der Ziffern selbst ändert sich mit der Maske, die du für dieses Gebietsschema gewählt
            hast.
          </li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            v1.2 — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: <code>[invalid]</code> allein zeichnet jetzt den
            Rand <code>--semantic-red-fg</code> des Kits an allen vier Feldern, die OTP-Kästchen eingeschlossen; das Passwort-Icon ist das
            geprüfte <code>--text-color-secondary</code> („form field icon“). Der Text zur Fehlerfärbung, die Icon-Zeile und der
            Kontrast-Hinweis sagen das.
          </li>
          <li>
            v1.1 — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft: Der Tab „Design“
            nennt die Kit-Schicht, unter der alle vier Felder rendern (der Rand von <code>input.p-inputtext</code> pro Stil und der
            dunkle Token-Block), zitiert die Zeilen „form field text“ und „form field edge“ pro Stil und Modus und sagt,
            wie die Fehlerfärbung jedes Feld erreicht; die Aussage zur Gültigkeit schließt jetzt das weitergereichte
            <code>invalid</code>-Input ein. Agent-Doku unter ihr Byte-Ziel gekürzt.
          </li>
          <li>v1.0 — 07.09.2026 — Erste Fassung, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ConstrainedInputsArticleDeComponent extends ConstrainedInputsArticleComponent {
  /** German measurement and prose constants; every key of the English `m`, values translated. */
  override readonly m = {
    maskHint:
      'Das Feld zeigt die ganze Maske, sobald es fokussiert ist, und der Cursor überspringt die Literalzeichen. Mit ausgeschaltetem autoClear übersteht eine unvollständige Eingabe das Verlassen des Felds.',
    unmaskHint:
      'Dieselbe Maske, anderes Model: unmask speichert nur die Zeichen, die zu einem Platz gepasst haben, also erreichen die Klammern, das Leerzeichen und der Bindestrich nie den Formularwert. Wähl pro Feld eins von beiden und schreib die Validatoren dafür.',
    otpHint:
      'Sechs Kästchen, nur Ziffern. Füg den ganzen Code in ein beliebiges Kästchen ein, und er füllt alle sechs; das erste Kästchen nimmt auch einen getippten Wert aus mehreren Zeichen an, weil seine maxlength die volle Länge ist, während jedes andere Kästchen eines nimmt.',
    pwMeterHint:
      'Das Overlay öffnet sich beim Fokus und zeigt die Aufforderung, bevor irgendetwas getippt ist. Das Augen-Icon ist nur ein Klickziel — es ist nicht in der Tab-Reihenfolge.',
    pwPlainHint: 'Mit ausgeschaltetem feedback gibt es kein Overlay und keine Stärkebewertung; das Feld ist ein maskiertes Textfeld.',
    kfBlockHint:
      'Blockierender Modus: Eine verbotene Taste erzeugt nie ein Zeichen, und ein Einfügen, das eine enthält, wird als Ganzes abgelehnt. Das Form-Control ist gültig, egal was im Feld steht.',
    kfValidateHint:
      'Modus „nur validieren“: Das Tippen ist uneingeschränkt, und das Control meldet stattdessen validatePattern. Das Einfügen wird trotzdem gefiltert — der Paste-Handler ist von dem Schalter nicht erfasst.',

    ddMaskBadNote: 'autoClear ist standardmäßig eingeschaltet.',
    ddMaskGoodNote: 'autoClear ist ausgeschaltet.',

    otpGap: '0.5rem, fest — nicht größenabhängig',
    otpWidth: '2.5rem Standard, 2rem klein, 3rem groß',
    meterTrack: '0.75rem hoch, gefüllt mit {content.border.color}',
    meterFill: '{red.500} / {amber.500} / {green.500} im hellen Modus, die .400-Stufe im dunklen',
    pwOverlay: 'Die Popover-Familie: {overlay.popover.background}, .border.color, .border.radius, .padding, .shadow',
    pwIcon: '--text-color-secondary (Kit; Aura {form.field.icon.color}); das Feld reserviert pro Icon 2 × padding.x + icon.size Platz am Ende',
    maskTokens: 'Keine eigene Token-Datei — es ist ein inputtext mit einer eingebetteten Positionierungsregel für das Leeren-Icon',

    meterProse:
      'Die Leiste ist eine Spur fester Höhe mit einer Füllung, deren Breite einer von drei festen Prozentwerten ist: 33.33% für schwach, 66.66% für mittel, 100% für stark und null, wenn das Feld leer ist. Die Füllung animiert ihre Breite über eine Sekunde, also bewegt sich die Leiste noch, wenn der nächste Tastendruck sie neu bewertet. Schwach, mittel und stark unterscheiden sich durch die Füllfarbe und das Wort darunter — die Breite allein ist der einzige Hinweis ohne Farbe, und sie wird nicht angesagt.',

    iconOverlapProse:
      'Die Icons zum Aufdecken und Leeren sind absolut über dem hinteren Rand des Felds positioniert, und das Stylesheet gleicht das mit Padding am Input aus: Ein Icon reserviert das doppelte Feld-Padding plus eine Icon-Breite, zwei Icons reservieren das dreifache Padding plus zwei Icon-Breiten. Diese Rechnung hängt an :has()-Selektoren auf den gerenderten Icons, also stimmt sie für die mitgelieferten Icons und ist still falsch für ein Icon, das du selbst hinzufügst — ein eigenes Bedienelement in derselben Ecke liegt über dem Text.',

    contrastProse:
      'Jedes Paar besteht in jedem Stil. Die knappsten Abstände sind der helle Placeholder (4,76:1, Standard-Aura, in allen vier Stilen gleich) und der dunkle Rand von blaupause (3,25:1). Die Stärkeanzeige ist eine andere Sache: Ihre Füllungen und ihre Spur kommen aus dem Aura-Preset, das Kompilat hat keine Zeile dafür, und der Guide nennt keine Zahl. Wenn das Urteil der Anzeige als Farbe lesbar sein muss, miss die drei Füllungen gegen die Spur und den Overlay-Hintergrund in deinem eigenen Build — und behalte das Wort unter der Leiste, denn Farbe allein ist keine Aussage.',

    invalidProse:
      'Zwei Wege malen den roten Rand. Jede Komponente reicht ihr invalid-Input an das innere pInputText weiter, das dann .p-invalid trägt; die Maske und das Passwort liefern zusätzlich Regeln, die an Angulars Klassen ng-invalid.ng-dirty auf ihrem Host hängen, und ein eigenes Input mit Key-Filter bekommt die inputtext-Regel für dieselben Klassen. In diesem Kit ist die Randregel html.style-<name> input.p-inputtext pro Stil spezifischer als .p-inputtext.p-invalid, also ergänzt das Kit input.p-inputtext.p-invalid mit !important: [invalid] allein zeichnet in jedem Stil den Rand --semantic-red-fg, auch im Fokus — das zählt am meisten für die OTP-Kästchen, die keine Formularklassen sehen und nur diesen Weg haben. Die Regeln für die Formularklassen greifen ebenfalls. Der Rand ist trotzdem nur Farbe: Setz die Fehlermeldung neben das Feld und beim OTP neben die Gruppe.',

    responsiveProse:
      'Das OTP-Control ist das mit echter Breitenrechnung: eine Flex-Zeile ohne Wrap-Angabe, also ist seine Breite Länge × Kästchenbreite + (Länge − 1) × 0.5rem. Sechs Kästchen in Standardgröße ergeben 17.5rem (280px) und passen in einen Viewport von 360px; acht ergeben 23.5rem (376px) und laufen über, weil nichts umbricht und nichts scrollt. Unter dieser Breite wechsel auf die kleine Kästchengröße (2rem, damit sind acht Kästchen 19.5rem) oder gib dem Wrapper einen eigenen horizontalen Scroll. Die anderen drei haben überhaupt kein eigenes responsives Verhalten: p-password ist inline-flex und behält sein Input in der Standardbreite des Browsers, solange du nicht fluid setzt; dann wird es eine Flex-Box mit einem Input in voller Breite; p-inputmask hat keine eigene display-Regel und erreicht width: 100% nur, wenn sein inneres Input fluid ist; und ein Feld mit Key-Filter ist, was dein eigenes Input schon war.',

    deadPwTransition:
      'Nichts. Beide Transition-Inputs sind noch an der Komponente deklariert, aber das Overlay, das sie rendert, nimmt stattdessen motionOptions, und keiner der beiden Werte ist irgendwo im Template gebunden.',
    deadBaseInputs:
      'Nichts. Diese vier stammen aus der gemeinsamen Basis-Input-Klasse und bestehen die Typprüfung unter strictTemplates, aber weder die Maske noch das Passwort übernimmt sie in das gerenderte Element. Drück die Regel im Formularmodell aus.',
    deadOtpMask:
      'Maskiert die Kästchen. Trotz des Doc-Kommentars „Mask pattern“ ist das Input ein Boolean: Jeder truthy Wert schaltet jedes Kästchen auf type="password", und der String wird nie als Muster verwendet.',
    deadKfPattern:
      'Setzt das native HTML-Attribut pattern und lässt den Filter auf seinem Standard. Der öffentliche Input-Name des Filters ist der Selektor selbst; das Klassenfeld namens pattern ist nicht das, woran ein Template bindet.',
    deadKfBanana:
      'Kompiliert nicht. Die Direktive deklariert ein eigenes ngModelChange-Output, also landet unter strictTemplates die Property-Hälfte des Two-Way-Bindings bei NgModel und die Event-Hälfte bei KeyFilter — NG8007. Schreib die Hälften getrennt, [ngModel] plus (ngModelChange).',
    deadKfTypo:
      'Schaltet den Filter ab. Ein unbekannter Name fällt auf einen regulären Ausdruck zurück, der auf jedes einzelne Zeichen passt, also kommt jeder Tastendruck durch, und nichts meldet den Tippfehler.',

    formsProse:
      'Alle drei Komponenten registrieren einen Value Accessor, also funktionieren ngModel und formControlName ohne zusätzliche Verdrahtung; der Key-Filter registriert stattdessen einen Validator und schreibt nie einen Wert. Um diese Asymmetrie musst du herumplanen: Im blockierenden Modus meldet der Filter überhaupt keinen Fehler, also wird ein Wert, der aus patchValue, aus einem Autofill oder aus einem ersten Laden kommt, nie angefochten. Gib dem Control zusätzlich einen echten Validator.',

    ptProse:
      'Die OTP-Kästchen werden von der Komponente gerendert und über nichts zugänglich gemacht außer über die Pass-through-Map, die von der gemeinsamen Basiskomponente geerbt ist und in keiner Input-Liste pro Komponente auftaucht. Der Schlüssel ist der Klassenname des Kästchens, und das Objekt, das er nimmt, wird auf das gerenderte Element geschrieben — so erreicht ein Attribut, für das die öffentliche API kein Input hat, etwa das autocomplete-Token one-time-code, die Kästchen.',

    testProse:
      'Ein Spec im echten Setup des Kits (TestBed + Vitest über @angular/build:unit-test), das den Fall prüft, der am härtesten beißt: Ein maskiertes Feld, das halb ausgefüllt verlassen wird, muss behalten, was getippt wurde.',

    i18nPwProse:
      'Aus der Rückfallkette folgen zwei Dinge. Die Komponente liest den eigenen Übersetzungsspeicher der Bibliothek, nicht den TranslationService dieses Kits, also ändern sich die Wörter nicht, wenn die Seitensprache wechselt, es sei denn, dieser Speicher wird ebenfalls befüllt; und die Direktive [pPassword] hat überhaupt keine Abfrage, also bleibt sie Englisch, egal was du mit einem der beiden Speicher machst. Die vier Beschriftungen aus einer übersetzten Map zu übergeben, ist der Weg, der für beide funktioniert, und der einzige, der die Texte am selben Ort hält wie den Rest deiner Texte.',

    i18nFilterProse:
      'Die benannten Masken alpha und alphanum akzeptieren die lateinischen Buchstaben a–z plus den Unterstrich und sonst nichts — kein ä, kein ø, kein ł, kein Kyrillisch, Griechisch, Arabisch oder CJK. Ein Namensfeld mit einer davon ist für einen großen Teil der Menschen, für die es gedacht ist, unbenutzbar, und die Ablehnung ist still. Schränk einen Lizenzschlüssel oder einen Slug ein, wenn es sein muss; nie einen Namen, einen Ort oder Freitext. Wo eine Klasse wirklich über Sprachen hinweg nötig ist, übergib deinen eigenen RegExp mit den Unicode-Property-Escapes für die Schrift, die du akzeptierst, und denk daran, dass der Filter kein Validator ist.',
  };
}
