/**
 * CSS Design Toolbox — Typography Tools (tools-typography.js)
 * Registers: Font Stack, Type Scale, Text Styling, Clamp Generator,
 *            Fluid Spacing, Text Stroke, Readability Tester
 */

'use strict';

const ui$t = CSSToolbox.ui;

/* ══════════════════════════════════════════════════════════
   1.  FONT STACK PICKER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'font-stack',
  name: 'Font Stack',
  section: 'typography',
  icon: '🔤',
  description: 'Pick system and web-safe font stacks',
  keywords: ['font', 'stack', 'serif', 'sans', 'mono', 'system'],

  presets: [
    { name: 'System UI', state: { stack: 'system', customFont:'', size:16, weight:400, color:'#e2e8f0', sampleText:'The quick brown fox jumps over the lazy dog.' }},
    { name: 'Serif', state: { stack: 'serif', customFont:'', size:16, weight:400, color:'#e2e8f0', sampleText:'The quick brown fox jumps over the lazy dog.' }},
    { name: 'Mono', state: { stack: 'mono', customFont:'', size:14, weight:400, color:'#e2e8f0', sampleText:'const greeting = "Hello, World!";' }},
    { name: 'Humanist', state: { stack: 'humanist', customFont:'', size:16, weight:400, color:'#e2e8f0', sampleText:'The quick brown fox jumps over the lazy dog.' }},
    { name: 'Geometric', state: { stack: 'geometric', customFont:'', size:16, weight:400, color:'#e2e8f0', sampleText:'The quick brown fox jumps over the lazy dog.' }},
    { name: 'Transitional', state: { stack: 'transitional', customFont:'', size:16, weight:400, color:'#e2e8f0', sampleText:'The quick brown fox jumps over the lazy dog.' }},
  ],

  defaultState: { stack:'system', customFont:'', size:16, weight:400, color:'#e2e8f0', sampleText:'The quick brown fox jumps over the lazy dog.' },

  render(controls, preview, s, onChange) {
    const STACKS = {
      system:       `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif`,
      serif:        `Georgia, 'Times New Roman', Times, serif`,
      mono:         `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
      humanist:     `Calibri, Optima, Candara, 'Noto Sans', source-sans-pro, sans-serif`,
      geometric:    `Futura, 'Century Gothic', 'Trebuchet MS', sans-serif`,
      transitional: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif`,
      old_style:    `'Palatino Linotype', Palatino, Palladio, 'URW Palladio L', 'Book Antiqua', Baskerville, serif`,
      slab:         `Rockwell, 'Rockwell Nova', 'Roboto Slab', 'DejaVu Serif', 'Sitka Small', serif`,
      cursive:      `Segoe Print, Bradley Hand, Chilanka, TSCu_Comic, casual, cursive`,
      custom:       s.customFont || 'inherit',
    };

    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '280px';
    preview.appendChild(previewArea);

    const textEl = document.createElement('div');
    textEl.style.cssText = `max-width:90%;text-align:center;transition:all .3s;line-height:1.6;`;
    previewArea.appendChild(textEl);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-font-stack-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-font-stack-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const fontFamily = s.stack === 'custom' ? (s.customFont || 'inherit') : STACKS[s.stack];
      textEl.style.fontFamily = fontFamily;
      textEl.style.fontSize = s.size + 'px';
      textEl.style.fontWeight = s.weight;
      textEl.style.color = s.color;
      textEl.textContent = s.sampleText;
      document.getElementById('out-font-stack-code').textContent =
        `font-family: ${fontFamily};\nfont-size: ${s.size}px;\nfont-weight: ${s.weight};`;
      onChange(s);
    }

    const stackOpts = Object.keys(STACKS).map(k => ({ value:k, label:k.replace('_',' ').replace(/\b\w/g, c => c.toUpperCase()) }));
    controls.appendChild(ui$t.makeSelect({ label:'Font Stack', id:'fs-stack', options:stackOpts, value:s.stack, onChange:v=>{s.stack=v;update();} }));
    controls.appendChild(ui$t.makeTextInput({ label:'Custom Font (if Custom selected)', id:'fs-custom', value:s.customFont, placeholder:"'Inter', sans-serif", onChange:v=>{s.customFont=v;if(s.stack==='custom')update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Font Size', id:'fs-size', min:10, max:80, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));

    const WEIGHTS = [100,200,300,400,500,600,700,800,900].map(w => ({ value:String(w), label:String(w) }));
    controls.appendChild(ui$t.makeSelect({ label:'Font Weight', id:'fs-weight', options:WEIGHTS, value:String(s.weight), onChange:v=>{s.weight=Number(v);update();} }));
    controls.appendChild(ui$t.makeColor({ label:'Text Color', id:'fs-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$t.makeTextInput({ label:'Sample Text', id:'fs-sample', value:s.sampleText, onChange:v=>{s.sampleText=v;update();} }));

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   2.  TYPOGRAPHY SCALE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'type-scale',
  name: 'Type Scale',
  section: 'typography',
  icon: '📏',
  description: 'Generate a modular type scale for headings and body text',
  keywords: ['type', 'scale', 'modular', 'heading', 'size', 'rem'],

  presets: [
    { name: 'Minor Second', state: { base:16, ratio:1.067, steps:6, unit:'rem' }},
    { name: 'Major Second', state: { base:16, ratio:1.125, steps:6, unit:'rem' }},
    { name: 'Minor Third', state: { base:16, ratio:1.200, steps:6, unit:'rem' }},
    { name: 'Major Third', state: { base:16, ratio:1.250, steps:6, unit:'rem' }},
    { name: 'Perfect Fourth', state: { base:16, ratio:1.333, steps:6, unit:'rem' }},
    { name: 'Augmented Fourth', state: { base:16, ratio:1.414, steps:6, unit:'rem' }},
    { name: 'Perfect Fifth', state: { base:16, ratio:1.500, steps:6, unit:'rem' }},
    { name: 'Golden Ratio', state: { base:16, ratio:1.618, steps:6, unit:'rem' }},
  ],

  defaultState: { base:16, ratio:1.333, steps:6, unit:'rem' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'flex-direction:column;align-items:flex-start;padding:24px 32px;min-height:320px;';
    preview.appendChild(previewArea);

    const scaleList = document.createElement('ul');
    scaleList.className = 'type-scale-list';
    scaleList.style.cssText = 'width:100%;';
    previewArea.appendChild(scaleList);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-type-scale-code" style="max-height:240px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-type-scale-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const LABELS = ['xs','sm','base','lg','xl','2xl','3xl','4xl','5xl'];

    function update() {
      const baseRem = s.base / 16;
      const sizes = [];
      for (let i = -1; i < s.steps; i++) {
        const size = baseRem * Math.pow(s.ratio, i);
        sizes.push({ label: LABELS[i+1] || `${i+1}xl`, rem: size });
      }
      sizes.reverse();

      scaleList.innerHTML = '';
      sizes.forEach(sz => {
        const li = document.createElement('li');
        li.className = 'type-scale-item';
        li.innerHTML = `
          <span class="type-scale-label">${sz.label}</span>
          <span style="font-size:${sz.rem}rem;font-weight:600;color:var(--text1);line-height:1.2;">${sz.rem.toFixed(3)}rem</span>`;
        scaleList.appendChild(li);
      });

      // CSS output
      const cssLines = [`:root {`];
      sizes.forEach(sz => {
        cssLines.push(`  --text-${sz.label}: ${sz.rem.toFixed(3)}rem;`);
      });
      cssLines.push(`}`);
      document.getElementById('out-type-scale-code').textContent = cssLines.join('\n');

      onChange(s);
    }

    controls.appendChild(ui$t.makeSlider({ label:'Base Size', id:'ts2-base', min:12, max:24, value:s.base, unit:'px', onChange:v=>{s.base=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Ratio', id:'ts2-ratio', min:100, max:200, step:1, value:Math.round(s.ratio*100), unit:'',
      onChange: v => { s.ratio = v/100; document.getElementById('ts2-ratio-val').textContent = (v/100).toFixed(3); update(); } }));
    controls.appendChild(ui$t.makeSlider({ label:'Steps', id:'ts2-steps', min:3, max:9, value:s.steps, unit:'', onChange:v=>{s.steps=v;update();} }));

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   3.  TEXT STYLING TOOL
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'text-styling',
  name: 'Text Styling',
  section: 'typography',
  icon: 'Aa',
  description: 'Control all text properties in one place',
  keywords: ['text', 'font', 'size', 'weight', 'line-height', 'letter-spacing', 'decoration'],

  presets: [
    { name: 'Body Text', state: { size:16, weight:400, lineHeight:1.6, letterSpacing:0, wordSpacing:0, transform:'none', decoration:'none', align:'left', color:'#e2e8f0', italic:false }},
    { name: 'Heading', state: { size:36, weight:800, lineHeight:1.2, letterSpacing:-1, wordSpacing:0, transform:'none', decoration:'none', align:'left', color:'#e2e8f0', italic:false }},
    { name: 'Display', state: { size:60, weight:900, lineHeight:1.1, letterSpacing:-2, wordSpacing:0, transform:'none', decoration:'none', align:'center', color:'#e2e8f0', italic:false }},
    { name: 'Subheading', state: { size:20, weight:600, lineHeight:1.4, letterSpacing:0.2, wordSpacing:0, transform:'none', decoration:'none', align:'left', color:'#94a3b8', italic:false }},
    { name: 'Small Print', state: { size:12, weight:400, lineHeight:1.5, letterSpacing:0, wordSpacing:0, transform:'none', decoration:'none', align:'left', color:'#94a3b8', italic:false }},
    { name: 'Uppercase Label', state: { size:11, weight:700, lineHeight:1.4, letterSpacing:2, wordSpacing:0, transform:'uppercase', decoration:'none', align:'left', color:'#6c63ff', italic:false }},
    { name: 'Italic Quote', state: { size:20, weight:400, lineHeight:1.7, letterSpacing:0, wordSpacing:0, transform:'none', decoration:'none', align:'center', color:'#e2e8f0', italic:true }},
    { name: 'Link Style', state: { size:16, weight:500, lineHeight:1.5, letterSpacing:0, wordSpacing:0, transform:'none', decoration:'underline', align:'left', color:'#6c63ff', italic:false }},
  ],

  defaultState: { size:16, weight:400, lineHeight:1.6, letterSpacing:0, wordSpacing:0, transform:'none', decoration:'none', align:'left', color:'#e2e8f0', italic:false },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;align-items:center;justify-content:center;padding:32px;';
    preview.appendChild(previewArea);

    const textEl = document.createElement('p');
    textEl.style.cssText = 'max-width:500px;transition:all .3s;';
    textEl.contentEditable = 'true';
    textEl.textContent = 'Click to edit this text. Try adjusting the controls to see live changes.';
    previewArea.appendChild(textEl);

    const hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;bottom:8px;font-size:11px;color:var(--text3);';
    hint.textContent = '✏ Click text to edit it';
    previewArea.style.position = 'relative';
    previewArea.appendChild(hint);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-text-styling-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-text-styling-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const TRANSFORMS = ['none','uppercase','lowercase','capitalize'];
    const DECORATIONS = ['none','underline','line-through','overline'];
    const ALIGNS = ['left','center','right','justify'];

    function getCSS() {
      return [
        `font-size: ${s.size}px;`,
        `font-weight: ${s.weight};`,
        `line-height: ${s.lineHeight};`,
        `letter-spacing: ${s.letterSpacing}px;`,
        s.wordSpacing !== 0 ? `word-spacing: ${s.wordSpacing}px;` : null,
        s.transform !== 'none' ? `text-transform: ${s.transform};` : null,
        s.decoration !== 'none' ? `text-decoration: ${s.decoration};` : null,
        `text-align: ${s.align};`,
        `color: ${s.color};`,
        s.italic ? `font-style: italic;` : null,
      ].filter(Boolean).join('\n');
    }

    function update() {
      textEl.style.fontSize = s.size + 'px';
      textEl.style.fontWeight = s.weight;
      textEl.style.lineHeight = s.lineHeight;
      textEl.style.letterSpacing = s.letterSpacing + 'px';
      textEl.style.wordSpacing = s.wordSpacing + 'px';
      textEl.style.textTransform = s.transform;
      textEl.style.textDecoration = s.decoration;
      textEl.style.textAlign = s.align;
      textEl.style.color = s.color;
      textEl.style.fontStyle = s.italic ? 'italic' : 'normal';
      document.getElementById('out-text-styling-code').textContent = getCSS();
      onChange(s);
    }

    controls.appendChild(ui$t.makeSlider({ label:'Font Size', id:'tstyle-size', min:8, max:100, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    const WEIGHTS = [100,200,300,400,500,600,700,800,900].map(w => ({ value:String(w), label:String(w) }));
    controls.appendChild(ui$t.makeSelect({ label:'Font Weight', id:'tstyle-weight', options:WEIGHTS, value:String(s.weight), onChange:v=>{s.weight=Number(v);update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Line Height', id:'tstyle-lh', min:80, max:250, step:5, value:Math.round(s.lineHeight*100), unit:'',
      onChange: v => { s.lineHeight = v/100; document.getElementById('tstyle-lh-val').textContent = (v/100).toFixed(2); update(); } }));
    controls.appendChild(ui$t.makeSlider({ label:'Letter Spacing', id:'tstyle-ls', min:-5, max:20, step:0.5, value:s.letterSpacing, unit:'px', onChange:v=>{s.letterSpacing=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Word Spacing', id:'tstyle-ws', min:-5, max:30, step:1, value:s.wordSpacing, unit:'px', onChange:v=>{s.wordSpacing=v;update();} }));
    controls.appendChild(ui$t.makeSelect({ label:'Transform', id:'tstyle-transform', options:TRANSFORMS, value:s.transform, onChange:v=>{s.transform=v;update();} }));
    controls.appendChild(ui$t.makeSelect({ label:'Decoration', id:'tstyle-decoration', options:DECORATIONS, value:s.decoration, onChange:v=>{s.decoration=v;update();} }));
    controls.appendChild(ui$t.makeSelect({ label:'Text Align', id:'tstyle-align', options:ALIGNS, value:s.align, onChange:v=>{s.align=v;update();} }));
    controls.appendChild(ui$t.makeColor({ label:'Color', id:'tstyle-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$t.makeToggle({ label:'Italic', id:'tstyle-italic', value:s.italic, onChange:v=>{s.italic=v;update();} }));

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   4.  CLAMP() FONT-SIZE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'clamp-generator',
  name: 'Clamp() Generator',
  section: 'typography',
  icon: '↔',
  description: 'Generate responsive font-size with CSS clamp()',
  keywords: ['clamp', 'fluid', 'responsive', 'font-size', 'viewport'],

  presets: [
    { name: 'Body',      state: { minSize:14, maxSize:18, minVw:320, maxVw:1440 }},
    { name: 'H6',        state: { minSize:15, maxSize:20, minVw:320, maxVw:1440 }},
    { name: 'H5',        state: { minSize:16, maxSize:22, minVw:320, maxVw:1440 }},
    { name: 'H4',        state: { minSize:18, maxSize:28, minVw:320, maxVw:1440 }},
    { name: 'H3',        state: { minSize:22, maxSize:36, minVw:320, maxVw:1440 }},
    { name: 'H2',        state: { minSize:28, maxSize:48, minVw:320, maxVw:1440 }},
    { name: 'H1',        state: { minSize:36, maxSize:72, minVw:320, maxVw:1440 }},
    { name: 'Display',   state: { minSize:48, maxSize:96, minVw:320, maxVw:1440 }},
  ],

  defaultState: { minSize:16, maxSize:32, minVw:320, maxVw:1440 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'flex-direction:column;gap:16px;min-height:240px;';
    preview.appendChild(previewArea);

    const demText = document.createElement('div');
    demText.style.cssText = 'font-weight:700;color:var(--text1);transition:font-size .1s;text-align:center;';
    demText.textContent = 'Fluid Text';
    previewArea.appendChild(demText);

    const vwSlider = document.createElement('div');
    vwSlider.style.cssText = 'width:80%;display:flex;flex-direction:column;gap:4px;';
    vwSlider.innerHTML = `
      <label style="font-size:12px;color:var(--text2)">Simulate viewport width: <span id="vw-display">1000</span>px</label>
      <input type="range" id="vw-sim" min="320" max="1440" value="1000" style="width:100%;">`;
    previewArea.appendChild(vwSlider);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-clamp-generator-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-clamp-generator-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function calcClamp() {
      const slope = (s.maxSize - s.minSize) / (s.maxVw - s.minVw);
      const intercept = s.minSize - slope * s.minVw;
      const preferred = `${(slope * 100).toFixed(4)}vw + ${intercept.toFixed(4)}px`;
      return `clamp(${s.minSize}px, ${preferred}, ${s.maxSize}px)`;
    }

    function simFontSize(vw) {
      const slope = (s.maxSize - s.minSize) / (s.maxVw - s.minVw);
      const intercept = s.minSize - slope * s.minVw;
      const raw = slope * vw + intercept;
      return Math.max(s.minSize, Math.min(s.maxSize, raw));
    }

    function update() {
      const clamp = calcClamp();
      document.getElementById('out-clamp-generator-code').textContent = `font-size: ${clamp};`;
      const vw = parseInt(document.getElementById('vw-sim')?.value || 1000);
      const fs = simFontSize(vw);
      demText.style.fontSize = fs + 'px';
      onChange(s);
    }

    document.getElementById('vw-sim')?.addEventListener('input', (e) => {
      document.getElementById('vw-display').textContent = e.target.value;
      update();
    });

    controls.appendChild(ui$t.makeSlider({ label:'Min Font Size', id:'cl-min', min:8, max:80, value:s.minSize, unit:'px', onChange:v=>{s.minSize=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Max Font Size', id:'cl-max', min:8, max:120, value:s.maxSize, unit:'px', onChange:v=>{s.maxSize=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Min Viewport', id:'cl-minvw', min:240, max:600, step:10, value:s.minVw, unit:'px', onChange:v=>{s.minVw=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Max Viewport', id:'cl-maxvw', min:768, max:2560, step:10, value:s.maxVw, unit:'px', onChange:v=>{s.maxVw=v;update();} }));

    // Info box
    const info = document.createElement('div');
    info.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12px;color:var(--text2);margin-top:8px;';
    info.textContent = 'Generates a CSS clamp() that scales from min at minVw to max at maxVw with a smooth fluid transition.';
    controls.appendChild(info);

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   5.  FLUID SPACING GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'fluid-spacing',
  name: 'Fluid Spacing',
  section: 'typography',
  icon: '↕',
  description: 'Generate fluid spacing values using clamp()',
  keywords: ['spacing', 'padding', 'margin', 'fluid', 'clamp', 'responsive'],

  presets: [
    { name: 'XS', state: { minVal:4, maxVal:8, minVw:320, maxVw:1440, property:'padding' }},
    { name: 'SM', state: { minVal:8, maxVal:16, minVw:320, maxVw:1440, property:'padding' }},
    { name: 'MD', state: { minVal:16, maxVal:32, minVw:320, maxVw:1440, property:'padding' }},
    { name: 'LG', state: { minVal:24, maxVal:48, minVw:320, maxVw:1440, property:'padding' }},
    { name: 'XL', state: { minVal:32, maxVal:64, minVw:320, maxVw:1440, property:'padding' }},
    { name: '2XL', state: { minVal:48, maxVal:96, minVw:320, maxVw:1440, property:'padding' }},
    { name: 'Section', state: { minVal:64, maxVal:128, minVw:320, maxVw:1440, property:'padding' }},
  ],

  defaultState: { minVal:16, maxVal:32, minVw:320, maxVw:1440, property:'padding' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '200px';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = 'background:var(--accent);border-radius:8px;color:#fff;font-weight:700;font-size:13px;transition:all .2s;';
    box.textContent = 'Spacing Preview';
    previewArea.appendChild(box);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-fluid-spacing-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-fluid-spacing-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function calcClamp() {
      const slope = (s.maxVal - s.minVal) / (s.maxVw - s.minVw);
      const intercept = s.minVal - slope * s.minVw;
      return `clamp(${s.minVal}px, ${(slope*100).toFixed(4)}vw + ${intercept.toFixed(4)}px, ${s.maxVal}px)`;
    }

    function update() {
      const clamp = calcClamp();
      box.style[s.property] = clamp;
      document.getElementById('out-fluid-spacing-code').textContent =
        `:root {\n  --space: ${clamp};\n}\n.element {\n  ${s.property}: var(--space);\n}`;
      onChange(s);
    }

    const PROPS = ['padding','margin','gap','padding-block','padding-inline','margin-block'];
    controls.appendChild(ui$t.makeSelect({ label:'Property', id:'fsp-prop', options:PROPS, value:s.property, onChange:v=>{s.property=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Min Value', id:'fsp-min', min:0, max:80, value:s.minVal, unit:'px', onChange:v=>{s.minVal=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Max Value', id:'fsp-max', min:0, max:200, value:s.maxVal, unit:'px', onChange:v=>{s.maxVal=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Min Viewport', id:'fsp-minvw', min:240, max:600, step:10, value:s.minVw, unit:'px', onChange:v=>{s.minVw=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Max Viewport', id:'fsp-maxvw', min:768, max:2560, step:10, value:s.maxVw, unit:'px', onChange:v=>{s.maxVw=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   6.  TEXT STROKE / FILL HELPER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'text-stroke',
  name: 'Text Stroke',
  section: 'typography',
  icon: '✒',
  description: 'Outline and stroke effects for text',
  keywords: ['text-stroke', 'stroke', 'outline', 'fill', 'neon', 'hollow'],

  presets: [
    { name: 'None', state: { strokeWidth:0, strokeColor:'#6c63ff', fill:'#e2e8f0', size:60, text:'STROKE', fontWeight:900 }},
    { name: 'Thin Stroke', state: { strokeWidth:1, strokeColor:'#6c63ff', fill:'transparent', size:60, text:'OUTLINE', fontWeight:900 }},
    { name: 'Medium Stroke', state: { strokeWidth:2, strokeColor:'#6c63ff', fill:'#e2e8f0', size:60, text:'STROKE', fontWeight:900 }},
    { name: 'Thick Stroke', state: { strokeWidth:4, strokeColor:'#ff6b6b', fill:'#fff', size:60, text:'THICK', fontWeight:900 }},
    { name: 'Hollow Text', state: { strokeWidth:2, strokeColor:'#e2e8f0', fill:'transparent', size:70, text:'HOLLOW', fontWeight:900 }},
    { name: 'Neon Stroke', state: { strokeWidth:2, strokeColor:'#00ffff', fill:'transparent', size:60, text:'NEON', fontWeight:900 }},
    { name: 'Gradient Look', state: { strokeWidth:3, strokeColor:'#f59e0b', fill:'#6c63ff', size:60, text:'GOLD', fontWeight:900 }},
  ],

  defaultState: { strokeWidth:2, strokeColor:'#6c63ff', fill:'transparent', size:60, text:'STROKE', fontWeight:900 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:240px;background:#111;';
    preview.appendChild(previewArea);

    const textEl = document.createElement('div');
    textEl.style.cssText = 'transition:all .3s;';
    previewArea.appendChild(textEl);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-text-stroke-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-text-stroke-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      textEl.style.fontSize = s.size + 'px';
      textEl.style.fontWeight = s.fontWeight;
      textEl.style.webkitTextStroke = s.strokeWidth ? `${s.strokeWidth}px ${s.strokeColor}` : '0';
      textEl.style.color = s.fill === 'transparent' ? 'transparent' : s.fill;
      textEl.style.webkitTextFillColor = s.fill;
      textEl.textContent = s.text;

      const lines = [];
      if (s.strokeWidth) lines.push(`-webkit-text-stroke: ${s.strokeWidth}px ${s.strokeColor};`);
      if (s.fill !== 'transparent') lines.push(`-webkit-text-fill-color: ${s.fill};`);
      else lines.push(`-webkit-text-fill-color: transparent;`);
      lines.push(`color: ${s.fill};`);

      document.getElementById('out-text-stroke-code').textContent = lines.join('\n');
      onChange(s);
    }

    controls.appendChild(ui$t.makeTextInput({ label:'Text', id:'tsk-text', value:s.text, onChange:v=>{s.text=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Font Size', id:'tsk-size', min:20, max:120, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Stroke Width', id:'tsk-sw', min:0, max:10, step:0.5, value:s.strokeWidth, unit:'px', onChange:v=>{s.strokeWidth=v;update();} }));
    controls.appendChild(ui$t.makeColor({ label:'Stroke Color', id:'tsk-sc', value:s.strokeColor, onChange:v=>{s.strokeColor=v;update();} }));
    controls.appendChild(ui$t.makeColor({ label:'Fill Color', id:'tsk-fill', value:s.fill === 'transparent' ? '#000000' : s.fill, onChange:v=>{s.fill=v;update();} }));
    const hollowToggle = ui$t.makeToggle({ label:'Hollow (transparent fill)', id:'tsk-hollow', value:s.fill === 'transparent',
      onChange: v => { s.fill = v ? 'transparent' : '#e2e8f0'; update(); } });
    controls.appendChild(hollowToggle);
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   7.  PARAGRAPH READABILITY TESTER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'readability',
  name: 'Readability',
  section: 'typography',
  icon: '📖',
  description: 'Test paragraph readability with line length and spacing analysis',
  keywords: ['readability', 'line-length', 'measure', 'paragraph', 'characters'],

  presets: [
    { name: 'Article', state: { maxWidth:680, fontSize:17, lineHeight:1.7, fontFamily:'serif', color:'#e2e8f0', bgColor:'#0d1117' }},
    { name: 'Blog', state: { maxWidth:720, fontSize:16, lineHeight:1.75, fontFamily:'sans-serif', color:'#e2e8f0', bgColor:'#0d1117' }},
    { name: 'Legal', state: { maxWidth:640, fontSize:14, lineHeight:1.8, fontFamily:'serif', color:'#e2e8f0', bgColor:'#0d1117' }},
    { name: 'Code Docs', state: { maxWidth:760, fontSize:15, lineHeight:1.65, fontFamily:'monospace', color:'#e2e8f0', bgColor:'#0d1117' }},
    { name: 'Newsletter', state: { maxWidth:600, fontSize:16, lineHeight:1.6, fontFamily:'sans-serif', color:'#1c2128', bgColor:'#ffffff' }},
  ],

  defaultState: { maxWidth:680, fontSize:17, lineHeight:1.7, fontFamily:'sans-serif', color:'#e2e8f0', bgColor:'#0d1117' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:32px 16px;min-height:300px;';
    preview.appendChild(previewArea);

    const article = document.createElement('article');
    article.style.cssText = 'transition:all .3s;';
    article.innerHTML = `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;
    previewArea.appendChild(article);

    const metrics = document.createElement('div');
    metrics.style.cssText = 'margin-top:16px;font-size:12px;color:var(--text2);display:flex;gap:16px;flex-wrap:wrap;';
    previewArea.appendChild(metrics);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-readability-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-readability-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const ff = s.fontFamily === 'serif' ? 'Georgia, serif' :
                 s.fontFamily === 'mono' ? 'monospace' : 'system-ui, sans-serif';
      article.style.maxWidth = s.maxWidth + 'px';
      article.style.fontSize = s.fontSize + 'px';
      article.style.lineHeight = s.lineHeight;
      article.style.fontFamily = ff;
      article.style.color = s.color;
      article.style.background = s.bgColor;
      article.style.padding = '24px';
      article.style.borderRadius = '8px';
      previewArea.style.background = s.bgColor === '#ffffff' ? '#f0f0f5' : '#0d1117';

      // Estimate CPL (chars per line)
      const charWidth = s.fontSize * 0.52; // rough estimate
      const cpl = Math.round(s.maxWidth / charWidth);
      const optimal = cpl >= 45 && cpl <= 75;

      metrics.innerHTML = `
        <span>Width: <b>${s.maxWidth}px</b></span>
        <span>~${cpl} chars/line <b style="color:${optimal?'var(--success)':'var(--warning)'};">${optimal ? '✓ Good' : '⚠ Aim for 45-75'}</b></span>
        <span>Line Height: <b>${s.lineHeight}</b> ${s.lineHeight >= 1.4 && s.lineHeight <= 1.8 ? '✓' : '⚠'}</span>
        <span>Font Size: <b>${s.fontSize}px</b> ${s.fontSize >= 15 ? '✓' : '⚠ Consider bigger'}</span>`;

      document.getElementById('out-readability-code').textContent =
        `p {\n  max-width: ${s.maxWidth}px;\n  font-size: ${s.fontSize}px;\n  line-height: ${s.lineHeight};\n  font-family: ${ff};\n  color: ${s.color};\n}`;

      onChange(s);
    }

    const FAMILIES = ['sans-serif','serif','mono'];
    controls.appendChild(ui$t.makeSlider({ label:'Max Width', id:'rb-mw', min:400, max:1000, step:10, value:s.maxWidth, unit:'px', onChange:v=>{s.maxWidth=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Font Size', id:'rb-fs', min:12, max:28, value:s.fontSize, unit:'px', onChange:v=>{s.fontSize=v;update();} }));
    controls.appendChild(ui$t.makeSlider({ label:'Line Height', id:'rb-lh', min:100, max:250, step:5, value:Math.round(s.lineHeight*100), unit:'',
      onChange: v => { s.lineHeight = v/100; document.getElementById('rb-lh-val').textContent = (v/100).toFixed(2); update(); } }));
    controls.appendChild(ui$t.makeSelect({ label:'Font Family', id:'rb-ff', options:FAMILIES, value:s.fontFamily, onChange:v=>{s.fontFamily=v;update();} }));
    controls.appendChild(ui$t.makeColor({ label:'Text Color', id:'rb-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$t.makeColor({ label:'Background', id:'rb-bg', value:s.bgColor, onChange:v=>{s.bgColor=v;update();} }));
    update();
  },
});
