/**
 * CSS Design Toolbox — Utilities, Suggestions & Extras (tools-utilities.js)
 * Registers: Unit Converter, Timing Visualizer, Cubic-bezier, Box Model,
 *            CSS Formatter, Preset Manager, Compare Mode helper,
 *            Border Radius Suggester, Shadow Suggester, Spacing Suggester,
 *            Typography Pairing, Color Harmony, Accessibility Checker,
 *            Style Packs
 */

'use strict';

const ui$u = CSSToolbox.ui;

/* ══════════════════════════════════════════════════════════
   1.  UNIT CONVERTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'unit-converter',
  name: 'Unit Converter',
  section: 'utilities',
  icon: '📐',
  description: 'Convert px ↔ rem ↔ em ↔ vw ↔ vh ↔ pt ↔ %',
  keywords: ['unit', 'px', 'rem', 'em', 'vw', 'convert'],

  presets: [
    { name: '16px Base',  state: { pxValue:16, baseFontSize:16, viewportW:1440, viewportH:900, parentPx:16 }},
    { name: '14px Body',  state: { pxValue:14, baseFontSize:16, viewportW:1440, viewportH:900, parentPx:16 }},
    { name: '24px Title', state: { pxValue:24, baseFontSize:16, viewportW:1440, viewportH:900, parentPx:16 }},
  ],

  defaultState: { pxValue:16, baseFontSize:16, viewportW:1440, viewportH:900, parentPx:16 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:20px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const resultTable = document.createElement('table');
    resultTable.className = 'unit-table';
    resultTable.innerHTML = '<thead><tr><th>Unit</th><th>Formula</th><th>Value</th></tr></thead>';
    const tbody = document.createElement('tbody');
    resultTable.appendChild(tbody);
    previewArea.appendChild(resultTable);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">Values</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-unit-converter-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-unit-converter-code')">Copy All</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const px = s.pxValue;
      const base = s.baseFontSize;
      const vw = s.viewportW;
      const vh = s.viewportH;
      const parent = s.parentPx;

      const conversions = [
        ['px',  '',                       `${px}px`],
        ['rem', `${px}px ÷ ${base}`,      `${(px/base).toFixed(4)}rem`],
        ['em',  `${px}px ÷ ${parent}`,    `${(px/parent).toFixed(4)}em`],
        ['vw',  `(${px}px ÷ ${vw}) × 100`,`${(px/vw*100).toFixed(4)}vw`],
        ['vh',  `(${px}px ÷ ${vh}) × 100`,`${(px/vh*100).toFixed(4)}vh`],
        ['%',   `(${px}px ÷ ${parent}) × 100`, `${(px/parent*100).toFixed(2)}%`],
        ['pt',  `${px}px × 0.75`,         `${(px*0.75).toFixed(2)}pt`],
        ['cm',  `${px}px ÷ 37.795`,       `${(px/37.795).toFixed(4)}cm`],
        ['mm',  `${px}px ÷ 3.7795`,       `${(px/3.7795).toFixed(4)}mm`],
        ['in',  `${px}px ÷ 96`,           `${(px/96).toFixed(6)}in`],
      ];

      tbody.innerHTML = conversions.map(([unit, formula, val]) =>
        `<tr><td><strong>${unit}</strong></td><td>${formula}</td><td>${val}</td></tr>`).join('');

      document.getElementById('out-unit-converter-code').textContent =
        conversions.map(([u,,v]) => `/* ${u} */ ${v}`).join('\n');
      onChange(s);
    }

    controls.appendChild(ui$u.makeSlider({ label:'Pixel Value to Convert', id:'uc-px', min:1, max:200, value:s.pxValue, unit:'px', onChange:v=>{s.pxValue=v;update();} }));
    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSectionTitle('Context'));
    controls.appendChild(ui$u.makeSlider({ label:'Root Font Size', id:'uc-base', min:8, max:24, value:s.baseFontSize, unit:'px', onChange:v=>{s.baseFontSize=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Parent Font Size', id:'uc-parent', min:8, max:32, value:s.parentPx, unit:'px', onChange:v=>{s.parentPx=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Viewport Width', id:'uc-vw', min:320, max:2560, step:10, value:s.viewportW, unit:'px', onChange:v=>{s.viewportW=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Viewport Height', id:'uc-vh', min:320, max:1600, step:10, value:s.viewportH, unit:'px', onChange:v=>{s.viewportH=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   2.  CUBIC-BEZIER GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'cubic-bezier',
  name: 'Cubic Bezier',
  section: 'utilities',
  icon: '〰',
  description: 'Visualize and create cubic-bezier timing functions',
  keywords: ['bezier', 'easing', 'timing', 'curve', 'animation', 'transition'],

  presets: [
    { name: 'ease',       state: { x1:.25, y1:.1, x2:.25, y2:1 }},
    { name: 'linear',     state: { x1:0, y1:0, x2:1, y2:1 }},
    { name: 'ease-in',    state: { x1:.42, y1:0, x2:1, y2:1 }},
    { name: 'ease-out',   state: { x1:0, y1:0, x2:.58, y2:1 }},
    { name: 'ease-in-out',state: { x1:.42, y1:0, x2:.58, y2:1 }},
    { name: 'Bounce Out', state: { x1:.34, y1:1.56, x2:.64, y2:1 }},
    { name: 'Back In',    state: { x1:.36, y1:0, x2:.66, y2:-.56 }},
    { name: 'Spring',     state: { x1:.68, y1:-.55, x2:.265, y2:1.55 }},
    { name: 'Snap',       state: { x1:.77, y1:0, x2:.175, y2:1 }},
    { name: 'Anticipate', state: { x1:.33, y1:-.4, x2:.55, y2:1.2 }},
  ],

  defaultState: { x1:.42, y1:0, x2:.58, y2:1 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const canvasSize = 200;
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.className = 'bezier-canvas';
    canvas.style.cssText = 'width:200px;height:200px;';
    previewArea.appendChild(canvas);

    const demoWrap = document.createElement('div');
    demoWrap.style.cssText = 'width:200px;display:flex;flex-direction:column;gap:8px;';
    demoWrap.innerHTML = `<div style="font-size:11px;color:var(--text3);text-align:center;">Hover to animate →</div>
      <div id="bezier-track" style="width:100%;height:8px;background:var(--bg3);border-radius:4px;position:relative;overflow:hidden;">
        <div id="bezier-ball" style="position:absolute;width:20px;height:20px;background:var(--accent);border-radius:50%;top:-6px;left:0;transition:left .8s ease;"></div>
      </div>`;
    previewArea.appendChild(demoWrap);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-cubic-bezier-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-cubic-bezier-code')">Copy</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const ctx = canvas.getContext('2d');

    function drawCurve() {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      const pad = 20;
      const w = canvasSize - pad * 2;
      const h = canvasSize - pad * 2;

      // Grid
      ctx.strokeStyle = '#2d3348';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(pad + (w/4)*i, pad);
        ctx.lineTo(pad + (w/4)*i, pad + h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pad, pad + (h/4)*i);
        ctx.lineTo(pad + w, pad + (h/4)*i);
        ctx.stroke();
      }

      // Convert bezier coords to canvas coords
      const cx = (bx) => pad + bx * w;
      const cy = (by) => pad + h - by * h;

      // Control lines
      ctx.strokeStyle = '#4d5566';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx(0), cy(0)); ctx.lineTo(cx(s.x1), cy(s.y1)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx(1), cy(1)); ctx.lineTo(cx(s.x2), cy(s.y2)); ctx.stroke();
      ctx.setLineDash([]);

      // Bezier curve
      ctx.strokeStyle = '#6c63ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx(0), cy(0));
      ctx.bezierCurveTo(cx(s.x1), cy(s.y1), cx(s.x2), cy(s.y2), cx(1), cy(1));
      ctx.stroke();

      // Control points
      [[s.x1, s.y1], [s.x2, s.y2]].forEach(([bx, by]) => {
        ctx.fillStyle = '#a78bfa';
        ctx.beginPath();
        ctx.arc(cx(bx), cy(by), 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Endpoints
      [[0, 0], [1, 1]].forEach(([bx, by]) => {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(cx(bx), cy(by), 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function update() {
      drawCurve();
      const css = `cubic-bezier(${s.x1}, ${s.y1}, ${s.x2}, ${s.y2})`;
      document.getElementById('out-cubic-bezier-code').textContent =
        `transition-timing-function: ${css};\nanimation-timing-function: ${css};`;

      const ball = document.getElementById('bezier-ball');
      if (ball) ball.style.transition = `left 0.8s ${css}`;

      onChange(s);
    }

    demoWrap.addEventListener('mouseenter', () => {
      const ball = document.getElementById('bezier-ball');
      if (ball) ball.style.left = '180px';
    });
    demoWrap.addEventListener('mouseleave', () => {
      const ball = document.getElementById('bezier-ball');
      if (ball) ball.style.left = '0';
    });

    controls.appendChild(ui$u.makeSectionTitle('Control Point 1 (P1)'));
    controls.appendChild(ui$u.makeSlider({ label:'X1', id:'bz-x1', min:0, max:100, step:1, value:Math.round(s.x1*100), unit:'',
      onChange: v => { s.x1 = v/100; document.getElementById('bz-x1-val').textContent = (v/100).toFixed(2); update(); } }));
    controls.appendChild(ui$u.makeSlider({ label:'Y1', id:'bz-y1', min:-100, max:200, step:1, value:Math.round(s.y1*100), unit:'',
      onChange: v => { s.y1 = v/100; document.getElementById('bz-y1-val').textContent = (v/100).toFixed(2); update(); } }));
    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSectionTitle('Control Point 2 (P2)'));
    controls.appendChild(ui$u.makeSlider({ label:'X2', id:'bz-x2', min:0, max:100, step:1, value:Math.round(s.x2*100), unit:'',
      onChange: v => { s.x2 = v/100; document.getElementById('bz-x2-val').textContent = (v/100).toFixed(2); update(); } }));
    controls.appendChild(ui$u.makeSlider({ label:'Y2', id:'bz-y2', min:-100, max:200, step:1, value:Math.round(s.y2*100), unit:'',
      onChange: v => { s.y2 = v/100; document.getElementById('bz-y2-val').textContent = (v/100).toFixed(2); update(); } }));

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   3.  BOX MODEL VISUALIZER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'box-model',
  name: 'Box Model',
  section: 'utilities',
  icon: '📦',
  description: 'Visualize the CSS box model with margin, border, padding, content',
  keywords: ['box model', 'margin', 'padding', 'border', 'content', 'sizing'],

  defaultState: { marginTop:16, marginRight:16, marginBottom:16, marginLeft:16, paddingTop:16, paddingRight:24, paddingBottom:16, paddingLeft:24, borderWidth:2, contentW:120, contentH:60, boxSizing:'content-box' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const viz = document.createElement('div');
    viz.className = 'box-model-viz';
    previewArea.appendChild(viz);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-box-model-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-box-model-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      viz.innerHTML = `
        <div class="bm-margin" style="padding:${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px;">
          <div style="font-size:10px;color:#d29922;margin-bottom:4px;">margin: ${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px</div>
          <div class="bm-border" style="padding:${s.borderWidth}px;">
            <div style="font-size:10px;color:#ff8c00;margin-bottom:4px;">border: ${s.borderWidth}px</div>
            <div class="bm-padding" style="padding:${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;">
              <div style="font-size:10px;color:#27c178;margin-bottom:4px;">padding: ${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px</div>
              <div class="bm-content" style="width:${s.contentW}px;height:${s.contentH}px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:11px;color:var(--accent2);">${s.contentW}×${s.contentH}</span>
              </div>
            </div>
          </div>
        </div>`;

      document.getElementById('out-box-model-code').textContent =
        `.element {\n  box-sizing: ${s.boxSizing};\n  width: ${s.contentW}px;\n  height: ${s.contentH}px;\n  margin: ${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px;\n  padding: ${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;\n  border: ${s.borderWidth}px solid;\n}`;
      onChange(s);
    }

    controls.appendChild(ui$u.makeSectionTitle('Content'));
    controls.appendChild(ui$u.makeSlider({ label:'Width', id:'bm-cw', min:40, max:240, value:s.contentW, unit:'px', onChange:v=>{s.contentW=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Height', id:'bm-ch', min:20, max:160, value:s.contentH, unit:'px', onChange:v=>{s.contentH=v;update();} }));
    controls.appendChild(ui$u.makeSelect({ label:'Box Sizing', id:'bm-bs', options:['content-box','border-box'], value:s.boxSizing, onChange:v=>{s.boxSizing=v;update();} }));
    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSectionTitle('Padding'));
    controls.appendChild(ui$u.makeSlider({ label:'Top',    id:'bm-pt', min:0, max:60, value:s.paddingTop,    unit:'px', onChange:v=>{s.paddingTop=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Right',  id:'bm-pr', min:0, max:60, value:s.paddingRight,  unit:'px', onChange:v=>{s.paddingRight=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Bottom', id:'bm-pb', min:0, max:60, value:s.paddingBottom, unit:'px', onChange:v=>{s.paddingBottom=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Left',   id:'bm-pl', min:0, max:60, value:s.paddingLeft,   unit:'px', onChange:v=>{s.paddingLeft=v;update();} }));
    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSectionTitle('Margin'));
    controls.appendChild(ui$u.makeSlider({ label:'Top',    id:'bm-mt', min:0, max:60, value:s.marginTop,    unit:'px', onChange:v=>{s.marginTop=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Right',  id:'bm-mr', min:0, max:60, value:s.marginRight,  unit:'px', onChange:v=>{s.marginRight=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Bottom', id:'bm-mb', min:0, max:60, value:s.marginBottom, unit:'px', onChange:v=>{s.marginBottom=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Left',   id:'bm-ml', min:0, max:60, value:s.marginLeft,   unit:'px', onChange:v=>{s.marginLeft=v;update();} }));
    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSlider({ label:'Border Width', id:'bm-bw', min:0, max:20, value:s.borderWidth, unit:'px', onChange:v=>{s.borderWidth=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   4.  CSS FORMATTER / MINIFIER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'css-formatter',
  name: 'CSS Formatter',
  section: 'utilities',
  icon: '⌨',
  description: 'Format or minify CSS code client-side',
  keywords: ['formatter', 'minifier', 'prettify', 'css', 'format', 'clean'],

  defaultState: { input: 'body{margin:0;padding:0;background:#0d1117;color:#e2e8f0;font-family:system-ui,sans-serif}.container{max-width:1200px;margin:0 auto;padding:0 16px}', mode:'format', indentSize:2 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;padding:16px;background:var(--bg0);gap:12px;';
    preview.appendChild(previewArea);

    const outputCode = document.createElement('pre');
    outputCode.className = 'output-code';
    outputCode.id = 'out-css-formatter-code';
    outputCode.style.cssText = 'flex:1;min-height:240px;max-height:400px;overflow:auto;';
    previewArea.appendChild(outputCode);

    const copyRow = document.createElement('div');
    copyRow.className = 'copy-row';
    copyRow.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-css-formatter-code')">Copy Output</button>`;
    previewArea.appendChild(copyRow);

    function formatCSS(css, indentSize = 2) {
      try {
        const indent = ' '.repeat(indentSize);
        return css
          .replace(/\s*{\s*/g, ' {\n' + indent)
          .replace(/;\s*/g, ';\n' + indent)
          .replace(/\s*}\s*/g, '\n}\n')
          .replace(new RegExp(indent + '$', 'gm'), '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      } catch (_) { return css; }
    }

    function minifyCSS(css) {
      return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/;\s*}/g, '}')
        .trim();
    }

    function update() {
      const result = s.mode === 'minify' ? minifyCSS(s.input) : formatCSS(s.input, s.indentSize);
      outputCode.textContent = result;
      onChange(s);
    }

    const inputTA = ui$u.makeTextarea({ label:'Input CSS', id:'fmt-input', value:s.input, rows:8,
      placeholder: 'Paste your CSS here…', onChange:v=>{s.input=v;update();} });
    controls.appendChild(inputTA);

    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSelect({ label:'Mode', id:'fmt-mode',
      options:[{value:'format',label:'Format / Prettify'},{value:'minify',label:'Minify'}],
      value:s.mode, onChange:v=>{s.mode=v;update();} }));
    controls.appendChild(ui$u.makeSelect({ label:'Indent Size', id:'fmt-indent',
      options:[{value:'2',label:'2 spaces'},{value:'4',label:'4 spaces'},{value:'1',label:'1 tab'}],
      value:String(s.indentSize), onChange:v=>{s.indentSize=Number(v);update();} }));

    const runBtn = document.createElement('button');
    runBtn.className = 'btn btn-primary btn-sm btn-full mt-2';
    runBtn.textContent = 'Apply';
    runBtn.addEventListener('click', update);
    controls.appendChild(runBtn);

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   5.  BORDER RADIUS SUGGESTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'radius-suggester',
  name: 'Radius Suggester',
  section: 'suggestions',
  icon: '💡',
  description: 'Get border-radius suggestions for common UI components',
  keywords: ['radius', 'suggest', 'recommend', 'border', 'corner'],

  defaultState: { component:'button', size:'medium' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;padding:24px;gap:16px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const suggestionsEl = document.createElement('div');
    suggestionsEl.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
    previewArea.appendChild(suggestionsEl);

    const SUGGESTIONS = {
      button: { small:[4,6], medium:[6,8], large:[8,12], pill:[9999] },
      card:   { small:[8,10], medium:[12,16], large:[16,24], pill:[8] },
      input:  { small:[4,6], medium:[6,8], large:[8,12], pill:[9999] },
      modal:  { small:[8,10], medium:[12,16], large:[16,20], pill:[8] },
      badge:  { small:[3,4], medium:[4,6], large:[6,8], pill:[9999] },
      tooltip:{ small:[4], medium:[6], large:[8], pill:[4] },
      avatar: { small:[4,8,50], medium:[8,50], large:[12,50], pill:[50] },
      image:  { small:[4,8], medium:[8,12], large:[12,20], pill:[8] },
    };

    function update() {
      const suggestions = SUGGESTIONS[s.component]?.[s.size] || [8];
      suggestionsEl.innerHTML = '';
      suggestions.forEach(r => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:16px;padding:12px;background:var(--bg1);border:1px solid var(--border);border-radius:8px;';

        const demo = document.createElement('div');
        demo.style.cssText = `width:80px;height:40px;background:var(--accent);border-radius:${r}px;flex-shrink:0;`;

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;';
        const label = r >= 999 ? 'Pill (fully rounded)' : `${r}px`;
        info.innerHTML = `<div style="font-weight:700;font-size:14px;">${label}</div><div style="font-size:12px;color:var(--text2);">border-radius: ${r === 9999 ? '9999px' : r + 'px'};</div>`;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-secondary btn-sm';
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(`border-radius: ${r === 9999 ? '9999px' : r + 'px'};`);
          CSSToolbox.toast('Copied!', 'success');
        });

        row.appendChild(demo);
        row.appendChild(info);
        row.appendChild(copyBtn);
        suggestionsEl.appendChild(row);
      });
      onChange(s);
    }

    const COMPONENTS = ['button','card','input','modal','badge','tooltip','avatar','image'].map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}));
    const SIZES = ['small','medium','large','pill'].map(sz=>({value:sz,label:sz.charAt(0).toUpperCase()+sz.slice(1)}));
    controls.appendChild(ui$u.makeSelect({ label:'Component Type', id:'rs-comp', options:COMPONENTS, value:s.component, onChange:v=>{s.component=v;update();} }));
    controls.appendChild(ui$u.makeSelect({ label:'Size', id:'rs-size', options:SIZES, value:s.size, onChange:v=>{s.size=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   6.  SHADOW SUGGESTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'shadow-suggester',
  name: 'Shadow Suggester',
  section: 'suggestions',
  icon: '🌫',
  description: 'Get box-shadow presets for different use cases',
  keywords: ['shadow', 'suggest', 'recommend', 'elevation', 'depth'],

  defaultState: { category:'material' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:24px;background:var(--bg0);display:flex;flex-direction:column;gap:12px;';
    preview.appendChild(previewArea);

    const SHADOWS = {
      material: [
        { name:'None',         css:'none' },
        { name:'Elevation 1',  css:'0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)' },
        { name:'Elevation 2',  css:'0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23)' },
        { name:'Elevation 3',  css:'0 10px 20px rgba(0,0,0,.19), 0 6px 6px rgba(0,0,0,.23)' },
        { name:'Elevation 4',  css:'0 14px 28px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.22)' },
        { name:'Elevation 5',  css:'0 19px 38px rgba(0,0,0,.30), 0 15px 12px rgba(0,0,0,.22)' },
      ],
      soft: [
        { name:'Subtle',       css:'0 2px 8px rgba(0,0,0,.08)' },
        { name:'Gentle',       css:'0 4px 16px rgba(0,0,0,.10)' },
        { name:'Floating',     css:'0 8px 30px rgba(0,0,0,.12)' },
        { name:'Deep Soft',    css:'0 20px 60px rgba(0,0,0,.15)' },
      ],
      tailwind: [
        { name:'sm',  css:'0 1px 2px 0 rgba(0,0,0,.05)' },
        { name:'md',  css:'0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)' },
        { name:'lg',  css:'0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)' },
        { name:'xl',  css:'0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)' },
        { name:'2xl', css:'0 25px 50px -12px rgba(0,0,0,.25)' },
        { name:'inner', css:'inset 0 2px 4px 0 rgba(0,0,0,.05)' },
      ],
      colored: [
        { name:'Purple', css:'0 8px 24px rgba(108,99,255,.4)' },
        { name:'Blue',   css:'0 8px 24px rgba(59,130,246,.4)' },
        { name:'Green',  css:'0 8px 24px rgba(16,185,129,.4)' },
        { name:'Red',    css:'0 8px 24px rgba(239,68,68,.4)' },
        { name:'Orange', css:'0 8px 24px rgba(245,158,11,.4)' },
      ],
    };

    const suggestionsEl = document.createElement('div');
    suggestionsEl.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
    previewArea.appendChild(suggestionsEl);

    function update() {
      const list = SHADOWS[s.category] || [];
      suggestionsEl.innerHTML = '';
      list.forEach(sh => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:14px;padding:12px;background:var(--bg1);border:1px solid var(--border);border-radius:8px;';

        const demo = document.createElement('div');
        demo.style.cssText = `width:60px;height:40px;background:var(--bg2);border-radius:6px;flex-shrink:0;box-shadow:${sh.css};`;

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';
        info.innerHTML = `<div style="font-weight:700;font-size:13px;margin-bottom:3px;">${sh.name}</div><div style="font-size:11px;color:var(--text3);font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sh.css}</div>`;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-secondary btn-sm';
        copyBtn.style.flexShrink = '0';
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(`box-shadow: ${sh.css};`);
          CSSToolbox.toast('Copied!', 'success');
        });

        row.appendChild(demo);
        row.appendChild(info);
        row.appendChild(copyBtn);
        suggestionsEl.appendChild(row);
      });
      onChange(s);
    }

    const CATEGORIES = ['material','soft','tailwind','colored'].map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)+' Shadows'}));
    controls.appendChild(ui$u.makeSelect({ label:'Shadow Set', id:'ss-cat', options:CATEGORIES, value:s.category, onChange:v=>{s.category=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   7.  COLOR HARMONY SUGGESTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'color-harmony',
  name: 'Color Harmony',
  section: 'suggestions',
  icon: '🎨',
  description: 'Generate complementary, analogous, triadic and split-complementary palettes',
  keywords: ['color', 'harmony', 'palette', 'complementary', 'analogous', 'triadic'],

  defaultState: { baseColor:'#6c63ff', harmony:'complementary' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;padding:24px;gap:16px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const palEl = document.createElement('div');
    palEl.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
    previewArea.appendChild(palEl);

    function hexToHsl(hex) {
      let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h, s2, l = (max+min)/2;
      if (max === min) { h = s2 = 0; }
      else {
        const d = max-min;
        s2 = l > .5 ? d/(2-max-min) : d/(max+min);
        switch(max) {
          case r: h = ((g-b)/d + (g<b?6:0))/6; break;
          case g: h = ((b-r)/d+2)/6; break;
          default: h = ((r-g)/d+4)/6;
        }
      }
      return [Math.round(h*360), Math.round(s2*100), Math.round(l*100)];
    }

    function hslToHex(h, s2, l) {
      l /= 100; const a = s2/100 * Math.min(l, 1-l);
      const f = n => { const k = (n + h/30) % 12; const c = l - a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*c).toString(16).padStart(2,'0'); };
      return `#${f(0)}${f(8)}${f(4)}`;
    }

    function getHarmony() {
      const [h, s2, l] = hexToHsl(s.baseColor || '#6c63ff');
      const harmonies = {
        complementary:       [[h, s2, l], [(h+180)%360, s2, l]],
        analogous:           [[h, s2, l], [(h+30)%360, s2, l], [(h-30+360)%360, s2, l]],
        triadic:             [[h, s2, l], [(h+120)%360, s2, l], [(h+240)%360, s2, l]],
        split_complementary: [[h, s2, l], [(h+150)%360, s2, l], [(h+210)%360, s2, l]],
        tetradic:            [[h, s2, l], [(h+90)%360, s2, l], [(h+180)%360, s2, l], [(h+270)%360, s2, l]],
        monochromatic:       [[h, s2, 30], [h, s2, 50], [h, s2, l], [h, s2, 70], [h, s2, 85]],
        shades:              [[h, s2, 20], [h, s2, 35], [h, s2, l], [h, s2, 65], [h, s2, 80]],
      };
      return (harmonies[s.harmony] || harmonies.complementary).map(([hh, ss, ll]) => hslToHex(hh, ss, ll));
    }

    function update() {
      const colors = getHarmony();
      palEl.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:8px;">
        ${colors.map(c => `<div title="${c}" style="flex:1;height:60px;border-radius:8px;background:${c};cursor:pointer;" onclick="navigator.clipboard.writeText('${c}');CSSToolbox.toast('Copied ${c}!','success')"></div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${colors.map(c => `<div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:12px;font-family:monospace;color:var(--text2);cursor:pointer;" onclick="navigator.clipboard.writeText('${c}');CSSToolbox.toast('${c} copied!','success')">${c}</div>`).join('')}
      </div>`;
      onChange(s);
    }

    const HARMONIES = ['complementary','analogous','triadic','split_complementary','tetradic','monochromatic','shades'].map(h=>({value:h,label:h.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}));
    controls.appendChild(ui$u.makeColor({ label:'Base Color', id:'ch-base', value:s.baseColor, onChange:v=>{s.baseColor=v;update();} }));
    controls.appendChild(ui$u.makeSelect({ label:'Harmony Type', id:'ch-harmony', options:HARMONIES, value:s.harmony, onChange:v=>{s.harmony=v;update();} }));
    const info = document.createElement('div');
    info.style.cssText = 'font-size:12px;color:var(--text2);background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:10px;margin-top:8px;';
    info.textContent = 'Click any color swatch to copy its hex value.';
    controls.appendChild(info);
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   8.  ACCESSIBILITY CHECKER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'accessibility',
  name: 'Accessibility',
  section: 'suggestions',
  icon: '♿',
  description: 'Check contrast ratios and WCAG compliance',
  keywords: ['accessibility', 'a11y', 'contrast', 'wcag', 'color'],

  defaultState: { fg:'#e2e8f0', bg:'#0d1117', fontSize:16, fontWeight:400 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:24px;background:var(--bg0);display:flex;flex-direction:column;gap:16px;';
    preview.appendChild(previewArea);

    const demoEl = document.createElement('div');
    demoEl.style.cssText = 'padding:24px;border-radius:12px;transition:all .3s;border:1px solid var(--border);';
    demoEl.innerHTML = '<p style="margin:0;margin-bottom:8px;font-weight:700;font-size:18px;">Normal Text Sample</p><p style="margin:0;font-size:14px;">This is a sample of body text using the selected colors. Can you read it comfortably?</p>';
    previewArea.appendChild(demoEl);

    const resultsEl = document.createElement('div');
    resultsEl.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    previewArea.appendChild(resultsEl);

    function hexToRgb(hex) {
      return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    }

    function getLuminance([r, g, b]) {
      const toLinear = c => { c /= 255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); };
      return .2126*toLinear(r) + .7152*toLinear(g) + .0722*toLinear(b);
    }

    function getContrastRatio(hex1, hex2) {
      const l1 = getLuminance(hexToRgb(hex1));
      const l2 = getLuminance(hexToRgb(hex2));
      const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
      return (lighter + .05) / (darker + .05);
    }

    function update() {
      demoEl.style.background = s.bg;
      demoEl.style.color = s.fg;
      demoEl.querySelectorAll('p').forEach(p => {
        p.style.color = s.fg;
        if (p.matches(':last-child')) p.style.fontSize = s.fontSize + 'px';
      });

      const ratio = getContrastRatio(s.fg, s.bg);
      const isLargeText = s.fontSize >= 18 || (s.fontSize >= 14 && s.fontWeight >= 700);

      const aaMin = isLargeText ? 3 : 4.5;
      const aaaMin = isLargeText ? 4.5 : 7;

      resultsEl.innerHTML = `
        <div style="font-size:24px;font-weight:900;color:${ratio >= 4.5 ? 'var(--success)' : ratio >= 3 ? 'var(--warning)' : 'var(--error)'};">${ratio.toFixed(2)}:1</div>
        <div class="a11y-result">
          <span class="a11y-badge ${ratio >= aaMin ? 'pass' : 'fail'}">${ratio >= aaMin ? '✓' : '✗'} AA</span>
          <span style="font-size:12px;color:var(--text2);">Normal text: min 4.5:1${isLargeText ? ' (large text: 3:1)' : ''}</span>
        </div>
        <div class="a11y-result">
          <span class="a11y-badge ${ratio >= aaaMin ? 'pass' : 'fail'}">${ratio >= aaaMin ? '✓' : '✗'} AAA</span>
          <span style="font-size:12px;color:var(--text2);">Enhanced: min 7:1${isLargeText ? ' (large text: 4.5:1)' : ''}</span>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-top:4px;">${isLargeText ? '📌 Evaluated as large text (≥18px or ≥14px bold)' : '📌 Evaluated as normal text'}</div>`;

      onChange(s);
    }

    controls.appendChild(ui$u.makeColor({ label:'Text Color', id:'a11y-fg', value:s.fg, onChange:v=>{s.fg=v;update();} }));
    controls.appendChild(ui$u.makeColor({ label:'Background Color', id:'a11y-bg', value:s.bg, onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$u.makeSlider({ label:'Font Size', id:'a11y-fs', min:10, max:48, value:s.fontSize, unit:'px', onChange:v=>{s.fontSize=v;update();} }));
    const WEIGHTS = [400,700].map(w=>({value:String(w),label:w===400?'Normal (400)':'Bold (700)'}));
    controls.appendChild(ui$u.makeSelect({ label:'Font Weight', id:'a11y-fw', options:WEIGHTS, value:String(s.fontWeight), onChange:v=>{s.fontWeight=Number(v);update();} }));

    const quickPairs = [
      ['White on Black', '#ffffff', '#000000'],
      ['Black on White', '#000000', '#ffffff'],
      ['White on Dark Navy', '#ffffff', '#0d1117'],
      ['Yellow on Black', '#ffff00', '#000000'],
      ['Grey Issue', '#999999', '#ffffff'],
    ];
    controls.appendChild(ui$u.makeDivider());
    controls.appendChild(ui$u.makeSectionTitle('Quick Test Pairs'));
    quickPairs.forEach(([name, fg, bg]) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.style.cssText = 'width:100%;text-align:left;margin-bottom:4px;';
      btn.textContent = name;
      btn.addEventListener('click', () => {
        s.fg = fg; s.bg = bg;
        const fgInput = document.getElementById('a11y-fg');
        const bgInput = document.getElementById('a11y-bg');
        if (fgInput) fgInput.value = fg;
        if (bgInput) bgInput.value = bg;
        update();
      });
      controls.appendChild(btn);
    });

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   9.  SPACING SUGGESTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'spacing-suggester',
  name: 'Spacing',
  section: 'suggestions',
  icon: '📏',
  description: 'Spacing scale suggestions for consistent layouts',
  keywords: ['spacing', 'margin', 'padding', 'gap', 'scale', 'suggest'],

  defaultState: { base:4, scale:'linear' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:24px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const scaleList = document.createElement('div');
    scaleList.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    previewArea.appendChild(scaleList);

    function update() {
      const spacingSizes = ['xs','sm','md','lg','xl','2xl','3xl','4xl'];
      const multipliers = {
        linear:   [0.5, 1, 2, 3, 4, 6, 8, 12],
        '4pt':    [1,   2, 4, 6, 8, 12, 16, 24],
        fibonacci:[1,   2, 3, 5, 8, 13, 21, 34],
      };
      const mult = multipliers[s.scale] || multipliers.linear;

      scaleList.innerHTML = '';
      spacingSizes.forEach((size, i) => {
        const val = Math.round(s.base * mult[i]);
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:8px 12px;background:var(--bg1);border:1px solid var(--border);border-radius:6px;';
        row.innerHTML = `
          <span style="font-family:monospace;font-size:12px;color:var(--text3);min-width:30px;">--${size}</span>
          <div style="height:12px;background:var(--accent);border-radius:2px;transition:width .3s;" data-width="${val}"></div>
          <span style="font-size:12px;font-weight:600;min-width:40px;">${val}px</span>
          <span style="font-size:11px;color:var(--text3);">${(val/16).toFixed(3)}rem</span>
          <button class="btn btn-secondary btn-xs" onclick="navigator.clipboard.writeText('${val}px');CSSToolbox.toast('Copied ${val}px!','success')">Copy</button>`;
        scaleList.appendChild(row);
        // Set bar width after append
        setTimeout(() => { row.querySelector('[data-width]').style.width = Math.min(val*2, 200) + 'px'; }, 10);
      });

      onChange(s);
    }

    controls.appendChild(ui$u.makeSlider({ label:'Base Unit', id:'sp-base', min:2, max:12, value:s.base, unit:'px', onChange:v=>{s.base=v;update();} }));
    controls.appendChild(ui$u.makeSelect({ label:'Scale Type', id:'sp-scale',
      options:[{value:'linear',label:'Linear (2× steps)'},{value:'4pt',label:'4pt System'},{value:'fibonacci',label:'Fibonacci'}],
      value:s.scale, onChange:v=>{s.scale=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   10.  TYPOGRAPHY PAIRING SUGGESTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'typography-pairing',
  name: 'Font Pairing',
  section: 'suggestions',
  icon: '✏',
  description: 'Suggested system font pairings for headings and body text',
  keywords: ['typography', 'font', 'pairing', 'heading', 'body', 'combination'],

  defaultState: { pairingIdx:0 },

  render(controls, preview, s, onChange) {
    const PAIRINGS = [
      { name:'Modern Clean',  heading:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', body:'system-ui, sans-serif', weight:'800', example:'Design Tools' },
      { name:'Editorial',     heading:'Georgia, "Times New Roman", serif', body:'-apple-system, BlinkMacSystemFont, sans-serif', weight:'700', example:'The Craft' },
      { name:'Monospace Accent', heading:'"SFMono-Regular", Consolas, monospace', body:'system-ui, sans-serif', weight:'700', example:'const UI = {}' },
      { name:'Humanist',      heading:'Calibri, Optima, Candara, sans-serif', body:'Georgia, serif', weight:'700', example:'Human Design' },
      { name:'Geometric',     heading:'"Century Gothic", Futura, sans-serif', body:'Verdana, Geneva, sans-serif', weight:'700', example:'Clean Lines' },
      { name:'Old Style',     heading:'"Palatino Linotype", Palatino, serif', body:'"Book Antiqua", Baskerville, serif', weight:'600', example:'Classic Style' },
      { name:'Slab Serif',    heading:'Rockwell, "Roboto Slab", serif', body:'Verdana, Arial, sans-serif', weight:'700', example:'Bold Impact' },
      { name:'Minimal Sans',  heading:'Arial, Helvetica, sans-serif', body:'Arial, Helvetica, sans-serif', weight:'900', example:'Simplicity' },
    ];

    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:32px;background:var(--bg0);display:flex;flex-direction:column;gap:24px;';
    preview.appendChild(previewArea);

    const pairingDemo = document.createElement('div');
    pairingDemo.style.cssText = 'background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:28px;';
    previewArea.appendChild(pairingDemo);

    const pairingGrid = document.createElement('div');
    pairingGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;';
    previewArea.appendChild(pairingGrid);

    function update() {
      const p = PAIRINGS[s.pairingIdx] || PAIRINGS[0];
      pairingDemo.innerHTML = `
        <h1 style="font-family:${p.heading};font-weight:${p.weight};font-size:36px;margin:0 0 12px;line-height:1.1;">${p.example}</h1>
        <h2 style="font-family:${p.heading};font-weight:600;font-size:20px;margin:0 0 16px;color:var(--text2);">Section Heading</h2>
        <p style="font-family:${p.body};font-size:16px;line-height:1.7;color:var(--text2);margin:0;">Body text paired with the heading font above. This combination works well for reading-focused interfaces where clarity matters most.</p>`;

      pairingGrid.innerHTML = '';
      PAIRINGS.forEach((pair, i) => {
        const card = document.createElement('div');
        card.style.cssText = `background:var(--bg${i===s.pairingIdx?'3':'2'});border:1px solid var(--${i===s.pairingIdx?'accent':'border'});border-radius:8px;padding:12px;cursor:pointer;transition:all .2s;`;
        card.innerHTML = `<div style="font-family:${pair.heading};font-weight:700;font-size:15px;margin-bottom:4px;">${pair.name}</div><div style="font-family:${pair.body};font-size:11px;color:var(--text2);">${pair.example}</div>`;
        card.addEventListener('click', () => { s.pairingIdx = i; update(); onChange(s); });
        pairingGrid.appendChild(card);
      });

      onChange(s);
    }

    controls.appendChild(ui$u.makeSectionTitle('Select Pairing'));
    PAIRINGS.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.style.cssText = 'width:100%;text-align:left;margin-bottom:4px;justify-content:flex-start;';
      btn.textContent = `${i+1}. ${p.name}`;
      btn.addEventListener('click', () => { s.pairingIdx = i; update(); });
      controls.appendChild(btn);
    });
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   11.  UI STYLE PACKS
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'style-packs',
  name: 'Style Packs',
  section: 'suggestions',
  icon: '🎭',
  description: 'Complete UI style presets: modern, glass, neumorphic, brutalism, retro',
  keywords: ['style', 'pack', 'preset', 'glassmorphism', 'neumorphism', 'brutalism', 'retro', 'theme'],

  defaultState: { selected:'modern' },

  render(controls, preview, s, onChange) {
    const PACKS = {
      modern: {
        name: 'Modern SaaS',
        emoji: '🚀',
        description: 'Clean gradients, subtle shadows, rounded corners',
        css: `/* Modern SaaS Style Pack */\n:root {\n  --radius: 8px;\n  --shadow: 0 4px 12px rgba(0,0,0,.15);\n  --accent: #6c63ff;\n  --bg: #0d1117;\n  --surface: #161b24;\n}\n.card {\n  background: var(--surface);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  border: 1px solid rgba(255,255,255,.06);\n  padding: 24px;\n}\n.btn-primary {\n  background: var(--accent);\n  border-radius: var(--radius);\n  color: #fff;\n  padding: 10px 20px;\n  font-weight: 600;\n}`,
        preview: 'background:linear-gradient(135deg,#0d1117,#161b24);',
        accent: '#6c63ff',
      },
      glass: {
        name: 'Glassmorphism',
        emoji: '🪟',
        description: 'Frosted glass, translucent surfaces, bright gradients',
        css: `/* Glassmorphism Pack */\n.glass-card {\n  background: rgba(255,255,255,.1);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid rgba(255,255,255,.2);\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 4px 24px rgba(0,0,0,.15);\n}`,
        preview: 'background:linear-gradient(135deg,#667eea,#764ba2,#f64f59);',
        accent: '#a78bfa',
      },
      neumorphic: {
        name: 'Neumorphism',
        emoji: '☁️',
        description: 'Soft shadows, monochromatic, extruded surfaces',
        css: `/* Neumorphism Pack */\n:root { --bg: #1f2533; }\n.neu-card {\n  background: var(--bg);\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 6px 6px 12px rgba(0,0,0,.3), -6px -6px 12px rgba(255,255,255,.05);\n}\n.neu-btn {\n  background: var(--bg);\n  border-radius: 8px;\n  padding: 10px 20px;\n  box-shadow: 4px 4px 8px rgba(0,0,0,.2), -4px -4px 8px rgba(255,255,255,.04);\n}`,
        preview: 'background:#1a1e2e;',
        accent: '#8b949e',
      },
      brutalism: {
        name: 'Brutalism',
        emoji: '💪',
        description: 'Bold borders, high contrast, offset shadows, raw aesthetics',
        css: `/* Brutalism Pack */\n.brut-card {\n  background: #ffffff;\n  border: 3px solid #000;\n  box-shadow: 6px 6px 0 #000;\n  padding: 24px;\n  border-radius: 0;\n}\n.brut-btn {\n  background: #ffff00;\n  border: 2px solid #000;\n  box-shadow: 4px 4px 0 #000;\n  font-weight: 900;\n  text-transform: uppercase;\n  padding: 10px 20px;\n  cursor: pointer;\n}\n.brut-btn:hover {\n  transform: translate(2px, 2px);\n  box-shadow: 2px 2px 0 #000;\n}`,
        preview: 'background:#f5f5f5;',
        accent: '#ffff00',
      },
      retro: {
        name: 'Retro / Vaporwave',
        emoji: '📟',
        description: 'Neon colors, dark backgrounds, pixel-inspired',
        css: `/* Retro / Vaporwave Pack */\n:root {\n  --neon: #ff71ce;\n  --neon2: #01cdfe;\n  --bg: #0d0221;\n}\n.retro-card {\n  background: var(--bg);\n  border: 2px solid var(--neon);\n  box-shadow: 0 0 20px var(--neon);\n  border-radius: 4px;\n  padding: 24px;\n}\n.retro-btn {\n  background: transparent;\n  border: 2px solid var(--neon2);\n  color: var(--neon2);\n  box-shadow: 0 0 10px var(--neon2);\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  padding: 10px 20px;\n}`,
        preview: 'background:linear-gradient(180deg,#0d0221,#1a0533);',
        accent: '#ff71ce',
      },
      minimal: {
        name: 'Minimal',
        emoji: '⚪',
        description: 'Maximum whitespace, light borders, no shadows',
        css: `/* Minimal Pack */\n.min-card {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  padding: 24px;\n}\n.min-btn {\n  background: #1a202c;\n  color: #fff;\n  border-radius: 4px;\n  padding: 8px 18px;\n  font-size: 13px;\n  font-weight: 500;\n}\n.min-btn-outline {\n  background: transparent;\n  border: 1px solid #e2e8f0;\n  color: #4a5568;\n  border-radius: 4px;\n  padding: 8px 18px;\n}`,
        preview: 'background:#f8f9fa;',
        accent: '#1a202c',
      },
    };

    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:24px;background:var(--bg0);display:flex;flex-direction:column;gap:16px;';
    preview.appendChild(previewArea);

    const packDisplay = document.createElement('div');
    previewArea.appendChild(packDisplay);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-style-packs-code" style="max-height:260px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-style-packs-code')">Copy CSS Pack</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const pack = PACKS[s.selected] || PACKS.modern;
      packDisplay.innerHTML = `
        <div style="${pack.preview}border-radius:12px;padding:32px;margin-bottom:16px;min-height:160px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;">
          <div style="font-size:32px;">${pack.emoji}</div>
          <div style="font-size:20px;font-weight:800;color:${pack.accent};">${pack.name}</div>
          <div style="font-size:13px;color:rgba(255,255,255,.6);text-align:center;max-width:280px;">${pack.description}</div>
        </div>`;
      document.getElementById('out-style-packs-code').textContent = pack.css;
      onChange(s);
    }

    controls.appendChild(ui$u.makeSectionTitle('Select Style Pack'));
    Object.entries(PACKS).forEach(([key, pack]) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.style.cssText = 'width:100%;text-align:left;margin-bottom:6px;justify-content:flex-start;gap:8px;';
      btn.innerHTML = `${pack.emoji} ${pack.name}`;
      btn.addEventListener('click', () => { s.selected = key; update(); onChange(s); controls.querySelectorAll('.btn-secondary').forEach(b => b.style.borderColor = ''); btn.style.borderColor = 'var(--accent)'; });
      controls.appendChild(btn);
    });
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   12.  TIMING FUNCTION VISUALIZER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'timing-visualizer',
  name: 'Timing Visualizer',
  section: 'utilities',
  icon: '⏱',
  description: 'Compare multiple easing functions side by side',
  keywords: ['timing', 'easing', 'transition', 'animation', 'curve', 'compare'],

  defaultState: { duration:1000 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;padding:24px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const TIMINGS = [
      { name:'linear',       val:'linear',                           color:'#6c63ff' },
      { name:'ease',         val:'ease',                             color:'#a78bfa' },
      { name:'ease-in',      val:'ease-in',                          color:'#3b82f6' },
      { name:'ease-out',     val:'ease-out',                         color:'#10b981' },
      { name:'ease-in-out',  val:'ease-in-out',                      color:'#f59e0b' },
      { name:'bounce-out',   val:'cubic-bezier(.34,1.56,.64,1)',     color:'#ef4444' },
      { name:'back-in',      val:'cubic-bezier(.36,0,.66,-.56)',     color:'#ff71ce' },
    ];

    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:12px;color:var(--text3);margin-bottom:16px;';
    hint.textContent = 'Hover rows to animate all timing functions simultaneously';
    previewArea.appendChild(hint);

    const rows = document.createElement('div');
    rows.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    previewArea.appendChild(rows);

    TIMINGS.forEach(t => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:12px;';

      const label = document.createElement('div');
      label.style.cssText = `font-size:11px;font-family:monospace;color:${t.color};min-width:120px;text-align:right;`;
      label.textContent = t.name;

      const track = document.createElement('div');
      track.style.cssText = 'flex:1;height:6px;background:var(--bg3);border-radius:3px;position:relative;';

      const ball = document.createElement('div');
      ball.style.cssText = `position:absolute;width:16px;height:16px;border-radius:50%;top:-5px;left:-8px;background:${t.color};transition:left ${s.duration}ms ${t.val};`;
      track.appendChild(ball);

      track.addEventListener('mouseenter', () => { ball.style.left = 'calc(100% - 8px)'; });
      track.addEventListener('mouseleave', () => { ball.style.left = '-8px'; });

      row.appendChild(label);
      row.appendChild(track);
      rows.appendChild(row);
    });

    controls.appendChild(ui$u.makeSlider({ label:'Animation Duration', id:'tv-dur', min:200, max:3000, step:100, value:s.duration, unit:'ms', onChange:v=>{s.duration=v;onChange(s);} }));

    const info = document.createElement('div');
    info.style.cssText = 'font-size:12px;color:var(--text2);background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:10px;margin-top:8px;';
    info.innerHTML = `<strong>Tip:</strong> Hover the tracks to see all easing functions animate at the same speed. Notice how different they feel!`;
    controls.appendChild(info);
  },
});
