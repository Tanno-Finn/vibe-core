import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { TreeNode } from '@openng/optimus-ui/api';
import { TreeArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './tree-article.component';

/** German organization-chart data; one fresh copy per field, as in the English base. */
const ORG_DATA_DE = (): TreeNode[] => [
  {
    label: 'Chefredaktion',
    expanded: true,
    children: [
      { label: 'Wissenschaftsressort', expanded: true, children: [{ label: 'Datenteam' }] },
      { label: 'Designressort' },
    ],
  },
];

/**
 * German twin of the Tree, TreeTable, and TreeSelect guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the demo data labels and the visible
 * strings in `m` are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs tree`).
 */
@Component({
  selector: 'app-tree-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tree'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein <code>TreeNode[]</code>, drei Widgets. Sie teilen sich die Daten und sonst fast nichts: Der Tree ist eine
          Liste aus <code>treeitem</code>s, die Tree-Table ein <code>treegrid</code>, dessen Zeilen du selbst schreibst,
          und das Tree-Select eine Combobox, an der ein Tree hängt. Welches du wählst, entscheidet, wem die Tastatur gehört.
        </p>

        <h3>Die drei Formen</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="lbl">p-tree</span>
            <p-tree [value]="nodes" selectionMode="single" ariaLabel="Beispielordner" />
          </div>
          <div class="col">
            <span class="lbl">p-treeSelect</span>
            <p-treeSelect [options]="nodes" ariaLabel="Zielordner" placeholder="Wähle einen Ordner" />
          </div>
        </div>
        <p class="src-note">
          Der Tree rendert <code>role="tree"</code> auf seiner Liste und <code>role="treeitem"</code> je Knoten
          (<code>openng-optimus-ui-tree.mjs:1997</code> für diesen nicht virtuellen Fall, <code>:1962</code> unter
          <code>virtualScroll</code>, <code>:618</code>); das Tree-Select rendert ein verstecktes
          <code>role="combobox"</code>-Input vor derselben Komponente
          (<code>openng-optimus-ui-treeselect.mjs:934</code>).
        </p>

        <h3>Dieselben Daten als Treegrid</h3>
        <div class="stage">
          <p-treeTable [value]="nodes" [pt]="treeTablePt">
            <ng-template pTemplate="caption">Beispielordner, nach Größe</ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Größe</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
              <tr [ttRow]="rowNode">
                <td>
                  <p-treeTableToggler [rowNode]="rowNode" />
                  {{ rowData.name }}
                </td>
                <td>{{ rowData.size }}</td>
              </tr>
            </ng-template>
          </p-treeTable>
        </div>
        <p class="src-note">
          Das <code>role="treegrid"</code> sitzt auf dem Table-Element
          (<code>openng-optimus-ui-treetable.mjs:2731</code>); <code>role="row"</code>, <code>aria-expanded</code> und
          <code>aria-level</code> kommen nur über die Direktive <code>ttRow</code> auf der Zeile
          (<code>:5081</code>) — eine Zeile ohne sie ist ein schlichtes <code>&lt;tr&gt;</code>. Das
          <code>caption</code>-Template ist keine <code>&lt;caption&gt;</code>: Es rendert ein
          <code>&lt;div&gt;</code> als Header vor der Tabelle (<code>:2678</code>), deshalb kommt der Name hier stattdessen aus
          <code>[pt]="&#123; table: &#123; 'aria-label': … &#125; &#125;"</code>.
        </p>

        <h3>Was jede davon ausgibt</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Knotenattribute aus <code>openng-optimus-ui-tree.mjs:609-618</code>; Zeilenattribute aus dem Host-Block von
          <code>ttRow</code> in <code>openng-optimus-ui-treetable.mjs:5081</code>; Combobox-Attribute aus
          <code>openng-optimus-ui-treeselect.mjs:934-946</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Benenne das Control, nicht den Wert</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Tree-Select ohne benennendes Input</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ nameBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ariaLabel, damit der Name die Auswahl überlebt</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ nameGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Die Fallback-Kette ist <code>ariaLabel || (label === 'p-emptylabel' ? undefined : label)</code>
          (<code>openng-optimus-ui-treeselect.mjs:946</code>), und <code>label</code> sind die verbundenen gewählten
          Labels, sonst der Placeholder, sonst undefined (<code>:913</code>). Prüf es im Accessibility Tree des
          Browsers: Der Name der Combobox muss das Feldlabel sein, nicht die aktuelle Auswahl.
        </p>

        <h3>Behalte in jeder Zeile einen Toggler</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Zeile, deren erste Zelle reiner Text ist</span>
            <div class="dd__stage">
              <p-treeTable [value]="nodes" [pt]="togglerBadPt">
                <ng-template pTemplate="header">
                  <tr>
                    <th scope="col">Name</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                  <tr [ttRow]="rowNode">
                    <td>{{ rowData.name }}</td>
                  </tr>
                </ng-template>
              </p-treeTable>
            </div>
            <p class="dd__why">{{ m.ddTogglerBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — der Toggler zuerst, Blätter eingeschlossen</span>
            <div class="dd__stage">
              <p-treeTable [value]="nodes" [pt]="togglerGoodPt">
                <ng-template pTemplate="header">
                  <tr>
                    <th scope="col">Name</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                  <tr [ttRow]="rowNode">
                    <td>
                      <p-treeTableToggler [rowNode]="rowNode" />
                      {{ rowData.name }}
                    </td>
                  </tr>
                </ng-template>
              </p-treeTable>
            </div>
            <p class="dd__why">{{ m.ddTogglerGood }}</p>
          </div>
        </div>
        <p class="src-note">
          <code>onArrowRightKey</code> liest <code>findSingle(currentTarget, 'button').style</code> ohne Null-Prüfung
          (<code>openng-optimus-ui-treetable.mjs:4980</code>); der Toggler rendert auch für Blätter und versteckt sich
          mit <code>[style.visibility]</code> (<code>:5141-5151</code>), deshalb ist er der sichere Weg, diesen Lookup
          zu bedienen.
        </p>

        <h3>Welche Komponente für welche Aufgabe</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Aufgabe</th>
                <th scope="col">Komponente</th>
                <th scope="col">Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hierarchie, ein Label je Zeile</td>
                <td><code>p-tree</code></td>
                <td>{{ m.pickTree }}</td>
              </tr>
              <tr>
                <td>Hierarchie mit Spalten</td>
                <td><code>p-treeTable</code></td>
                <td>{{ m.pickTreeTable }}</td>
              </tr>
              <tr>
                <td>Hierarchie als Formularwert</td>
                <td><code>p-treeSelect</code></td>
                <td>{{ m.pickTreeSelect }}</td>
              </tr>
              <tr>
                <td>Eine Ebene, keine Verschachtelung</td>
                <td><code>p-select</code> / <code>p-listbox</code></td>
                <td>{{ m.pickFlat }}</td>
              </tr>
              <tr>
                <td>Berichtslinien als Diagramm gezeichnet</td>
                <td><code>p-organizationChart</code>, neben einem <code>p-tree</code></td>
                <td>{{ m.pickOrgChart }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rollen je Zeile abgelesen aus <code>openng-optimus-ui-tree.mjs:1997</code>,
          <code>openng-optimus-ui-treetable.mjs:2731</code> und
          <code>openng-optimus-ui-treeselect.mjs:934</code>; das Organigramm gibt überhaupt keine Rolle aus
          (<code>openng-optimus-ui-organizationchart.mjs:164-225</code>).
        </p>

        <h3>Ein Organigramm ist ein Bild, kein Tree</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Diagramm als einziger Weg, einen Knoten zu lesen oder zu wählen</span>
            <div class="dd__stage dd__stage--scroll">
              <p-organizationChart [value]="orgNodes" [collapsible]="true" selectionMode="single" />
            </div>
            <p class="dd__why">{{ m.ddOrgBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein benannter Tree trägt den Inhalt; ein statisches Diagramm illustriert ihn nur</span>
            <div class="dd__stage dd__stage--col">
              <p-tree [value]="orgTreeNodes" ariaLabel="Berichtslinien" />
              <div class="dd__scroll" aria-hidden="true">
                <p-organizationChart [value]="orgTreeNodes" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddOrgGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Der Knoten ist ein <code>&lt;div (click)&gt;</code> ohne tabindex und ohne Key-Handler
          (<code>openng-optimus-ui-organizationchart.mjs:169</code>); der Toggle ist ein
          <code>&lt;a tabindex="0"&gt;</code> ohne <code>href</code>, Rolle, Namen und <code>aria-expanded</code>
          (<code>:180</code>), gerendert nur unter <code>collapsible</code> (<code>:178</code>). Ohne
          <code>collapsible</code> und <code>selectionMode</code> enthält das Diagramm nichts Fokussierbares, und genau
          das macht <code>aria-hidden</code> auf seinem Wrapper sicher.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ annotatedSnippet }}</code></pre>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Aura-Token-Kette, p-tree</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Teil</th>
                <th scope="col">Token</th>
                <th scope="col">Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Knoten-Padding</td>
                <td><code>tree.node.padding</code></td>
                <td>{{ m.tkNodePadding }}</td>
              </tr>
              <tr>
                <td>Hintergrund des gewählten Knotens</td>
                <td><code>tree.node.selectedBackground</code></td>
                <td>{{ m.tkSelectedBg }}</td>
              </tr>
              <tr>
                <td>Offset des Fokus-Rings am Knoten</td>
                <td><code>tree.node.focusRing.offset</code></td>
                <td>{{ m.tkFocusOffset }}</td>
              </tr>
              <tr>
                <td>Größe des Toggle-Buttons</td>
                <td><code>tree.nodeToggleButton.size</code></td>
                <td>{{ m.tkToggleSize }}</td>
              </tr>
              <tr>
                <td>Einzug der Gruppe</td>
                <td><code>tree.indent</code></td>
                <td>{{ m.tkIndent }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und Werte aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/tree/index.mjs</code>, dessen Default-Export
          <code>&#123;root,node,nodeIcon,nodeToggleButton,loadingIcon,filter,css&#125;</code> ist — der Toggle-Button
          ist ein Schlüssel der obersten Ebene, kein Kind von <code>node</code>. Die Regeln, die die Token verbrauchen,
          liegen in <code>&#64;openng/optimus-ui-styles/dist/tree/index.mjs</code> und schreiben dieselben Werte anders
          (<code>dt('tree.node.toggle.button.size')</code>, <code>dt('tree.node.selected.background')</code>) — das
          Preset trägt die flachen Namen, das Stylesheet die gepunkteten.
        </p>

        <h3>Zwei Einzüge, ein Input</h3>
        <p>{{ m.indentProse }}</p>
        <p class="src-note">
          Seite des Stylesheets: <code>padding-inline-start: dt('tree.indent')</code> auf
          <code>.p-tree-node-children</code> (<code>&#64;openng/optimus-ui-styles/dist/tree/index.mjs:27</code>).
          Seite des Templates: <code>[style.paddingLeft]="level * indentation + 'rem'"</code>
          (<code>openng-optimus-ui-tree.mjs:627</code>), gespeist von <code>[indentation]="indentation"</code> allein im
          Virtual-Scroll-Zweig (<code>:1978</code>); das empfangende Feld ist ohne Default deklariert
          (<code>:158</code>), also erreicht <code>Tree.indentation = 1.5</code> (<code>:1094</code>) es nur dort.
        </p>

        <h3>Kontrast, je Stil und Modus</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Knotenlabel auf dem Tree-Hintergrund, je Stil und Modus
            </caption>
            <thead>
              <tr>
                <th scope="col">Stil</th>
                <th scope="col">Hell</th>
                <th scope="col">Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Knotenlabel ist <code>&#123;text.color&#125;</code> auf dem
          <code>&#123;content.background&#125;</code> der Wurzel (<code>&#64;openng/optimus-ui-themes/dist/aura/tree/index.mjs</code>),
          nicht das <code>--text-color</code> des Kits. <code>docs/generated/CONTRAST.MD</code> hat keine Tree-Zeile, aber
          seine Zeilen „content panel“ messen genau dieses Paar (<code>text.color</code> auf <code>content.background</code>,
          <code>&#123;surface.0&#125;</code> / <code>&#123;surface.900&#125;</code>), Kriterium SC 1.4.3 (verlangt
          4,5:1).
        </p>
        <p class="src-note">{{ m.crGap }}</p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          Weder <code>&#64;openng/optimus-ui-styles/dist/tree/index.mjs</code> noch
          <code>&#64;openng/optimus-ui-styles/dist/treetable/index.mjs</code> noch
          <code>&#64;openng/optimus-ui-styles/dist/treeselect/index.mjs</code> enthält eine Media Query.
          <code>.p-tree-root</code> setzt <code>overflow: auto</code>, seine Höhe kommt aus
          <code>[style.max-height]="scrollHeight"</code> (<code>openng-optimus-ui-tree.mjs:1995</code>); das
          Tree-Stylesheet deklariert nirgends <code>white-space</code>, während das Label des Tree-Selects
          <code>white-space: nowrap</code> mit <code>text-overflow: ellipsis</code> setzt.
        </p>
        <p>{{ m.responsiveOrg }}</p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/organizationchart/index.mjs</code> enthält keine Media Query und
          keine Overflow-Regel; die Tabelle des Diagramms wird mit <code>margin: 0 auto</code> zentriert.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Tastatur, Taste für Taste</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Taste</th>
                <th scope="col"><code>p-tree</code></th>
                <th scope="col"><code>p-treeTable</code></th>
                <th scope="col"><code>p-treeSelect</code>-Input</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pfeil nach unten / Pfeil nach oben</td>
                <td>{{ m.kbTreeUpDown }}</td>
                <td>{{ m.kbTtUpDown }}</td>
                <td>{{ m.kbTsDown }}</td>
              </tr>
              <tr>
                <td>Pfeil nach rechts</td>
                <td>{{ m.kbTreeRight }}</td>
                <td>{{ m.kbTtRight }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
              <tr>
                <td>Pfeil nach links</td>
                <td>{{ m.kbTreeLeft }}</td>
                <td>{{ m.kbTtLeft }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
              <tr>
                <td>Enter / Leertaste</td>
                <td>{{ m.kbTreeEnter }}</td>
                <td>{{ m.kbTtEnter }}</td>
                <td>{{ m.kbTsEnter }}</td>
              </tr>
              <tr>
                <td>Pos1 / Ende</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbTtHomeEnd }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
              <tr>
                <td>Esc</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbTsEscape }}</td>
              </tr>
              <tr>
                <td>Tippsuche (Typeahead)</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Switch-Anweisungen abgelesen aus <code>openng-optimus-ui-tree.mjs:439</code>,
          <code>openng-optimus-ui-treetable.mjs:4939</code> (plus <code>:4252</code> für Enter und Leertaste) und
          <code>openng-optimus-ui-treeselect.mjs:661</code>. Eine Taste, die in einem Switch fehlt, ist eine Taste, die
          die Komponente nicht behandelt.
        </p>

        <h3>Labels: ein Input, ein Config-Schlüssel, ein Literal</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">String</th>
                <th scope="col">Woher er kommt</th>
                <th scope="col">Erreichbar?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Toggle-Button von <code>p-tree</code></td>
                <td>{{ m.lblTreeToggler }}</td>
                <td>{{ m.lblNo }}</td>
              </tr>
              <tr>
                <td>Toggle-Button von <code>p-treeTable</code></td>
                <td>{{ m.lblTtToggler }}</td>
                <td>{{ m.lblConfig }}</td>
              </tr>
              <tr>
                <td>Dropdown-Trigger von <code>p-treeSelect</code></td>
                <td>{{ m.lblTsTrigger }}</td>
                <td>{{ m.lblNo }}</td>
              </tr>
              <tr>
                <td>Filterfeld von <code>p-tree</code></td>
                <td>{{ m.lblTreeFilter }}</td>
                <td>{{ m.lblInput }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>togglerAriaLabel</code> ist bei <code>openng-optimus-ui-tree.mjs:1014</code> deklariert und in keinem
          der beiden Knoten-Templates dieser Datei gebunden; der Label-Getter der Tree-Table ist
          <code>openng-optimus-ui-treetable.mjs:5118</code>; das Trigger-Label des Tree-Selects ist das Literal bei
          <code>openng-optimus-ui-treeselect.mjs:981</code>.
        </p>

        <h3>Was p-organizationChart assistiven Technologien gibt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Teil</th>
                <th scope="col">Was gerendert wird</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Struktur</td>
                <td>{{ m.ocStructure }}</td>
              </tr>
              <tr>
                <td>Knoten</td>
                <td>{{ m.ocNode }}</td>
              </tr>
              <tr>
                <td>Toggle (<code>collapsible</code>)</td>
                <td>{{ m.ocToggle }}</td>
              </tr>
              <tr>
                <td>Auswahl (<code>selectionMode</code>)</td>
                <td>{{ m.ocSelection }}</td>
              </tr>
              <tr>
                <td>Eingeklappter Zweig</td>
                <td>{{ m.ocCollapsed }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen aus <code>openng-optimus-ui-organizationchart.mjs</code>, Optimus UI 2.0.2: die Wurzeltabelle
          (<code>:498</code>), das Knoten-Template (<code>:164-225</code>), <code>onNodeClick</code>
          (<code>:440-474</code>), <code>getChildStyle</code> (<code>:123-127</code>) und die Klasse für die Auswahl
          (<code>:21</code>). Die Datei enthält kein <code>role=</code> und kein <code>aria-</code>-Attribut.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.chkName }}</li>
          <li>{{ m.chkCaption }}</li>
          <li>{{ m.chkToggler }}</li>
          <li>{{ m.chkTabstops }}</li>
          <li>{{ m.chkExpanded }}</li>
          <li>{{ m.chkState }}</li>
          <li>{{ m.chkOrgChart }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Wo jeder String lebt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">String</th>
                <th scope="col">Quelle</th>
                <th scope="col">Was du tust</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Knotenlabels</td>
                <td>{{ m.i18nNodesSrc }}</td>
                <td>{{ m.i18nNodesDo }}</td>
              </tr>
              <tr>
                <td>Name des Trees / Felds</td>
                <td>{{ m.i18nNameSrc }}</td>
                <td>{{ m.i18nNameDo }}</td>
              </tr>
              <tr>
                <td>Filter-Placeholder</td>
                <td>{{ m.i18nFilterSrc }}</td>
                <td>{{ m.i18nFilterDo }}</td>
              </tr>
              <tr>
                <td>Zeile auf- / zuklappen</td>
                <td>{{ m.i18nExpandSrc }}</td>
                <td>{{ m.i18nExpandDo }}</td>
              </tr>
              <tr>
                <td>Trigger des Tree-Selects</td>
                <td>{{ m.i18nTriggerSrc }}</td>
                <td>{{ m.i18nTriggerDo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Config-Schlüssel aus <code>openng-optimus-ui-treetable.mjs:5118</code>; das nicht übersetzbare Literal aus
          <code>openng-optimus-ui-treeselect.mjs:981</code>. Die eigene Konvention des Kits ist ein einziger
          <code>setTranslation</code>-Merge des <code>aria</code>-Blocks, gesteuert vom Übersetzungsdienst — die
          Referenzimplementierung ist <code>syncAriaStrings</code> in <code>OptimusA11yService</code>, ausgeführt von der Root-App-Komponente.
        </p>

        <h3>Die zwei Zeilenschlüssel ergänzen</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          {{ m.i18nMergeNote }} (<code>openng-optimus-ui-config.mjs:246</code>)
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="checklist">
          <li>{{ m.hist4 }}</li>
          <li>{{ m.hist3 }}</li>
          <li>{{ m.hist2 }}</li>
          <li>{{ m.hist1 }}</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TreeArticleDeComponent extends TreeArticleComponent {
  override readonly nodes: TreeNode[] = [
    {
      key: '0',
      label: 'Dokumente',
      data: { name: 'Dokumente', size: '75 kb' },
      expanded: true,
      children: [
        { key: '0-0', label: 'Rechnungen', data: { name: 'Rechnungen', size: '30 kb' } },
        { key: '0-1', label: 'Verträge', data: { name: 'Verträge', size: '45 kb' } },
      ],
    },
    {
      key: '1',
      label: 'Bilder',
      data: { name: 'Bilder', size: '150 kb' },
      children: [{ key: '1-0', label: 'Urlaub', data: { name: 'Urlaub', size: '150 kb' } }],
    },
  ];

  override readonly orgNodes: TreeNode[] = ORG_DATA_DE();
  override readonly orgTreeNodes: TreeNode[] = ORG_DATA_DE();

  override readonly treeTablePt = { table: { 'aria-label': 'Beispielordner, nach Größe' } };
  override readonly togglerBadPt = { table: { 'aria-label': 'Ordner ohne Toggler-Spalte' } };
  override readonly togglerGoodPt = { table: { 'aria-label': 'Ordner mit Toggler-Spalte' } };

  override readonly m = {
    ddNameBad:
      'Ohne ariaLabel und ohne ariaLabelledBy fällt der Name der Combobox auf den label-Ausdruck zurück: die verbundenen gewählten Labels, sobald etwas gewählt ist, davor der Placeholder, und gar nichts, wenn es auch keinen Placeholder gibt. Der Name ändert sich jedes Mal, wenn sich der Wert ändert.',
    ddNameGood:
      'ariaLabel gewinnt den Fallback direkt, also wird das Feld danach angesagt, wofür es da ist, statt danach, was gerade darin steht, und die Ansage bewegt sich nicht, wenn sich die Auswahl bewegt.',
    ddTogglerBad:
      'Kein Toggler, also überhaupt kein Weg, einen Zweig per Zeiger zu öffnen — und Pfeil nach rechts auf so einer Zeile sucht den ersten Button darin und liest eine Eigenschaft vom Ergebnis, ohne auf null zu prüfen, also wirft die Taste einen TypeError, statt aufzuklappen. Spring mit Tab in diese Tabelle und drück Pfeil nach rechts auf einer Zeile, um es zu sehen.',
    ddTogglerGood:
      'Der Toggler steht in jeder Zeile, Blätter eingeschlossen — er versteckt sich mit visibility, statt entfernt zu werden —, also findet der Lookup immer ein Element und die Zeile klappt auf.',

    pickTree: 'Knoten sind Listeneinträge, deren Tree-Semantik für dich ausgegeben wird; nichts zu verdrahten.',
    pickTreeTable:
      'Du besitzt das Zeilen-Markup, also besitzt du die Spalten — und die Direktive ttRow, die Rolle, Ebene und Aufklappzustand liefert.',
    pickTreeSelect:
      'Implementiert ControlValueAccessor, bindet sich also an ngModel oder ein Reactive Control wie jedes andere Feld.',
    pickFlat:
      'Ein einstufiger p-tree kündigt sich trotzdem als Tree an, und das verspricht eine Hierarchie, die es nicht gibt.',
    pickOrgChart:
      'Das Diagramm ist ein visuelles Layout ohne Rollen und mit einer Auswahl nur per Maus; es illustriert eine Hierarchie, die es zusätzlich in einer Form geben muss, durch die assistive Technologien gehen können.',
    ddOrgBad:
      'Einklappbar und auswählbar sieht das Diagramm interaktiv aus, aber ein Tastaturnutzer erreicht nur die unbenannten Toggles, nie einen Knoten; ein Screenreader hört verschachtelte Layout-Tabellen und leere Verbindungszellen ohne Ebene, ohne Position und ohne Aufklapp- oder Auswahlzustand.',
    ddOrgGood:
      'Der benannte p-tree trägt die Hierarchie mit Ebenen, Positionen und Tastatur. Das Diagramm daneben hat weder collapsible noch selectionMode, enthält also nichts Fokussierbares, und sein Wrapper ist aria-hidden, damit die Layout-Tabellen nicht doppelt vorgelesen werden.',

    tkNodePadding: '0.25rem 0.5rem',
    tkSelectedBg: '{highlight.background}',
    tkFocusOffset:
      '-1px für den 1px-Ring von Aura — das Kit ersetzt ihn durch seinen einen Ring, 2px --primary-color-fg bei -2px, innerhalb des Knotens (der Toggle-Button hat tabindex -1 und bekommt nie einen Ring)',
    tkToggleSize: '1.75rem quadratisch, border-radius 50%',
    tkIndent: '1rem',

    indentProse:
      'Ein Standard-Tree wird nur von einer Stelle aus eingerückt: Das Stylesheet gibt jeder Kindgruppe ein Start-Padding von einem Indent-Token. Der Knoteninhalt trägt ein zweites, inline gesetztes linkes Padding von Ebene mal dem Input indentation — aber dieses Input wird allein im Virtual-Scroll-Zweig weitergereicht. Ohne virtualScroll wird es nie gebunden, das Produkt ist NaN, und der Browser verwirft die Deklaration, also hat die Einrückung dort überhaupt keine Wirkung. Unter virtualScroll greifen beide Paddings, und weil das inline gesetzte ein physisches linkes Padding ist, während das Stylesheet ein logisches inline-start verwendet, ist das auch der einzige Fall, in dem die beiden unter RTL auseinanderlaufen.',

    crLight: '10,35:1',
    crDark: '17,72:1',
    crGap:
      'Das gewählte Label ist {highlight.color} auf {highlight.background}, das Paar, das die Zeilen „table & paginator“ als datatable.row.selected.color auf seinem Hintergrund messen (6,59–20,38:1). Der Fokus-Ring des Kits, innerhalb des Knotens gezeichnet, ist in den Zeilen „focus ring“ gemessen: auf content.background (den Werten von dialog.background) 5,18–17,85:1, und als „kit focus ring, inset“ auf der Hover-Fläche und dem Auswahl-Highlight 3,48–17,32:1 (SC 1.4.11, 3:1). Nicht im Kompilat: die Knoten-Icons ({text.muted.color}) und der Knotenrand des Organigramms ({content.border.color}). Der gewählte Knoten hat keinen Balken wie die Tabellenzeile, also ist die Auswahl allein die Fläche (1,00–1,68:1 gegen die Ruhefläche) — ein Design, das Gewähltes von Nicht-Gewähltem durch mehr als Farbe unterscheiden muss, ergänzt seine eigene Markierung.',

    responsive:
      'Keine der drei Komponenten bricht um: Keines der drei Stylesheets trägt eine Media Query. Die Tree-Wurzel scrollt horizontal; vertikal scrollt sie erst, wenn du scrollHeight setzt, denn dieses Input begrenzt ihre Höhe. Nichts im Tree-Stylesheet setzt white-space, also bricht ein langes Label innerhalb seines Knotens um, statt abgeschnitten zu werden, und tiefe Verschachtelung verengt die Label-Spalte, statt sie zu verstecken. Die Tree-Table ist eine echte Tabelle und verhält sich wie eine — sie läuft über ihren Container hinaus, deshalb packt das Kit jede Tabelle in einen scrollenden Container. Das Tree-Select behält seine Feldbreite und kürzt das gewählte Label mit einer Ellipse, also liest sich eine lange Mehrfachauswahl als Fragment. Layout-Rat: Gib allen dreien ein Flex-Elternelement mit min-width: 0, und nimm unterhalb von etwa 40rem lieber den Tree als die Tree-Table, denn ein Spaltensatz, der in Desktop-Breite lesbar ist, wird auf einem Smartphone zum horizontalen Scrollen.',

    kbTreeUpDown: 'Geht zum vorigen/nächsten sichtbaren Knoten, über Ebenen hinweg',
    kbTtUpDown: 'Geht zum vorigen/nächsten Geschwister-Zeilenelement',
    kbTsDown: 'Öffnet das Popup, wenn es geschlossen ist; derselbe Handler fokussiert dann den ersten Knoten, aber erst, wenn das Panel im DOM ist',
    kbTreeRight: 'Klappt einen eingeklappten Zweig auf und geht dann hinein; wirkungslos, wenn er schon aufgeklappt ist',
    kbTtRight: 'Klappt eine eingeklappte Zeile auf; wirkungslos, wenn sie schon aufgeklappt ist',
    kbTreeLeft: 'Klappt einen aufgeklappten Knoten zu, sonst geht es zum Elternknoten',
    kbTtLeft: 'Klappt eine aufgeklappte Zeile zu und stellt den Fokus wieder her',
    kbTreeEnter: 'Wählt den Knoten (Enter, Leertaste und NumpadEnter)',
    kbTtEnter: 'Nur über ttSelectableRow, nicht über ttRow — eine Zeile ohne sie ignoriert beide Tasten',
    kbTsEnter: 'Öffnet das Popup, wenn es geschlossen ist',
    kbTtHomeEnd: 'Erste/letzte Zeile auf dem aktuellen aria-level, nicht des ganzen Grids',
    kbTsEscape: 'Schließt das Popup — aber nur, solange der Fokus noch auf dem Input liegt',
    kbNone: 'Nicht behandelt',

    lblTreeToggler:
      'Nichts. Das Input togglerAriaLabel existiert, ist aber in keinem Template gebunden, und der Button trägt kein aria-label.',
    lblTtToggler: 'Die Schlüssel aria.expandRow / aria.collapseRow der Übersetzung in der Optimus-Config.',
    lblTsTrigger: 'Ein fest codierter englischer String im Template.',
    lblTreeFilter: 'Das Input filterPlaceholder, nur als placeholder-Attribut gerendert.',
    lblNo: 'Nein — nicht ohne eigenes Template',
    lblConfig: 'Ja, über setTranslation',
    lblInput: 'Ja, über das Input',

    chkName:
      'p-tree und p-treeSelect haben ein ariaLabel oder ariaLabelledBy, und der Name des Tree-Selects ändert sich nicht, wenn sich die Auswahl ändert.',
    chkCaption:
      'p-treeTable trägt über pt einen zugänglichen Namen auf seinem Table-Element — nicht über das caption-Template, das außerhalb der Tabelle rendert; sortierbare Header tragen ttSortableColumn, damit aria-sort ausgegeben wird.',
    chkToggler: 'Jede Zeile von p-treeTable beginnt mit p-treeTableToggler, Blätter eingeschlossen.',
    chkTabstops:
      'Spring einmal mit Tab in das Widget und wieder hinaus, dann wieder hinein: Nur ein Knoten oder eine Zeile ist ein Tab-Stopp. Vor diesem ersten Tab sind es mehrere.',
    chkExpanded:
      'Pfeil nach rechts auf einem schon aufgeklappten Knoten bewegt den Fokus bekanntermaßen nicht; wenn deine Nutzer das brauchen, behandle die Taste selbst.',
    chkState: 'Aufklappen und Auswahl werden auf deinen Knotenobjekten gespeichert, und dein Code behandelt sie als seinen eigenen Zustand.',
    chkOrgChart:
      'Ein p-organizationChart steht nie allein: Dieselbe Hierarchie ist als benannter p-tree oder als Liste verfügbar, und ein Diagramm, das nur illustriert, hat weder collapsible noch selectionMode.',

    ocStructure:
      'Verschachtelte Layout-Tabellen, eine je Knoten, mit leeren Verbindungszellen zwischen den Ebenen — keine Rolle tree, treeitem oder group und kein Überschreiben der Rolle auf den Tabellen.',
    ocNode:
      'Ein div mit Click-Handler: kein tabindex, kein Key-Handler, keine Rolle. Sein Label oder dein Knoten-Template ist reiner Text.',
    ocToggle:
      'Ein Anker mit tabindex 0, aber ohne href, ohne Rolle, ohne zugänglichen Namen und ohne aria-expanded; Enter und Leertaste schalten ihn um. Das Icon ist der einzige Hinweis, und es zeigt nach unten, wenn der Zweig offen ist.',
    ocSelection: 'Nur per Zeiger, und nur durch eine CSS-Klasse gezeigt — nichts wird angesagt, und keine Taste wählt einen Knoten.',
    ocCollapsed:
      'Mit visibility versteckt, also verlässt er den Accessibility Tree und nimmt im Layout trotzdem seinen Platz ein.',
    responsiveOrg:
      'Auch das Organigramm bricht nicht um: Es ist eine Tabelle so breit wie seine breiteste Ebene, zentriert, ohne eigene Overflow-Behandlung. Setz es in einen Container mit overflow-x: auto, und zeig auf einem Smartphone stattdessen den Tree — ein vierstufiges Diagramm ist bei 360px ein horizontales Scrollen.',

    i18nNodesSrc: 'Deine Daten — das Feld label jedes TreeNode.',
    i18nNodesDo: 'Übersetze in der Datenschicht; die Komponenten fassen Knotentext nie an.',
    i18nNameSrc: 'Dein Template — ariaLabel, ariaLabelledBy oder der pt-Eintrag für die Tree-Table.',
    i18nNameDo: 'Binde einen übersetzten String; überlass ihn nie dem Fallback auf den Wert.',
    i18nFilterSrc: 'Dein Template — filterPlaceholder.',
    i18nFilterDo: 'Binde einen übersetzten String; er ist der einzige zugängliche Name des Felds.',
    i18nExpandSrc: 'Die Übersetzung in der Optimus-Config, Schlüssel aria.expandRow und aria.collapseRow.',
    i18nExpandDo:
      'Ergänze beide Schlüssel in dem Aufruf, der den aria-Block des Kits zusammensetzt; ein Schlüssel, den dieser Aufruf nicht aufführt, behält seinen englischen Standardwert.',
    i18nTriggerSrc: 'Ein Literal im Template des Tree-Selects.',
    i18nTriggerDo:
      'Unerreichbar: kein Input, kein Config-Schlüssel. Behandle den Trigger in jeder Sprache als unbenannt und sorg dafür, dass das Feld selbst benannt ist.',
    i18nMergeNote:
      'setTranslation merged nur eine Ebene tief, also wird das aria-Objekt als Ganzes ersetzt — spreize zuerst den aktuellen Block, sonst fällt jeder Schlüssel, den du nicht aufführst, auf seinen englischen Standardwert zurück.',

    hist4:
      'v1.3 (23.09.2026) — mit den Kontrast- und Fokus-Runden abgeglichen: Tree-Knoten, Tree-Table-Zeilen und Sortier-Header tragen den einen 2px-Ring des Kits innerhalb ihrer Kante; Knotenlabel und gewähltes Paar zitiert aus den geprüften Zeilen „content panel“ und „table & paginator“.',
    hist3:
      'v1.2 (23.09.2026) — p-organizationChart behandelt (wann nicht verwenden, was es rendert, schmale Bildschirme); Kontrast des Knotenlabels neu zitiert aus dem Token-Paar, das der Tree tatsächlich malt; Verlauf mit dem Neuesten zuerst.',
    hist1: 'v1 (06.09.2026) — erste Fassung, gemessen gegen @openng/optimus-ui 2.0.2.',
    hist2:
      'v1.1 (06.09.2026) — Review-Durchgang: Das Treegrid wird über pt statt über eine Caption benannt, die Einrückung ist als nur unter Virtual Scroll wirksam dokumentiert, aria-selected als abhängig vom Modus, und das Do/Don’t-Paar zum Toggler rendert jetzt.',
  };
}
