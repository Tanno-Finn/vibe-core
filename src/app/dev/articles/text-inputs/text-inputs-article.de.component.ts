import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextInputsArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './text-inputs-article.component';

/** German title and note for each static example, keyed by the example's id (the code stays English). */
const EXAMPLE_TEXT_DE: Record<string, { title: string; note: string }> = {
  basic: {
    title: 'Der Standard: Label, Feld, Hinweis',
    note: 'Ein natives Input mit einem nativen Label. Der Hinweis ist eigener Text, per id verknüpft.',
  },
  sizes: {
    title: 'Größen',
    note: 'pSize nimmt small oder large; für den Standard lässt du es weg. Achtung: pSize, nicht size.',
  },
  multiline: {
    title: 'Mehrzeilig: eine Adresse',
    note: 'rows legt die sichtbare Höhe fest und signalisiert, wie viel Text erwartet wird.',
  },
  autoresize: {
    title: 'Mitwachsende Textarea (tipp hinein)',
    note: 'autoResize folgt dem Inhalt. Die max-height muss inline UND in px stehen — siehe die Stolperfalle unter Entwicklung.',
  },
  'group-prefix': {
    title: 'Input-Gruppe: Icon-Präfix und ein Löschen-Button',
    note: 'Tipp etwas ein, dann erscheint das Löschen-Addon. Das Icon ist aria-hidden; der Button trägt einen Namen.',
  },
  'group-suffix': {
    title: 'Input-Gruppe: eine Einheit, die auch im Label steht',
    note: 'Das Addon ist Dekoration. Die Einheit wird im Label wiederholt, denn dort wird sie vorgelesen.',
  },
  states: {
    title: 'Ungültig, schreibgeschützt, deaktiviert',
    note: 'Ungültig koppelt die Optik an aria-invalid und einen verknüpften Fehlertext. Schreibgeschützt ist überhaupt nicht gestylt.',
  },
  fluid: {
    title: 'Volle Breite',
    note: 'fluid setzt die Breite auf 100 %; ein p-fluid-Vorfahr tut dasselbe für jedes teilnehmende Feld, das im selben Template deklariert ist.',
  },
  'icon-field': {
    title: 'Icon im Feld',
    note: 'Auf welcher Seite das Icon sitzt, entscheidet die Reihenfolge im Dokument, nicht iconPosition — die beiden Felder unten unterscheiden sich nur darin, wo p-inputicon steht.',
  },
  mask: {
    title: 'Ein festes Schreibformat',
    note: 'Die Maske führt beim Tippen, statt hinterher abzulehnen. An inputId bindet ein <label for>.',
  },
  password: {
    title: 'Ein Geheimnis, mit Aufdecken und Stärkeanzeige',
    note: 'Das Aufdecken-Element wird als reines Klick-Icon gerendert, ein Tastaturnutzer kann es also nicht bedienen — siehe das Paar unter Verwendung.',
  },
  otp: {
    title: 'Ein Einmalcode',
    note: 'Sechs einzelne Kästchen mit automatischem Weiterspringen und Einfügen. Die Komponente benennt keines davon, also trägt der Gruppen-Wrapper den Namen.',
  },
  keyfilter: {
    title: 'Zeichen schon beim Tippen ablehnen',
    note: 'pKeyFilter blockiert den Tastendruck. Dem Formular meldet es nichts: In diesem Modus ist das Feld immer gültig.',
  },
};

/**
 * German twin of the Text inputs guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, the generated playground
 * markup and code snippets are shared; only the template, the option labels and the
 * titles and notes of the static examples are German. Keep it in step with the English
 * file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs text-inputs`).
 */
