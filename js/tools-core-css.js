/**
 * CSS Design Toolbox — Core CSS Generators (tools-core-css.js)
 * Registers: Box Shadow, Text Shadow, Border Radius, Border, Outline,
 *            Opacity, Transform, Filter, Backdrop Filter, Transition,
 *            Animation Keyframe Helper
 */

'use strict';

/* ─── helpers ─────────────────────────────────────────────── */
const ui = CSSToolbox.ui;

function hexToRgba(hex, a = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/* ══════════════════════════════════════════════════════════
   1.  BOX SHADOW GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'box-shadow',
  name: 'Box Shadow',
  section: 'core-css',
  icon: '🌑',
  description: 'Generate layered box-shadow with live preview',
  keywords: ['shadow', 'box', 'blur', 'spread', 'drop', 'depth'],

  presets: [
    { name: 'None', state: { shadows: [{ x:0, y:0, blur:0, spread:0, color:'#000000', alpha:0, inset:false }] } },
    { name: 'Subtle', state: { shadows: [{ x:0, y:2, blur:4, spread:0, color:'#000000', alpha:0.15, inset:false }] } },
    { name: 'Card', state: { shadows: [{ x:0, y:4, blur:12, spread:-2, color:'#000000', alpha:0.25, inset:false }] } },
    { name: 'Raised', state: { shadows: [{ x:0, y:8, blur:24, spread:-4, color:'#000000', alpha:0.35, inset:false }] } },
    { name: 'Deep', state: { shadows: [{ x:0, y:20, blur:60, spread:-10, color:'#000000', alpha:0.5, inset:false }] } },
    { name: 'Inset', state: { shadows: [{ x:0, y:2, blur:8, spread:0, color:'#000000', alpha:0.3, inset:true }] } },
    { name: 'Neon Blue', state: { shadows: [{ x:0, y:0, blur:16, spread:4, color:'#3b82f6', alpha:0.8, inset:false }] } },
    { name: 'Neon Purple', state: { shadows: [{ x:0, y:0, blur:20, spread:6, color:'#8b5cf6', alpha:0.9, inset:false }] } },
    { name: 'Soft UI', state: { shadows: [
      { x:6, y:6, blur:12, spread:0, color:'#000000', alpha:0.2, inset:false },
      { x:-6, y:-6, blur:12, spread:0, color:'#ffffff', alpha:0.07, inset:false }
    ]}},
    { name: 'Multi-layer', state: { shadows: [
      { x:0, y:1, blur:2, spread:0, color:'#000000', alpha:0.1, inset:false },
      { x:0, y:4, blur:8, spread:0, color:'#000000', alpha:0.15, inset:false },
      { x:0, y:16, blur:32, spread:0, color:'#000000', alpha:0.12, inset:false }
    ]}},
  ],

  defaultState: {
    shadows: [{ x:0, y:4, blur:12, spread:0, color:'#000000', alpha:0.25, inset:false }],
    selectedLayer: 0,
    previewBg: '#6c63ff',
    previewShape: 'rounded',
  },

  render(controls, preview, s, onChange) {
    let shadows = s.shadows.map(sh => ({ ...sh }));
    let selected = 0;

    /* ── Preview ── */
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '280px';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = `width:160px;height:100px;border-radius:12px;transition:box-shadow .3s;`;
    previewArea.appendChild(box);

    makeOutputBlock(preview, 'box-shadow');

    /* ── Controls ── */
    controls.appendChild(ui.makeSectionTitle('Layers'));

    const layerList = document.createElement('div');
    layerList.className = 'layers-list';
    controls.appendChild(layerList);

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-secondary btn-sm mt-2';
    addBtn.textContent = '+ Add Shadow Layer';
    addBtn.addEventListener('click', () => {
      shadows.push({ x:0, y:4, blur:8, spread:0, color:'#000000', alpha:0.2, inset:false });
      selected = shadows.length - 1;
      refresh();
    });
    controls.appendChild(addBtn);

    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Layer Controls'));

    const layerControls = document.createElement('div');
    layerControls.id = 'bs-layer-ctrl';
    controls.appendChild(layerControls);

    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Preview'));

    const bgColor = ui.makeColor({ label:'Box Color', id:'bs-bg', value: s.previewBg || '#6c63ff',
      onChange: v => { box.style.background = v; } });
    controls.appendChild(bgColor);

    const shapeOptions = [
      { value:'none', label:'Square' },
      { value:'rounded', label:'Rounded' },
      { value:'circle', label:'Circle' },
    ];
    controls.appendChild(ui.makeSelect({ label:'Shape', id:'bs-shape', options: shapeOptions, value:'rounded',
      onChange: v => {
        const r = v === 'circle' ? '50%' : v === 'rounded' ? '12px' : '0';
        box.style.borderRadius = r;
      }
    }));

    function makeOutputBlock(container, id) {
      const out = document.createElement('div');
      out.className = 'output-area';
      out.innerHTML = `
        <div class="output-tabs">
          <button class="output-tab active" data-tab="css">CSS</button>
        </div>
        <div class="output-content active">
          <pre class="output-code" id="out-${id}-code">/* ... */</pre>
          <div class="copy-row">
            <button class="btn btn-secondary btn-sm" id="out-${id}-copy">Copy CSS</button>
          </div>
        </div>`;
      container.appendChild(out);
      out.querySelector(`#out-${id}-copy`).addEventListener('click', () => CSSToolbox.copyCode(`out-${id}-code`));
    }

    function getCSS() {
      const parts = shadows.map(sh => {
        const inset = sh.inset ? 'inset ' : '';
        return `${inset}${sh.x}px ${sh.y}px ${sh.blur}px ${sh.spread}px ${hexToRgba(sh.color, sh.alpha)}`;
      });
      return `box-shadow: ${parts.join(',\n             ')};`;
    }

    function refresh() {
      // Rebuild layer list
      layerList.innerHTML = '';
      shadows.forEach((sh, i) => {
        const item = document.createElement('div');
        item.className = 'layer-item' + (i === selected ? ' selected' : '');
        item.innerHTML = `<span class="layer-label">Shadow ${i + 1}${sh.inset ? ' (inset)' : ''}</span>
          <span class="layer-del" title="Delete">✕</span>`;
        item.querySelector('.layer-label').addEventListener('click', () => { selected = i; refresh(); });
        item.querySelector('.layer-del').addEventListener('click', (e) => {
          e.stopPropagation();
          if (shadows.length > 1) { shadows.splice(i, 1); selected = Math.min(selected, shadows.length-1); refresh(); }
        });
        layerList.appendChild(item);
      });

      // Rebuild layer controls for selected
      layerControls.innerHTML = '';
      const sh = shadows[selected];

      layerControls.appendChild(ui.makeSlider({ label:'X Offset', id:'bs-x', min:-60, max:60, value:sh.x, unit:'px',
        onChange: v => { sh.x = v; update(); } }));
      layerControls.appendChild(ui.makeSlider({ label:'Y Offset', id:'bs-y', min:-60, max:60, value:sh.y, unit:'px',
        onChange: v => { sh.y = v; update(); } }));
      layerControls.appendChild(ui.makeSlider({ label:'Blur', id:'bs-blur', min:0, max:100, value:sh.blur, unit:'px',
        onChange: v => { sh.blur = v; update(); } }));
      layerControls.appendChild(ui.makeSlider({ label:'Spread', id:'bs-spread', min:-30, max:60, value:sh.spread, unit:'px',
        onChange: v => { sh.spread = v; update(); } }));
      layerControls.appendChild(ui.makeSlider({ label:'Opacity', id:'bs-alpha', min:0, max:100, value:Math.round(sh.alpha*100), unit:'%',
        onChange: v => { sh.alpha = v/100; update(); } }));
      layerControls.appendChild(ui.makeColor({ label:'Color', id:'bs-color', value:sh.color,
        onChange: v => { sh.color = v; update(); } }));
      layerControls.appendChild(ui.makeToggle({ label:'Inset', id:'bs-inset', value:sh.inset,
        onChange: v => { sh.inset = v; refresh(); update(); } }));

      update();
    }

    function update() {
      const css = getCSS();
      box.style.boxShadow = shadows.map(sh => {
        const inset = sh.inset ? 'inset ' : '';
        return `${inset}${sh.x}px ${sh.y}px ${sh.blur}px ${sh.spread}px ${hexToRgba(sh.color, sh.alpha)}`;
      }).join(',');
      const codeEl = document.getElementById('out-box-shadow-code');
      if (codeEl) codeEl.textContent = css;
      s.shadows = shadows.map(sh => ({...sh}));
      onChange(s);
    }

    // Initial box color
    box.style.background = s.previewBg || '#6c63ff';
    refresh();
  },

  randomize(s) {
    return { ...s, shadows: [{ x:randInt(-20,20), y:randInt(0,30), blur:randInt(4,40), spread:randInt(-5,10),
      color:`#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}`,
      alpha: Math.random()*0.8+0.1, inset: Math.random() > 0.8 }]
    };
  },
});

