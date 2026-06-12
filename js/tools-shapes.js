/**
 * CSS Design Toolbox — Shape & Visual Effect Tools (tools-shapes.js)
 * Registers: Clip-path, Blob, Triangle, Ribbon/Badge, Mask/Overlay,
 *            Blend Mode, Pattern Background, CSS Loader, Glow Effect
 */

'use strict';

const ui$s = CSSToolbox.ui;
function randInt$s(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

/* ══════════════════════════════════════════════════════════
   1.  CLIP-PATH GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'clip-path',
  name: 'Clip-path',
  section: 'shapes',
  icon: '✂',
  description: 'Apply clip-path shapes with presets or custom polygon',
  keywords: ['clip-path', 'polygon', 'circle', 'ellipse', 'shape', 'inset'],

  presets: [
    { name: 'None',      state: { mode:'none' }},
    { name: 'Circle',    state: { mode:'circle',  val:'circle(50% at 50% 50%)' }},
    { name: 'Ellipse',   state: { mode:'ellipse', val:'ellipse(55% 40% at 50% 50%)' }},
    { name: 'Inset',     state: { mode:'inset',   val:'inset(10% 15% 10% 15% round 12px)' }},
    { name: 'Triangle ▲', state: { mode:'polygon', val:'polygon(50% 0%, 0% 100%, 100% 100%)' }},
    { name: 'Triangle ▼', state: { mode:'polygon', val:'polygon(0% 0%, 100% 0%, 50% 100%)' }},
    { name: 'Parallelogram', state: { mode:'polygon', val:'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }},
    { name: 'Pentagon',  state: { mode:'polygon', val:'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }},
    { name: 'Hexagon',   state: { mode:'polygon', val:'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }},
    { name: 'Star',      state: { mode:'polygon', val:'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }},
    { name: 'Rhombus',   state: { mode:'polygon', val:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }},
    { name: 'Arrow →',   state: { mode:'polygon', val:'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' }},
    { name: 'Notch',     state: { mode:'polygon', val:'polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }},
    { name: 'Wave Top',  state: { mode:'polygon', val:'polygon(0 15%, 5% 5%, 10% 15%, 15% 5%, 20% 15%, 25% 5%, 30% 15%, 35% 5%, 40% 15%, 45% 5%, 50% 15%, 55% 5%, 60% 15%, 65% 5%, 70% 15%, 75% 5%, 80% 15%, 85% 5%, 90% 15%, 95% 5%, 100% 15%, 100% 100%, 0 100%)' }},
  ],

  defaultState: { mode:'polygon', val:'polygon(50% 0%, 0% 100%, 100% 100%)' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area checkered';
    previewArea.style.minHeight = '280px';
    preview.appendChild(previewArea);

    const box = document.createElement('div');
    box.style.cssText = 'width:220px;height:220px;background:linear-gradient(135deg,var(--accent),var(--accent2));transition:clip-path .3s;';
    previewArea.appendChild(box);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-clip-path-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-clip-path-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const css = s.mode === 'none' ? 'clip-path: none;' : `clip-path: ${s.val};`;
      box.style.clipPath = s.mode === 'none' ? 'none' : s.val;
      document.getElementById('out-clip-path-code').textContent = css;
      onChange(s);
    }

    controls.appendChild(ui$s.makeSectionTitle('Clip-path Value'));

    const ta = ui$s.makeTextarea({ label:'Value (edit freely)', id:'cp-val', value:s.val, rows:3,
      placeholder:'polygon(50% 0%, 0% 100%, 100% 100%)',
      onChange: v => { s.val = v; s.mode = 'polygon'; update(); } });
    controls.appendChild(ta);

    controls.appendChild(ui$s.makeDivider());
    controls.appendChild(ui$s.makeSectionTitle('Quick Presets'));

    const info = document.createElement('div');
    info.style.cssText = 'font-size:12px;color:var(--text2);margin-bottom:4px;';
    info.textContent = 'Use the presets bar above, or type any clip-path value directly.';
    controls.appendChild(info);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-secondary btn-sm mt-2';
    removeBtn.textContent = 'Remove Clip-path';
    removeBtn.addEventListener('click', () => { s.mode = 'none'; update(); });
    controls.appendChild(removeBtn);

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   2.  BLOB SHAPE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'blob-shape',
  name: 'Blob Shape',
  section: 'shapes',
  icon: '🫧',
  description: 'Generate organic blob shapes using border-radius',
  keywords: ['blob', 'organic', 'shape', 'border-radius', 'morphing'],

  presets: [
    { name: 'Gentle', state: { tl1:60, tl2:40, tr1:40, tr2:60, br1:60, br2:40, bl1:40, bl2:60, color:'#6c63ff' }},
    { name: 'Blobby', state: { tl1:70, tl2:30, tr1:30, tr2:70, br1:70, br2:30, bl1:30, bl2:70, color:'#6c63ff' }},
    { name: 'Bubbly', state: { tl1:80, tl2:20, tr1:20, tr2:80, br1:80, br2:20, bl1:20, bl2:80, color:'#6c63ff' }},
    { name: 'Wobbly', state: { tl1:55, tl2:45, tr1:65, tr2:35, br1:45, br2:55, bl1:35, bl2:65, color:'#6c63ff' }},
    { name: 'Asymmetric', state: { tl1:82, tl2:18, tr1:33, tr2:67, br1:55, br2:45, bl1:78, bl2:22, color:'#6c63ff' }},
  ],

  defaultState: { tl1:60, tl2:40, tr1:40, tr2:60, br1:60, br2:40, bl1:40, bl2:60, color:'#6c63ff' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area checkered';
    previewArea.style.minHeight = '280px';
    preview.appendChild(previewArea);

    const blob = document.createElement('div');
    blob.style.cssText = 'width:220px;height:220px;transition:all .4s ease;';
    previewArea.appendChild(blob);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-blob-shape-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-blob-shape-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getBorderRadius() {
      return `${s.tl1}% ${100-s.tl1}% ${100-s.br1}% ${s.br1}% / ${s.tl2}% ${s.tr2}% ${100-s.tr2}% ${100-s.tl2}%`;
    }

    function update() {
      const br = getBorderRadius();
      blob.style.borderRadius = br;
      blob.style.background = s.color;
      document.getElementById('out-blob-shape-code').textContent = `border-radius: ${br};\nbackground: ${s.color};`;
      onChange(s);
    }

    const randomizeBtn = document.createElement('button');
    randomizeBtn.className = 'btn btn-primary btn-sm btn-full';
    randomizeBtn.textContent = '🎲 Random Blob';
    randomizeBtn.addEventListener('click', () => {
      const r = () => randInt$s(15, 85);
      Object.assign(s, { tl1:r(), tl2:r(), tr1:r(), tr2:r(), br1:r(), br2:r(), bl1:r(), bl2:r() });
      controls.innerHTML = '';
      preview.innerHTML = '';
      CSSToolbox.getTool('blob-shape')?.render?.(controls, preview, s, onChange);
      // rebuild — re-call render
    });

    controls.appendChild(randomizeBtn);
    controls.appendChild(ui$s.makeDivider());
    controls.appendChild(ui$s.makeSectionTitle('Fine Tune'));
    controls.appendChild(ui$s.makeSlider({ label:'TL Horizontal', id:'bl-tl1', min:10, max:90, value:s.tl1, unit:'%', onChange:v=>{s.tl1=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'TL Vertical', id:'bl-tl2', min:10, max:90, value:s.tl2, unit:'%', onChange:v=>{s.tl2=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'TR Horizontal', id:'bl-tr1', min:10, max:90, value:s.tr1, unit:'%', onChange:v=>{s.tr1=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'TR Vertical', id:'bl-tr2', min:10, max:90, value:s.tr2, unit:'%', onChange:v=>{s.tr2=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'BR Horizontal', id:'bl-br1', min:10, max:90, value:s.br1, unit:'%', onChange:v=>{s.br1=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'BR Vertical', id:'bl-br2', min:10, max:90, value:s.br2, unit:'%', onChange:v=>{s.br2=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Fill Color', id:'bl-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    update();
  },

  randomize: (s) => {
    const r = () => randInt$s(15, 85);
    return { ...s, tl1:r(), tl2:r(), tr1:r(), tr2:r(), br1:r(), br2:r(), bl1:r(), bl2:r() };
  },
});

/* ══════════════════════════════════════════════════════════
   3.  TRIANGLE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'triangle',
  name: 'Triangle',
  section: 'shapes',
  icon: '▲',
  description: 'CSS triangles using the border trick',
  keywords: ['triangle', 'arrow', 'border', 'shape', 'pointer'],

  presets: [
    { name: 'Up',    state: { dir:'up',    size:60, color:'#6c63ff' }},
    { name: 'Down',  state: { dir:'down',  size:60, color:'#6c63ff' }},
    { name: 'Left',  state: { dir:'left',  size:60, color:'#6c63ff' }},
    { name: 'Right', state: { dir:'right', size:60, color:'#6c63ff' }},
    { name: 'Up-Left',    state: { dir:'upLeft',   size:80, color:'#6c63ff' }},
    { name: 'Up-Right',   state: { dir:'upRight',  size:80, color:'#6c63ff' }},
    { name: 'Down-Left',  state: { dir:'downLeft', size:80, color:'#6c63ff' }},
    { name: 'Down-Right', state: { dir:'downRight',size:80, color:'#6c63ff' }},
  ],

  defaultState: { dir:'up', size:60, color:'#6c63ff' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area checkered';
    previewArea.style.minHeight = '260px';
    preview.appendChild(previewArea);

    const tri = document.createElement('div');
    tri.style.cssText = 'width:0;height:0;transition:border .3s;';
    previewArea.appendChild(tri);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-triangle-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-triangle-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const h = s.size, c = s.color, t = 'transparent';
      const map = {
        up:        [`border-left: ${h/2}px solid ${t};`, `border-right: ${h/2}px solid ${t};`, `border-bottom: ${h}px solid ${c};`],
        down:      [`border-left: ${h/2}px solid ${t};`, `border-right: ${h/2}px solid ${t};`, `border-top: ${h}px solid ${c};`],
        left:      [`border-top: ${h/2}px solid ${t};`, `border-bottom: ${h/2}px solid ${t};`, `border-right: ${h}px solid ${c};`],
        right:     [`border-top: ${h/2}px solid ${t};`, `border-bottom: ${h/2}px solid ${t};`, `border-left: ${h}px solid ${c};`],
        upLeft:    [`border-top: ${h}px solid ${c};`, `border-right: ${h}px solid ${t};`],
        upRight:   [`border-top: ${h}px solid ${c};`, `border-left: ${h}px solid ${t};`],
        downLeft:  [`border-bottom: ${h}px solid ${c};`, `border-right: ${h}px solid ${t};`],
        downRight: [`border-bottom: ${h}px solid ${c};`, `border-left: ${h}px solid ${t};`],
      };
      return ['width: 0;', 'height: 0;', ...(map[s.dir] || [])].join('\n');
    }

    function update() {
      const h = s.size, c = s.color, t = 'transparent';
      tri.style.borderLeft = tri.style.borderRight = tri.style.borderTop = tri.style.borderBottom = '';
      const styleMap = {
        up:        {borderLeft:`${h/2}px solid ${t}`,borderRight:`${h/2}px solid ${t}`,borderBottom:`${h}px solid ${c}`},
        down:      {borderLeft:`${h/2}px solid ${t}`,borderRight:`${h/2}px solid ${t}`,borderTop:`${h}px solid ${c}`},
        left:      {borderTop:`${h/2}px solid ${t}`,borderBottom:`${h/2}px solid ${t}`,borderRight:`${h}px solid ${c}`},
        right:     {borderTop:`${h/2}px solid ${t}`,borderBottom:`${h/2}px solid ${t}`,borderLeft:`${h}px solid ${c}`},
        upLeft:    {borderTop:`${h}px solid ${c}`,borderRight:`${h}px solid ${t}`},
        upRight:   {borderTop:`${h}px solid ${c}`,borderLeft:`${h}px solid ${t}`},
        downLeft:  {borderBottom:`${h}px solid ${c}`,borderRight:`${h}px solid ${t}`},
        downRight: {borderBottom:`${h}px solid ${c}`,borderLeft:`${h}px solid ${t}`},
      };
      Object.assign(tri.style, styleMap[s.dir] || {});
      document.getElementById('out-triangle-code').textContent = getCSS();
      onChange(s);
    }

    const DIRS = ['up','down','left','right','upLeft','upRight','downLeft','downRight'].map(d => ({ value:d, label:d.replace(/([A-Z])/g,' $1').trim() }));
    controls.appendChild(ui$s.makeSelect({ label:'Direction', id:'tri-dir', options:DIRS, value:s.dir, onChange:v=>{s.dir=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Size', id:'tri-size', min:10, max:200, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Color', id:'tri-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   4.  RIBBON / BADGE SHAPE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'ribbon-badge',
  name: 'Ribbon / Badge',
  section: 'shapes',
  icon: '🎀',
  description: 'Ribbon and badge shapes using CSS',
  keywords: ['ribbon', 'badge', 'label', 'tag', 'corner'],

  presets: [
    { name: 'Corner Ribbon', state: { type:'corner', color:'#ef4444', text:'NEW', textColor:'#fff' }},
    { name: 'Side Ribbon', state: { type:'side', color:'#6c63ff', text:'SALE', textColor:'#fff' }},
    { name: 'Badge Pill', state: { type:'pill', color:'#10b981', text:'PRO', textColor:'#fff' }},
    { name: 'Diagonal Tag', state: { type:'diagonal', color:'#f59e0b', text:'HOT', textColor:'#fff' }},
    { name: 'Notification Dot', state: { type:'dot', color:'#ef4444', text:'5', textColor:'#fff' }},
    { name: 'Star Badge', state: { type:'star', color:'#f59e0b', text:'⭐', textColor:'#fff' }},
  ],

  defaultState: { type:'corner', color:'#ef4444', text:'NEW', textColor:'#fff' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:300px;position:relative;overflow:hidden;';
    preview.appendChild(previewArea);

    const card = document.createElement('div');
    card.style.cssText = 'width:240px;height:160px;background:var(--bg1);border:1px solid var(--border);border-radius:8px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:13px;';
    card.textContent = 'Host Element';

    const ribbon = document.createElement('div');
    ribbon.id = 'ribbon-preview';
    card.appendChild(ribbon);
    previewArea.appendChild(card);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-ribbon-badge-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-ribbon-badge-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const typeCSS = {
      corner: `.ribbon {\n  position: absolute;\n  top: 12px;\n  right: -28px;\n  transform: rotate(45deg);\n  background: ${s.color};\n  color: ${s.textColor};\n  padding: 4px 36px;\n  font-size: 12px;\n  font-weight: 700;\n}`,
      side:   `.ribbon {\n  position: absolute;\n  left: 0;\n  top: 16px;\n  background: ${s.color};\n  color: ${s.textColor};\n  padding: 4px 12px 4px 8px;\n  font-size: 12px;\n  font-weight: 700;\n  clip-path: polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%);\n}`,
      pill:   `.badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: ${s.color};\n  color: ${s.textColor};\n  border-radius: 9999px;\n  padding: 2px 10px;\n  font-size: 12px;\n  font-weight: 700;\n}`,
      diagonal: `.ribbon {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 80px;\n  height: 80px;\n  overflow: hidden;\n}\n.ribbon::before {\n  content: "${s.text}";\n  position: absolute;\n  top: 16px;\n  right: -20px;\n  transform: rotate(45deg);\n  width: 80px;\n  background: ${s.color};\n  color: ${s.textColor};\n  text-align: center;\n  font-size: 11px;\n  font-weight: 700;\n  padding: 4px;\n}`,
      dot:    `.dot-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: ${s.color};\n  color: ${s.textColor};\n  font-size: 11px;\n  font-weight: 700;\n}`,
      star:   `.star-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: ${s.color};\n  color: ${s.textColor};\n  width: 48px;\n  height: 48px;\n  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);\n  font-size: 18px;\n}`,
    };

    function update() {
      ribbon.className = '';
      ribbon.style.cssText = '';

      if (s.type === 'corner') {
        Object.assign(ribbon.style, { position:'absolute', top:'12px', right:'-28px', transform:'rotate(45deg)',
          background:s.color, color:s.textColor, padding:'4px 36px', fontSize:'12px', fontWeight:'700' });
      } else if (s.type === 'side') {
        Object.assign(ribbon.style, { position:'absolute', left:'0', top:'16px', background:s.color,
          color:s.textColor, padding:'4px 12px 4px 8px', fontSize:'12px', fontWeight:'700',
          clipPath:'polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%)' });
      } else if (s.type === 'pill') {
        Object.assign(ribbon.style, { position:'absolute', top:'8px', right:'8px', background:s.color,
          color:s.textColor, borderRadius:'9999px', padding:'2px 10px', fontSize:'12px', fontWeight:'700' });
      } else if (s.type === 'dot') {
        Object.assign(ribbon.style, { position:'absolute', top:'6px', right:'6px', background:s.color,
          color:s.textColor, borderRadius:'50%', width:'22px', height:'22px',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700' });
      } else if (s.type === 'star') {
        Object.assign(ribbon.style, { position:'absolute', top:'8px', right:'8px', background:s.color,
          color:s.textColor, width:'48px', height:'48px',
          clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' });
      } else if (s.type === 'diagonal') {
        Object.assign(ribbon.style, { position:'absolute', top:'12px', right:'-28px',
          transform:'rotate(45deg)', background:s.color, color:s.textColor,
          padding:'4px 36px', fontSize:'11px', fontWeight:'700' });
      }
      ribbon.textContent = s.text;
      document.getElementById('out-ribbon-badge-code').textContent = typeCSS[s.type]?.replace(/\$\{s\.color\}/g, s.color)?.replace(/\$\{s\.textColor\}/g, s.textColor) || '';
      onChange(s);
    }

    const TYPES = ['corner','side','pill','diagonal','dot','star'].map(t => ({ value:t, label:t.charAt(0).toUpperCase()+t.slice(1) }));
    controls.appendChild(ui$s.makeSelect({ label:'Type', id:'rb-type', options:TYPES, value:s.type, onChange:v=>{s.type=v;update();} }));
    controls.appendChild(ui$s.makeTextInput({ label:'Label Text', id:'rb-text', value:s.text, onChange:v=>{s.text=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Background Color', id:'rb-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Text Color', id:'rb-tc', value:s.textColor, onChange:v=>{s.textColor=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   5.  MASK / OVERLAY PREVIEW
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'mask-overlay',
  name: 'Mask / Overlay',
  section: 'shapes',
  icon: '🎭',
  description: 'Preview overlay and mask effects on content',
  keywords: ['mask', 'overlay', 'opacity', 'scrim', 'gradient'],

  presets: [
    { name: 'None',        state: { type:'solid', color:'#000000', opacity:0, blend:'normal' }},
    { name: 'Light Scrim', state: { type:'solid', color:'#000000', opacity:30, blend:'normal' }},
    { name: 'Dark Scrim',  state: { type:'solid', color:'#000000', opacity:60, blend:'normal' }},
    { name: 'Gradient',    state: { type:'gradient', color:'#000000', opacity:80, blend:'normal' }},
    { name: 'Color Wash',  state: { type:'solid', color:'#6c63ff', opacity:50, blend:'normal' }},
    { name: 'Screen',      state: { type:'solid', color:'#ffffff', opacity:20, blend:'screen' }},
    { name: 'Multiply',    state: { type:'solid', color:'#6c63ff', opacity:80, blend:'multiply' }},
    { name: 'Darken',      state: { type:'solid', color:'#000000', opacity:40, blend:'darken' }},
  ],

  defaultState: { type:'solid', color:'#000000', opacity:30, blend:'normal' },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;position:relative;overflow:hidden;padding:0;';
    preview.appendChild(previewArea);

    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;background:linear-gradient(135deg,#667eea,#f64f59);display:flex;align-items:center;justify-content:center;';
    bg.innerHTML = '<div style="color:#fff;font-weight:700;font-size:18px;z-index:1;position:relative;">Content Behind</div>';
    previewArea.appendChild(bg);

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;transition:all .3s;';
    bg.appendChild(overlay);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-mask-overlay-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-mask-overlay-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function hexToRgba2(hex, a) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function update() {
      const alpha = s.opacity / 100;
      const bg2 = s.type === 'gradient'
        ? `linear-gradient(to bottom, transparent, ${hexToRgba2(s.color, alpha)})`
        : hexToRgba2(s.color, alpha);
      overlay.style.background = bg2;
      overlay.style.mixBlendMode = s.blend;
      document.getElementById('out-mask-overlay-code').textContent =
        `.overlay {\n  position: absolute;\n  inset: 0;\n  background: ${bg2};\n  mix-blend-mode: ${s.blend};\n}`;
      onChange(s);
    }

    const TYPES = ['solid','gradient'];
    const BLENDS = ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light'];
    controls.appendChild(ui$s.makeSelect({ label:'Overlay Type', id:'mo-type', options:TYPES, value:s.type, onChange:v=>{s.type=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Overlay Color', id:'mo-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Opacity', id:'mo-opacity', min:0, max:100, value:s.opacity, unit:'%', onChange:v=>{s.opacity=v;update();} }));
    controls.appendChild(ui$s.makeSelect({ label:'Blend Mode', id:'mo-blend', options:BLENDS, value:s.blend, onChange:v=>{s.blend=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   6.  BLEND MODE PREVIEW
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'blend-mode',
  name: 'Blend Mode',
  section: 'shapes',
  icon: '🎨',
  description: 'Preview mix-blend-mode and background-blend-mode',
  keywords: ['blend', 'mix-blend-mode', 'background-blend', 'multiply', 'screen'],

  presets: [
    { name: 'Normal',      state: { mode:'normal',      bgMode:false }},
    { name: 'Multiply',    state: { mode:'multiply',    bgMode:false }},
    { name: 'Screen',      state: { mode:'screen',      bgMode:false }},
    { name: 'Overlay',     state: { mode:'overlay',     bgMode:false }},
    { name: 'Darken',      state: { mode:'darken',      bgMode:false }},
    { name: 'Lighten',     state: { mode:'lighten',     bgMode:false }},
    { name: 'Color Dodge', state: { mode:'color-dodge', bgMode:false }},
    { name: 'Color Burn',  state: { mode:'color-burn',  bgMode:false }},
    { name: 'Hard Light',  state: { mode:'hard-light',  bgMode:false }},
    { name: 'Soft Light',  state: { mode:'soft-light',  bgMode:false }},
    { name: 'Difference',  state: { mode:'difference',  bgMode:false }},
    { name: 'Exclusion',   state: { mode:'exclusion',   bgMode:false }},
    { name: 'Hue',         state: { mode:'hue',         bgMode:false }},
    { name: 'Saturation',  state: { mode:'saturation',  bgMode:false }},
    { name: 'Color',       state: { mode:'color',       bgMode:false }},
    { name: 'Luminosity',  state: { mode:'luminosity',  bgMode:false }},
  ],

  defaultState: { mode:'multiply', bgMode:false },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;background:#555;';
    preview.appendChild(previewArea);

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:200px;height:200px;';

    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;background:linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff);border-radius:8px;';

    const fg = document.createElement('div');
    fg.style.cssText = 'position:absolute;inset:20px;background:radial-gradient(circle,#a855f7,#3b82f6);border-radius:8px;transition:mix-blend-mode .1s;';

    wrap.appendChild(bg);
    wrap.appendChild(fg);
    previewArea.appendChild(wrap);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-blend-mode-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-blend-mode-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      fg.style.mixBlendMode = s.mode;
      document.getElementById('out-blend-mode-code').textContent =
        `.overlay {\n  mix-blend-mode: ${s.mode};\n}`;
      onChange(s);
    }

    const MODES = ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'];
    controls.appendChild(ui$s.makeSelect({ label:'Blend Mode', id:'bm-mode', options:MODES, value:s.mode, onChange:v=>{s.mode=v;update();} }));

    const info = document.createElement('div');
    info.style.cssText = 'font-size:12px;color:var(--text2);background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:10px;margin-top:8px;';
    info.textContent = 'The purple/blue circle blends with the colorful background using the selected blend mode.';
    controls.appendChild(info);

    update();
  },
});

/* ══════════════════════════════════════════════════════════
   7.  PATTERN BACKGROUND GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'pattern-bg',
  name: 'Pattern Background',
  section: 'shapes',
  icon: '▦',
  description: 'Generate CSS-only background patterns',
  keywords: ['pattern', 'background', 'dots', 'stripes', 'grid', 'checker'],

  presets: [
    { name: 'Dots',         state: { type:'dots',    color1:'#6c63ff', color2:'#0d1117', size:20, opacity:60 }},
    { name: 'Grid',         state: { type:'grid',    color1:'#6c63ff', color2:'#0d1117', size:30, opacity:40 }},
    { name: 'Checker',      state: { type:'checker', color1:'#6c63ff', color2:'#0d1117', size:20, opacity:100 }},
    { name: 'Stripes H',    state: { type:'stripesH',color1:'#6c63ff', color2:'#0d1117', size:10, opacity:80 }},
    { name: 'Stripes V',    state: { type:'stripesV',color1:'#6c63ff', color2:'#0d1117', size:10, opacity:80 }},
    { name: 'Diagonal',     state: { type:'diagonal',color1:'#6c63ff', color2:'#0d1117', size:12, opacity:80 }},
    { name: 'Cross Hatch',  state: { type:'crossHatch',color1:'#6c63ff', color2:'#0d1117', size:20, opacity:60 }},
  ],

  defaultState: { type:'dots', color1:'#6c63ff', color2:'#0d1117', size:20, opacity:60 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;transition:all .3s;';
    preview.appendChild(previewArea);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-pattern-bg-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-pattern-bg-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function hexToRgba3(hex, a) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a/100})`;
    }

    function getPatternCSS() {
      const c1 = hexToRgba3(s.color1, s.opacity);
      const c2 = s.color2;
      const n = s.size;

      const patterns = {
        dots:      `background-color: ${c2};\nbackground-image: radial-gradient(${c1} 1px, transparent 1px);\nbackground-size: ${n}px ${n}px;`,
        grid:      `background-color: ${c2};\nbackground-image: linear-gradient(${c1} 1px, transparent 1px),\n  linear-gradient(to right, ${c1} 1px, transparent 1px);\nbackground-size: ${n}px ${n}px;`,
        checker:   `background-color: ${c1};\nbackground-image: linear-gradient(45deg, ${c2} 25%, transparent 25%),\n  linear-gradient(-45deg, ${c2} 25%, transparent 25%),\n  linear-gradient(45deg, transparent 75%, ${c2} 75%),\n  linear-gradient(-45deg, transparent 75%, ${c2} 75%);\nbackground-size: ${n}px ${n}px;\nbackground-position: 0 0, 0 ${n/2}px, ${n/2}px -${n/2}px, -${n/2}px 0px;`,
        stripesH:  `background-color: ${c2};\nbackground-image: repeating-linear-gradient(0deg, ${c1} 0, ${c1} ${n/2}px, transparent ${n/2}px, transparent ${n}px);`,
        stripesV:  `background-color: ${c2};\nbackground-image: repeating-linear-gradient(90deg, ${c1} 0, ${c1} ${n/2}px, transparent ${n/2}px, transparent ${n}px);`,
        diagonal:  `background-color: ${c2};\nbackground-image: repeating-linear-gradient(45deg, ${c1} 0, ${c1} ${n/4}px, transparent 0, transparent 50%);background-size: ${n}px ${n}px;`,
        crossHatch:`background-color: ${c2};\nbackground-image: repeating-linear-gradient(0deg, ${c1} 0px, ${c1} 1px, transparent 1px, transparent ${n}px),\n  repeating-linear-gradient(90deg, ${c1} 0px, ${c1} 1px, transparent 1px, transparent ${n}px);`,
      };
      return patterns[s.type] || '';
    }

    function update() {
      const css = getPatternCSS();
      const lines = css.split('\n');
      lines.forEach(line => {
        const [prop, ...rest] = line.split(':');
        if (prop && rest.length) {
          const camel = prop.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          try { previewArea.style[camel] = rest.join(':').trim(); } catch(_) {}
        }
      });
      document.getElementById('out-pattern-bg-code').textContent = `.element {\n  ${css.replace(/\n/g, '\n  ')}\n}`;
      onChange(s);
    }

    const TYPES = ['dots','grid','checker','stripesH','stripesV','diagonal','crossHatch'].map(t => ({ value:t, label:t.replace(/([A-Z])/g,' $1').trim() }));
    controls.appendChild(ui$s.makeSelect({ label:'Pattern', id:'pt-type', options:TYPES, value:s.type, onChange:v=>{s.type=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Pattern Color', id:'pt-c1', value:s.color1, onChange:v=>{s.color1=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Background Color', id:'pt-c2', value:s.color2, onChange:v=>{s.color2=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Size', id:'pt-size', min:4, max:80, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Opacity', id:'pt-opacity', min:5, max:100, value:s.opacity, unit:'%', onChange:v=>{s.opacity=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   8.  CSS LOADER / SPINNER GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'css-loader',
  name: 'CSS Loader',
  section: 'shapes',
  icon: '⏳',
  description: 'Pure-CSS loading spinners and animations',
  keywords: ['loader', 'spinner', 'loading', 'animation', 'indicator'],

  presets: [
    { name: 'Ring Spin',   state: { type:'ring',   color:'#6c63ff', size:48, speed:1 }},
    { name: 'Dots Pulse',  state: { type:'dots',   color:'#6c63ff', size:12, speed:1 }},
    { name: 'Bars',        state: { type:'bars',   color:'#6c63ff', size:40, speed:1.2 }},
    { name: 'Ping',        state: { type:'ping',   color:'#6c63ff', size:40, speed:1.5 }},
    { name: 'Dual Ring',   state: { type:'dual',   color:'#6c63ff', size:48, speed:0.8 }},
    { name: 'Bounce',      state: { type:'bounce', color:'#6c63ff', size:16, speed:1.4 }},
    { name: 'Progress',    state: { type:'bar',    color:'#6c63ff', size:4,  speed:1.5 }},
  ],

  defaultState: { type:'ring', color:'#6c63ff', size:48, speed:1 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:260px;gap:32px;flex-direction:column;';
    preview.appendChild(previewArea);

    // Style injection
    let styleEl = document.getElementById('loader-styles');
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'loader-styles'; document.head.appendChild(styleEl); }

    const loaderWrap = document.createElement('div');
    loaderWrap.id = 'loader-preview-wrap';
    previewArea.appendChild(loaderWrap);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-css-loader-code" style="max-height:240px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-css-loader-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const c = s.color, sz = s.size, sp = s.speed;
      let html = '', css = '', fullCSS = '';

      if (s.type === 'ring') {
        html = `<div class="ld-ring"></div>`;
        css = `.ld-ring { width:${sz}px;height:${sz}px;border:${Math.max(3,sz/8)}px solid ${c}22;border-top-color:${c};border-radius:50%;animation:spin ${sp}s linear infinite; }`;
      } else if (s.type === 'dots') {
        html = `<div class="ld-dots"><span></span><span></span><span></span></div>`;
        css = `.ld-dots{display:flex;gap:${sz/2}px}.ld-dots span{width:${sz}px;height:${sz}px;border-radius:50%;background:${c};animation:pulse ${sp}s ease-in-out infinite}.ld-dots span:nth-child(1){animation-delay:0s}.ld-dots span:nth-child(2){animation-delay:.2s}.ld-dots span:nth-child(3){animation-delay:.4s}`;
      } else if (s.type === 'bars') {
        html = `<div class="ld-bars"><span></span><span></span><span></span><span></span></div>`;
        css = `.ld-bars{display:flex;gap:4px;align-items:center}.ld-bars span{width:${sz/6}px;height:${sz}px;background:${c};border-radius:2px;animation:bounce-dots ${sp}s ease-in-out infinite}.ld-bars span:nth-child(1){animation-delay:-.32s}.ld-bars span:nth-child(2){animation-delay:-.16s}.ld-bars span:nth-child(3){animation-delay:0s}.ld-bars span:nth-child(4){animation-delay:.16s}`;
      } else if (s.type === 'ping') {
        html = `<div class="ld-ping-wrap"><div class="ld-ping"></div></div>`;
        css = `.ld-ping-wrap{position:relative;width:${sz}px;height:${sz}px;display:flex;align-items:center;justify-content:center}.ld-ping{width:${sz}px;height:${sz}px;border-radius:50%;background:${c};animation:ping ${sp}s cubic-bezier(0,0,.2,1) infinite}`;
      } else if (s.type === 'dual') {
        html = `<div class="ld-dual"></div>`;
        css = `.ld-dual{width:${sz}px;height:${sz}px;border-radius:50%;border:${Math.max(3,sz/8)}px solid ${c}33;border-top-color:${c};border-bottom-color:${c};animation:spin ${sp}s linear infinite}`;
      } else if (s.type === 'bounce') {
        html = `<div class="ld-bounce"><span></span><span></span><span></span></div>`;
        css = `.ld-bounce{display:flex;gap:6px;align-items:flex-end}.ld-bounce span{width:${sz}px;height:${sz}px;border-radius:50%;background:${c};animation:bounce-dots ${sp}s ease-in-out infinite}.ld-bounce span:nth-child(2){animation-delay:.1s}.ld-bounce span:nth-child(3){animation-delay:.2s}`;
      } else if (s.type === 'bar') {
        html = `<div class="ld-bar"><div class="ld-bar-fill"></div></div>`;
        css = `.ld-bar{width:200px;height:${sz}px;background:${c}22;border-radius:${sz}px;overflow:hidden}.ld-bar-fill{height:100%;width:40%;background:${c};border-radius:inherit;animation:slideIn ${sp}s ease-in-out infinite alternate}`;
      }

      loaderWrap.innerHTML = html;
      styleEl.textContent = css;
      fullCSS = css;
      document.getElementById('out-css-loader-code').textContent = fullCSS;
      onChange(s);
    }

    const TYPES = ['ring','dots','bars','ping','dual','bounce','bar'].map(t => ({ value:t, label:t.charAt(0).toUpperCase()+t.slice(1) }));
    controls.appendChild(ui$s.makeSelect({ label:'Loader Type', id:'ld-type', options:TYPES, value:s.type, onChange:v=>{s.type=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Color', id:'ld-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Size', id:'ld-size', min:8, max:120, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Speed', id:'ld-speed', min:20, max:400, step:10, value:Math.round(s.speed*100), unit:'',
      onChange: v => { s.speed = v/100; document.getElementById('ld-speed-val').textContent = (v/100).toFixed(2)+'s'; update(); } }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   9.  GLOW EFFECT GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'glow-effect',
  name: 'Glow Effect',
  section: 'shapes',
  icon: '✨',
  description: 'Generate neon and glow effects using box-shadow and text-shadow',
  keywords: ['glow', 'neon', 'shadow', 'shine', 'luminous'],

  presets: [
    { name: 'None',        state: { target:'box', color:'#6c63ff', intensity:0, size:20, spread:0, pulse:false }},
    { name: 'Soft Glow',   state: { target:'box', color:'#6c63ff', intensity:60, size:20, spread:0, pulse:false }},
    { name: 'Neon',        state: { target:'box', color:'#00ffff', intensity:90, size:30, spread:4, pulse:false }},
    { name: 'Fire',        state: { target:'box', color:'#ff4500', intensity:90, size:40, spread:6, pulse:false }},
    { name: 'Electric',    state: { target:'box', color:'#00ff88', intensity:100, size:20, spread:2, pulse:false }},
    { name: 'Pulsing',     state: { target:'box', color:'#a78bfa', intensity:80, size:24, spread:4, pulse:true }},
    { name: 'Text Glow',   state: { target:'text', color:'#00ffff', intensity:90, size:20, spread:0, pulse:false }},
    { name: 'Sunset',      state: { target:'box', color:'#f59e0b', intensity:80, size:32, spread:8, pulse:false }},
  ],

  defaultState: { target:'box', color:'#6c63ff', intensity:80, size:20, spread:0, pulse:false },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;background:#0a0a0f;';
    preview.appendChild(previewArea);

    // Inject pulse keyframe
    let styleEl = document.getElementById('glow-styles');
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'glow-styles'; document.head.appendChild(styleEl); }

    const box = document.createElement('div');
    box.style.cssText = 'width:140px;height:80px;background:var(--accent);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;transition:box-shadow .3s,text-shadow .3s;';
    box.textContent = 'Glow';

    const textEl = document.createElement('div');
    textEl.style.cssText = 'font-size:48px;font-weight:900;color:#fff;transition:text-shadow .3s;';
    textEl.textContent = 'GLOW';

    previewArea.appendChild(box);
    previewArea.appendChild(textEl);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-glow-effect-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-glow-effect-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function hexToRgba4(hex, a) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function getGlowShadow(forText = false) {
      const a = s.intensity / 100;
      const c = s.color;
      const sz = s.size;
      const sp = s.spread;
      if (forText) {
        return [
          `0 0 ${sz/3}px ${c}`,
          `0 0 ${sz}px ${hexToRgba4(c,a)}`,
          `0 0 ${sz*2}px ${hexToRgba4(c,a*0.6)}`,
        ].join(', ');
      }
      return [
        `0 0 ${sz/4}px ${hexToRgba4(c,a)}`,
        `0 0 ${sz}px ${hexToRgba4(c,a*0.8)}`,
        `0 0 ${sz*2}px ${hexToRgba4(c,a*0.4)}`,
        sp ? `0 0 ${sz*3}px ${hexToRgba4(c,a*0.2)}` : null,
      ].filter(Boolean).join(', ');
    }

    function update() {
      box.style.display = s.target === 'box' ? 'flex' : 'none';
      textEl.style.display = s.target === 'text' ? 'block' : 'none';

      const glowBox = getGlowShadow(false);
      const glowText = getGlowShadow(true);

      if (s.pulse) {
        styleEl.textContent = `@keyframes glowPulse { 0%,100%{box-shadow:${glowBox}} 50%{box-shadow:none} }`;
        box.style.animation = 'glowPulse 2s ease-in-out infinite';
        box.style.boxShadow = '';
      } else {
        styleEl.textContent = '';
        box.style.animation = '';
        box.style.boxShadow = s.target === 'box' ? glowBox : 'none';
      }

      textEl.style.textShadow = s.target === 'text' ? glowText : 'none';
      textEl.style.color = s.color;

      const cssProp = s.target === 'box' ? `box-shadow: ${glowBox};` : `text-shadow: ${glowText};\ncolor: ${s.color};`;
      document.getElementById('out-glow-effect-code').textContent = cssProp + (s.pulse ? '\n/* Add animation: glowPulse 2s ease-in-out infinite; */' : '');
      onChange(s);
    }

    controls.appendChild(ui$s.makeSelect({ label:'Target', id:'gl-target', options:[{value:'box',label:'Box Element'},{value:'text',label:'Text'}], value:s.target, onChange:v=>{s.target=v;update();} }));
    controls.appendChild(ui$s.makeColor({ label:'Glow Color', id:'gl-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Intensity', id:'gl-int', min:0, max:100, value:s.intensity, unit:'%', onChange:v=>{s.intensity=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Glow Size', id:'gl-size', min:4, max:80, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    controls.appendChild(ui$s.makeSlider({ label:'Spread', id:'gl-spread', min:0, max:20, value:s.spread, unit:'px', onChange:v=>{s.spread=v;update();} }));
    controls.appendChild(ui$s.makeToggle({ label:'Pulse Animation', id:'gl-pulse', value:s.pulse, onChange:v=>{s.pulse=v;update();} }));
    update();
  },
});