@Component({
  selector: 'app-text-inputs-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'text-inputs'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Drei Bausteine, eine Geschichte: <code>pInputText</code> für eine Zeile, <code>pTextarea</code> für viele,
          <code>p-inputgroup</code>, um an beide ein Addon anzuschweißen. Jedes Feld hier unten ist echtes Markup — fang
          im Playground an und lies dann die Varianten darunter.
        </p>

        <!-- Mini playground: live-configure a field and read back the markup. -->
        <section class="pg" aria-label="Playground für Texteingaben">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <!-- p-select is named through [ariaLabelledBy]: its focusable element is a
                   <span role="combobox">, which a <label for> cannot bind to. The Select
                   guide's naming table covers all three patterns. -->
              <div class="pg__field">
                <span class="pg__label" id="pg-kind-label">Steuerelement</span>
                <p-select
                  [ariaLabelledBy]="'pg-kind-label'"
                  size="small"
                  [options]="kindOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgKind()"
                  (ngModelChange)="pgKind.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Größe</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-addon-label">Addon</span>
                <p-select
                  [ariaLabelledBy]="'pg-addon-label'"
                  size="small"
                  [options]="addonOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAddon()"
                  (ngModelChange)="pgAddon.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-invalid">Ungültig</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Deaktiviert</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <div class="field" data-pg-stage>
                  <label class="field__label" for="pg-preview">Projekttitel</label>
                  @if (pgAddon() === 'none') {
                    @if (pgKind() === 'input') {
                      <input
                        pInputText
                        id="pg-preview"
                        type="text"
                        placeholder="Hier tippen"
                        [pSize]="pgSizeInput()"
                        [invalid]="pgInvalid()"
                        [attr.aria-invalid]="pgInvalid() || null"
                        [disabled]="pgDisabled()"
                      />
                    } @else {
                      <textarea
                        pTextarea
                        id="pg-preview"
                        rows="3"
                        placeholder="Hier tippen"
                        [pSize]="pgSizeInput()!"
                        [invalid]="pgInvalid()"
                        [attr.aria-invalid]="pgInvalid() || null"
                        [disabled]="pgDisabled()"
                      ></textarea>
                    }
                  } @else {
                    <p-inputgroup>
                      @if (pgAddon() === 'prefix') {
                        <p-inputgroup-addon><i class="pi pi-search" aria-hidden="true"></i></p-inputgroup-addon>
                      }
                      @if (pgKind() === 'input') {
                        <input
                          pInputText
                          id="pg-preview"
                          type="text"
                          placeholder="Hier tippen"
                          [pSize]="pgSizeInput()"
                          [invalid]="pgInvalid()"
                          [attr.aria-invalid]="pgInvalid() || null"
                          [disabled]="pgDisabled()"
                        />
                      } @else {
                        <textarea
                          pTextarea
                          id="pg-preview"
                          rows="3"
                          placeholder="Hier tippen"
                          [pSize]="pgSizeInput()!"
                          [invalid]="pgInvalid()"
                          [attr.aria-invalid]="pgInvalid() || null"
                          [disabled]="pgDisabled()"
                        ></textarea>
                      }
                      @if (pgAddon() === 'suffix') {
                        <p-inputgroup-addon>EUR</p-inputgroup-addon>
                      }
                      @if (pgAddon() === 'button') {
                        <p-inputgroup-addon>
                          <p-button icon="pi pi-arrow-right" ariaLabel="Übernehmen" [disabled]="pgDisabled()" />
                        </p-inputgroup-addon>
                      }
                    </p-inputgroup>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        <!-- Static variants: each rendered next to the exact markup. -->
        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('basic') {
                  <div class="field">
                    <label class="field__label" for="ex-city">Ort</label>
                    <input pInputText id="ex-city" type="text" autocomplete="address-level2" />
                    <small class="field__hint" id="ex-city-hint">Wohin die Rechnung geschickt wird.</small>
                  </div>
                }
                @case ('sizes') {
                  <div class="field">
                    <label class="field__label" for="ex-small">Klein</label>
                    <input pInputText id="ex-small" type="text" pSize="small" placeholder="pSize=small" />
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-normal">Standard</label>
                    <input pInputText id="ex-normal" type="text" placeholder="ohne pSize" />
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-large">Groß</label>
                    <input pInputText id="ex-large" type="text" pSize="large" placeholder="pSize=large" />
                  </div>
                }
                @case ('multiline') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-address">Postanschrift</label>
                    <textarea
                      pTextarea
                      id="ex-address"
                      rows="4"
                      autocomplete="street-address"
                      placeholder="Straße und Hausnummer&#10;Postleitzahl und Ort&#10;Land"
                    ></textarea>
                    <small class="field__hint">Ein Feld, vier Zeilen — eine Adresse ist keine einzelne Zeile.</small>
                  </div>
                }
                @case ('autoresize') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-auto">Release-Notiz (wächst beim Tippen mit)</label>
                    <textarea
                      pTextarea
                      id="ex-auto"
                      rows="2"
                      autoResize
                      style="max-height: 160px"
                      [ngModel]="noteText()"
                      (ngModelChange)="noteText.set($event)"
                      [attr.aria-describedby]="'ex-auto-count'"
                      placeholder="Tipp ein paar Zeilen und sieh zu, wie das Feld mitgeht"
                    ></textarea>
                    <small class="field__hint" id="ex-auto-count" aria-live="polite">
                      {{ noteText().length }} Zeichen
                    </small>
                  </div>
                }
                @case ('group-prefix') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-search">Im Glossar suchen</label>
                    <p-inputgroup>
                      <p-inputgroup-addon><i class="pi pi-search" aria-hidden="true"></i></p-inputgroup-addon>
                      <input
                        pInputText
                        id="ex-search"
                        type="search"
                        [ngModel]="searchText()"
                        (ngModelChange)="searchText.set($event)"
                        placeholder="Begriff eingeben"
                      />
                      @if (searchText()) {
                        <p-inputgroup-addon>
                          <p-button
                            icon="pi pi-times"
                            severity="secondary"
                            [text]="true"
                            ariaLabel="Suchfeld leeren"
                            (onClick)="searchText.set('')"
                          />
                        </p-inputgroup-addon>
                      }
                    </p-inputgroup>
                  </div>
                }
                @case ('group-suffix') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-budget">Monatsbudget in Euro</label>
                    <p-inputgroup>
                      <p-inputgroup-addon>EUR</p-inputgroup-addon>
                      <input
                        pInputText
                        id="ex-budget"
                        type="text"
                        inputmode="decimal"
                        [attr.aria-describedby]="'ex-budget-hint'"
                      />
                    </p-inputgroup>
                    <small class="field__hint" id="ex-budget-hint">
                      Die Einheit steht noch einmal im Label, weil das Addon nicht vorgelesen wird.
                    </small>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <label class="field__label" for="ex-invalid">Ungültig</label>
                    <input
                      pInputText
                      id="ex-invalid"
                      type="text"
                      [invalid]="true"
                      [attr.aria-invalid]="true"
                      [attr.aria-describedby]="'ex-invalid-msg'"
                      value="keine-mail-adresse"
                    />
                    <small class="field__error" id="ex-invalid-msg">
                      Gib eine Adresse in der Form name&#64;example.org ein.
                    </small>
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-readonly">Schreibgeschützt</label>
                    <input pInputText id="ex-readonly" type="text" readonly value="INV-2026-0042" />
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-disabled">Deaktiviert</label>
                    <input pInputText id="ex-disabled" type="text" disabled value="Gesperrt" />
                  </div>
                }
                @case ('fluid') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-fluid">Feld in voller Breite</label>
                    <input
                      pInputText
                      id="ex-fluid"
                      type="text"
                      [fluid]="true"
                      placeholder="fluid streckt das Feld auf 100 % des Containers"
                    />
                  </div>
                }
                @case ('icon-field') {
                  <div class="field">
                    <label class="field__label" for="ex-icon-lead">Icon vor dem Text</label>
                    <p-iconfield>
                      <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
                      <input pInputText id="ex-icon-lead" type="search" placeholder="Glossar" />
                    </p-iconfield>
                    <label class="field__label" for="ex-icon-trail">Icon nach dem Text</label>
                    <p-iconfield>
                      <input pInputText id="ex-icon-trail" type="text" placeholder="Betrag" />
                      <p-inputicon><i class="pi pi-euro" aria-hidden="true"></i></p-inputicon>
                    </p-iconfield>
                  </div>
                }
                @case ('mask') {
                  <div class="field">
                    <label class="field__label" for="ex-mask">Telefon</label>
                    <p-inputmask
                      inputId="ex-mask"
                      mask="+49 999 9999999"
                      placeholder="+49 ___ _______"
                      [ngModel]="maskValue()"
                      (ngModelChange)="maskValue.set($event)"
                    />
                    <small class="field__hint">
                      Ohne <code>unmask</code> behält der gebundene Wert die festen Zeichen der Maske.
                    </small>
                  </div>
                }
                @case ('password') {
                  <div class="field">
                    <label class="field__label" for="ex-password">Neues Passwort</label>
                    <p-password
                      inputId="ex-password"
                      [toggleMask]="true"
                      [feedback]="true"
                      autocomplete="new-password"
                      [ngModel]="secret()"
                      (ngModelChange)="secret.set($event)"
                    />
                    <small class="field__hint">Fokussiere das Feld, um das Stärke-Overlay zu öffnen.</small>
                  </div>
                }
                @case ('otp') {
                  <div class="field">
                    <span class="field__label" id="ex-otp-label">Sicherheitscode</span>
                    <div role="group" aria-labelledby="ex-otp-label" aria-describedby="ex-otp-hint">
                      <p-inputOtp [length]="6" [integerOnly]="true" [ngModel]="otp()" (ngModelChange)="otp.set($event)" />
                    </div>
                    <small class="field__hint" id="ex-otp-hint">
                      Sechs Ziffern. Füg sie ins erste Kästchen ein, um alle sechs zu füllen.
                    </small>
                  </div>
                }
                @case ('keyfilter') {
                  <div class="field">
                    <label class="field__label" for="ex-keyfilter">Nur ganze Zahlen</label>
                    <input
                      pInputText
                      id="ex-keyfilter"
                      type="text"
                      inputmode="numeric"
                      pKeyFilter="int"
                      placeholder="Buchstaben werden schon beim Tippen abgelehnt"
                    />
                  </div>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welches Steuerelement?</h3>
        <p>
          Ein Textfeld ist die Rückfallebene, nicht der Standard. Greif dazu, wenn die Antwort
          <strong>freier Text ist, den das System nicht aufzählen kann</strong>. Für alles andere gibt es ein besseres
          Steuerelement, und das falsche kostet den Nutzer Tipparbeit, Validierungsfehler oder beides.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Die Antwort ist …</th>
                <th>Steuerelement</th>
                <th>Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Freier Text, eine Zeile (Name, Titel, Suchbegriff)</td>
                <td><code>&lt;input pInputText&gt;</code></td>
                <td>Der Standard. Eine Zeile signalisiert „kurze Antwort erwartet“.</td>
              </tr>
              <tr>
                <td>Freier Text, mehrere Zeilen (Adresse, Kommentar, Beschreibung)</td>
                <td><code>&lt;textarea pTextarea&gt;</code></td>
                <td>Zeilenumbrüche bleiben erhalten, das Feld zeigt, wie viel erwartet wird, und der Text lässt sich wieder lesen.</td>
              </tr>
              <tr>
                <td>Freier Text plus eine feste Einheit, ein Symbol oder eine Aktion</td>
                <td>eins von beiden, in <code>p-inputgroup</code> gehüllt</td>
                <td>Nur Layout — es schweißt ein Addon an die Kante des Felds. Es fügt keine Semantik hinzu (siehe unten).</td>
              </tr>
              <tr>
                <td>Ein Eintrag aus einer bekannten, geschlossenen Liste</td>
                <td><code>p-select</code></td>
                <td>Einen Wert abzutippen, den das System schon kennt, ist Dateneingabe, die dem Nutzer erspart bleiben sollte.</td>
              </tr>
              <tr>
                <td>Eine bekannte Liste, zu lang zum Durchblättern, oder eine Abfrage beim Server</td>
                <td><code>p-autocomplete</code></td>
                <td>Tippen grenzt eine Liste ein; der übernommene Wert bleibt trotzdem eingeschränkt.</td>
              </tr>
              <tr>
                <td>Eine Zahl, die gemessen oder gezählt wird</td>
                <td><code>p-inputnumber</code></td>
                <td>
                  Gebietsschema-gerechte Tausender- und Dezimaltrennzeichen, Pfeiltasten zum Hochzählen, min/max — nichts davon hat ein Textfeld.
                </td>
              </tr>
              <tr>
                <td>Eine Zahl, die der Nutzer ungefähr wählt</td>
                <td><code>p-slider</code></td>
                <td>Die Abwägung gegen ein Zahlenfeld steht im Slider-Guide.</td>
              </tr>
              <tr>
                <td>Ein Geheimnis</td>
                <td><code>p-password</code></td>
                <td>
                  Maskierung plus ein Aufdecken-Schalter und eine optionale Stärkeanzeige;
                  <code>&lt;input type="password" pInputText&gt;</code> gibt dir die Maskierung und sonst nichts.
                </td>
              </tr>
              <tr>
                <td>Ja/Nein</td>
                <td><code>p-checkbox</code> oder <code>p-toggleswitch</code></td>
                <td>Nie ein Textfeld, das nach „ja“ fragt.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Fünf weitere Nachbarn übersieht man leicht, und der erste konkurriert direkt mit dem Suchfeld weiter oben auf
          dieser Seite:
        </p>
        <ul>
          <li>
            <code>p-iconfield</code> — ein Icon <em>innerhalb</em> der eigenen Box des Felds, keine separate Zelle. Zieh
            es einem <code>p-inputgroup</code>-Addon vor, wann immer das Icon Dekoration an einem einzelnen Feld ist: kein
            zusätzliches Element ohne Rolle, keine eckige Ecke und keine Gruppe in voller Breite, die du begrenzen musst.
          </li>
          <li>
            <code>p-inputmask</code> — ein Wert mit festem Schreibformat: eine Telefonnummer, eine IBAN, ein
            Lizenzschlüssel. Die Maske führt beim Tippen, statt hinterher abzulehnen; ihren Vertrag beschreibt der Guide
            zu eingeschränkten Eingaben, dazu <code>p-password</code> und <code>[pKeyFilter]</code>.
          </li>
          <li>
            <code>p-inputotp</code> — ein Einmalcode, als einzelne Kästchen mit dem Einfüge- und Weiterspring-Verhalten,
            das Nutzer erwarten (der Hinweis <code>autocomplete="one-time-code"</code> erreicht die Kästchen nur über <code>pt</code>; ein Input dafür gibt es nicht).
          </li>
          <li>
            <code>p-datepicker</code> — ein Datum. Nie ein Textfeld: Datumsformate sind das Gebietsschema-abhängigste,
            was ein Nutzer überhaupt tippen kann.
          </li>
          <li>
            <code>p-editor</code> — die Obergrenze einer Textarea. Sobald die Antwort Überschriften, Links oder Listen
            braucht, ist reiner Text der falsche Behälter.
          </li>
        </ul>
        <p class="src-note">
          Jede Komponente, die diese Seite nennt, wird mit Optimus UI 2.0.2 ausgeliefert und braucht keine zusätzliche
          Abhängigkeit — jede ist ihr eigener Einstiegspunkt (<code>&#64;openng/optimus-ui/iconfield</code>,
          <code>&#8230;/inputmask</code>, <code>&#8230;/inputnumber</code>, <code>&#8230;/password</code>,
          <code>&#8230;/autocomplete</code> und so weiter). Der Autocomplete-Guide ist geplant; bis er da ist, deckt die
          Tabelle zur Wahl des Steuerelements im Select-Guide die Grenze zwischen Select und Autocomplete ab, und der
          Slider-Guide die zwischen Slider und Zahlenfeld.
        </p>

        <h3>Eine Zeile oder viele?</h3>
        <p>
          Die Frage ist nicht „wie lang ist der Wert“, sondern <strong>kann er einen Zeilenumbruch enthalten</strong>.
          Ein einzeiliges <code>&lt;input&gt;</code> entfernt eingefügte Zeilenumbrüche stillschweigend und scrollt
          horizontal, sodass der Nutzer nie sehen kann, was er getippt hat. Das klassische Opfer ist die
          <strong>Postanschrift</strong>: Sie ist per Definition mehrzeilig, und wer sie in ein Feld quetscht, zwingt den
          Nutzer, ein Trennzeichen zu erfinden, und macht den Wert hinterher unzerlegbar. Teil sie entweder in
          beschriftete einzeilige Felder auf (Straße, Postleitzahl, Ort, Land) oder gib ihr eine
          <code>pTextarea</code> — nie ein <code>pInputText</code>.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Die gerenderten Paare unten sind die drei Fehler, die du dir merken solltest. Das
          <span class="tag tag--bad">Don’t</span> steht links, das <span class="tag tag--good">Do</span>
          rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — der Placeholder ist das Label</span>
            <div class="dd__stage">
              <input pInputText type="text" placeholder="Vollständiger Name" aria-label="Vollständiger Name" />
            </div>
            <p class="dd__why">
              Die Beschriftung verschwindet, sobald der Nutzer tippt, also kann niemand mehr prüfen, wofür das Feld war —
              und kontrastarmes Grau erfüllt nicht das Kontrastbudget eines Labels.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein bleibendes Label, der Placeholder als Beispiel</span>
            <div class="dd__stage">
              <div class="field">
                <label class="field__label" for="dd-name">Vollständiger Name</label>
                <input pInputText id="dd-name" type="text" placeholder="Ada Lovelace" autocomplete="name" />
              </div>
            </div>
            <p class="dd__why">
              Das Label bleibt. Verschwindet der Placeholder, geht nichts verloren — er hat nur die erwartete Form gezeigt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Adresse in einer Zeile</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-addr-bad">Adresse</label>
                <input pInputText id="dd-addr-bad" type="text" value="Hauptstrasse 12, 10115 Berlin, Deutschland" />
              </div>
            </div>
            <p class="dd__why">
              Der Wert scrollt aus dem Blick, eingefügte Zeilenumbrüche fallen weg, und die Komma-Konvention ist eine
              Vermutung des Nutzers, kein Format.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine Textarea, passend zur Antwort bemessen</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-addr-good">Adresse</label>
                <textarea pTextarea id="dd-addr-good" rows="3" autocomplete="street-address">
Hauptstrasse 12
10115 Berlin
Deutschland</textarea>
              </div>
            </div>
            <p class="dd__why">
              <code>rows</code> zeigt, wie viel erwartet wird, Zeilenumbrüche bleiben erhalten, und der ganze Wert ist auf
              einen Blick lesbar.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Addon, das die Bedeutung trägt</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-unit-bad">Budget</label>
                <p-inputgroup>
                  <p-inputgroup-addon>EUR</p-inputgroup-addon>
                  <input pInputText id="dd-unit-bad" type="text" inputmode="decimal" />
                </p-inputgroup>
              </div>
            </div>
            <p class="dd__why">
              Das Addon ist eine Box ohne Rolle. Ein Screenreader sagt „Budget, Eingabefeld“ — die Währung ist für ihn
              unsichtbar, also ist die Zahl mehrdeutig.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Bedeutung im Label, das Addon als Dekoration</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-unit-good">Budget in Euro</label>
                <p-inputgroup>
                  <p-inputgroup-addon>EUR</p-inputgroup-addon>
                  <input pInputText id="dd-unit-good" type="text" inputmode="decimal" />
                </p-inputgroup>
              </div>
            </div>
            <p class="dd__why">Das Label trägt die Einheit; das Addon wiederholt sie optisch. Beide Zielgruppen bekommen sie mit.</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Aufdecken, das nur eine Maus erreicht</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-pw-bad">Passwort</label>
                <p-password inputId="dd-pw-bad" [toggleMask]="true" [feedback]="false" autocomplete="off" />
              </div>
            </div>
            <p class="dd__why">
              <code>toggleMask</code> rendert das Auge als <code>svg</code> mit einem Klick-Handler. Es ist kein Button,
              nimmt keinen Fokus an und hat keinen Namen, also lässt sich der Wert über die Tastatur überhaupt nicht
              aufdecken.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein echter Button neben dem Feld</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-pw-good">Passwort</label>
                <p-inputgroup>
                  <input
                    pInputText
                    id="dd-pw-good"
                    [attr.type]="revealed() ? 'text' : 'password'"
                    autocomplete="off"
                  />
                  <p-inputgroup-addon>
                    <p-button
                      [icon]="revealed() ? 'pi pi-eye-slash' : 'pi pi-eye'"
                      severity="secondary"
                      [text]="true"
                      [ariaLabel]="revealed() ? 'Passwort verbergen' : 'Passwort anzeigen'"
                      (onClick)="revealed.set(!revealed())"
                    />
                  </p-inputgroup-addon>
                </p-inputgroup>
              </div>
            </div>
            <p class="dd__why">
              Ein <code>&lt;button&gt;</code> ist fokussierbar, hat einen Namen, der sich mit dem Zustand ändert, und
              reagiert auf Enter und Leertaste. Die Stärkeanzeige, falls du eine brauchst, kommt als verknüpfter Text unter
              das Feld.
            </p>
          </div>
        </div>

        <h3>Fünf Nachbarn, und wo jeder aufhört</h3>
        <p>
          Jeder davon ist ein Textfeld mit einer zusätzlichen, angeschweißten Idee. Diese zusätzliche Idee ist auch die
          Stelle, an der jeder von ihnen endet: Lies die dritte Spalte, bevor du einen wählst, denn keinem lässt sich das
          ausreden.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Die eine Idee, die sie hinzufügt</th>
                <th>Wo sie aufhört</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-iconfield</code> + <code>p-inputicon</code></td>
                <td>Ein Icon in der eigenen Box des Felds, positioniert über Padding statt über eine zusätzliche Zelle.</td>
                <td>
                  Das Icon-Element hat keine Rolle und trägt keinen Namen — reine Dekoration. An welcher Kante es sitzt,
                  entscheidet die Reihenfolge im Dokument (siehe Design).
                </td>
              </tr>
              <tr>
                <td><code>p-inputmask</code> / <code>[pInputMask]</code></td>
                <td>Eine feste Schreibform, die beim Tippen führt: Telefon, IBAN, Lizenzschlüssel.</td>
                <td>
                  Sie formatiert, sie prüft keine Bedeutung. Der gebundene Wert behält die festen Zeichen der Maske, außer
                  du forderst den unmaskierten an (Guide zu eingeschränkten Eingaben).
                </td>
              </tr>
              <tr>
                <td><code>p-password</code> / <code>[pPassword]</code></td>
                <td>Maskierung, ein optionaler Aufdecken-Schalter und ein Stärke-Overlay beim Fokus.</td>
                <td>
                  Das Aufdecken ist nicht per Tastatur bedienbar, und der Stärketext wird nicht vorgelesen. Nutz das Feld
                  für die Maskierung und bau das Aufdecken selbst.
                </td>
              </tr>
              <tr>
                <td><code>p-inputOtp</code></td>
                <td>Ein Kästchen je Zeichen, mit automatischem Weiterspringen, Zurückspringen per Backspace und Einfügen ins erste.</td>
                <td>
                  Sie benennt nichts: keine <code>id</code>, kein <code>inputId</code>, kein Label-Anker an irgendeinem
                  Kästchen. Ein Wrapper muss den Namen tragen.
                </td>
              </tr>
              <tr>
                <td><code>[pKeyFilter]</code></td>
                <td>Lehnt Zeichen schon beim Tastendruck ab, auf jedem Feld, auf dem sie sitzt.</td>
                <td>
                  Die Ablehnung ist stumm und im Standardmodus für das Formular unsichtbar: Sie meldet keinen
                  Validierungsfehler. Nie der einzige Schutz für einen Wert.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Jede ist ihr eigener Einstiegspunkt — <code>&#64;openng/optimus-ui/iconfield</code>,
          <code>&#8230;/inputicon</code>, <code>&#8230;/inputmask</code>, <code>&#8230;/password</code>,
          <code>&#8230;/inputotp</code>, <code>&#8230;/keyfilter</code> — und keine zieht eine zusätzliche Abhängigkeit
          nach. Zwei davon gibt es doppelt: <code>inputmask</code> und <code>password</code> exportieren je eine
          Komponente <em>und</em> eine Direktive mit unterschiedlichen Inputs — beschrieben im Guide zu eingeschränkten
          Eingaben.
        </p>

        <h3>Wann du <em>nicht</em> zu <code>p-inputgroup</code> greifst</h3>
        <p>
          Es ist ein Flex-Container mit einem Rahmen-Trick, sonst nichts. Nutz es, wenn ein Symbol, eine Einheit oder
          eine Aktion wirklich <em>in</em> den Rahmen des Felds gehört. Nutz es nicht:
        </p>
        <ul>
          <li>
            um einen <strong>Absenden</strong>-Button an ein Formular zu hängen — dieser Button gehört in die
            Aktionszeile des Formulars, wo er in einer vernünftigen Tab-Reihenfolge erreichbar ist und ein Label bekommen
            kann;
          </li>
          <li>
            um <strong>zwei unabhängige Steuerelemente</strong> nebeneinander zu setzen — das ist ein Grid, und sie
            zusammenzuschweißen unterstellt, dass sie ein einziger Wert sind;
          </li>
          <li>
            um eine <code>pTextarea</code> herum — die Flex-Regel der Gruppe zielt auf <code>.p-inputtext</code> und
            <code>.p-inputwrapper</code>, also nimmt eine Textarea den freien Platz nicht ein, und das Addon streckt sich
            auf die volle Höhe der Box;
          </li>
          <li>
            um Information zu tragen, die der Nutzer haben muss — ein Addon hat keine Rolle und keinen zugänglichen
            Namen, ist also schon von der Bauart her Dekoration.
          </li>
        </ul>

        <h3>Placeholder</h3>
        <p>
          Ein Placeholder ist ein <strong>Beispiel für den erwarteten Wert</strong>
          („Ada Lovelace“, „name&#64;example.org“), nie der Name des Felds und nie eine Anweisung, die der Nutzer nach
          dem Losschreiben noch braucht. Bleibende Anweisungen gehören in ein
          <code>&lt;small&gt;</code> unter dem Feld, verknüpft mit <code>aria-describedby</code> — dieser Text bleibt
          sichtbar und wird mit dem Feld vorgelesen. Placeholder-Text hat außerdem den niedrigsten Textkontrast des
          Themes (siehe den Tab Design), ein weiterer Grund, warum er nichts Tragendes enthalten darf.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 3.3.2 Labels or Instructions</a
            >
            — die Anforderung hinter „ein bleibendes Label, kein Placeholder“; eine Beschriftung, die verschwindet, ist
            keine Anweisung.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.3.5 Identify Input Purpose</a
            >
            — die AA-Regel, die das Attribut <code>autocomplete</code> an Feldern Pflicht macht, die die eigenen Daten
            des Nutzers erfassen; die Token-Liste ist normativ.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            — die Untergrenze von 4,5:1, an der die Placeholder-Farbe im Tab Design gemessen wird.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 für den Rahmen des Felds und für den Fokusindikator; der Grund, warum ein Fokussignal, das nur den
            Rahmen einfärbt, gemessen statt angenommen werden muss.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — warum ein Feld, dessen Fokuszustand ein Stylesheet-Override unterdrückt, ein Konformitätsfehler ist und
            kein kosmetischer.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Textarea element</a
            >
            — <code>rows</code>, <code>wrap</code>, <code>maxlength</code> und die CSS-Eigenschaft <code>resize</code>,
            die <code>autoResize</code> abschaltet.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The autocomplete attribute</a
            >
            — die Feldnamen-Tokens (<code>name</code>, <code>street-address</code>, <code>address-level2</code>,
            <code>one-time-code</code>), die die Beispiele verwenden.
          </li>
          <li>
            <a
              href="https://design-system.service.gov.uk/components/text-input/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GOV.UK Design System — Text input</a
            >
            — eine Primärquelle aus dem Produktiveinsatz dazu, wie man ein Feld nach seiner Antwort bemisst, und zu
            Hinweistext gegenüber Placeholder-Text.
          </li>
          <li>
            <a href="https://optimus.openng.org/inputtext/" target="_blank" rel="noopener noreferrer">
              Optimus UI — InputText, Textarea and InputGroup</a
            >
            — die Input-/Output-Oberfläche, die dieser Guide auf die Konventionen des Kits abbildet.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          Es gibt kein Wrapper-Element, über das du nachdenken musst: <code>pInputText</code> und <code>pTextarea</code>
          sind <strong>Direktiven</strong>, also ist das Element, das du schreibst, das Element, das gerendert wird, und
          das Element, das der Browser fokussiert.
        </p>
        <ul>
          <li>
            <strong>Feld</strong> — dein <code>&lt;input&gt;</code> oder <code>&lt;textarea&gt;</code>, mit der
            Root-Klasse <code>p-inputtext p-component</code> oder <code>p-textarea p-component</code>: Hintergrund, 1px
            Rahmen, Radius, Padding, Transition.
          </li>
          <li>
            <strong>Zustandsklassen</strong> — <code>p-filled</code> (nicht leer), <code>p-invalid</code>,
            <code>p-variant-filled</code>, <code>p-inputtext-sm</code> / <code>-lg</code> (eine Textarea mit Größe
            bekommt <code>p-textarea-sm</code> / <code>-lg</code> <em>und</em> <code>p-inputfield-sm</code> /
            <code>-lg</code>), <code>p-inputtext-fluid</code> / <code>p-textarea-fluid</code> und
            <code>p-textarea-resizable</code> unter <code>autoResize</code>.
          </li>
          <li>
            <strong>Gruppe</strong> — <code>p-inputgroup</code> rendert eine <code>display: flex</code>-Box mit
            <code>width: 100%</code>; ein <code>&lt;input&gt;</code> darin bekommt <code>flex: 1 1 auto</code>, weil die
            Regel <code>.p-inputtext</code> und <code>.p-inputwrapper</code> nennt — eine <code>pTextarea</code> ist
            keins von beiden, und genau das ist die Stolperfalle unter Entwicklung.
          </li>
          <li>
            <strong>Addon</strong> — die Zelle <code>.p-inputgroupaddon</code>, zentriert, mit eigenem Hintergrund und
            Rahmen, <code>min-width: 2.5rem</code>. Nur das erste und das letzte Kind der Gruppe behalten ihre
            Eckenradien; alles dazwischen wird eckig.
          </li>
        </ul>
        <p class="src-note">
          Klassen-Maps aus <code>openng-optimus-ui-inputtext.mjs</code>, <code>openng-optimus-ui-textarea.mjs</code> und
          <code>openng-optimus-ui-inputgroup.mjs</code> (Optimus UI 2.0.2); Layout-Literale aus
          <code>&#64;openng/optimus-ui-styles/dist/inputgroup/index.mjs</code>.
        </p>

        <h3>Größenskala — eine Token-Familie für beide Felder</h3>
        <p>
          Die Token-Maps <code>inputtext</code> und <code>textarea</code> von Aura sind Eintrag für Eintrag identisch:
          Jeder Wert löst denselben Slot <code>&#123;form.field.*&#125;</code> auf. Eine Tabelle deckt also beide ab, und
          ein Input neben einer Textarea fluchtet schon von der Bauart her.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>pSize="small"</code></th>
                <th>Standard</th>
                <th><code>pSize="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>padding-block (y)</td>
                <td>0.375rem (6px)</td>
                <td>0.5rem (8px)</td>
                <td>0.625rem (10px)</td>
              </tr>
              <tr>
                <td>padding-inline (x)</td>
                <td>0.625rem (10px)</td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
              </tr>
              <tr>
                <td>border-radius</td>
                <td colspan="3">
                  <code>&#123;border.radius.md&#125;</code> — je visuellem Stil gesetzt: 0 Werkbund, 12px Lernwerkstatt,
                  10px Skizzenbuch, 2px Blaupause (Aura-Standard 6px)
                </td>
              </tr>
              <tr>
                <td>border</td>
                <td colspan="3">
                  1px solid <code>&#123;form.field.border.color&#125;</code>, an einer Textarea auf
                  <code>--control-border</code> umgelenkt; ein <code>&lt;input&gt;</code> bekommt stattdessen Breite
                  und Rahmenfarbe des Stils (Zustände, unten)
                </td>
              </tr>
              <tr>
                <td>height</td>
                <td colspan="3">kein Token — Inhalt + Padding; die Höhe einer Textarea ist <code>rows</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus dem Preset <strong>Aura</strong> (dem aktiven Preset des Kits, <code>app.config.ts</code>):
          <code>&#64;openng/optimus-ui-themes/dist/aura/inputtext/index.mjs</code> und
          <code>&#8230;/aura/textarea/index.mjs</code> lösen beide <code>&#123;form.field.*&#125;</code> aus
          <code>&#8230;/aura/base/index.mjs</code> auf (paddingX 0.75rem / paddingY 0.5rem; sm 0.625 / 0.375; lg 0.875 /
          0.625). Die Standard-Schriftgröße 1rem ist ein Literal in
          <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>; die Radius-Stufen sind jeweils
          <code>presetOverrides.primitive.borderRadius</code> des Stils in <code>ui-styles.ts</code>.
          Beachte: Das Input heißt <code>pSize</code>, nicht <code>size</code> — siehe die Stolperfalle unter Entwicklung.
        </p>

        <h3>Zustände — die Aura-Schicht und was dieses Kit rendert</h3>
        <p>
          Drei Schichten stylen diese Felder. Die <em>Aura-Token-Schicht</em> ist das, was Optimus ausliefert; ihre
          Formularfeld-Farben kommen aus der eigenen Surface-Palette von Aura (slate im hellen, zinc im dunklen Modus),
          die die visuellen Stile des Kits nicht ersetzen — ein Stil verschiebt die Radien und die Akzentfarbe
          (<code>&#123;primary.color&#125;</code>), nicht diese Grautöne. Die <em>Kit-Schicht</em> sind vier Regeln in
          <code>styles.scss</code>: <code>.dark-theme .p-inputtext</code> lenkt vier Element-Tokens um (Hintergrund
          <code>--surface-section</code>, Text <code>--text-color</code>, Rahmen <code>--control-border</code>,
          Placeholder <code>--control-placeholder</code>); <code>.p-textarea</code> lenkt seinen Ruhe-Rahmen in beiden
          Modi auf <code>--control-border</code> um; das Ungültig-Rahmen-Token beider Steuerelemente zeigt auf
          <code>--semantic-red-fg</code>, und <code>input.p-inputtext.p-invalid</code> malt dieses Rot mit
          <code>!important</code>; und <code>.p-inputtext:focus-visible, .p-textarea:focus-visible</code> zeichnet den
          Fokus-Ring des Kits (2px solid <code>--primary-color-fg</code> bei 2px Offset, <code>!important</code>). Die
          <em>Schicht der visuellen Stile</em> ist eine Regel <code>input.p-inputtext</code> in jedem Block
          <code>html.style-*</code>: Sie setzt <code>border-color</code> auf die Rahmenfarbe des Stils
          (<code>--control-border</code> im dunklen Lernwerkstatt), dazu eine kräftigere Breite und, in zwei Stilen,
          einen festen Radius.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Aura-Token (hell / dunkel)</th>
                <th><code>&lt;input pInputText&gt;</code></th>
                <th><code>pTextarea</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ruhezustand</td>
                <td>
                  Hintergrund <code>&#123;surface.0&#125;</code> / <code>&#123;surface.950&#125;</code>; Rahmen
                  <code>&#123;surface.300&#125;</code> / <code>&#123;surface.600&#125;</code>
                </td>
                <td>
                  der Rahmen ist die Rahmenfarbe des Stils (<code>--style-outline</code>, <code>--style-outline-soft</code>
                  in Skizzenbuch, <code>--control-border</code> im dunklen Lernwerkstatt); dunkler Hintergrund
                  <code>--surface-section</code>
                </td>
                <td>
                  1px <code>--control-border</code>, beide Modi; dunkler Hintergrund <code>--surface-section</code> mit
                  <code>--text-color</code> und <code>--control-placeholder</code> — die Füllung des Inputs, eine andere
                  Kante
                </td>
              </tr>
              <tr>
                <td>Hover, Fokus</td>
                <td>
                  Rahmen → <code>&#123;surface.400&#125;</code> / <code>&#123;surface.500&#125;</code> bei Hover,
                  <code>&#123;primary.color&#125;</code> bei Fokus. Der Ring ist <strong>auf null gesetzt</strong>:
                  <code>form.field.focusRing</code> hat die Breite <code>0</code> und den Stil <code>none</code>.
                </td>
                <td colspan="2">
                  wie Aura (<code>:enabled:hover</code> und <code>:enabled:focus</code> stechen die Stilregel aus),
                  <em>plus</em> der Kit-Ring beim Tastaturfokus, der über die Transition des Felds eingeblendet wird
                </td>
              </tr>
              <tr>
                <td>ungültig</td>
                <td>
                  Rahmen → <code>&#123;red.400&#125;</code> / <code>&#123;red.300&#125;</code>; Placeholder →
                  <code>&#123;red.600&#125;</code> / <code>&#123;red.400&#125;</code>
                </td>
                <td>
                  Rahmen <code>--semantic-red-fg</code> bei beiden Auslösern — <code>[invalid]</code> allein
                  eingeschlossen, in jedem Stil, auch im Fokus (Kit-Regel <code>input.p-inputtext.p-invalid</code>);
                  Placeholder-Tönung wie Aura
                </td>
                <td>Rahmen <code>--semantic-red-fg</code> (Kit-Token), beide Auslöser</td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td>
                  <code>opacity: 1</code>, Hintergrund <code>&#123;surface.200&#125;</code> /
                  <code>&#123;surface.700&#125;</code>, Text <code>&#123;surface.500&#125;</code> /
                  <code>&#123;surface.400&#125;</code>
                </td>
                <td colspan="2">wie Aura, beide Modi — das Kit lenkt nur die Tokens des Ruhezustands um</td>
              </tr>
              <tr>
                <td>schreibgeschützt</td>
                <td colspan="3">
                  weder von Aura noch vom Kit noch von einem visuellen Stil gestylt: Ein schreibgeschütztes Feld ist
                  pixelgleich mit einem bearbeitbaren.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura-Spalte: <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (<code>formField</code>, beide
          Farbschemata) über die Selektoren in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>
          und die Regel <code>.p-inputtext.ng-invalid.ng-dirty</code> in <code>openng-optimus-ui-inputtext.mjs:16</code>
          (<code>openng-optimus-ui-textarea.mjs:16</code> für das Gegenstück). Kit-Spalten: die Regeln
          <code>.dark-theme .p-inputtext</code>, <code>.p-textarea</code>, die Ungültig- und die Fokus-Regel sowie die
          vier Blöcke <code>html.style-*</code> in <code>styles.scss</code>; wer gewinnt, folgt aus der
          Selektor-Spezifität — <code>html.style-* input.p-inputtext</code> sticht <code>.p-inputtext.p-invalid</code>
          aus, aber nicht die Zustandsregeln mit drei Klassen, und deshalb trägt die Ungültig-Kante des Kits
          <code>!important</code>. Prüf es in deinem Build: Setz <code>[invalid]</code> an ein unberührtes Feld und lies
          seine berechnete <code>border-color</code>.
        </p>

        <h4>Die Folgen, um die du herumgestalten musst</h4>
        <ul>
          <li>
            Lass Gültigkeit nie allein von Farbe tragen. Das Kit zeichnet die rote Kante schon für <code>[invalid]</code>
            allein — ein Serverfehler, eine Prüfung beim Absenden, bevor das Feld berührt wurde — in jedem visuellen
            Stil; aber eine Kante ist Farbe, und die lässt SC 1.4.1 nicht als einziges Signal gelten. Kopple
            <code>[invalid]</code> an <code>aria-invalid</code>, eine sichtbare Fehlermeldung und
            <code>aria-describedby</code>: Text, der in jedem Stil und Modus lesbar ist.
          </li>
          <li>
            Ein Input und eine Textarea im selben Formular passen nicht ganz zusammen. Die Stilregel nennt
            <code>input.p-inputtext</code>; die Root-Klasse einer Textarea ist <code>p-textarea</code>, also bekommt sie
            die eigene <code>.p-textarea</code>-Kante des Kits (1px <code>--control-border</code>) statt der Rahmenfarbe
            des Stils. Dunkle Füllung, Text und Placeholder sind gleich (<code>.dark-theme .p-textarea</code>,
            <code>--surface-section</code>). Beide Kanten bestehen das Gate; sie unterscheiden sich nur.
            Die Kit-Selektoren zu erweitern ist eine Änderung an <code>styles.scss</code>, nach der das Kontrast-Gate neu
            laufen muss.
          </li>
          <li>
            Außerhalb des Stylesheets dieses Kits stellst du den Ring wieder her, den Aura auf null gesetzt hat: Setz
            <code>--p-inputtext-focus-ring-width</code>, <code>-style</code>, <code>-color</code> und
            <code>-offset</code> an einem <strong>Vorfahren</strong> — einer Klasse am Formular-Wrapper. Dieselben Tokens
            in einem Stylesheet an <code>:root</code> zu deklarieren funktioniert nicht: Optimus deklariert sie zur
            Laufzeit aus einem <code>&lt;style&gt;</code>-Element neu an <code>:root, :host</code>, und das sticht
            frühere <code>:root</code>-Regeln aus.
          </li>
        </ul>
        <pre class="code-block"><code>{{ ringSnippet }}</code></pre>

        <h3>Kontrast von Feldkante, Text und Placeholder</h3>
        <p>
          Der <strong>Placeholder</strong> wird über eine eigene Pseudo-Element-Regel gestylt
          (<code>.p-inputtext::placeholder</code> / <code>.p-textarea::placeholder</code> →
          <code>&#123;form.field.placeholder.color&#125;</code>). Im dunklen Modus lenkt das Kit dieses Token an
          <code>pInputText</code> und <code>pTextarea</code> auf <code>--control-placeholder</code> um, einen Wert, den
          jeder Stil gegen sein eigenes <code>--surface-section</code> wählt, die dunkle Füllung beider. Jedes Paar unten
          misst das Kontrast-Gate, je Stil und Modus, gegen die eigene Füllung des Felds.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paarung</th>
                <th>Tokens</th>
                <th>Spanne über die vier Stile</th>
                <th>Gruppe in CONTRAST.MD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ruhe-Kante, <code>&lt;input pInputText&gt;</code></td>
                <td>die Rahmenfarbe der Stilregel auf <code>inputtext.background</code></td>
                <td>3,25:1 (Blaupause dunkel) bis 18,73:1 (Werkbund hell); Skizzenbuch hell 3,62:1</td>
                <td>„form field edge“ — besteht SC 1.4.11</td>
              </tr>
              <tr>
                <td>Ruhe-Kante, <code>pTextarea</code></td>
                <td><code>--control-border</code> auf <code>textarea.background</code></td>
                <td>3,25:1 (Blaupause dunkel) bis 5,23:1 (Werkbund hell)</td>
                <td>„form field edge“ — besteht SC 1.4.11</td>
              </tr>
              <tr>
                <td>Ungültig-Kante, beide Steuerelemente</td>
                <td><code>--semantic-red-fg</code> auf <code>inputtext.background</code></td>
                <td>5,66:1 (Blaupause dunkel) bis 7,93:1; 6,47:1 im hellen Modus</td>
                <td>„form field edge“ (<code>inputtext.invalid.border.color</code>) — besteht SC 1.4.11</td>
              </tr>
              <tr>
                <td>Placeholder, hell (beide Steuerelemente)</td>
                <td><code>&#123;surface.500&#125;</code> auf <code>&#123;surface.0&#125;</code></td>
                <td>4,76:1 in jedem Stil (Standardpalette)</td>
                <td>„form field text“ — besteht SC 1.4.3</td>
              </tr>
              <tr>
                <td>Placeholder, dunkel (beide Steuerelemente)</td>
                <td><code>--control-placeholder</code> auf <code>--surface-section</code></td>
                <td>4,79:1 (Skizzenbuch) bis 5,93:1 (Lernwerkstatt)</td>
                <td>„form field text“, „field placeholder“ — besteht SC 1.4.3</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilen aus <code>docs/generated/CONTRAST.MD</code>, Gruppen „form field edge“ und „form field text“ unter
          jedem Stil und Modus; der Feldtext selbst liegt dort bei 9,35:1 oder höher. Der Placeholder besteht, aber er
          verschwindet beim ersten Tastendruck — er trägt trotzdem nie etwas Tragendes.
        </p>

        <h3>Geometrie der Input-Gruppe</h3>
        <ul>
          <li>
            Die Gruppe hat <code>width: 100%</code> — sie füllt immer ihren Container. Begrenz das <em>Elternelement</em>,
            nie das Feld darin.
          </li>
          <li>
            <code>align-items: stretch</code>: Das Addon übernimmt die Höhe des Felds, auch die volle Box einer Textarea.
          </li>
          <li>
            Eckenradien sitzen nur am ersten und letzten Kind der Gruppe; das Radius-Token des Addons ist
            <code>inputgroup.addon.border.radius</code>, sein Padding <code>0.5rem</code> und seine Mindestbreite
            <code>2.5rem</code>.
          </li>
          <li>
            Ein Addon mit einem <code>p-button</code> darin lässt sein eigenes Padding weg und macht die Ecken des
            Buttons eckig, sodass der Button die Zelle von Kante zu Kante füllt.
          </li>
          <li>
            Alle Kantenregeln der Gruppe verwenden logische Eigenschaften (<code>border-inline-start</code>,
            <code>border-start-start-radius</code>), also spiegelt sich die Gruppe unter <code>dir="rtl"</code> ohne
            jeden Aufwand korrekt.
          </li>
        </ul>
        <p class="src-note">
          Geometrie aus <code>&#64;openng/optimus-ui-styles/dist/inputgroup/index.mjs</code>; Addon-Tokens aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/inputgroup/index.mjs</code>
          (Padding 0.5rem, minWidth 2.5rem, Hintergrund und Rahmen geerbt von
          <code>&#123;form.field.*&#125;</code>).
        </p>

        <h3>Geometrie des Icon-Felds — und das Input, das sie nicht erreicht</h3>
        <p>
          <code>p-iconfield</code> ist ein Block mit <code>position: relative</code>; <code>p-inputicon</code> ist darin
          absolut positioniert, und das Padding des Felds wird auf der Seite des Icons geöffnet, damit der Text nie
          darunter läuft. Welche Seite das ist, ergibt sich aus drei Regeln mit <code>:first-child</code> /
          <code>:last-child</code> im Stylesheet — also <strong>platziert die Reihenfolge im Dokument das Icon</strong>,
          und ein Icon, das nach dem Input steht, sitzt an der hinteren Kante. Beide sind im Tab Beispiele nebeneinander
          gerendert.
        </p>
        <p>
          Die Komponente bietet außerdem ein Input <code>iconPosition</code>, das eine Klasse
          <code>p-iconfield-left</code> oder <code>p-iconfield-right</code> an den Host setzt. Keine Regel irgendwo in der
          Bibliothek liest eine der beiden Klassen. Daraus folgt, dass das Input wirkungslos ist:
          <code>iconPosition="right"</code> an einem Feld, dessen Icon zuerst steht, ändert auf dem Bildschirm nichts.
        </p>
        <p class="src-note">
          Positionierungsregeln in <code>&#64;openng/optimus-ui-styles/dist/iconfield/index.mjs</code>; die Klassen-Map,
          die die beiden ungelesenen Klassen schreibt, in
          <code>openng-optimus-ui-iconfield.mjs:13</code>–<code>14</code>. Zum Nachstellen: Render ein Icon-Feld mit dem
          Icon-Element vor dem Input und eines mit dem Icon dahinter, und vergleich, an welcher Kante jedes Icon landet.
        </p>

        <h3>Volle Breite — und was diese drei Wrapper bei 360 px tun</h3>
        <p>
          <code>p-fluid</code> malt nichts. Es trägt eine Klasse <code>p-fluid</code>, die kein Stylesheet der
          Bibliothek oder dieses Kits liest; die Breite kommt von den Feldern selbst, von denen jedes ein Flag
          <code>hasFluid</code> auflöst und seinen eigenen Modifier <code>p-inputtext-fluid</code> /
          <code>p-textarea-fluid</code> hinzufügt. Deshalb hat der Wrapper weder Inputs noch Tokens, die man auflisten
          könnte.
        </p>
        <ul>
          <li>
            <strong><code>p-iconfield</code> bei 360 px: Es passiert nichts.</strong> Es ist
            <code>display: block</code> ohne eigene Breite, also behält das Feld darin seine intrinsische Breite — etwa
            20 Zeichen —, und das Icon bleibt an der eigenen Kante des Felds verankert, nicht an der des Viewports. Gib
            dem Feld <code>[fluid]="true"</code> oder dem Wrapper ein fluides Elternelement, wenn es einen schmalen
            Bildschirm füllen soll.
          </li>
          <li>
            <strong><code>p-inputicon</code> bei 360 px: Es passiert nichts.</strong> Es ist absolut positioniert, mit
            einem Token-Abstand von der Feldkante, und es fließt nie um, bricht nie um und schrumpft nie; nur das eigene
            Padding des Felds wächst mit der Größenskala.
          </li>
          <li>
            <strong><code>p-fluid</code> bei 360 px: Es ist die Lösung, nicht das Problem.</strong> Felder darin nehmen
            bei jedem Viewport 100 % des Containers ein, also braucht der Fehlerfall, den es beseitigt — ein Feld mit 20
            Zeichen in einer Spalte von 340 Pixeln —, keine Media Query. Es kann ein Feld nicht <em>schmaler</em> als
            seinen Container machen, und es erreicht kein <code>p-inputgroup</code>, das ohnehin volle Breite hat.
          </li>
        </ul>
        <p class="src-note">
          Das <code>display: block</code> des Icon-Felds und die Abstandsregeln des Icons stehen in
          <code>&#64;openng/optimus-ui-styles/dist/iconfield/index.mjs</code>; die Fluid-Modifier in
          <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code> und
          <code>&#8230;/textarea/index.mjs</code>. <code>p-fluid</code> selbst kommt in keinem Stylesheet der beiden
          Pakete vor. Zum Nachstellen: Verkleinere den Viewport auf 360 px, mit einem Icon-Feld und einem Feld in einem
          Fluid-Wrapper nebeneinander, und vergleich ihre gerenderten Breiten.
        </p>

        <h3>Stand WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide belegen kann — ein Kriterium, das nicht aufgeführt ist, wird nicht
          beansprucht. <strong>Erfüllt:</strong> SC 4.1.2, weil das Element ein natives <code>&lt;input&gt;</code> oder
          <code>&lt;textarea&gt;</code> ist, dessen zugänglicher Name allein das gebundene Label ist — im Accessibility
          Tree gelesen, ohne das Addon; SC 1.4.3 für Feldtext und Placeholder und SC 1.4.11 für die Ruhe-Kante beider
          Steuerelemente, in jedem Stil und Modus (Kontrast-Gate, „form field text“ und „form field edge“); und SC 2.4.7,
          weil die Fokus-Regeln in <code>styles.scss</code> an beiden Steuerelementen in beiden Modi 2px solid
          <code>--primary-color-fg</code> bei 2px Offset zeichnen, obwohl Aura seinen Ring auf null setzt.
          <strong>Bedingt:</strong> SC 1.3.5, das das native Attribut <code>autocomplete</code> nur dort erfüllt, wo die
          Aufrufstelle es setzt; und SC 3.3.2, das ein sichtbares Label braucht und, für die Gültigkeit, eine Textmeldung,
          verknüpft mit <code>aria-describedby</code> — die rote Ungültig-Kante des Kits (per Gate geprüft, „form field
          edge“) ist Farbe, kein Text. <strong>AAA</strong> ist für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Drei getrennte Einstiegspunkte. <code>InputTextModule</code> exportiert die Direktive
          <code>[pInputText]</code>, <code>TextareaModule</code> die Direktive <code>[pTextarea]</code> (alter Alias
          <code>[pInputTextarea]</code>), und die Gruppe braucht sowohl <code>InputGroupModule</code> als auch
          <code>InputGroupAddonModule</code>. Die Element-Selektoren der Gruppe sind <code>&lt;p-inputgroup&gt;</code> und
          <code>&lt;p-inputgroup-addon&gt;</code>; Optimus akzeptiert außerdem die Camel-Formen
          <code>&lt;p-inputGroup&gt;</code> und <code>&lt;p-inputGroupAddon&gt;</code> sowie
          <code>&lt;p-input-group&gt;</code> (PrimeNG 22 hatte sie entfernt; die Selektor-Listen von v21 sind zurück),
          aber das komplett kleingeschriebene
          <code>&lt;p-inputgroupaddon&gt;</code> ist <em>kein</em> Selektor: Unter den <code>strictTemplates</code>
          dieses Kits ist es ein Build-Fehler, <strong>NG8001 „not a known element“</strong>, also benennt der Compiler
          das Problem für dich.
        </p>

        <h3>Inputs — <code>pInputText</code> und <code>pTextarea</code></h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ</th>
                <th>An</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>pSize</code></td>
                <td>'small' | 'large'</td>
                <td>beiden</td>
                <td>
                  Größenstufe; für den Standard weglassen. <strong>Nicht</strong> <code>size</code> — siehe die
                  Stolperfalle unten.
                </td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'outlined' | 'filled'</td>
                <td>beiden</td>
                <td>Überschreibt die globale <code>inputVariant</code>; dieses Kit konfiguriert <code>'outlined'</code>.</td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>beiden</td>
                <td>Nimmt 100 % des Containers ein oder erbt es von einem <code>p-fluid</code>-Vorfahren.</td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>beiden</td>
                <td>Fügt <code>p-invalid</code> hinzu. Nur optisch — <code>aria-invalid</code> setzt du selbst.</td>
              </tr>
              <tr>
                <td><code>autoResize</code></td>
                <td>boolean</td>
                <td>Textarea</td>
                <td>Die Höhe folgt dem Inhalt; setzt außerdem <code>resize: none</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs geprüft gegen die Direktiven-Deklarationen in
          <code>openng-optimus-ui-inputtext.mjs</code> und <code>openng-optimus-ui-textarea.mjs</code> (Optimus UI
          2.0.2). Beachte die Aufteilung: <code>variant</code>, <code>fluid</code> und <code>invalid</code> sind
          Input-<em>Signals</em>, während <code>pSize</code> und <code>autoResize</code> einfache Properties sind —
          Optimus behält dort die Form von v21, also lassen sie sich aus einer Host-Direktive nicht als
          <code>pSize()</code> lesen. Alles andere, was du brauchst — <code>type</code>, <code>placeholder</code>,
          <code>readonly</code>, <code>disabled</code>, <code>required</code>, <code>maxlength</code>,
          <code>rows</code>, <code>autocomplete</code>, <code>inputmode</code> — ist ein natives Attribut, weil das
          Element nativ ist.
        </p>

        <h3>Outputs</h3>
        <p>
          <code>pInputText</code> sendet nichts: Nutz die nativen Events <code>(input)</code>, <code>(change)</code> und
          <code>(blur)</code>. <code>pTextarea</code> fügt genau eins hinzu, <code>(onResize)</code>, das immer dann
          feuert, wenn <code>autoResize</code> die Höhe neu berechnet. Beide Direktiven hören intern auf das native
          Event <code>input</code>, um die Klasse <code>p-filled</code> zu pflegen.
        </p>

        <h3>Formulare — der Unterschied zu <code>p-select</code></h3>
        <p>
          Keine der beiden Direktiven ist ein <code>ControlValueAccessor</code>. Das Value-Binding läuft über Angulars
          eigenen Accessor am nativen Element, und deshalb verhalten sich <code>[(ngModel)]</code>,
          <code>formControlName</code> und Template-Validatoren genau so wie an einem nackten
          <code>&lt;input&gt;</code> — und deshalb funktionieren <code>&lt;label for&gt;</code>, natives
          <code>disabled</code>, natives <code>required</code> und das Autofill des Browsers hier, an
          <code>p-select</code> aber nicht. Ist ein Form-Control angebunden, wendet Optimus Angulars Paar
          <code>ng-invalid</code> / <code>ng-dirty</code> als zweiten Ungültig-Auslöser neben dem Input
          <code>[invalid]</code> an — das Stylesheet in <code>openng-optimus-ui-inputtext.mjs</code> selektiert
          <code>.p-inputtext.ng-invalid.ng-dirty</code> und dessen <code>::placeholder</code>.
        </p>
        <pre class="code-block"><code>{{ formsSnippet }}</code></pre>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>Setz sie an einem Vorfahren — einer Klasse rund um das Formular — und lies die dritte Spalte, bevor du dich auf eine verlässt.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom Property</th>
                <th>Steuert</th>
                <th>Setzt sie sich in diesem Kit durch?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-inputtext-border-radius</code></td>
                <td>Eckenradius (<code>&#123;border.radius.md&#125;</code>, je Stil).</td>
                <td>Ja, außer an einem <code>&lt;input&gt;</code> in Werkbund und Blaupause, deren Stilregel den Radius festlegt.</td>
              </tr>
              <tr>
                <td><code>--p-inputtext-padding-x</code> / <code>-padding-y</code></td>
                <td>Padding in Standardgröße.</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-inputtext-background</code>, <code>-placeholder-color</code></td>
                <td>Füllung im Ruhezustand, Placeholder-Text.</td>
                <td>
                  Hell ja; dunkel nein — das Kit deklariert beide am Element (<code>.dark-theme .p-inputtext</code>), und
                  das schlägt einen geerbten Wert.
                </td>
              </tr>
              <tr>
                <td><code>--p-inputtext-border-color</code></td>
                <td>Rahmen im Ruhezustand.</td>
                <td>Nein an einem <code>&lt;input&gt;</code>, in keinem Stil — die Stilregel setzt <code>border-color</code> selbst.</td>
              </tr>
              <tr>
                <td><code>--p-inputtext-focus-border-color</code>, <code>-invalid-border-color</code></td>
                <td>Rahmen der Zustände.</td>
                <td>
                  Fokus ja. Ungültig nein: Das Kit deklariert es am Element (<code>--semantic-red-fg</code>) und malt die
                  rote Kante des Inputs mit <code>!important</code> (Tab Design, Zustände).
                </td>
              </tr>
              <tr>
                <td>
                  <code>--p-inputtext-focus-ring-width</code> / <code>-style</code> / <code>-color</code> /
                  <code>-offset</code>
                </td>
                <td>Fokus-Umriss — von Aura auf null gesetzt.</td>
                <td>
                  Hier zeichnet die <code>:focus-visible</code>-Regel des Kits den Ring schon und gewinnt mit
                  <code>!important</code>. Ohne diese Regel: ja von einem Vorfahren aus, <strong>nein</strong> von
                  <code>:root</code> aus (Token-Injektion zur Laufzeit, Tab Design).
                </td>
              </tr>
              <tr>
                <td><code>--p-textarea-*</code>, <code>--p-inputgroup-addon-*</code></td>
                <td>Dieselben Slots für die beiden anderen Bausteine.</td>
                <td>
                  Ja, beide Modi, außer <code>--p-textarea-border-color</code>: Das Kit deklariert es an
                  <code>.p-textarea</code> selbst (<code>--control-border</code>), und das schlägt einen geerbten Wert.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Ein begrenzter Geometrie-Override, der in beiden Modi greift:</p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Die Property-Namen folgen dem Präfix <code>p</code>, das in <code>app.config.ts</code> gesetzt ist. Die
          Einschränkungen sind die Regeln <code>.dark-theme .p-inputtext</code>, Fokus und <code>html.style-*</code>
          <code>input.p-inputtext</code> in <code>styles.scss</code>; die Einschränkung zu <code>:root</code> ist die
          Token-Injektion zur Laufzeit, die dort für das Select-Steuerelement dokumentiert ist.
        </p>

        <h3>Stolperfallen, die einen Nachmittag kosten</h3>
        <ul>
          <li>
            <strong><code>size</code> ist nicht das Größen-Input.</strong>
            <code>&lt;input pInputText size="small"&gt;</code> setzt das <em>native</em> Attribut <code>size</code> — einen
            Hinweis auf die Breite in Zeichen — und ist bei einem nicht numerischen Wert ungültiges HTML. Das Input der
            Direktive heißt <code>pSize</code>.
          </li>
          <li>
            <strong>Die beiden <code>pSize</code>-Typen widersprechen sich.</strong> An der Input-Direktive ist es als
            <code>'large' | 'small' | undefined</code> deklariert
            (<code>openng-optimus-ui-inputtext.d.ts:80</code>), an der Textarea aber als <code>'large' | 'small'</code>
            (<code>openng-optimus-ui-textarea.d.ts:78</code>, Optimus UI 2.0.2 — die Abweichung aus v21 überlebt den
            Fork). Unter den <code>strictTemplates</code> dieses Kits kompiliert das Binding einer optionalen Größe an
            einem <code>&lt;input&gt;</code> und scheitert an einer <code>&lt;textarea&gt;</code> — obwohl die Laufzeit
            in beiden Fällen <code>undefined</code> akzeptiert (die Klassen-Map vergleicht mit <code>===</code>).
            Sichere das Binding als nicht null ab oder verzweig das Template.
          </li>
          <li>
            <strong><code>autoResize</code> braucht seine <code>max-height</code> inline <em>und</em> in Pixeln.</strong>
            Die Resize-Routine begrenzt, indem sie <code>parseFloat(style.height)</code> — immer px — mit
            <code>parseFloat(style.maxHeight)</code> vergleicht, und <code>parseFloat</code> verwirft die Einheit. Eine
            <code>max-height</code> aus einer CSS-Klasse ist also unsichtbar (die Box wächst ohne Grenze), und ein
            inline gesetztes <code>max-height: 10rem</code> wird als nackte Zahl <strong>10</strong> gelesen: Jede echte
            Höhe in px übersteigt sie, die Begrenzung greift schon beim allerersten Durchlauf, und das Feld klebt bei
            seinem Maximum mit <code>overflow-y: scroll</code> fest, obwohl es noch leer ist. Schreib
            <code>style="max-height: 160px"</code>.
          </li>
          <li>
            <strong><code>autoResize</code> löst bei jedem Change-Detection-Durchlauf einen Reflow aus.</strong>
            Die Höhe wird im After-Checked-Hook neu berechnet, und jeder Durchlauf schreibt
            <code>height: auto</code> und liest dann <code>scrollHeight</code> — ein erzwungenes synchrones Layout. Bei
            einer Handvoll Feldern kein Problem, in einer langen Liste messbar.
          </li>
          <li>
            <strong>Eine Textarea in einem <code>p-inputgroup</code> flext nicht.</strong> Die Regel
            <code>flex: 1 1 auto</code> der Gruppe nennt <code>.p-inputtext</code> und <code>.p-inputwrapper</code>;
            <code>p-textarea</code> ist keins von beiden.
          </li>
          <li>
            <strong>Die Gruppe hat <code>width: 100%</code>.</strong> Steckst du eine in eine Flex-Zeile mit anderen
            Steuerelementen, frisst sie die Zeile auf.
          </li>
          <li>
            <strong><code>readonly</code> sieht bearbeitbar aus.</strong> Nichts in beiden Schichten stylt es; wenn der
            Nutzer sehen muss, dass ein Wert gesperrt ist, sag es im Text oder nimm <code>disabled</code>.
          </li>
        </ul>

        <h3>Icon-Feld, Icon und Fluid: die ganze API</h3>
        <p>
          Drei Wrapper, kein Wert unter ihnen. Keiner ist ein <code>ControlValueAccessor</code>, keiner sendet ein
          Output, und jedes Template ist ein nacktes <code>&lt;ng-content&gt;</code> — alles, was sie tun, tun sie mit
          einer Klasse an ihrem eigenen Host-Element.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Einstiegspunkt</th>
                <th>Akzeptierter Selektor</th>
                <th>Inputs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>IconFieldModule</code> → <code>p-iconfield</code></td>
                <td><code>p-iconfield</code>, <code>p-iconField</code>, <code>p-icon-field</code></td>
                <td>
                  <code>iconPosition</code> (<code>'left' | 'right'</code>, Standard <code>'left'</code>) — wirkungslos,
                  siehe den Tab Design; <code>styleClass</code>, seit v20 zugunsten von <code>class</code> veraltet;
                  <code>hostName</code>.
                </td>
              </tr>
              <tr>
                <td><code>InputIconModule</code> → <code>p-inputicon</code></td>
                <td>
                  <code>p-inputicon</code>, <code>p-inputIcon</code> — ein <code>p-input-icon</code> gibt es nicht, und
                  die Kebab-Schreibweise scheitert beim Kompilieren des Templates genauso wie das kleingeschriebene
                  <code>p-inputgroupaddon</code>.
                </td>
                <td><code>styleClass</code> (veraltet), <code>hostName</code>. Hier kein <code>iconPosition</code>.</td>
              </tr>
              <tr>
                <td><code>FluidModule</code> → <code>p-fluid</code></td>
                <td>nur <code>p-fluid</code> — kein camelCase- und kein Kebab-Alias</td>
                <td>Keine eigenen — nur die vier, die jede Komponente hier von <code>BaseComponent</code> erbt: <code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> (<code>openng-optimus-ui-basecomponent.mjs:428</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selektoren und Input-Listen gelesen aus den Komponenten-Metadaten in
          <code>openng-optimus-ui-iconfield.mjs:71</code> und <code>:76</code>,
          <code>openng-optimus-ui-inputicon.mjs:43</code> und <code>:48</code>,
          <code>openng-optimus-ui-fluid.mjs:52</code> — deren Deklaration überhaupt keinen Eintrag
          <code>inputs</code> hat. Die eigene Klassen-Map des Icon-Felds steht in
          <code>openng-optimus-ui-iconfield.mjs:9</code>&#8211;<code>17</code>.
        </p>

        <h3>Wie <code>p-fluid</code> ein Feld erreicht — und wo es aufhört</h3>
        <p>
          Der Wrapper stylt seine Nachfahren nicht. Jedes Feld entscheidet selbst: Es injiziert die Komponente
          <code>Fluid</code> als optionalen Vorfahren und löst <code>fluid() ?? !!pcFluid</code> auf. Daraus folgen
          direkt zwei Konsequenzen, und beide sind genau die, die Leute überraschen.
        </p>
        <ul>
          <li>
            <strong>Das eigene Input des Felds gewinnt immer.</strong> <code>[fluid]="true"</code> funktioniert ohne
            Wrapper, und <code>[fluid]="false"</code> nimmt ein einzelnes Feld wieder aus einem Wrapper heraus. Ein
            <code>p-fluid</code> in einem anderen zu verschachteln ändert nichts — das Ergebnis ist ein Boolean.
          </li>
          <li>
            <strong>Die Suche ist mit <code>host: true</code> deklariert, also überschreitet sie keine
            Komponentengrenze.</strong> Angular beendet diese Suche am Host-Element der Komponente, deren Template das
            Feld enthält. Hüllst du deine eigene Komponente mit Feldern in <code>p-fluid</code>, sehen die Inputs in
            ihrem Template es nie. Setz den Wrapper in das Template, das die Felder deklariert.
          </li>
          <li>
            <strong>Nicht jede Komponente macht mit.</strong> Zu denen, die das Flag lesen, gehören
            <code>pInputText</code>, <code>pTextarea</code>, Select, Multiselect, Autocomplete, Datepicker,
            Inputnumber, Cascadeselect, Treeselect, Inputmask, Password und Button. <code>p-iconfield</code> nicht, und
            <code>p-inputgroup</code> auch nicht: Seine Klassen-Map prüft noch <code>instance.fluid</code>, obwohl die
            Komponente <code>styleClass</code> als einziges Input deklariert, also kann <code>p-inputgroup-fluid</code>
            nie angewendet werden — und kein Stylesheet definiert es. Die Gruppe hat ohnehin <code>width: 100%</code>,
            und deshalb ist es niemandem aufgefallen.
          </li>
        </ul>
        <p class="src-note">
          Die Injektion und die Auflösung stehen in <code>openng-optimus-ui-baseinput.mjs:7</code> und <code>:79</code>,
          wiederholt an den beiden Direktiven in <code>openng-optimus-ui-inputtext.mjs:97</code> und
          <code>openng-optimus-ui-textarea.mjs:127</code>; die Modifier-Klassen in
          <code>openng-optimus-ui-inputtext.mjs:33</code> und <code>openng-optimus-ui-textarea.mjs:30</code>. Der
          unerreichbare Zweig der Input-Gruppe ist <code>openng-optimus-ui-inputgroup.mjs:49</code>, verglichen mit
          ihrer Input-Liste in <code>:100</code>. Um die Grenze nachzustellen: Setz ein Feld in eine kleine eigene
          Komponente, hüll diese Komponente in <code>p-fluid</code> und lies die Klassenliste des gerenderten Felds.
        </p>

        <h3>Die eingeschränkten Nachbarn</h3>
        <p>
          <code>p-inputmask</code>, <code>p-password</code>, <code>p-inputOtp</code> und <code>[pKeyFilter]</code>
          stehen im Tab Beispiele, weil sie auf dem Bildschirm zur selben Familie gehören, aber ihr Vertrag —
          Selektoren, Value-Binding, die Inputs der Basisklasse, die deklariert und nie gelesen werden, die Icons zum
          Aufdecken und Leeren, die nur per Zeiger bedienbar sind, die fehlende Identität der OTP-Kästchen, der stumme
          Rückfall des Key-Filters — ist im Guide zu eingeschränkten Eingaben beschrieben, nicht hier.
          <code>p-floatlabel</code> und <code>p-iftalabel</code> gehören ebenso in den Guide zu Input-Labels. Aufgabe
          dieses Guides bleibt die Grenze — zu welchem Steuerelement du greifst und wo jedes davon aufhört —, und das ist
          die Tabelle im Tab Verwendung.
        </p>

        <h4>Tastatur</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td>
                <td>
                  Bewegt den Fokus hinein und hinaus. Ein <code>disabled</code>-Feld wird übersprungen, ein
                  <code>readonly</code>-Feld nicht — es ist fokussierbar und sein Wert auswählbar.
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  Input: sendet das umgebende Formular ab. Textarea: fügt einen Zeilenumbruch ein — eine Textarea kann ein
                  Formular nicht per Tastatur absenden.
                </td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>Nichts. Keines der beiden Steuerelemente setzt bei Escape zurück; eine Abbrechen-Möglichkeit baust du selbst.</td>
              </tr>
              <tr>
                <td>Alles andere</td>
                <td>Natives Textbearbeiten: Auswahl, Zwischenablage, Rückgängig, IME-Eingabe, Autofill des Browsers.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>
        <ul>
          <li>
            <strong>Jedes Feld hat ein echtes Label.</strong> Weil das Element nativ ist, bindet
            <code>&lt;label for="id"&gt;</code> korrekt — zieh es <code>aria-label</code> vor, denn ein sichtbares Label
            hilft allen. Heb dir <code>aria-label</code> für ein Feld auf, dessen Zweck aus seiner Umgebung unverkennbar
            ist, etwa ein Suchfeld unter einer Such-Überschrift; beachte, dass es jedes <code>&lt;label&gt;</code> im
            zugänglichen Namen <em>ersetzt</em>, also lass die beiden nie auseinanderlaufen.
          </li>
          <li>
            <strong>Addons sind keine Namen.</strong> <code>p-inputgroup-addon</code> rendert ein Element ohne Rolle und
            trägt nichts zum zugänglichen Namen des Felds bei. Prüf es im Accessibility Tree des Browsers: Der Name des
            Felds muss der Label-Text sein, ohne das Addon. Trägt das Addon Bedeutung — eine Währung, eine Einheit, ein
            Präfix —, gehört diese Bedeutung ins Label oder in einen Text per <code>aria-describedby</code>.
          </li>
          <li>
            <strong>Gültigkeit ist Text, nicht Farbe.</strong> Setz <code>aria-invalid="true"</code> neben
            <code>[invalid]</code>, zeig den Grund als sichtbaren Text an und verweis mit
            <code>aria-describedby</code> darauf. Die rote Kante des Kits (<code>--semantic-red-fg</code>, Tab Design,
            Zustände) zeigt sehenden Nutzern den Zustand, aber ein Farbwechsel allein ist keine Meldung.
          </li>
          <li>
            <strong>Hinweise gehören zum Feld.</strong> Verknüpf bleibenden Hinweistext per
            <code>aria-describedby</code>, damit er mit dem Feld vorgelesen wird, statt verloren daneben zu stehen.
          </li>
          <li>
            <strong>Benenn den Zweck.</strong> Felder, die die eigenen Daten des Nutzers erfassen, tragen ein
            <code>autocomplete</code>-Token (<code>name</code>, <code>email</code>, <code>street-address</code>,
            <code>postal-code</code>) — WCAG 2.2 SC 1.3.5, und es lässt das Autofill funktionieren.
          </li>
          <li>
            <strong>Sichtbarer Fokus.</strong> Aura setzt den Fokus-Ring der Formularfelder auf null, also ist das
            einzige Standardsignal eines Textfelds eine Rahmen-Tönung — die Regeln
            <code>.p-inputtext:focus-visible, .p-textarea:focus-visible</code> des Kits stellen in beiden Themes einen
            echten 2px-Ring wieder her. Eigene Widgets bekommen von dieser Familienregel nichts: Liefer ihre
            focus-visible-Regel selbst mit und prüf sie in beiden Themes.
          </li>
          <li>
            <strong>Richtige Tastatur, richtige Validierung.</strong> <code>type</code> und <code>inputmode</code>
            entscheiden, welche Bildschirmtastatur erscheint; <code>type="email"</code> oder <code>type="url"</code>
            bringt außerdem native Validierung und eine vom Browser lokalisierte Fehlermeldung mit.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Jedes Feld hat ein bleibendes, programmatisch verknüpftes Label.</li>
          <li>☐ Der Placeholder ist ein Beispiel, nicht das Label, und nichts hängt davon ab, dass man ihn liest.</li>
          <li>☐ Mehrzeilige Antworten nutzen <code>pTextarea</code>, bemessen mit <code>rows</code>.</li>
          <li>
            ☐ Fehler sind sichtbarer Text, verknüpft per <code>aria-describedby</code>, mit gesetztem <code>aria-invalid</code>.
          </li>
          <li>☐ Das Addon einer Input-Gruppe trägt keine Information, die nicht auch im Label steht.</li>
          <li>☐ Der Fokus ist am Feld in <strong>beiden</strong> Themes sichtbar.</li>
          <li>☐ Felder mit persönlichen Daten tragen ein <code>autocomplete</code>-Token.</li>
          <li>☐ Textareas mit <code>autoResize</code> haben eine inline gesetzte <code>max-height</code>.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>) — sie prüft das, was bei einer Input-Gruppe am häufigsten schiefgeht,
          nämlich dass das Addon aus dem zugänglichen Namen herausbleibt:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Welche Strings deine sind</h3>
        <p>
          Alle. Anders als <code>p-select</code>, das ein <code>aria.listLabel</code> und ein fest eingebautes
          Trigger-Label aus der eigenen Übersetzungskonfiguration von Optimus (<code>Optimus.setTranslation</code>)
          beisteuert, liefern diese drei Bausteine <strong>überhaupt keinen sichtbaren String</strong>
          aus — keinen Placeholder, keinen Fehlertext, keine Ansage. Jedes Wort auf dem Bildschirm kommt aus deinem
          Template, also läuft jedes Wort über einen Übersetzungsschlüssel:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Wo</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Label</td>
                <td>Text von <code>&lt;label for&gt;</code></td>
                <td>Der eine String, der nie fehlen darf.</td>
              </tr>
              <tr>
                <td><code>placeholder</code></td>
                <td>Attribut</td>
                <td>Ein Beispielwert — übersetz ihn in ein plausibles <em>lokales</em> Beispiel, statt ihn zu transliterieren.</td>
              </tr>
              <tr>
                <td>Hinweis</td>
                <td><code>&lt;small&gt;</code> + <code>aria-describedby</code></td>
                <td>Wächst beim Übersetzen am stärksten; lass vertikal Platz.</td>
              </tr>
              <tr>
                <td>Fehlertext</td>
                <td><code>&lt;small&gt;</code> + <code>aria-describedby</code></td>
                <td>Sag, was zu tun ist, nicht, was fehlgeschlagen ist.</td>
              </tr>
              <tr>
                <td><code>aria-label</code></td>
                <td>Attribut</td>
                <td>Nur für ein Suchfeld ohne Label, und dann ist es der zugängliche Name — übersetz es.</td>
              </tr>
              <tr>
                <td>Addon-Text</td>
                <td>projizierter Inhalt</td>
                <td>
                  Einheiten und Währungssymbole sind Gebietsschema-Daten, keine Dekoration: Ob EUR vor oder nach der Zahl
                  steht, unterscheidet sich je nach Sprache.
                </td>
              </tr>
              <tr>
                <td>Labels von Icon-Buttons in einem Addon</td>
                <td><code>ariaLabel</code> an <code>p-button</code></td>
                <td>Leicht zu übersehen — ein Kreuz zum Leeren der Suche ohne Namen ist ein unbenanntes Steuerelement.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Konvention des Kits: Lös diese Strings über den <code>TranslationService</code> auf, in einer
          <code>computed()</code>-Label-Map an der Komponente, damit das Feld bei einem Sprachwechsel neu rendert.
          Texteingaben werden in diesem Kit auf eine von drei Arten beschriftet: ein sichtbares
          <code>&lt;label for&gt;</code>; ein visuell verborgenes (<code>class="sr-only"</code>) für ein Suchfeld,
          dessen Lupe die Bedeutung schon trägt; oder ein übersetztes <code>[attr.aria-label]</code>, wo es keine
          Beschriftung zum Verbergen gibt. Das Feld für den Zertifikatsnamen in
          <code>learning-paths-overview.component.ts</code> ist das Muster zum Kopieren für den Fall mit sichtbarem
          Label. Weder <code>p-floatlabel</code> noch <code>p-iftalabel</code>
          wird verwendet: Ein schwebendes Label ist ein Placeholder im Kostüm eines Labels, und es verliert die Abwägung
          im Tab Verwendung.
        </p>

        <h3>Die Nachbarn liefern doch Strings aus — vier davon</h3>
        <p>
          Die Bausteine oben liefern keine aus. <code>p-password</code> ist auf dieser Seite die Ausnahme: Das
          Stärke-Overlay trägt eine Aufforderung und die Wörter weak, medium und strong. Sie sind englische Literale im
          Quelltext, und für sie greift die Komponente auf den eigenen Übersetzungsspeicher von Optimus zurück, nicht
          auf den <code>TranslationService</code> dieses Kits. Daraus folgen zwei Konsequenzen. Die Strings wechseln
          nicht mit der Seitensprache, solange nicht auch der Speicher der Bibliothek gefüllt ist; und die Direktive
          <code>[pPassword]</code>, die dieselben vier Standardwerte, aber keine Abfrage des Speichers hat, bleibt in
          jedem Fall englisch. <code>promptLabel</code>, <code>weakLabel</code>, <code>mediumLabel</code> und
          <code>strongLabel</code> aus einer <code>computed()</code>-Map zu übergeben ist in beiden Fällen der
          verlässliche Weg.
        </p>
        <p>
          Die anderen drei steuern nichts Lesbares bei, tragen aber trotzdem Gewicht fürs Gebietsschema:
        </p>
        <ul>
          <li>
            <strong>Eine Maske ist keine vom Gebietsschema unabhängige Tatsache.</strong> Formen von Telefonnummern,
            Postleitzahlen und Kennungen unterscheiden sich je Land, also gehört der Masken-String selbst neben das Label
            ins Sprach-Bundle — nicht fest ins Template. Dasselbe gilt für den Placeholder, der sie spiegelt, und für
            <code>slotChar</code>, das Zeichen, das für einen leeren Platz angezeigt wird.
          </li>
          <li>
            <strong>Der Name der OTP-Gruppe ist deiner.</strong> Das Steuerelement rendert nichts Lesbares, also sind das
            Label des <code>role="group"</code>-Wrappers und der Hinweis darunter die gesamte Ansage.
          </li>
          <li>
            <strong>Ein Key-Filter kann eine Sprachentscheidung sein.</strong> <code>alpha</code> und
            <code>alphanum</code> akzeptieren die lateinischen Buchstaben <code>a</code>–<code>z</code> und den
            Unterstrich, also lehnt ein Namensfeld damit ä, ø, ł und jede nicht lateinische Schrift ab. Filtere nie einen
            Namen, einen Ort oder freien Text.
          </li>
        </ul>
        <p class="src-note">
          Die vier Standardwerte und die Abfrage des Speichers stehen in <code>openng-optimus-ui-password.mjs</code>: die
          Literale der Direktive in <code>:193</code>–<code>:208</code>, die Rückfallwerte der Komponente in
          <code>:854</code>–<code>:869</code>. Die rein lateinischen Masken sind die Einträge <code>alpha</code> und
          <code>alphanum</code> in <code>openng-optimus-ui-keyfilter.mjs:20</code>–<code>21</code>. Zum Nachstellen:
          Wechsel die Seitensprache bei geöffneter Stärkeanzeige und lies den Text der Anzeige.
        </p>

        <h3>Länge und Layout</h3>
        <ul>
          <li>
            <strong>Labels wachsen.</strong> Deutsch läuft etwa ein Drittel länger als Englisch („Rechnungsanschrift“
            gegenüber „Address“). Labels stehen in diesem Kit über dem Feld, also brechen sie um, statt abgeschnitten zu
            werden — wechsle nicht zu einem Layout mit Labels in derselben Zeile, ohne die längste Sprache neu zu prüfen.
          </li>
          <li>
            <strong>Placeholder auch</strong>, und ein Placeholder wird an der Kante des Felds stillschweigend
            abgeschnitten. Halt das Beispiel in jeder Sprache kurz oder lass es weg.
          </li>
          <li>
            <strong><code>rows</code> ist eine Entscheidung je Sprache.</strong> Dieselbe Aufforderung füllt in einer
            längeren Sprache mehr Zeilen; bemiss die Textarea für die längste, nicht für Englisch.
          </li>
          <li>
            <strong>Varianten in Einfacher Sprache</strong> wollen kurze Labels und eine Idee je Hinweissatz — im
            Hinweis wird ein kompliziertes Feld erklärt, also ist er der String, der die einfache Formulierung am
            dringendsten braucht.
          </li>
        </ul>

        <h3>Eingabemethode und Gebietsschema</h3>
        <ul>
          <li>
            <code>inputmode</code> und <code>type</code> wählen die Bildschirmtastatur.
            <code>inputmode="decimal"</code> zählt dort am meisten, wo das Dezimaltrennzeichen ein Komma ist — aber wenn
            du dich dabei ertappst, das zu parsen, ist das richtige Steuerelement <code>p-inputnumber</code>, das das
            Gebietsschema für dich übernimmt.
          </li>
          <li>
            Blockier die IME-Eingabe nicht mit Tastendruck-Handlern: Ein japanischer oder koreanischer Nutzer tippt
            mehrere Tasten je Zeichen, und ein Handler, der den Wert bei jedem <code>keydown</code> liest, sieht
            Bruchstücke.
          </li>
          <li>
            <code>maxlength</code> zählt UTF-16-Code-Units, keine Zeichen. Ein Emoji oder ein Zeichen außerhalb der
            Basisebene kostet zwei. Ist ein Limit eine Produktregel und keine Datenbankspalte, zähl Grapheme und zeig
            stattdessen einen Zähler an.
          </li>
        </ul>

        <h3>RTL</h3>
        <p>
          Textfelder brauchen keine Arbeit: Der Browser spiegelt das Feld und seinen Text unter
          <code>dir="rtl"</code>, und <code>p-inputgroup</code> drückt jede Kantenregel mit logischen Eigenschaften aus
          (<code>border-inline-start</code>, <code>border-start-start-radius</code>), also wandert ein Präfix-Addon von
          selbst auf die rechte Seite. Zwei Dinge bleiben physisch und sind deine Sache: ein Icon-Glyph, das irgendwohin
          zeigt (ein Pfeil in einem Addon-Button), und jeder Wert, der keine Sprache ist — eine Telefonnummer oder eine
          IBAN liest sich auch in einem RTL-Absatz von links nach rechts, und genau dafür ist <code>dir="ltr"</code> an
          diesem einen Feld da.
        </p>
        <p class="src-note">
          Dieses Kit liefert nur LTR-Sprachen aus, also ist hier heute nichts verdrahtet — der Abschnitt existiert für
          spätere RTL-Erweiterungen. Gruppenregeln gelesen aus
          <code>&#64;openng/optimus-ui-styles/dist/inputgroup/index.mjs</code> (Optimus UI 2.0.2).
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Eine dunkle Textarea
            füllt <code>--surface-section</code> mit <code>--text-color</code> und <code>--control-placeholder</code> wie
            das Input; Zustandstabelle, Kontrasttabelle (Textarea-Kante 3,25&#8211;5,23:1, eine Zeile für den dunklen
            Placeholder) und Agent-Doc sagen das.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: <code>[invalid]</code>
            allein zeichnet jetzt in jedem Stil die <code>--semantic-red-fg</code>-Kante des Kits an einem Input (per
            Gate geprüft, „form field edge“); die Texte zu Zuständen, Kontrast, Theming und WCAG sagen das, und die
            Untergrenze für Feldtext lautet 9,35:1.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile neu geprüft (ADR-0016).
            Zustandsmatrix, Kontrasttabelle, Theming-Tabelle und WCAG-Zusammenfassung beschreiben die heutige
            Kit-Schicht: Die dunkle <code>.p-inputtext</code>-Regel lenkt Tokens um, statt Farben zu erzwingen, also
            besteht der dunkle Placeholder jetzt (Kontrast-Gate, je Stil), und deaktivierte Tönungen werden gerendert; die
            <code>input.p-inputtext</code>-Regel jedes Stils unterdrückt die <code>[invalid]</code>-Rahmentönung (die
            von <code>ng-invalid ng-dirty</code> überlebt); Radien gelten je Stil. Die Verhältnisse für Kante, Text und
            Placeholder sind jetzt aus den Widget-Zeilen des Kontrast-Gates zitiert, einschließlich der neuen
            <code>.p-textarea</code>-Kante des Kits, also scheitert SC 1.4.11 nicht mehr; die Vorschau im Playground trägt
            <code>aria-invalid</code>.
          </li>
          <li>
            <strong>v0.5</strong> — 07.09.2026 — Umfang auf sieben Komponenten erweitert: <code>p-iconfield</code>,
            <code>p-inputicon</code> und <code>p-fluid</code> werden jetzt hier behandelt statt nur verlinkt, mit ihrer
            API, Geometrie, Accessibility-Oberfläche und ihren Fehlerfällen unter Entwicklung und Design, und einer
            Aussage zu schmalen Bildschirmen für jede. Der Vertrag von <code>p-inputmask</code>, <code>p-password</code>,
            <code>p-inputOtp</code> und <code>[pKeyFilter]</code> — Selektoren und Value-Binding, die ungelesenen Inputs
            der Basisklasse, die nur per Zeiger bedienbaren Icons zum Aufdecken und Leeren, die fehlende Identität der
            OTP-Kästchen, der stumme Rückfall des Key-Filters — ist aus dem Tab Entwicklung in den Guide zu
            eingeschränkten Eingaben gewandert; ihre Live-Beispiele und die Grenztabelle im Tab Verwendung bleiben.
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Die camelCase-Selektoren der
            Gruppe sind zurück: <code>p-inputgroup, p-inputGroup, p-input-group</code> und
            <code>p-inputgroup-addon, p-inputGroupAddon</code>, also ist die Aussage aus v0.3, PrimeNG 22 habe sie
            entfernt, Geschichte und nicht Gegenwart; das komplett kleingeschriebene <code>p-inputgroupaddon</code> ist
            weiterhin NG8001. Aura ist zurück auf den 2.x-Tokens, und es sind dieselben Werte, die diese Seite schon
            aufführte — <code>form.field</code>-Paddings 0.75/0.5rem (sm 0.625/0.375, lg 0.875/0.625),
            <code>focusRing</code> weiterhin 0&nbsp;/&nbsp;none&nbsp;/&nbsp;transparent, und die Maps
            <code>inputtext</code> und <code>textarea</code> weiterhin byte-identisch —, also hat sich keine Größen- oder
            Kontrastzahl bewegt. Die Formen der Inputs neu gelesen gegen die Optimus-Typings:
            <code>variant</code>/<code>fluid</code>/<code>invalid</code> sind Input-Signals, <code>pSize</code> und
            <code>autoResize</code> einfache Properties; die Typ-Abweichung bei <code>pSize</code> überlebt in
            <code>:80</code>&nbsp;/&nbsp;<code>:78</code>. Die globale Option heißt <code>inputVariant</code>, nicht
            <code>inputStyle</code>. Die Browser-Messungen vom 23.08.2026 wurden nicht wiederholt.
          </li>
          <li>
            <strong>v0.3</strong> — 23.08.2026 — Neu gemessen gegen PrimeNG 22.1.0 / Themes 3.0.0. Die Fokus-Geschichte
            neu geschrieben: Die Familienregeln des Kits in <code>styles.scss</code> zeichnen jetzt den 2px-Ring an beiden
            Steuerelementen in beiden Themes (im Browser geprüft; der Ring wird über die outline-color-Transition von
            PrimeNG eingeblendet), also ist SC 2.4.7 von nicht erfüllt/bedingt zu erfüllt gewechselt. PrimeNG 22 hat die
            camelCase-Selektoren der Gruppe entfernt (<code>p-inputGroup</code>, <code>p-inputGroupAddon</code>). Aura 3.0
            hat die Farbwerte der Formularfelder behalten, also gelten die gemessenen Kontrastzahlen weiter.
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — Zusammenfassung zum Stand WCAG 2.2 im Tab Design ergänzt: gemessene
            Kriterien zusammengefasst als erfüllt / nicht erfüllt / bedingt, nicht gemessene Kriterien ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erster Sammel-Guide: die drei Bausteine zur Texteingabe, die Tabelle zur
            Wahl des Steuerelements, die Zustandsmatrix aus Aura und Kit je Theme und das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TextInputsArticleDeComponent extends TextInputsArticleComponent {
  /** The playground's option labels in German; the values stay as the English class reads them. */
  override readonly kindOptions = [
    { label: 'Einzeilig (pInputText)', value: 'input' },
    { label: 'Mehrzeilig (pTextarea)', value: 'textarea' },
  ];
  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];
  override readonly addonOptions = [
    { label: 'Keins', value: 'none' },
    { label: 'Icon als Präfix', value: 'prefix' },
    { label: 'Einheit als Suffix', value: 'suffix' },
    { label: 'Button am Ende', value: 'button' },
  ];

  /** The static examples with German title and note; id and code come unchanged from the English class. */
  override readonly examples: TextInputsArticleComponent['examples'] = this.examples.map((ex) => ({ ...ex, ...EXAMPLE_TEXT_DE[ex.id] }));
}