/* ══════════════════════════════════════════════════════════
   2.  TEXT SHADOW GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'text-shadow',
  name: 'Text Shadow',
  section: 'core-css',
  icon: '🖋',
  description: 'Generate text-shadow CSS with multiple layers',
  keywords: ['text', 'shadow', 'glow', 'neon', 'letterpress'],

  presets: [
    { name: 'None', state: { shadows:[{ x:0, y:0, blur:0, color:'#000000', alpha:0 }], text:'Hello World', fontSize:48 }},
    { name: 'Subtle', state: { shadows:[{ x:1, y:1, blur:3, color:'#000000', alpha:0.3 }], text:'Hello World', fontSize:48 }},
    { name: 'Hard', state: { shadows:[{ x:2, y:2, blur:0, color:'#000000', alpha:0.6 }], text:'Hello World', fontSize:48 }},
    { name: 'Letterpress', state: { shadows:[
      { x:0, y:1, blur:0, color:'#ffffff', alpha:0.5 },
      { x:0, y:-1, blur:0, color:'#000000', alpha:0.2 }
    ], text:'Hello World', fontSize:48 }},
    { name: 'Neon', state: { shadows:[
      { x:0, y:0, blur:6, color:'#00ffff', alpha:1 },
      { x:0, y:0, blur:20, color:'#00ffff', alpha:0.8 },
      { x:0, y:0, blur:40, color:'#00bfff', alpha:0.5 }
    ], text:'NEON', fontSize:60 }},
    { name: 'Emboss', state: { shadows:[
      { x:-2, y:-2, blur:3, color:'#ffffff', alpha:0.3 },
      { x:2, y:2, blur:3, color:'#000000', alpha:0.3 }
    ], text:'Emboss', fontSize:48 }},
    { name: 'Fire', state: { shadows:[
      { x:0, y:0, blur:4, color:'#ff4500', alpha:1 },
      { x:0, y:0, blur:12, color:'#ff8c00', alpha:0.9 },
      { x:0, y:0, blur:28, color:'#ffff00', alpha:0.7 }
    ], text:'FIRE', fontSize:60 }},
    { name: 'Retro', state: { shadows:[
      { x:3, y:3, blur:0, color:'#ff6b6b', alpha:1 },
      { x:6, y:6, blur:0, color:'#4ecdc4', alpha:1 }
    ], text:'Retro', fontSize:52 }},
  ],

  defaultState: {
    shadows: [{ x:1, y:1, blur:3, color:'#000000', alpha:0.3 }],
    text: 'Hello World',
    fontSize: 48,
    textColor: '#e2e8f0',
    selectedLayer: 0,
  },

  render(controls, preview, s, onChange) {
    let shadows = s.shadows.map(sh => ({...sh}));
    let selected = 0;

    /* Preview */
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;background:#0d1117;';
    preview.appendChild(previewArea);

    const textEl = document.createElement('div');
    textEl.className = 'preview-text';
    textEl.style.cssText = `font-size:${s.fontSize||48}px;font-weight:700;color:${s.textColor||'#e2e8f0'};transition:text-shadow .3s;`;
    textEl.textContent = s.text || 'Hello World';
    previewArea.appendChild(textEl);

    /* Output */
    const outputWrap = document.createElement('div');
    outputWrap.className = 'output-area';
    outputWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-text-shadow-code">/* ... */</pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-text-shadow-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outputWrap);

    /* Controls */
    controls.appendChild(ui.makeSectionTitle('Preview Text'));
    controls.appendChild(ui.makeTextInput({ label:'Text Content', id:'ts-text', value: s.text||'Hello World',
      onChange: v => { textEl.textContent = v; s.text = v; onChange(s); } }));
    controls.appendChild(ui.makeSlider({ label:'Font Size', id:'ts-size', min:16, max:120, value:s.fontSize||48, unit:'px',
      onChange: v => { textEl.style.fontSize = v+'px'; s.fontSize = v; onChange(s); } }));
    controls.appendChild(ui.makeColor({ label:'Text Color', id:'ts-tcolor', value:s.textColor||'#e2e8f0',
      onChange: v => { textEl.style.color = v; s.textColor = v; onChange(s); } }));

    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Shadow Layers'));

    const layerList = document.createElement('div');
    layerList.className = 'layers-list';
    controls.appendChild(layerList);

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-secondary btn-sm mt-2';
    addBtn.textContent = '+ Add Layer';
    addBtn.addEventListener('click', () => {
      shadows.push({ x:2, y:2, blur:4, color:'#6c63ff', alpha:0.8 });
      selected = shadows.length - 1;
      refresh();
    });
    controls.appendChild(addBtn);

    controls.appendChild(ui.makeDivider());
    const layerControls = document.createElement('div');
    controls.appendChild(layerControls);

    function getCSS() {
      const parts = shadows.map(sh =>
        `${sh.x}px ${sh.y}px ${sh.blur}px ${hexToRgba(sh.color, sh.alpha)}`);
      return `text-shadow: ${parts.join(',\n             ')};`;
    }

    function update() {
      textEl.style.textShadow = shadows.map(sh =>
        `${sh.x}px ${sh.y}px ${sh.blur}px ${hexToRgba(sh.color, sh.alpha)}`).join(',');
      document.getElementById('out-text-shadow-code').textContent = getCSS();
      s.shadows = shadows.map(sh=>({...sh}));
      onChange(s);
    }

    function refresh() {
      layerList.innerHTML = '';
      shadows.forEach((sh, i) => {
        const item = document.createElement('div');
        item.className = 'layer-item' + (i===selected?' selected':'');
        item.innerHTML = `<span class="layer-label">Shadow ${i+1}</span><span class="layer-del">✕</span>`;
        item.querySelector('.layer-label').addEventListener('click', ()=>{ selected=i; refresh(); });
        item.querySelector('.layer-del').addEventListener('click', e => {
          e.stopPropagation();
          if (shadows.length>1) { shadows.splice(i,1); selected=Math.min(selected,shadows.length-1); refresh(); }
        });
        layerList.appendChild(item);
      });
      layerControls.innerHTML = '';
      const sh = shadows[selected];
      layerControls.appendChild(ui.makeSlider({ label:'X', id:'ts-x', min:-20, max:20, value:sh.x, unit:'px', onChange:v=>{sh.x=v;update();} }));
      layerControls.appendChild(ui.makeSlider({ label:'Y', id:'ts-y', min:-20, max:20, value:sh.y, unit:'px', onChange:v=>{sh.y=v;update();} }));
      layerControls.appendChild(ui.makeSlider({ label:'Blur', id:'ts-blur', min:0, max:60, value:sh.blur, unit:'px', onChange:v=>{sh.blur=v;update();} }));
      layerControls.appendChild(ui.makeSlider({ label:'Opacity', id:'ts-alpha', min:0, max:100, value:Math.round(sh.alpha*100), unit:'%', onChange:v=>{sh.alpha=v/100;update();} }));
      layerControls.appendChild(ui.makeColor({ label:'Color', id:'ts-color', value:sh.color, onChange:v=>{sh.color=v;update();} }));
      update();
    }
    refresh();
  },
});

/* ══════════════════════════════════════════════════════════
   3.  BORDER RADIUS GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'border-radius',
  name: 'Border Radius',
  section: 'core-css',
  icon: '⬜',
  description: 'Fine-tune corner radii with per-corner or linked controls',
  keywords: ['border', 'radius', 'corner', 'rounded', 'pill', 'squircle'],

  presets: [
    { name: 'None',     state: { tl:0,  tr:0,  br:0,  bl:0,  linked:true }},
    { name: 'Slight',   state: { tl:4,  tr:4,  br:4,  bl:4,  linked:true }},
    { name: 'Rounded',  state: { tl:8,  tr:8,  br:8,  bl:8,  linked:true }},
    { name: 'Smooth',   state: { tl:12, tr:12, br:12, bl:12, linked:true }},
    { name: 'Large',    state: { tl:24, tr:24, br:24, bl:24, linked:true }},
    { name: 'Pill',     state: { tl:9999,tr:9999,br:9999,bl:9999,linked:true }},
    { name: 'Circle',   state: { tl:50, tr:50, br:50, bl:50, linked:true }},
    { name: 'Card',     state: { tl:16, tr:16, br:16, bl:16, linked:true }},
    { name: 'Chat',     state: { tl:20, tr:20, br:4,  bl:20, linked:false }},
    { name: 'Top Only', state: { tl:16, tr:16, br:0,  bl:0,  linked:false }},
    { name: 'Diagonal', state: { tl:0,  tr:24, br:0,  bl:24, linked:false }},
  ],

  defaultState: { tl:8, tr:8, br:8, bl:8, linked:true },

  render(controls, preview, s, onChange) {
    /* Preview */
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = 'width:200px;height:120px;background:var(--accent);transition:border-radius .3s;';
    previewArea.appendChild(box);

    /* Output */
    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-border-radius-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-border-radius-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const { tl, tr, br, bl } = s;
      if (s.linked) return `border-radius: ${tl}px;`;
      if (tl === tr && bl === br && tl === bl) return `border-radius: ${tl}px;`;
      return `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
    }

    function update() {
      box.style.borderRadius = `${s.tl}px ${s.tr}px ${s.br}px ${s.bl}px`;
      document.getElementById('out-border-radius-code').textContent = getCSS();
      onChange(s);
    }

    const linked = { value: s.linked };

    controls.appendChild(ui.makeToggle({ label:'Link all corners', id:'br-linked', value:s.linked,
      onChange: v => { linked.value = v; s.linked = v; buildControls(); } }));
    controls.appendChild(ui.makeDivider());

    const ctrlContainer = document.createElement('div');
    controls.appendChild(ctrlContainer);

    function buildControls() {
      ctrlContainer.innerHTML = '';
      if (s.linked) {
        ctrlContainer.appendChild(ui.makeSlider({ label:'All Corners', id:'br-all', min:0, max:200, value:s.tl, unit:'px',
          onChange: v => { s.tl=s.tr=s.br=s.bl=v; update(); } }));
      } else {
        [['tl','Top Left'],['tr','Top Right'],['br','Bottom Right'],['bl','Bottom Left']].forEach(([k,lbl]) => {
          ctrlContainer.appendChild(ui.makeSlider({ label:lbl, id:`br-${k}`, min:0, max:200, value:s[k], unit:'px',
            onChange: v => { s[k]=v; update(); } }));
        });
      }
    }

    buildControls();
    update();
  },

  randomize(s) {
    const v = () => randInt(0, 100);
    return { tl:v(), tr:v(), br:v(), bl:v(), linked:false };
  },
});

/* ══════════════════════════════════════════════════════════
   4.  BORDER GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'border',
  name: 'Border',
  section: 'core-css',
  icon: '▭',
  description: 'Design borders with per-side controls and style options',
  keywords: ['border', 'stroke', 'outline', 'dashed', 'dotted'],

  presets: [
    { name: 'None',      state: { width:0,  style:'solid',  color:'#6c63ff', mode:'all', top:1, right:1, bottom:1, left:1, radius:0 }},
    { name: 'Thin',      state: { width:1,  style:'solid',  color:'#6c63ff', mode:'all', top:1, right:1, bottom:1, left:1, radius:4 }},
    { name: 'Medium',    state: { width:2,  style:'solid',  color:'#6c63ff', mode:'all', top:2, right:2, bottom:2, left:2, radius:8 }},
    { name: 'Thick',     state: { width:4,  style:'solid',  color:'#6c63ff', mode:'all', top:4, right:4, bottom:4, left:4, radius:8 }},
    { name: 'Dashed',    state: { width:2,  style:'dashed', color:'#6c63ff', mode:'all', top:2, right:2, bottom:2, left:2, radius:8 }},
    { name: 'Dotted',    state: { width:2,  style:'dotted', color:'#6c63ff', mode:'all', top:2, right:2, bottom:2, left:2, radius:8 }},
    { name: 'Double',    state: { width:4,  style:'double', color:'#6c63ff', mode:'all', top:4, right:4, bottom:4, left:4, radius:8 }},
    { name: 'Groove',    state: { width:4,  style:'groove', color:'#6c63ff', mode:'all', top:4, right:4, bottom:4, left:4, radius:8 }},
    { name: 'Bottom',    state: { width:2,  style:'solid',  color:'#6c63ff', mode:'sides',top:0,right:0,bottom:2,left:0, radius:0 }},
    { name: 'Left Bar',  state: { width:4,  style:'solid',  color:'#6c63ff', mode:'sides',top:0,right:0,bottom:0,left:4, radius:0 }},
  ],

  defaultState: { width:2, style:'solid', color:'#6c63ff', mode:'all', top:2, right:2, bottom:2, left:2, radius:8 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = 'width:200px;height:120px;background:var(--bg2);transition:all .3s;';
    previewArea.appendChild(box);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-border-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-border-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const STYLES = ['solid','dashed','dotted','double','groove','ridge','inset','outset','none'];

    function getCSS() {
      if (s.mode === 'all') {
        const lines = [`border-radius: ${s.radius}px;`];
        if (s.width === 0) lines.unshift('border: none;');
        else lines.unshift(`border: ${s.width}px ${s.style} ${s.color};`);
        return lines.join('\n');
      }
      const lines = [`border-radius: ${s.radius}px;`];
      ['top','right','bottom','left'].forEach(side => {
        if (s[side]) lines.push(`border-${side}: ${s[side]}px ${s.style} ${s.color};`);
      });
      return lines.join('\n');
    }

    function update() {
      box.style.borderRadius = s.radius + 'px';
      if (s.mode === 'all') {
        box.style.border = s.width ? `${s.width}px ${s.style} ${s.color}` : 'none';
        box.style.borderTop = box.style.borderRight = box.style.borderBottom = box.style.borderLeft = '';
      } else {
        box.style.border = 'none';
        ['top','right','bottom','left'].forEach(side => {
          box.style[`border${side.charAt(0).toUpperCase()+side.slice(1)}`] = s[side] ? `${s[side]}px ${s.style} ${s.color}` : 'none';
        });
      }
      document.getElementById('out-border-code').textContent = getCSS();
      onChange(s);
    }

    controls.appendChild(ui.makeSelect({ label:'Mode', id:'brd-mode', options:[{value:'all',label:'All Sides'},{value:'sides',label:'Per Side'}], value:s.mode,
      onChange: v => { s.mode = v; buildSideControls(); update(); } }));
    controls.appendChild(ui.makeSelect({ label:'Style', id:'brd-style', options:STYLES, value:s.style,
      onChange: v => { s.style = v; update(); } }));
    controls.appendChild(ui.makeColor({ label:'Color', id:'brd-color', value:s.color,
      onChange: v => { s.color = v; update(); } }));
    controls.appendChild(ui.makeSlider({ label:'Border Radius', id:'brd-radius', min:0, max:80, value:s.radius, unit:'px',
      onChange: v => { s.radius = v; update(); } }));

    controls.appendChild(ui.makeDivider());
    const sideContainer = document.createElement('div');
    controls.appendChild(sideContainer);

    function buildSideControls() {
      sideContainer.innerHTML = '';
      if (s.mode === 'all') {
        sideContainer.appendChild(ui.makeSlider({ label:'Width', id:'brd-w', min:0, max:20, value:s.width, unit:'px',
          onChange: v => { s.width = v; update(); } }));
      } else {
        ['top','right','bottom','left'].forEach(side => {
          sideContainer.appendChild(ui.makeSlider({ label:`${side.charAt(0).toUpperCase()+side.slice(1)} Width`, id:`brd-${side}`, min:0, max:20, value:s[side], unit:'px',
            onChange: v => { s[side] = v; update(); } }));
        });
      }
    }

    buildSideControls();
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   5.  OUTLINE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'outline',
  name: 'Outline',
  section: 'core-css',
  icon: '◻',
  description: 'Generate focus-ring / outline styles',
  keywords: ['outline', 'focus', 'ring', 'accessibility'],

  presets: [
    { name: 'None', state: { width:0, style:'solid', color:'#6c63ff', offset:0 }},
    { name: 'Focus Ring', state: { width:2, style:'solid', color:'#6c63ff', offset:2 }},
    { name: 'Thick', state: { width:4, style:'solid', color:'#6c63ff', offset:0 }},
    { name: 'Dashed', state: { width:2, style:'dashed', color:'#6c63ff', offset:3 }},
    { name: 'Dotted', state: { width:2, style:'dotted', color:'#6c63ff', offset:2 }},
    { name: 'Offset In', state: { width:2, style:'solid', color:'#e2e8f0', offset:-4 }},
    { name: 'WCAG 2.2', state: { width:3, style:'solid', color:'#ffbf00', offset:0 }},
    { name: 'Double', state: { width:3, style:'double', color:'#6c63ff', offset:0 }},
  ],

  defaultState: { width:2, style:'solid', color:'#6c63ff', offset:2 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = 'width:200px;height:80px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;';
    box.textContent = 'Focused Element';
    previewArea.appendChild(box);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-outline-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-outline-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      if (s.width === 0) {
        box.style.outline = 'none';
        box.style.outlineOffset = '';
        document.getElementById('out-outline-code').textContent = 'outline: none;';
      } else {
        box.style.outline = `${s.width}px ${s.style} ${s.color}`;
        box.style.outlineOffset = `${s.offset}px`;
        document.getElementById('out-outline-code').textContent =
          `outline: ${s.width}px ${s.style} ${s.color};\noutline-offset: ${s.offset}px;`;
      }
      onChange(s);
    }

    const STYLES = ['solid','dashed','dotted','double','groove','ridge'];
    controls.appendChild(ui.makeSlider({ label:'Width', id:'ol-w', min:0, max:12, value:s.width, unit:'px', onChange:v=>{s.width=v;update();} }));
    controls.appendChild(ui.makeSelect({ label:'Style', id:'ol-style', options:STYLES, value:s.style, onChange:v=>{s.style=v;update();} }));
    controls.appendChild(ui.makeColor({ label:'Color', id:'ol-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Offset', id:'ol-offset', min:-10, max:20, value:s.offset, unit:'px', onChange:v=>{s.offset=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   6.  OPACITY / TRANSPARENCY
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'opacity',
  name: 'Opacity',
  section: 'core-css',
  icon: '👁',
  description: 'Control element opacity and RGBA color transparency',
  keywords: ['opacity', 'transparency', 'alpha', 'rgba'],

  presets: [
    { name: 'Opaque',    state: { opacity:100, color:'#6c63ff' }},
    { name: '90%',       state: { opacity:90,  color:'#6c63ff' }},
    { name: '75%',       state: { opacity:75,  color:'#6c63ff' }},
    { name: '50%',       state: { opacity:50,  color:'#6c63ff' }},
    { name: '25%',       state: { opacity:25,  color:'#6c63ff' }},
    { name: 'Ghost',     state: { opacity:10,  color:'#6c63ff' }},
    { name: 'Invisible', state: { opacity:0,   color:'#6c63ff' }},
  ],

  defaultState: { opacity:75, color:'#6c63ff' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area checkered';
    preview.appendChild(previewArea);

    const stack = document.createElement('div');
    stack.style.cssText = 'position:relative;width:200px;height:120px;';
    previewArea.appendChild(stack);

    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;background:linear-gradient(135deg,#ff6b6b,#feca57,#48dbfb);border-radius:8px;';
    stack.appendChild(bg);

    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;inset:0;border-radius:8px;transition:opacity .3s;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;';
    box.style.background = s.color;
    box.textContent = `${s.opacity}%`;
    stack.appendChild(box);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-opacity-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-opacity-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      box.style.opacity = s.opacity / 100;
      box.textContent = s.opacity + '%';
      document.getElementById('out-opacity-code').textContent =
        `opacity: ${(s.opacity/100).toFixed(2)};`;
      onChange(s);
    }

    controls.appendChild(ui.makeSlider({ label:'Opacity', id:'op-val', min:0, max:100, value:s.opacity, unit:'%',
      onChange: v => { s.opacity = v; update(); } }));
    controls.appendChild(ui.makeColor({ label:'Element Color', id:'op-color', value:s.color,
      onChange: v => { s.color = v; box.style.background = v; } }));

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   7.  TRANSFORM GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'transform',
  name: 'Transform',
  section: 'core-css',
  icon: '↗',
  description: 'Combine translate, scale, rotate, and skew transforms',
  keywords: ['transform', 'rotate', 'scale', 'translate', 'skew', 'matrix'],

  presets: [
    { name: 'None',       state: { tx:0, ty:0, sx:1, sy:1, r:0, skx:0, sky:0, perspective:0 }},
    { name: 'Scale Up',   state: { tx:0, ty:0, sx:1.2, sy:1.2, r:0, skx:0, sky:0, perspective:0 }},
    { name: 'Rotate 45',  state: { tx:0, ty:0, sx:1, sy:1, r:45, skx:0, sky:0, perspective:0 }},
    { name: 'Flip H',     state: { tx:0, ty:0, sx:-1, sy:1, r:0, skx:0, sky:0, perspective:0 }},
    { name: 'Flip V',     state: { tx:0, ty:0, sx:1, sy:-1, r:0, skx:0, sky:0, perspective:0 }},
    { name: 'Tilt',       state: { tx:0, ty:0, sx:1, sy:1, r:15, skx:10, sky:0, perspective:0 }},
    { name: 'Shrink',     state: { tx:0, ty:0, sx:0.6, sy:0.6, r:0, skx:0, sky:0, perspective:0 }},
    { name: 'Skew',       state: { tx:0, ty:0, sx:1, sy:1, r:0, skx:20, sky:0, perspective:0 }},
    { name: 'Float Up',   state: { tx:0, ty:-20, sx:1.05, sy:1.05, r:0, skx:0, sky:0, perspective:0 }},
    { name: 'Spin + Scale', state: { tx:0, ty:0, sx:1.1, sy:1.1, r:180, skx:0, sky:0, perspective:0 }},
  ],

  defaultState: { tx:0, ty:0, sx:1, sy:1, r:0, skx:0, sky:0, perspective:0 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '300px';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = 'width:120px;height:80px;background:var(--accent);border-radius:8px;transition:transform .3s;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;';
    box.textContent = 'Transform';
    previewArea.appendChild(box);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-transform-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-transform-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const parts = [];
      if (s.tx !== 0 || s.ty !== 0) parts.push(`translate(${s.tx}px, ${s.ty}px)`);
      if (s.sx !== 1 || s.sy !== 1) parts.push(`scale(${s.sx}, ${s.sy})`);
      if (s.r !== 0) parts.push(`rotate(${s.r}deg)`);
      if (s.skx !== 0 || s.sky !== 0) parts.push(`skew(${s.skx}deg, ${s.sky}deg)`);
      return parts.length ? `transform: ${parts.join(' ')};` : 'transform: none;';
    }

    function update() {
      box.style.transform = getCSS().replace('transform: ', '').replace(';', '');
      document.getElementById('out-transform-code').textContent = getCSS();
      onChange(s);
    }

    controls.appendChild(ui.makeSectionTitle('Translate'));
    controls.appendChild(ui.makeSlider({ label:'X', id:'tr-tx', min:-200, max:200, value:s.tx, unit:'px', onChange:v=>{s.tx=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Y', id:'tr-ty', min:-200, max:200, value:s.ty, unit:'px', onChange:v=>{s.ty=v;update();} }));
    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Scale'));
    controls.appendChild(ui.makeSlider({ label:'X', id:'tr-sx', min:0, max:300, step:5, value:Math.round(s.sx*100), unit:'%',
      onChange:v=>{s.sx=v/100;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Y', id:'tr-sy', min:0, max:300, step:5, value:Math.round(s.sy*100), unit:'%',
      onChange:v=>{s.sy=v/100;update();} }));
    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Rotate'));
    controls.appendChild(ui.makeSlider({ label:'Degrees', id:'tr-r', min:-360, max:360, value:s.r, unit:'°', onChange:v=>{s.r=v;update();} }));
    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Skew'));
    controls.appendChild(ui.makeSlider({ label:'X', id:'tr-skx', min:-60, max:60, value:s.skx, unit:'°', onChange:v=>{s.skx=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Y', id:'tr-sky', min:-60, max:60, value:s.sky, unit:'°', onChange:v=>{s.sky=v;update();} }));
    update();
  },

  randomize(s) {
    return { tx:randInt(-50,50), ty:randInt(-50,50), sx:+(Math.random()*1.5+0.3).toFixed(2), sy:+(Math.random()*1.5+0.3).toFixed(2),
      r:randInt(-180,180), skx:randInt(-30,30), sky:randInt(-20,20), perspective:0 };
  },
});

/* ══════════════════════════════════════════════════════════
   8.  FILTER GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'filter',
  name: 'CSS Filter',
  section: 'core-css',
  icon: '🎛',
  description: 'Apply blur, brightness, contrast, saturate, hue-rotate, etc.',
  keywords: ['filter', 'blur', 'brightness', 'contrast', 'saturate', 'sepia', 'grayscale', 'hue'],

  presets: [
    { name: 'None',      state: { blur:0, brightness:100, contrast:100, saturate:100, grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 }},
    { name: 'Vintage',   state: { blur:0, brightness:95,  contrast:90,  saturate:80,  grayscale:0, sepia:30, hueRotate:0, invert:0, opacity:100 }},
    { name: 'Grayscale', state: { blur:0, brightness:100, contrast:100, saturate:0,   grayscale:100, sepia:0, hueRotate:0, invert:0, opacity:100 }},
    { name: 'Vivid',     state: { blur:0, brightness:110, contrast:120, saturate:180, grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 }},
    { name: 'Cool',      state: { blur:0, brightness:100, contrast:100, saturate:100, grayscale:0, sepia:0, hueRotate:200, invert:0, opacity:100 }},
    { name: 'Warm',      state: { blur:0, brightness:105, contrast:100, saturate:110, grayscale:0, sepia:20, hueRotate:30, invert:0, opacity:100 }},
    { name: 'Blur',      state: { blur:8, brightness:100, contrast:100, saturate:100, grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 }},
    { name: 'Inverted',  state: { blur:0, brightness:100, contrast:100, saturate:100, grayscale:0, sepia:0, hueRotate:0, invert:100, opacity:100 }},
    { name: 'Neon',      state: { blur:0, brightness:120, contrast:150, saturate:200, grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 }},
    { name: 'Faded',     state: { blur:0, brightness:110, contrast:70,  saturate:60,  grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 }},
  ],

  defaultState: { blur:0, brightness:100, contrast:100, saturate:100, grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '280px';
    preview.appendChild(previewArea);

    const img = document.createElement('div');
    img.style.cssText = 'width:280px;height:180px;border-radius:8px;background:linear-gradient(135deg,#667eea,#764ba2 40%,#f64f59,#c0392b);transition:filter .3s;';
    previewArea.appendChild(img);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-filter-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-filter-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const parts = [];
      if (s.blur)       parts.push(`blur(${s.blur}px)`);
      if (s.brightness !== 100) parts.push(`brightness(${s.brightness}%)`);
      if (s.contrast !== 100)   parts.push(`contrast(${s.contrast}%)`);
      if (s.saturate !== 100)   parts.push(`saturate(${s.saturate}%)`);
      if (s.grayscale)  parts.push(`grayscale(${s.grayscale}%)`);
      if (s.sepia)      parts.push(`sepia(${s.sepia}%)`);
      if (s.hueRotate)  parts.push(`hue-rotate(${s.hueRotate}deg)`);
      if (s.invert)     parts.push(`invert(${s.invert}%)`);
      if (s.opacity !== 100) parts.push(`opacity(${s.opacity}%)`);
      return parts.length ? `filter: ${parts.join(' ')};` : 'filter: none;';
    }

    function update() {
      img.style.filter = getCSS().replace('filter: ','').replace(';','');
      document.getElementById('out-filter-code').textContent = getCSS();
      onChange(s);
    }

    const filterDefs = [
      { label:'Blur',       key:'blur',       min:0, max:30, step:0.5, unit:'px' },
      { label:'Brightness', key:'brightness', min:0, max:300, unit:'%' },
      { label:'Contrast',   key:'contrast',   min:0, max:300, unit:'%' },
      { label:'Saturate',   key:'saturate',   min:0, max:400, unit:'%' },
      { label:'Grayscale',  key:'grayscale',  min:0, max:100, unit:'%' },
      { label:'Sepia',      key:'sepia',      min:0, max:100, unit:'%' },
      { label:'Hue Rotate', key:'hueRotate',  min:0, max:360, unit:'°' },
      { label:'Invert',     key:'invert',     min:0, max:100, unit:'%' },
      { label:'Opacity',    key:'opacity',    min:0, max:100, unit:'%' },
    ];

    filterDefs.forEach(def => {
      controls.appendChild(ui.makeSlider({ label:def.label, id:`fl-${def.key}`, min:def.min, max:def.max, step:def.step||1, value:s[def.key], unit:def.unit,
        onChange: v => { s[def.key]=v; update(); } }));
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-secondary btn-sm btn-full mt-2';
    resetBtn.textContent = 'Reset All Filters';
    resetBtn.addEventListener('click', () => {
      Object.assign(s, { blur:0, brightness:100, contrast:100, saturate:100, grayscale:0, sepia:0, hueRotate:0, invert:0, opacity:100 });
      controls.innerHTML = '';
      preview.innerHTML = '';
      CSSToolbox.register['filter']?.render?.(controls, preview, s, onChange);
    });
    controls.appendChild(resetBtn);

    update();
  },

  randomize(s) {
    return { blur:randInt(0,5), brightness:randInt(70,150), contrast:randInt(80,140),
      saturate:randInt(50,200), grayscale:randInt(0,30), sepia:randInt(0,40),
      hueRotate:randInt(0,360), invert:0, opacity:100 };
  },
});

/* ══════════════════════════════════════════════════════════
   9.  BACKDROP FILTER GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'backdrop-filter',
  name: 'Backdrop Filter',
  section: 'core-css',
  icon: '🪟',
  description: 'Glassmorphism effect with backdrop-filter',
  keywords: ['backdrop', 'glass', 'frosted', 'blur', 'glassmorphism'],

  presets: [
    { name: 'None', state: { blur:0, brightness:100, saturate:100, bgColor:'#ffffff', bgAlpha:0.1, border:true, borderColor:'#ffffff', borderAlpha:0.2 }},
    { name: 'Frosted', state: { blur:12, brightness:100, saturate:150, bgColor:'#ffffff', bgAlpha:0.15, border:true, borderColor:'#ffffff', borderAlpha:0.3 }},
    { name: 'Dark Glass', state: { blur:16, brightness:80, saturate:120, bgColor:'#000000', bgAlpha:0.3, border:true, borderColor:'#ffffff', borderAlpha:0.1 }},
    { name: 'Light Glass', state: { blur:8, brightness:110, saturate:100, bgColor:'#ffffff', bgAlpha:0.4, border:true, borderColor:'#ffffff', borderAlpha:0.6 }},
    { name: 'Heavy Blur', state: { blur:24, brightness:100, saturate:100, bgColor:'#ffffff', bgAlpha:0.1, border:true, borderColor:'#ffffff', borderAlpha:0.2 }},
    { name: 'Colorful', state: { blur:12, brightness:100, saturate:200, bgColor:'#6c63ff', bgAlpha:0.2, border:true, borderColor:'#a78bfa', borderAlpha:0.4 }},
    { name: 'Matte', state: { blur:6, brightness:90, saturate:100, bgColor:'#1a1d27', bgAlpha:0.7, border:false, borderColor:'#ffffff', borderAlpha:0 }},
  ],

  defaultState: { blur:12, brightness:100, saturate:150, bgColor:'#ffffff', bgAlpha:0.15, border:true, borderColor:'#ffffff', borderAlpha:0.3 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:320px;background:linear-gradient(135deg,#667eea,#764ba2 40%,#f64f59);position:relative;overflow:hidden;';
    preview.appendChild(previewArea);

    // background "bokeh" circles
    ['#ff6b6b','#feca57','#48dbfb','#ff9ff3'].forEach((c, i) => {
      const circle = document.createElement('div');
      const size = 80 + i * 30;
      circle.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${c};opacity:.4;top:${20+i*40}px;left:${i*60}px;`;
      previewArea.appendChild(circle);
    });

    const card = document.createElement('div');
    card.style.cssText = 'position:relative;z-index:2;width:220px;padding:24px;border-radius:16px;transition:all .3s;';
    card.innerHTML = '<div style="font-weight:700;font-size:16px;color:#fff;margin-bottom:8px;">Glass Card</div><p style="font-size:13px;color:rgba(255,255,255,.8);">Backdrop filter creates a frosted glass effect on elements behind this card.</p>';
    previewArea.appendChild(card);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-backdrop-filter-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-backdrop-filter-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const parts = [];
      if (s.blur)        parts.push(`blur(${s.blur}px)`);
      if (s.brightness !== 100) parts.push(`brightness(${s.brightness}%)`);
      if (s.saturate !== 100)   parts.push(`saturate(${s.saturate}%)`);
      const bf = parts.length ? `backdrop-filter: ${parts.join(' ')};` : 'backdrop-filter: none;';
      const bg = `background: ${hexToRgba(s.bgColor, s.bgAlpha)};`;
      const border = s.border ? `border: 1px solid ${hexToRgba(s.borderColor, s.borderAlpha)};` : '';
      return [bf, bg, border].filter(Boolean).join('\n');
    }

    function update() {
      const parts = [];
      if (s.blur)        parts.push(`blur(${s.blur}px)`);
      if (s.brightness !== 100) parts.push(`brightness(${s.brightness}%)`);
      if (s.saturate !== 100)   parts.push(`saturate(${s.saturate}%)`);
      card.style.backdropFilter = parts.join(' ') || 'none';
      card.style.webkitBackdropFilter = card.style.backdropFilter;
      card.style.background = hexToRgba(s.bgColor, s.bgAlpha);
      card.style.border = s.border ? `1px solid ${hexToRgba(s.borderColor, s.borderAlpha)}` : 'none';
      document.getElementById('out-backdrop-filter-code').textContent = getCSS();
      onChange(s);
    }

    controls.appendChild(ui.makeSectionTitle('Backdrop Filter'));
    controls.appendChild(ui.makeSlider({ label:'Blur', id:'bdf-blur', min:0, max:40, value:s.blur, unit:'px', onChange:v=>{s.blur=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Brightness', id:'bdf-bright', min:0, max:200, value:s.brightness, unit:'%', onChange:v=>{s.brightness=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Saturate', id:'bdf-sat', min:0, max:300, value:s.saturate, unit:'%', onChange:v=>{s.saturate=v;update();} }));
    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Background'));
    controls.appendChild(ui.makeColor({ label:'Background Color', id:'bdf-bg', value:s.bgColor, onChange:v=>{s.bgColor=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Background Alpha', id:'bdf-bga', min:0, max:100, value:Math.round(s.bgAlpha*100), unit:'%', onChange:v=>{s.bgAlpha=v/100;update();} }));
    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSectionTitle('Border'));
    controls.appendChild(ui.makeToggle({ label:'Show Border', id:'bdf-border', value:s.border, onChange:v=>{s.border=v;update();} }));
    controls.appendChild(ui.makeColor({ label:'Border Color', id:'bdf-bc', value:s.borderColor, onChange:v=>{s.borderColor=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Border Alpha', id:'bdf-ba', min:0, max:100, value:Math.round(s.borderAlpha*100), unit:'%', onChange:v=>{s.borderAlpha=v/100;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   10.  TRANSITION GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'transition',
  name: 'Transition',
  section: 'core-css',
  icon: '⏩',
  description: 'Build CSS transition rules with live hover preview',
  keywords: ['transition', 'animation', 'ease', 'duration', 'timing'],

  presets: [
    { name: 'Smooth',    state: { property:'all', duration:300, delay:0, timing:'ease', hover:'scale(1.05)' }},
    { name: 'Snap',      state: { property:'all', duration:100, delay:0, timing:'ease-in', hover:'scale(1.05)' }},
    { name: 'Slow Ease', state: { property:'all', duration:800, delay:0, timing:'ease', hover:'scale(1.05)' }},
    { name: 'Bounce',    state: { property:'transform', duration:500, delay:0, timing:'cubic-bezier(0.34,1.56,0.64,1)', hover:'scale(1.15)' }},
    { name: 'Spring',    state: { property:'transform', duration:600, delay:0, timing:'cubic-bezier(0.68,-0.55,0.265,1.55)', hover:'translateY(-8px)' }},
    { name: 'Delayed',   state: { property:'all', duration:400, delay:200, timing:'ease-out', hover:'scale(1.05)' }},
    { name: 'Linear',    state: { property:'all', duration:400, delay:0, timing:'linear', hover:'scale(1.05)' }},
    { name: 'Color Fade', state: { property:'background-color', duration:600, delay:0, timing:'ease', hover:'scale(1)' }},
  ],

  defaultState: { property:'all', duration:300, delay:0, timing:'ease', hover:'scale(1.05)' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '260px';
    preview.appendChild(previewArea);

    const hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;top:12px;font-size:11px;color:var(--text3);';
    hint.textContent = 'Hover the button to see transition';
    previewArea.style.position = 'relative';
    previewArea.appendChild(hint);

    const btn = document.createElement('button');
    btn.style.cssText = 'padding:14px 28px;background:var(--accent);color:#fff;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;border:none;';
    btn.textContent = 'Hover Me';
    previewArea.appendChild(btn);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-transition-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-transition-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const PROPS = ['all','transform','opacity','background-color','color','border','box-shadow','width','height','padding','margin','font-size'];
    const TIMINGS = ['ease','linear','ease-in','ease-out','ease-in-out','cubic-bezier(0.34,1.56,0.64,1)','cubic-bezier(0.68,-0.55,0.265,1.55)'];
    const HOVERS = [
      { value:'scale(1.05)', label:'Scale Up' },
      { value:'scale(0.95)', label:'Scale Down' },
      { value:'translateY(-8px)', label:'Float Up' },
      { value:'translateY(4px)', label:'Sink Down' },
      { value:'rotate(5deg)', label:'Rotate' },
      { value:'scale(1.15)', label:'Scale Up More' },
    ];

    function getCSS() {
      return `transition: ${s.property} ${s.duration}ms ${s.timing}${s.delay ? ` ${s.delay}ms` : ''};`;
    }

    function update() {
      btn.style.transition = `${s.property} ${s.duration}ms ${s.timing} ${s.delay}ms`;
      document.getElementById('out-transition-code').textContent =
        [getCSS(), `\n/* Hover effect example */\n.element:hover {\n  transform: ${s.hover};\n}`].join('');
      onChange(s);
    }

    btn.addEventListener('mouseenter', () => { btn.style.transform = s.hover; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'none'; });

    controls.appendChild(ui.makeSelect({ label:'Property', id:'tr2-prop', options:PROPS, value:s.property, onChange:v=>{s.property=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Duration', id:'tr2-dur', min:0, max:3000, step:50, value:s.duration, unit:'ms', onChange:v=>{s.duration=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Delay', id:'tr2-delay', min:0, max:2000, step:50, value:s.delay, unit:'ms', onChange:v=>{s.delay=v;update();} }));
    controls.appendChild(ui.makeSelect({ label:'Timing', id:'tr2-timing', options:TIMINGS, value:s.timing, onChange:v=>{s.timing=v;update();} }));
    controls.appendChild(ui.makeDivider());
    controls.appendChild(ui.makeSelect({ label:'Hover Effect (preview)', id:'tr2-hover', options:HOVERS, value:s.hover, onChange:v=>{s.hover=v;} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   11.  ANIMATION KEYFRAME HELPER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'animation',
  name: 'Animation',
  section: 'core-css',
  icon: '🎬',
  description: 'Keyframe animation presets with live preview and @keyframes output',
  keywords: ['animation', 'keyframe', 'fade', 'slide', 'bounce', 'pulse', 'spin'],

  presets: [
    { name: 'Fade In', state: { preset:'fadeIn', duration:1000, delay:0, timing:'ease', iterationCount:'1', direction:'normal', fillMode:'forwards' }},
    { name: 'Fade Out', state: { preset:'fadeOut', duration:1000, delay:0, timing:'ease', iterationCount:'1', direction:'normal', fillMode:'forwards' }},
    { name: 'Slide In Left', state: { preset:'slideInLeft', duration:600, delay:0, timing:'ease-out', iterationCount:'1', direction:'normal', fillMode:'forwards' }},
    { name: 'Bounce', state: { preset:'bounce', duration:1000, delay:0, timing:'ease', iterationCount:'infinite', direction:'normal', fillMode:'none' }},
    { name: 'Pulse', state: { preset:'pulse', duration:2000, delay:0, timing:'ease-in-out', iterationCount:'infinite', direction:'normal', fillMode:'none' }},
    { name: 'Spin', state: { preset:'spin', duration:1000, delay:0, timing:'linear', iterationCount:'infinite', direction:'normal', fillMode:'none' }},
    { name: 'Shake', state: { preset:'shake', duration:600, delay:0, timing:'ease', iterationCount:'1', direction:'normal', fillMode:'none' }},
    { name: 'Float', state: { preset:'float', duration:3000, delay:0, timing:'ease-in-out', iterationCount:'infinite', direction:'alternate', fillMode:'none' }},
    { name: 'Heartbeat', state: { preset:'heartbeat', duration:1400, delay:0, timing:'ease-in-out', iterationCount:'infinite', direction:'normal', fillMode:'none' }},
    { name: 'Rubber Band', state: { preset:'rubberBand', duration:1000, delay:0, timing:'ease', iterationCount:'1', direction:'normal', fillMode:'none' }},
  ],

  defaultState: { preset:'fadeIn', duration:1000, delay:0, timing:'ease', iterationCount:'1', direction:'normal', fillMode:'forwards' },

  render(controls, preview, s, onChange) {
    const KEYFRAMES = {
      fadeIn:      `@keyframes fadeIn {\n  from { opacity: 0; }\n  to   { opacity: 1; }\n}`,
      fadeOut:     `@keyframes fadeOut {\n  from { opacity: 1; }\n  to   { opacity: 0; }\n}`,
      slideInLeft: `@keyframes slideInLeft {\n  from { transform: translateX(-100%); opacity: 0; }\n  to   { transform: translateX(0);    opacity: 1; }\n}`,
      bounce:      `@keyframes bounce {\n  0%,100% { transform: translateY(0);    animation-timing-function: cubic-bezier(0.8,0,1,1); }\n  50%     { transform: translateY(-24px); animation-timing-function: cubic-bezier(0,0,0.2,1); }\n}`,
      pulse:       `@keyframes pulse {\n  0%,100% { transform: scale(1);    opacity: 1; }\n  50%     { transform: scale(1.05); opacity: 0.7; }\n}`,
      spin:        `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}`,
      shake:       `@keyframes shake {\n  0%,100%      { transform: translateX(0); }\n  10%,30%,50%,70%,90% { transform: translateX(-6px); }\n  20%,40%,60%,80%     { transform: translateX(6px); }\n}`,
      float:       `@keyframes float {\n  from { transform: translateY(0px); }\n  to   { transform: translateY(-12px); }\n}`,
      heartbeat:   `@keyframes heartbeat {\n  0%   { transform: scale(1);   }\n  14%  { transform: scale(1.3);  }\n  28%  { transform: scale(1);   }\n  42%  { transform: scale(1.3);  }\n  70%  { transform: scale(1);   }\n}`,
      rubberBand:  `@keyframes rubberBand {\n  0%   { transform: scale(1); }\n  30%  { transform: scaleX(1.25) scaleY(0.75); }\n  40%  { transform: scaleX(0.75) scaleY(1.25); }\n  50%  { transform: scaleX(1.15) scaleY(0.85); }\n  65%  { transform: scaleX(0.95) scaleY(1.05); }\n  75%  { transform: scaleX(1.05) scaleY(0.95); }\n  100% { transform: scale(1); }\n}`,
    };

    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.minHeight = '280px';
    preview.appendChild(previewArea);

    const animEl = document.createElement('div');
    animEl.style.cssText = 'width:80px;height:80px;background:var(--accent);border-radius:12px;';
    previewArea.appendChild(animEl);

    const replayBtn = document.createElement('button');
    replayBtn.className = 'btn btn-secondary btn-sm';
    replayBtn.style.cssText = 'position:absolute;bottom:16px;right:16px;';
    replayBtn.textContent = '▶ Replay';
    previewArea.style.position = 'relative';
    previewArea.appendChild(replayBtn);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-animation-code" style="max-height:280px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-animation-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const kf = KEYFRAMES[s.preset] || '';
      const anim = `.element {\n  animation: ${s.preset} ${s.duration}ms ${s.timing} ${s.delay}ms ${s.iterationCount} ${s.direction} ${s.fillMode};\n}`;
      return `${kf}\n\n${anim}`;
    }

    function playAnimation() {
      animEl.style.animation = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animEl.style.animation = `${s.preset} ${s.duration}ms ${s.timing} ${s.delay}ms ${s.iterationCount} ${s.direction} ${s.fillMode}`;
        });
      });
    }

    function update() {
      document.getElementById('out-animation-code').textContent = getCSS();
      playAnimation();
      onChange(s);
    }

    replayBtn.addEventListener('click', playAnimation);

    const PRESETS = Object.keys(KEYFRAMES);
    const TIMINGS = ['ease','linear','ease-in','ease-out','ease-in-out'];
    const ITERATIONS = ['1','2','3','infinite'];
    const DIRECTIONS = ['normal','reverse','alternate','alternate-reverse'];
    const FILLS = ['none','forwards','backwards','both'];

    controls.appendChild(ui.makeSelect({ label:'Preset', id:'an-preset', options:PRESETS, value:s.preset, onChange:v=>{s.preset=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Duration', id:'an-dur', min:100, max:5000, step:100, value:s.duration, unit:'ms', onChange:v=>{s.duration=v;update();} }));
    controls.appendChild(ui.makeSlider({ label:'Delay', id:'an-delay', min:0, max:3000, step:100, value:s.delay, unit:'ms', onChange:v=>{s.delay=v;update();} }));
    controls.appendChild(ui.makeSelect({ label:'Timing', id:'an-timing', options:TIMINGS, value:s.timing, onChange:v=>{s.timing=v;update();} }));
    controls.appendChild(ui.makeSelect({ label:'Iteration Count', id:'an-iter', options:ITERATIONS, value:s.iterationCount, onChange:v=>{s.iterationCount=v;update();} }));
    controls.appendChild(ui.makeSelect({ label:'Direction', id:'an-dir', options:DIRECTIONS, value:s.direction, onChange:v=>{s.direction=v;update();} }));
    controls.appendChild(ui.makeSelect({ label:'Fill Mode', id:'an-fill', options:FILLS, value:s.fillMode, onChange:v=>{s.fillMode=v;update();} }));

    update();
  },
});
