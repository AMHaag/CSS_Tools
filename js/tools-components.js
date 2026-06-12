/**
 * CSS Design Toolbox — Component-focused Tools (tools-components.js)
 * Registers: Button, Card, Input, Badge, Tooltip, Navbar, Modal,
 *            Avatar, Toggle Switch, Progress Bar, Skeleton Loader
 */

'use strict';

const ui$c = CSSToolbox.ui;

function hexToRgba$c(hex, a = 1) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ══════════════════════════════════════════════════════════
   1.  BUTTON DESIGNER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'button-designer',
  name: 'Button Designer',
  section: 'components',
  icon: '🔘',
  description: 'Design buttons with hover states, gradients, and shadows',
  keywords: ['button', 'btn', 'hover', 'click', 'cta', 'primary'],

  presets: [
    { name: 'Primary',       state: { label:'Click Me', bg:'#6c63ff', color:'#ffffff', hoverBg:'#8b85ff', border:false, borderColor:'#6c63ff', radius:8, px:20, py:10, fontSize:14, fontWeight:600, shadow:true, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 }},
    { name: 'Outline',       state: { label:'Outline', bg:'transparent', color:'#6c63ff', hoverBg:'rgba(108,99,255,0.1)', border:true, borderColor:'#6c63ff', radius:8, px:20, py:10, fontSize:14, fontWeight:600, shadow:false, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 }},
    { name: 'Ghost',         state: { label:'Ghost', bg:'transparent', color:'#8b949e', hoverBg:'rgba(139,132,255,0.1)', border:false, borderColor:'#6c63ff', radius:8, px:20, py:10, fontSize:14, fontWeight:500, shadow:false, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 }},
    { name: 'Pill',          state: { label:'Subscribe', bg:'#6c63ff', color:'#ffffff', hoverBg:'#8b85ff', border:false, borderColor:'#6c63ff', radius:999, px:24, py:12, fontSize:14, fontWeight:600, shadow:true, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 }},
    { name: 'Gradient',      state: { label:'Get Started', bg:'#6c63ff', color:'#ffffff', hoverBg:'#8b85ff', border:false, borderColor:'#6c63ff', radius:8, px:24, py:12, fontSize:15, fontWeight:700, shadow:true, gradient:true, grad2:'#a855f7', textTransform:'none', letterSpacing:0 }},
    { name: 'Danger',        state: { label:'Delete', bg:'#ef4444', color:'#ffffff', hoverBg:'#dc2626', border:false, borderColor:'#ef4444', radius:8, px:20, py:10, fontSize:14, fontWeight:600, shadow:false, gradient:false, grad2:'#b91c1c', textTransform:'none', letterSpacing:0 }},
    { name: 'Success',       state: { label:'Confirm', bg:'#10b981', color:'#ffffff', hoverBg:'#059669', border:false, borderColor:'#10b981', radius:8, px:20, py:10, fontSize:14, fontWeight:600, shadow:false, gradient:false, grad2:'#10b981', textTransform:'none', letterSpacing:0 }},
    { name: 'Uppercase',     state: { label:'EXPLORE', bg:'#1a1d27', color:'#e2e8f0', hoverBg:'#252836', border:true, borderColor:'#2d3348', radius:4, px:24, py:12, fontSize:12, fontWeight:700, shadow:false, gradient:false, grad2:'#6c63ff', textTransform:'uppercase', letterSpacing:2 }},
    { name: 'Neumorphic',    state: { label:'Press Me', bg:'#1f2533', color:'#8b949e', hoverBg:'#1a1d27', border:false, borderColor:'#6c63ff', radius:12, px:24, py:12, fontSize:14, fontWeight:600, shadow:false, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 }},
    { name: 'Minimal',       state: { label:'Learn more →', bg:'transparent', color:'#6c63ff', hoverBg:'transparent', border:false, borderColor:'transparent', radius:0, px:4, py:4, fontSize:14, fontWeight:600, shadow:false, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 }},
  ],

  defaultState: { label:'Click Me', bg:'#6c63ff', color:'#ffffff', hoverBg:'#8b85ff', border:false, borderColor:'#6c63ff', radius:8, px:20, py:10, fontSize:14, fontWeight:600, shadow:true, gradient:false, grad2:'#a78bfa', textTransform:'none', letterSpacing:0 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;flex-direction:column;gap:24px;';
    preview.appendChild(previewArea);

    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:11px;color:var(--text3);';
    hint.textContent = 'Hover to see hover state';
    previewArea.appendChild(hint);

    const btnEl = document.createElement('button');
    btnEl.style.cssText = 'cursor:pointer;border:none;transition:all .2s;';
    previewArea.appendChild(btnEl);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-button-designer-code" style="max-height:240px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-button-designer-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function getCSS() {
      const bg = s.gradient ? `linear-gradient(135deg, ${s.bg}, ${s.grad2})` : s.bg;
      const shadow = s.shadow ? `box-shadow: 0 4px 14px ${hexToRgba$c(s.bg, 0.4)};` : '';
      const border2 = s.border ? `border: 2px solid ${s.borderColor};` : 'border: none;';
      return `.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: ${bg};\n  color: ${s.color};\n  padding: ${s.py}px ${s.px}px;\n  border-radius: ${s.radius}px;\n  font-size: ${s.fontSize}px;\n  font-weight: ${s.fontWeight};\n  letter-spacing: ${s.letterSpacing}px;\n  text-transform: ${s.textTransform};\n  ${border2}\n  cursor: pointer;\n  ${shadow}\n  transition: all 0.2s ease;\n}\n.btn:hover {\n  background: ${s.hoverBg};\n}`;
    }

    function update() {
      const bg = s.gradient ? `linear-gradient(135deg, ${s.bg}, ${s.grad2})` : s.bg;
      Object.assign(btnEl.style, {
        background: bg,
        color: s.color,
        padding: `${s.py}px ${s.px}px`,
        borderRadius: `${s.radius}px`,
        fontSize: `${s.fontSize}px`,
        fontWeight: s.fontWeight,
        letterSpacing: `${s.letterSpacing}px`,
        textTransform: s.textTransform,
        border: s.border ? `2px solid ${s.borderColor}` : 'none',
        boxShadow: s.shadow ? `0 4px 14px ${hexToRgba$c(s.bg, 0.4)}` : 'none',
      });
      btnEl.textContent = s.label;
      document.getElementById('out-button-designer-code').textContent = getCSS();
      onChange(s);
    }

    btnEl.addEventListener('mouseenter', () => { btnEl.style.background = s.hoverBg; });
    btnEl.addEventListener('mouseleave', () => {
      btnEl.style.background = s.gradient ? `linear-gradient(135deg, ${s.bg}, ${s.grad2})` : s.bg;
    });

    controls.appendChild(ui$c.makeTextInput({ label:'Label', id:'bt-label', value:s.label, onChange:v=>{s.label=v;update();} }));
    controls.appendChild(ui$c.makeSectionTitle('Colors'));
    controls.appendChild(ui$c.makeColor({ label:'Background', id:'bt-bg', value:s.bg, onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Gradient', id:'bt-grad', value:s.gradient, onChange:v=>{s.gradient=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Gradient End Color', id:'bt-grad2', value:s.grad2, onChange:v=>{s.grad2=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'bt-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Hover Background', id:'bt-hover', value:s.hoverBg, onChange:v=>{s.hoverBg=v;} }));
    controls.appendChild(ui$c.makeDivider());
    controls.appendChild(ui$c.makeSectionTitle('Shape'));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'bt-r', min:0, max:50, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Horizontal Padding', id:'bt-px', min:4, max:60, value:s.px, unit:'px', onChange:v=>{s.px=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Vertical Padding', id:'bt-py', min:2, max:30, value:s.py, unit:'px', onChange:v=>{s.py=v;update();} }));
    controls.appendChild(ui$c.makeDivider());
    controls.appendChild(ui$c.makeSectionTitle('Typography'));
    controls.appendChild(ui$c.makeSlider({ label:'Font Size', id:'bt-fs', min:10, max:24, value:s.fontSize, unit:'px', onChange:v=>{s.fontSize=v;update();} }));
    const WEIGHTS = [400,500,600,700,800].map(w=>({value:String(w),label:String(w)}));
    controls.appendChild(ui$c.makeSelect({ label:'Font Weight', id:'bt-fw', options:WEIGHTS, value:String(s.fontWeight), onChange:v=>{s.fontWeight=Number(v);update();} }));
    controls.appendChild(ui$c.makeSelect({ label:'Transform', id:'bt-tt', options:['none','uppercase','lowercase'], value:s.textTransform, onChange:v=>{s.textTransform=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Letter Spacing', id:'bt-ls', min:0, max:8, step:0.5, value:s.letterSpacing, unit:'px', onChange:v=>{s.letterSpacing=v;update();} }));
    controls.appendChild(ui$c.makeDivider());
    controls.appendChild(ui$c.makeToggle({ label:'Show Shadow', id:'bt-shadow', value:s.shadow, onChange:v=>{s.shadow=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Show Border', id:'bt-border', value:s.border, onChange:v=>{s.border=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Border Color', id:'bt-bc', value:s.borderColor, onChange:v=>{s.borderColor=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   2.  CARD DESIGNER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'card-designer',
  name: 'Card Designer',
  section: 'components',
  icon: '🃏',
  description: 'Design cards: shadow, border, glass, neumorphic styles',
  keywords: ['card', 'panel', 'box', 'container', 'glass', 'neumorphism'],

  presets: [
    { name: 'Default',     state: { bg:'#1f2533', color:'#e2e8f0', radius:12, padding:24, shadow:'medium', border:false, borderColor:'#2d3348', glass:false, blur:0 }},
    { name: 'Elevated',    state: { bg:'#252836', color:'#e2e8f0', radius:16, padding:28, shadow:'large', border:false, borderColor:'#2d3348', glass:false, blur:0 }},
    { name: 'Bordered',    state: { bg:'#1f2533', color:'#e2e8f0', radius:12, padding:24, shadow:'none', border:true, borderColor:'#374155', glass:false, blur:0 }},
    { name: 'Glass',       state: { bg:'rgba(255,255,255,0.1)', color:'#ffffff', radius:16, padding:24, shadow:'medium', border:true, borderColor:'rgba(255,255,255,0.2)', glass:true, blur:12 }},
    { name: 'Neumorphic',  state: { bg:'#1f2533', color:'#8b949e', radius:16, padding:24, shadow:'neumorphic', border:false, borderColor:'#2d3348', glass:false, blur:0 }},
    { name: 'Flat Light',  state: { bg:'#ffffff', color:'#1a202c', radius:8, padding:20, shadow:'none', border:true, borderColor:'#e2e8f0', glass:false, blur:0 }},
    { name: 'Gradient',    state: { bg:'linear-gradient(135deg,#667eea,#764ba2)', color:'#ffffff', radius:16, padding:28, shadow:'large', border:false, borderColor:'#2d3348', glass:false, blur:0 }},
    { name: 'Dark Card',   state: { bg:'#0d1117', color:'#e2e8f0', radius:12, padding:24, shadow:'medium', border:true, borderColor:'#2d3348', glass:false, blur:0 }},
  ],

  defaultState: { bg:'#1f2533', color:'#e2e8f0', radius:12, padding:24, shadow:'medium', border:false, borderColor:'#2d3348', glass:false, blur:0 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:320px;background:var(--bg0);';
    preview.appendChild(previewArea);

    const card = document.createElement('div');
    card.style.cssText = 'transition:all .3s;max-width:300px;width:80%;';
    card.innerHTML = `
      <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Card Title</div>
      <div style="font-size:12px;opacity:.7;margin-bottom:16px;line-height:1.5;">This is a sample card component. It can contain text, images, and actions.</div>
      <div style="display:flex;gap:8px;">
        <div style="padding:6px 14px;background:var(--accent);color:#fff;border-radius:6px;font-size:12px;font-weight:600;">Action</div>
        <div style="padding:6px 14px;background:transparent;border:1px solid currentColor;border-radius:6px;font-size:12px;opacity:.6;">Cancel</div>
      </div>`;
    previewArea.appendChild(card);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-card-designer-code" style="max-height:240px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-card-designer-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    const SHADOW_MAP = {
      none: 'none',
      small: '0 1px 4px rgba(0,0,0,.2)',
      medium: '0 4px 12px rgba(0,0,0,.3)',
      large: '0 8px 32px rgba(0,0,0,.4)',
      neumorphic: '6px 6px 12px rgba(0,0,0,.3), -6px -6px 12px rgba(255,255,255,.05)',
    };

    function getCSS() {
      const shadowVal = SHADOW_MAP[s.shadow] || s.shadow;
      return `.card {\n  background: ${s.bg};\n  color: ${s.color};\n  border-radius: ${s.radius}px;\n  padding: ${s.padding}px;\n  box-shadow: ${shadowVal};\n  ${s.border ? `border: 1px solid ${s.borderColor};` : ''}\n  ${s.glass ? `backdrop-filter: blur(${s.blur}px);\n  -webkit-backdrop-filter: blur(${s.blur}px);` : ''}\n}`;
    }

    function update() {
      const shadowVal = SHADOW_MAP[s.shadow] || 'none';
      Object.assign(card.style, {
        background: s.bg,
        color: s.color,
        borderRadius: s.radius + 'px',
        padding: s.padding + 'px',
        boxShadow: shadowVal,
        border: s.border ? `1px solid ${s.borderColor}` : 'none',
        backdropFilter: s.glass ? `blur(${s.blur}px)` : 'none',
      });
      document.getElementById('out-card-designer-code').textContent = getCSS();
      onChange(s);
    }

    controls.appendChild(ui$c.makeColor({ label:'Background', id:'cd-bg', value:s.bg.startsWith('#') ? s.bg : '#1f2533', onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'cd-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'cd-r', min:0, max:40, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Padding', id:'cd-pad', min:8, max:60, value:s.padding, unit:'px', onChange:v=>{s.padding=v;update();} }));
    const SHADOWS = ['none','small','medium','large','neumorphic'].map(v=>({value:v,label:v.charAt(0).toUpperCase()+v.slice(1)}));
    controls.appendChild(ui$c.makeSelect({ label:'Shadow', id:'cd-shadow', options:SHADOWS, value:s.shadow, onChange:v=>{s.shadow=v;update();} }));
    controls.appendChild(ui$c.makeDivider());
    controls.appendChild(ui$c.makeToggle({ label:'Show Border', id:'cd-border', value:s.border, onChange:v=>{s.border=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Border Color', id:'cd-bc', value:s.borderColor, onChange:v=>{s.borderColor=v;update();} }));
    controls.appendChild(ui$c.makeDivider());
    controls.appendChild(ui$c.makeToggle({ label:'Glass Effect', id:'cd-glass', value:s.glass, onChange:v=>{s.glass=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Backdrop Blur', id:'cd-blur', min:0, max:40, value:s.blur, unit:'px', onChange:v=>{s.blur=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   3.  INPUT FIELD DESIGNER
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'input-designer',
  name: 'Input Designer',
  section: 'components',
  icon: '📝',
  description: 'Style form inputs with focus rings, placeholder styling',
  keywords: ['input', 'form', 'field', 'focus', 'placeholder', 'textbox'],

  presets: [
    { name: 'Default',    state: { bg:'#1f2533', color:'#e2e8f0', borderColor:'#2d3348', focusColor:'#6c63ff', radius:8, px:12, py:10, fontSize:14, shadow:false, filled:false, underline:false }},
    { name: 'Rounded',    state: { bg:'#1f2533', color:'#e2e8f0', borderColor:'#2d3348', focusColor:'#6c63ff', radius:24, px:16, py:10, fontSize:14, shadow:false, filled:false, underline:false }},
    { name: 'Filled',     state: { bg:'#252836', color:'#e2e8f0', borderColor:'transparent', focusColor:'#6c63ff', radius:8, px:12, py:10, fontSize:14, shadow:false, filled:true, underline:false }},
    { name: 'Underline',  state: { bg:'transparent', color:'#e2e8f0', borderColor:'#2d3348', focusColor:'#6c63ff', radius:0, px:4, py:10, fontSize:14, shadow:false, filled:false, underline:true }},
    { name: 'Shadow',     state: { bg:'#1f2533', color:'#e2e8f0', borderColor:'transparent', focusColor:'#6c63ff', radius:8, px:12, py:10, fontSize:14, shadow:true, filled:false, underline:false }},
    { name: 'White Box',  state: { bg:'#ffffff', color:'#1a202c', borderColor:'#d1d5db', focusColor:'#6c63ff', radius:6, px:12, py:10, fontSize:14, shadow:false, filled:false, underline:false }},
    { name: 'Success',    state: { bg:'#1f2533', color:'#10b981', borderColor:'#10b981', focusColor:'#10b981', radius:8, px:12, py:10, fontSize:14, shadow:false, filled:false, underline:false }},
    { name: 'Error',      state: { bg:'#1f2533', color:'#ef4444', borderColor:'#ef4444', focusColor:'#ef4444', radius:8, px:12, py:10, fontSize:14, shadow:false, filled:false, underline:false }},
  ],

  defaultState: { bg:'#1f2533', color:'#e2e8f0', borderColor:'#2d3348', focusColor:'#6c63ff', radius:8, px:12, py:10, fontSize:14, shadow:false, filled:false, underline:false },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;flex-direction:column;gap:16px;';
    preview.appendChild(previewArea);

    const label = document.createElement('div');
    label.style.cssText = 'display:flex;flex-direction:column;gap:6px;width:280px;';
    label.innerHTML = `<label style="font-size:12px;font-weight:600;color:var(--text2);">Email Address</label>`;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'hello@example.com';
    inp.value = '';
    inp.style.cssText = 'outline:none;transition:all .2s;width:100%;box-sizing:border-box;';
    label.appendChild(inp);

    const helperText = document.createElement('div');
    helperText.style.cssText = 'font-size:11px;color:var(--text2);';
    helperText.textContent = 'We\'ll never share your email.';
    label.appendChild(helperText);

    previewArea.appendChild(label);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-input-designer-code" style="max-height:240px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-input-designer-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    let styleTag = document.getElementById('input-style');
    if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'input-style'; document.head.appendChild(styleTag); }

    function update() {
      const brd = s.underline
        ? `border:none;border-bottom:2px solid ${s.borderColor};border-radius:0;`
        : `border:1px solid ${s.borderColor};border-radius:${s.radius}px;`;
      Object.assign(inp.style, {
        background: s.bg,
        color: s.color,
        padding: `${s.py}px ${s.px}px`,
        fontSize: s.fontSize + 'px',
        boxShadow: s.shadow ? `0 2px 8px rgba(0,0,0,.2)` : 'none',
      });
      if (s.underline) {
        inp.style.border = 'none';
        inp.style.borderBottom = `2px solid ${s.borderColor}`;
        inp.style.borderRadius = '0';
      } else {
        inp.style.border = `1px solid ${s.borderColor}`;
        inp.style.borderRadius = s.radius + 'px';
      }

      styleTag.textContent = `
        #id-preview-inp:focus { border-color: ${s.focusColor} !important; box-shadow: 0 0 0 3px ${hexToRgba$c(s.focusColor, 0.2)} !important; }
        #id-preview-inp::placeholder { color: ${s.color}88; }`;
      inp.id = 'id-preview-inp';

      const css = `.input {\n  background: ${s.bg};\n  color: ${s.color};\n  padding: ${s.py}px ${s.px}px;\n  font-size: ${s.fontSize}px;\n  ${brd}\n  ${s.shadow ? 'box-shadow: 0 2px 8px rgba(0,0,0,.2);' : ''}\n  outline: none;\n  transition: border-color 0.2s, box-shadow 0.2s;\n}\n.input:focus {\n  border-color: ${s.focusColor};\n  box-shadow: 0 0 0 3px ${hexToRgba$c(s.focusColor, 0.2)};\n}`;
      document.getElementById('out-input-designer-code').textContent = css;
      onChange(s);
    }

    controls.appendChild(ui$c.makeColor({ label:'Background', id:'inp-bg', value:s.bg.startsWith('#')?s.bg:'#1f2533', onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'inp-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Border Color', id:'inp-bc', value:s.borderColor.startsWith('#')?s.borderColor:'#2d3348', onChange:v=>{s.borderColor=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Focus Color', id:'inp-fc', value:s.focusColor, onChange:v=>{s.focusColor=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'inp-r', min:0, max:30, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Horizontal Padding', id:'inp-px', min:4, max:40, value:s.px, unit:'px', onChange:v=>{s.px=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Vertical Padding', id:'inp-py', min:4, max:24, value:s.py, unit:'px', onChange:v=>{s.py=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Font Size', id:'inp-fs', min:10, max:20, value:s.fontSize, unit:'px', onChange:v=>{s.fontSize=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Drop Shadow', id:'inp-shadow', value:s.shadow, onChange:v=>{s.shadow=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Underline Style', id:'inp-ul', value:s.underline, onChange:v=>{s.underline=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   4.  BADGE / CHIP GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'badge-chip',
  name: 'Badge / Chip',
  section: 'components',
  icon: '🏷',
  description: 'Design badge and chip components',
  keywords: ['badge', 'chip', 'tag', 'label', 'pill', 'status'],

  presets: [
    { name: 'Default', state: { label:'Badge', bg:'#6c63ff', color:'#fff', radius:4, px:8, py:3, fontSize:12, fontWeight:600, dot:false, removable:false, outline:false }},
    { name: 'Pill',    state: { label:'Pill', bg:'#6c63ff', color:'#fff', radius:999, px:10, py:4, fontSize:12, fontWeight:600, dot:false, removable:false, outline:false }},
    { name: 'Outline', state: { label:'Outline', bg:'transparent', color:'#6c63ff', radius:999, px:10, py:4, fontSize:12, fontWeight:600, dot:false, removable:false, outline:true }},
    { name: 'Success', state: { label:'Active', bg:'#d1fae5', color:'#059669', radius:999, px:10, py:4, fontSize:12, fontWeight:600, dot:true, removable:false, outline:false }},
    { name: 'Warning', state: { label:'Pending', bg:'#fef3c7', color:'#b45309', radius:999, px:10, py:4, fontSize:12, fontWeight:600, dot:true, removable:false, outline:false }},
    { name: 'Error',   state: { label:'Error', bg:'#fee2e2', color:'#dc2626', radius:999, px:10, py:4, fontSize:12, fontWeight:600, dot:true, removable:false, outline:false }},
    { name: 'Chip',    state: { label:'React', bg:'#1f2533', color:'#e2e8f0', radius:8, px:12, py:6, fontSize:13, fontWeight:500, dot:false, removable:true, outline:false }},
  ],

  defaultState: { label:'Badge', bg:'#6c63ff', color:'#fff', radius:4, px:8, py:3, fontSize:12, fontWeight:600, dot:false, removable:false, outline:false },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:220px;flex-wrap:wrap;gap:12px;';
    preview.appendChild(previewArea);

    const badgeEl = document.createElement('span');
    badgeEl.style.cssText = 'display:inline-flex;align-items:center;gap:6px;transition:all .3s;';
    previewArea.appendChild(badgeEl);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-badge-chip-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-badge-chip-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      Object.assign(badgeEl.style, {
        background: s.outline ? 'transparent' : s.bg,
        color: s.color,
        borderRadius: s.radius + 'px',
        padding: `${s.py}px ${s.px}px`,
        fontSize: s.fontSize + 'px',
        fontWeight: s.fontWeight,
        border: s.outline ? `1.5px solid ${s.color}` : 'none',
      });
      badgeEl.innerHTML = '';
      if (s.dot) {
        const dot = document.createElement('span');
        dot.style.cssText = `width:6px;height:6px;border-radius:50%;background:${s.color};flex-shrink:0;`;
        badgeEl.appendChild(dot);
      }
      badgeEl.appendChild(document.createTextNode(s.label));
      if (s.removable) {
        const x = document.createElement('span');
        x.style.cssText = 'cursor:pointer;opacity:.7;font-size:14px;';
        x.textContent = '×';
        badgeEl.appendChild(x);
      }
      document.getElementById('out-badge-chip-code').textContent =
        `.badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  background: ${s.outline?'transparent':s.bg};\n  color: ${s.color};\n  border-radius: ${s.radius}px;\n  padding: ${s.py}px ${s.px}px;\n  font-size: ${s.fontSize}px;\n  font-weight: ${s.fontWeight};\n  ${s.outline?`border: 1.5px solid ${s.color};`:''}\n}`;
      onChange(s);
    }

    controls.appendChild(ui$c.makeTextInput({ label:'Label', id:'bg-label', value:s.label, onChange:v=>{s.label=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Background', id:'bg-bg', value:s.bg.startsWith('#')?s.bg:'#6c63ff', onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'bg-color', value:s.color.startsWith('#')?s.color:'#ffffff', onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'bg-r', min:0, max:24, value:s.radius>24?24:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Padding X', id:'bg-px', min:4, max:24, value:s.px, unit:'px', onChange:v=>{s.px=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Padding Y', id:'bg-py', min:1, max:12, value:s.py, unit:'px', onChange:v=>{s.py=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Font Size', id:'bg-fs', min:10, max:18, value:s.fontSize, unit:'px', onChange:v=>{s.fontSize=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Status Dot', id:'bg-dot', value:s.dot, onChange:v=>{s.dot=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Removable (×)', id:'bg-rm', value:s.removable, onChange:v=>{s.removable=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Outline Style', id:'bg-outline', value:s.outline, onChange:v=>{s.outline=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   5.  TOOLTIP STYLE GENERATOR
══════════════════════════════════════════════════════════ */
CSSToolbox.register({
  id: 'tooltip',
  name: 'Tooltip',
  section: 'components',
  icon: '💬',
  description: 'Style CSS-only tooltips with arrows and placement',
  keywords: ['tooltip', 'popover', 'hint', 'title', 'popup'],

  presets: [
    { name: 'Dark', state: { bg:'#1a1d27', color:'#e2e8f0', placement:'top', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 }},
    { name: 'Light', state: { bg:'#ffffff', color:'#1a202c', placement:'top', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 }},
    { name: 'Accent', state: { bg:'#6c63ff', color:'#ffffff', placement:'top', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 }},
    { name: 'Bottom', state: { bg:'#1a1d27', color:'#e2e8f0', placement:'bottom', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 }},
    { name: 'Right',  state: { bg:'#1a1d27', color:'#e2e8f0', placement:'right', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 }},
    { name: 'Left',   state: { bg:'#1a1d27', color:'#e2e8f0', placement:'left', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 }},
    { name: 'Wide',   state: { bg:'#1a1d27', color:'#e2e8f0', placement:'top', radius:8, px:14, py:10, fontSize:13, arrow:true, maxWidth:280 }},
  ],

  defaultState: { bg:'#1a1d27', color:'#e2e8f0', placement:'top', radius:6, px:10, py:6, fontSize:12, arrow:true, maxWidth:200 },

  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;flex-direction:column;gap:20px;';
    preview.appendChild(previewArea);

    const trigger = document.createElement('button');
    trigger.style.cssText = 'padding:10px 20px;background:var(--accent);color:#fff;border-radius:8px;font-size:14px;font-weight:600;border:none;cursor:pointer;position:relative;';
    trigger.textContent = 'Hover me';
    previewArea.appendChild(trigger);

    const tooltip = document.createElement('div');
    tooltip.style.cssText = 'position:absolute;z-index:999;white-space:nowrap;pointer-events:none;transition:all .2s;';
    tooltip.textContent = 'This is a tooltip!';

    let styleTag = document.getElementById('tooltip-style');
    if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'tooltip-style'; document.head.appendChild(styleTag); }

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-tooltip-code" style="max-height:220px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-tooltip-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const pos = {};
      const arrowStyle = {};
      if (s.placement === 'top') {
        pos.bottom = '110%'; pos.left = '50%'; pos.transform = 'translateX(-50%)';
        if (s.arrow) arrowStyle.css = `content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:${s.bg};`;
      } else if (s.placement === 'bottom') {
        pos.top = '110%'; pos.left = '50%'; pos.transform = 'translateX(-50%)';
        if (s.arrow) arrowStyle.css = `content:'';position:absolute;bottom:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-bottom-color:${s.bg};`;
      } else if (s.placement === 'left') {
        pos.right = '110%'; pos.top = '50%'; pos.transform = 'translateY(-50%)';
        if (s.arrow) arrowStyle.css = `content:'';position:absolute;left:100%;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:${s.bg};`;
      } else {
        pos.left = '110%'; pos.top = '50%'; pos.transform = 'translateY(-50%)';
        if (s.arrow) arrowStyle.css = `content:'';position:absolute;right:100%;top:50%;transform:translateY(-50%);border:6px solid transparent;border-right-color:${s.bg};`;
      }

      Object.assign(tooltip.style, {
        background: s.bg,
        color: s.color,
        borderRadius: s.radius + 'px',
        padding: `${s.py}px ${s.px}px`,
        fontSize: s.fontSize + 'px',
        maxWidth: s.maxWidth + 'px',
        ...pos,
      });

      styleTag.textContent = arrowStyle.css ? `#tooltip-preview::after { ${arrowStyle.css} }` : '';
      tooltip.id = 'tooltip-preview';

      document.getElementById('out-tooltip-code').textContent =
        `.tooltip {\n  position: absolute;\n  background: ${s.bg};\n  color: ${s.color};\n  border-radius: ${s.radius}px;\n  padding: ${s.py}px ${s.px}px;\n  font-size: ${s.fontSize}px;\n  max-width: ${s.maxWidth}px;\n  white-space: nowrap;\n  z-index: 100;\n}`;
      onChange(s);
    }

    trigger.appendChild(tooltip);

    const PLACEMENTS = ['top','bottom','left','right'].map(p=>({value:p,label:p.charAt(0).toUpperCase()+p.slice(1)}));
    controls.appendChild(ui$c.makeSelect({ label:'Placement', id:'tt-pl', options:PLACEMENTS, value:s.placement, onChange:v=>{s.placement=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Background', id:'tt-bg', value:s.bg, onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'tt-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'tt-r', min:0, max:20, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Padding X', id:'tt-px', min:4, max:24, value:s.px, unit:'px', onChange:v=>{s.px=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Padding Y', id:'tt-py', min:2, max:16, value:s.py, unit:'px', onChange:v=>{s.py=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Font Size', id:'tt-fs', min:10, max:16, value:s.fontSize, unit:'px', onChange:v=>{s.fontSize=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Show Arrow', id:'tt-arrow', value:s.arrow, onChange:v=>{s.arrow=v;update();} }));
    update();
  },
});

/* ══════════════════════════════════════════════════════════
   6-11: NAVBAR, MODAL, AVATAR, TOGGLE, PROGRESS, SKELETON
══════════════════════════════════════════════════════════ */

CSSToolbox.register({
  id: 'navbar-preview',
  name: 'Navbar Preview',
  section: 'components',
  icon: '🧭',
  description: 'Design navbar style and layout',
  keywords: ['navbar', 'header', 'navigation', 'menu', 'topbar'],
  presets: [
    { name: 'Dark Flat',   state: { bg:'#0d1117', color:'#e2e8f0', borderBottom:true, borderColor:'#21262d', shadow:false, blur:false, height:60, sticky:true }},
    { name: 'White Card',  state: { bg:'#ffffff', color:'#1a202c', borderBottom:true, borderColor:'#e2e8f0', shadow:true,  blur:false, height:64, sticky:true }},
    { name: 'Frosted',     state: { bg:'rgba(13,17,23,0.8)', color:'#e2e8f0', borderBottom:true, borderColor:'rgba(255,255,255,0.1)', shadow:false, blur:true, height:60, sticky:true }},
    { name: 'Accent',      state: { bg:'#6c63ff', color:'#ffffff', borderBottom:false, borderColor:'transparent', shadow:true, blur:false, height:60, sticky:true }},
    { name: 'Transparent', state: { bg:'transparent', color:'#ffffff', borderBottom:false, borderColor:'transparent', shadow:false, blur:false, height:64, sticky:false }},
  ],
  defaultState: { bg:'#0d1117', color:'#e2e8f0', borderBottom:true, borderColor:'#21262d', shadow:false, blur:false, height:60, sticky:true },
  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;background:var(--bg0);';
    preview.appendChild(previewArea);

    const nav = document.createElement('nav');
    nav.style.cssText = 'width:100%;transition:all .3s;display:flex;align-items:center;justify-content:space-between;padding:0 24px;';
    nav.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:16px;">
        <span style="font-size:20px;">⬡</span> Brand
      </div>
      <div style="display:flex;gap:20px;font-size:14px;">
        <a href="#" style="color:inherit;text-decoration:none;opacity:.8;">Home</a>
        <a href="#" style="color:inherit;text-decoration:none;opacity:.8;">About</a>
        <a href="#" style="color:inherit;text-decoration:none;opacity:.8;">Contact</a>
      </div>
      <div style="display:flex;gap:8px;">
        <div style="padding:6px 16px;border:1px solid currentColor;border-radius:6px;font-size:13px;opacity:.7;cursor:pointer;">Login</div>
        <div style="padding:6px 16px;background:var(--accent);color:#fff;border-radius:6px;font-size:13px;cursor:pointer;">Sign Up</div>
      </div>`;
    previewArea.appendChild(nav);

    const body = document.createElement('div');
    body.style.cssText = 'padding:40px 24px;color:var(--text2);font-size:14px;text-align:center;';
    body.textContent = 'Page content area';
    previewArea.appendChild(body);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-navbar-preview-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-navbar-preview-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      Object.assign(nav.style, {
        background: s.bg,
        color: s.color,
        height: s.height + 'px',
        borderBottom: s.borderBottom ? `1px solid ${s.borderColor}` : 'none',
        boxShadow: s.shadow ? '0 2px 8px rgba(0,0,0,.2)' : 'none',
        backdropFilter: s.blur ? 'blur(12px)' : 'none',
        position: s.sticky ? 'sticky' : 'static',
        top: s.sticky ? '0' : 'auto',
        zIndex: s.sticky ? '100' : 'auto',
      });
      document.getElementById('out-navbar-preview-code').textContent =
        `.navbar {\n  background: ${s.bg};\n  color: ${s.color};\n  height: ${s.height}px;\n  display: flex;\n  align-items: center;\n  padding: 0 24px;\n  ${s.borderBottom?`border-bottom: 1px solid ${s.borderColor};`:''}\n  ${s.shadow?'box-shadow: 0 2px 8px rgba(0,0,0,.2);':''}\n  ${s.blur?'backdrop-filter: blur(12px);':''}\n  ${s.sticky?'position: sticky;\n  top: 0;\n  z-index: 100;':''}\n}`;
      onChange(s);
    }

    controls.appendChild(ui$c.makeColor({ label:'Background', id:'nav-bg', value:s.bg.startsWith('rgb')||s.bg==='transparent'?'#0d1117':s.bg, onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'nav-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Height', id:'nav-h', min:40, max:100, value:s.height, unit:'px', onChange:v=>{s.height=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Bottom Border', id:'nav-border', value:s.borderBottom, onChange:v=>{s.borderBottom=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Border Color', id:'nav-bc', value:s.borderColor.startsWith('#')?s.borderColor:'#21262d', onChange:v=>{s.borderColor=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Drop Shadow', id:'nav-shadow', value:s.shadow, onChange:v=>{s.shadow=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Backdrop Blur', id:'nav-blur', value:s.blur, onChange:v=>{s.blur=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Sticky', id:'nav-sticky', value:s.sticky, onChange:v=>{s.sticky=v;update();} }));
    update();
  },
});

CSSToolbox.register({
  id: 'modal-preview',
  name: 'Modal Preview',
  section: 'components',
  icon: '🗔',
  description: 'Style modals and dialog boxes',
  keywords: ['modal', 'dialog', 'popup', 'overlay', 'lightbox'],
  presets: [
    { name: 'Default',  state: { bg:'#1f2533', color:'#e2e8f0', overlayBg:'rgba(0,0,0,0.6)', radius:12, padding:28, maxWidth:480, shadow:true, blur:false }},
    { name: 'Glass',    state: { bg:'rgba(255,255,255,0.1)', color:'#ffffff', overlayBg:'rgba(0,0,0,0.5)', radius:16, padding:28, maxWidth:480, shadow:true, blur:true }},
    { name: 'White',    state: { bg:'#ffffff', color:'#1a202c', overlayBg:'rgba(0,0,0,0.4)', radius:8, padding:24, maxWidth:440, shadow:true, blur:false }},
    { name: 'Compact',  state: { bg:'#1f2533', color:'#e2e8f0', overlayBg:'rgba(0,0,0,0.6)', radius:8, padding:16, maxWidth:360, shadow:true, blur:false }},
    { name: 'Wide',     state: { bg:'#1f2533', color:'#e2e8f0', overlayBg:'rgba(0,0,0,0.6)', radius:12, padding:32, maxWidth:680, shadow:true, blur:false }},
  ],
  defaultState: { bg:'#1f2533', color:'#e2e8f0', overlayBg:'rgba(0,0,0,0.6)', radius:12, padding:28, maxWidth:480, shadow:true, blur:false },
  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;min-height:320px;position:relative;';
    preview.appendChild(previewArea);

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;transition:background .3s;display:flex;align-items:center;justify-content:center;';
    previewArea.appendChild(overlay);

    const modal = document.createElement('div');
    modal.style.cssText = 'width:90%;transition:all .3s;';
    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3 style="font-size:17px;font-weight:700;">Modal Title</h3>
        <span style="cursor:pointer;opacity:.6;font-size:20px;line-height:1;">×</span>
      </div>
      <p style="font-size:14px;line-height:1.6;opacity:.8;margin-bottom:24px;">This is a modal dialog. It contains important content or actions that require user attention.</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <div style="padding:8px 16px;border:1px solid currentColor;border-radius:6px;font-size:13px;opacity:.7;cursor:pointer;">Cancel</div>
        <div style="padding:8px 16px;background:var(--accent);color:#fff;border-radius:6px;font-size:13px;cursor:pointer;">Confirm</div>
      </div>`;
    overlay.appendChild(modal);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-modal-preview-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-modal-preview-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      overlay.style.background = s.overlayBg;
      Object.assign(modal.style, {
        background: s.bg, color: s.color,
        borderRadius: s.radius + 'px', padding: s.padding + 'px',
        maxWidth: s.maxWidth + 'px',
        boxShadow: s.shadow ? '0 20px 60px rgba(0,0,0,.5)' : 'none',
        backdropFilter: s.blur ? 'blur(12px)' : 'none',
      });
      document.getElementById('out-modal-preview-code').textContent =
        `.overlay {\n  position: fixed;\n  inset: 0;\n  background: ${s.overlayBg};\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.modal {\n  background: ${s.bg};\n  color: ${s.color};\n  border-radius: ${s.radius}px;\n  padding: ${s.padding}px;\n  max-width: ${s.maxWidth}px;\n  width: 90%;\n  ${s.shadow?'box-shadow: 0 20px 60px rgba(0,0,0,.5);':''}\n  ${s.blur?'backdrop-filter: blur(12px);':''}\n}`;
      onChange(s);
    }

    controls.appendChild(ui$c.makeColor({ label:'Modal Background', id:'mod-bg', value:s.bg.startsWith('#')?s.bg:'#1f2533', onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'mod-color', value:s.color, onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'mod-r', min:0, max:32, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Padding', id:'mod-pad', min:12, max:60, value:s.padding, unit:'px', onChange:v=>{s.padding=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Max Width', id:'mod-mw', min:300, max:800, step:20, value:s.maxWidth, unit:'px', onChange:v=>{s.maxWidth=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Shadow', id:'mod-shadow', value:s.shadow, onChange:v=>{s.shadow=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Backdrop Blur', id:'mod-blur', value:s.blur, onChange:v=>{s.blur=v;update();} }));
    update();
  },
});

CSSToolbox.register({
  id: 'avatar-styling',
  name: 'Avatar',
  section: 'components',
  icon: '👤',
  description: 'Style profile images and avatars',
  keywords: ['avatar', 'profile', 'photo', 'image', 'user', 'picture'],
  presets: [
    { name: 'Circle',   state: { size:64, radius:50, border:false, borderColor:'#6c63ff', borderW:3, shadow:false, initials:'JD', bg:'#6c63ff', color:'#fff', ring:false, ringColor:'#6c63ff' }},
    { name: 'Rounded',  state: { size:64, radius:20, border:false, borderColor:'#6c63ff', borderW:3, shadow:false, initials:'JD', bg:'#6c63ff', color:'#fff', ring:false, ringColor:'#6c63ff' }},
    { name: 'Square',   state: { size:64, radius:0, border:false, borderColor:'#6c63ff', borderW:3, shadow:false, initials:'JD', bg:'#6c63ff', color:'#fff', ring:false, ringColor:'#6c63ff' }},
    { name: 'Bordered', state: { size:72, radius:50, border:true, borderColor:'#6c63ff', borderW:3, shadow:false, initials:'JD', bg:'#6c63ff', color:'#fff', ring:false, ringColor:'#6c63ff' }},
    { name: 'Ring',     state: { size:72, radius:50, border:true, borderColor:'#fff', borderW:4, shadow:false, initials:'JD', bg:'#6c63ff', color:'#fff', ring:true, ringColor:'#6c63ff' }},
    { name: 'Shadow',   state: { size:72, radius:50, border:false, borderColor:'#6c63ff', borderW:3, shadow:true, initials:'JD', bg:'#6c63ff', color:'#fff', ring:false, ringColor:'#6c63ff' }},
  ],
  defaultState: { size:64, radius:50, border:false, borderColor:'#6c63ff', borderW:3, shadow:false, initials:'JD', bg:'#6c63ff', color:'#fff', ring:false, ringColor:'#6c63ff' },
  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:260px;gap:20px;flex-direction:column;';
    preview.appendChild(previewArea);

    const av = document.createElement('div');
    av.style.cssText = 'display:flex;align-items:center;justify-content:center;font-weight:700;transition:all .3s;';
    previewArea.appendChild(av);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-avatar-styling-code"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-avatar-styling-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      Object.assign(av.style, {
        width: s.size + 'px', height: s.size + 'px',
        borderRadius: s.radius + '%',
        background: s.bg, color: s.color,
        fontSize: Math.round(s.size * 0.35) + 'px',
        border: s.border ? `${s.borderW}px solid ${s.borderColor}` : 'none',
        boxShadow: s.ring ? `0 0 0 ${s.borderW+2}px ${s.ringColor}` : (s.shadow ? '0 4px 16px rgba(0,0,0,.3)' : 'none'),
      });
      av.textContent = s.initials;
      document.getElementById('out-avatar-styling-code').textContent =
        `.avatar {\n  width: ${s.size}px;\n  height: ${s.size}px;\n  border-radius: ${s.radius}%;\n  background: ${s.bg};\n  color: ${s.color};\n  font-size: ${Math.round(s.size*.35)}px;\n  font-weight: 700;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  ${s.border?`border: ${s.borderW}px solid ${s.borderColor};`:''}\n  ${s.ring?`box-shadow: 0 0 0 ${s.borderW+2}px ${s.ringColor};`:s.shadow?'box-shadow: 0 4px 16px rgba(0,0,0,.3);':''}\n}`;
      onChange(s);
    }

    controls.appendChild(ui$c.makeSlider({ label:'Size', id:'av-size', min:32, max:128, value:s.size, unit:'px', onChange:v=>{s.size=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'av-r', min:0, max:50, value:s.radius, unit:'%', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Background', id:'av-bg', value:s.bg, onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Text Color', id:'av-color', value:s.color.startsWith('#')?s.color:'#ffffff', onChange:v=>{s.color=v;update();} }));
    controls.appendChild(ui$c.makeTextInput({ label:'Initials', id:'av-init', value:s.initials, onChange:v=>{s.initials=v.slice(0,2).toUpperCase();update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Border', id:'av-border', value:s.border, onChange:v=>{s.border=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Border Color', id:'av-bc', value:s.borderColor, onChange:v=>{s.borderColor=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Ring', id:'av-ring', value:s.ring, onChange:v=>{s.ring=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Ring Color', id:'av-rc', value:s.ringColor, onChange:v=>{s.ringColor=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Shadow', id:'av-shadow', value:s.shadow, onChange:v=>{s.shadow=v;update();} }));
    update();
  },
});

CSSToolbox.register({
  id: 'toggle-switch',
  name: 'Toggle Switch',
  section: 'components',
  icon: '🔀',
  description: 'Design toggle switches / checkboxes',
  keywords: ['toggle', 'switch', 'checkbox', 'on', 'off'],
  presets: [
    { name: 'Default',  state: { width:44, height:24, activeColor:'#6c63ff', inactiveColor:'#2d3348', thumbColor:'#fff', radius:12, thumbSize:18, on:true, label:'Toggle', duration:200 }},
    { name: 'Large',    state: { width:60, height:32, activeColor:'#6c63ff', inactiveColor:'#2d3348', thumbColor:'#fff', radius:16, thumbSize:26, on:true, label:'Large Toggle', duration:200 }},
    { name: 'Square',   state: { width:44, height:24, activeColor:'#6c63ff', inactiveColor:'#2d3348', thumbColor:'#fff', radius:4, thumbSize:18, on:true, label:'Square Toggle', duration:200 }},
    { name: 'iOS Style', state: { width:51, height:31, activeColor:'#34c759', inactiveColor:'#e5e5ea', thumbColor:'#fff', radius:16, thumbSize:27, on:true, label:'iOS Toggle', duration:250 }},
    { name: 'Material', state: { width:40, height:20, activeColor:'#6200ea', inactiveColor:'#757575', thumbColor:'#fff', radius:10, thumbSize:24, on:true, label:'Material Toggle', duration:150 }},
  ],
  defaultState: { width:44, height:24, activeColor:'#6c63ff', inactiveColor:'#2d3348', thumbColor:'#fff', radius:12, thumbSize:18, on:true, label:'Toggle', duration:200 },
  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:240px;flex-direction:column;gap:20px;';
    preview.appendChild(previewArea);

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:12px;cursor:pointer;';

    const track = document.createElement('div');
    track.style.cssText = 'position:relative;cursor:pointer;transition:all .2s;';

    const thumb = document.createElement('div');
    thumb.style.cssText = `position:absolute;top:50%;transform:translateY(-50%);border-radius:50%;transition:all .2s ease;box-shadow:0 2px 4px rgba(0,0,0,.3);`;
    track.appendChild(thumb);

    const labelEl = document.createElement('span');
    labelEl.style.cssText = 'font-size:14px;font-weight:500;color:var(--text1);';

    wrap.appendChild(track);
    wrap.appendChild(labelEl);
    previewArea.appendChild(wrap);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-toggle-switch-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-toggle-switch-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const offset = s.on ? (s.width - s.thumbSize - (s.height - s.thumbSize)/2) : (s.height - s.thumbSize)/2;
      Object.assign(track.style, { width:s.width+'px', height:s.height+'px', borderRadius:s.radius+'px', background: s.on?s.activeColor:s.inactiveColor, transition:`background ${s.duration}ms ease` });
      Object.assign(thumb.style, { width:s.thumbSize+'px', height:s.thumbSize+'px', background:s.thumbColor, left:offset+'px', transition:`left ${s.duration}ms ease` });
      labelEl.textContent = s.label;
      document.getElementById('out-toggle-switch-code').textContent =
        `.toggle { width:${s.width}px; height:${s.height}px; border-radius:${s.radius}px; background:${s.inactiveColor}; position:relative; cursor:pointer; transition:background ${s.duration}ms ease; }\n.toggle.on { background:${s.activeColor}; }\n.toggle-thumb { width:${s.thumbSize}px; height:${s.thumbSize}px; border-radius:50%; background:${s.thumbColor}; position:absolute; top:50%; left:${(s.height-s.thumbSize)/2}px; transform:translateY(-50%); transition:left ${s.duration}ms ease; box-shadow:0 2px 4px rgba(0,0,0,.3); }\n.toggle.on .toggle-thumb { left:${s.width-s.thumbSize-(s.height-s.thumbSize)/2}px; }`;
      onChange(s);
    }

    track.addEventListener('click', () => { s.on = !s.on; update(); });

    controls.appendChild(ui$c.makeSlider({ label:'Width', id:'tg-w', min:30, max:80, value:s.width, unit:'px', onChange:v=>{s.width=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Height', id:'tg-h', min:16, max:40, value:s.height, unit:'px', onChange:v=>{s.height=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Thumb Size', id:'tg-ts', min:10, max:36, value:s.thumbSize, unit:'px', onChange:v=>{s.thumbSize=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'tg-r', min:0, max:20, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Active Color', id:'tg-ac', value:s.activeColor, onChange:v=>{s.activeColor=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Inactive Color', id:'tg-ic', value:s.inactiveColor, onChange:v=>{s.inactiveColor=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Thumb Color', id:'tg-tc', value:s.thumbColor, onChange:v=>{s.thumbColor=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Duration', id:'tg-dur', min:50, max:600, step:50, value:s.duration, unit:'ms', onChange:v=>{s.duration=v;update();} }));
    update();
  },
});

CSSToolbox.register({
  id: 'progress-bar',
  name: 'Progress Bar',
  section: 'components',
  icon: '📊',
  description: 'Design progress bars and loading indicators',
  keywords: ['progress', 'bar', 'loading', 'completion', 'percentage'],
  presets: [
    { name: 'Default',   state: { value:60, bg:'#6c63ff', trackBg:'#2d3348', height:8, radius:4, animated:false, striped:false, gradient:false, grad2:'#a78bfa', label:true }},
    { name: 'Thin',      state: { value:75, bg:'#6c63ff', trackBg:'#2d3348', height:4, radius:2, animated:false, striped:false, gradient:false, grad2:'#a78bfa', label:false }},
    { name: 'Thick',     state: { value:45, bg:'#6c63ff', trackBg:'#2d3348', height:20, radius:10, animated:false, striped:false, gradient:false, grad2:'#a78bfa', label:true }},
    { name: 'Gradient',  state: { value:70, bg:'#6c63ff', trackBg:'#2d3348', height:12, radius:6, animated:false, striped:false, gradient:true, grad2:'#a855f7', label:true }},
    { name: 'Striped',   state: { value:55, bg:'#6c63ff', trackBg:'#2d3348', height:16, radius:8, animated:true, striped:true, gradient:false, grad2:'#a78bfa', label:false }},
    { name: 'Success',   state: { value:100, bg:'#10b981', trackBg:'#2d3348', height:8, radius:4, animated:false, striped:false, gradient:false, grad2:'#34d399', label:true }},
    { name: 'Warning',   state: { value:30, bg:'#f59e0b', trackBg:'#2d3348', height:10, radius:5, animated:false, striped:false, gradient:false, grad2:'#fbbf24', label:true }},
  ],
  defaultState: { value:60, bg:'#6c63ff', trackBg:'#2d3348', height:8, radius:4, animated:false, striped:false, gradient:false, grad2:'#a78bfa', label:true },
  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:240px;flex-direction:column;gap:20px;';
    preview.appendChild(previewArea);

    const pbWrap = document.createElement('div');
    pbWrap.style.cssText = 'width:80%;display:flex;flex-direction:column;gap:8px;';

    const labelRow = document.createElement('div');
    labelRow.style.cssText = 'display:flex;justify-content:space-between;font-size:12px;color:var(--text2);';
    labelRow.innerHTML = '<span>Progress</span><span id="pb-pct">60%</span>';

    const track = document.createElement('div');
    track.style.cssText = 'width:100%;overflow:hidden;';

    const fill = document.createElement('div');
    fill.style.cssText = 'transition:width .4s ease;position:relative;overflow:hidden;';
    track.appendChild(fill);

    pbWrap.appendChild(labelRow);
    pbWrap.appendChild(track);
    previewArea.appendChild(pbWrap);

    let stripedStyle = document.getElementById('pb-striped-style');
    if (!stripedStyle) { stripedStyle = document.createElement('style'); stripedStyle.id = 'pb-striped-style'; document.head.appendChild(stripedStyle); }

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-progress-bar-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-progress-bar-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function update() {
      const bg = s.gradient ? `linear-gradient(90deg, ${s.bg}, ${s.grad2})` : s.bg;
      Object.assign(track.style, { height:s.height+'px', borderRadius:s.radius+'px', background:s.trackBg });
      Object.assign(fill.style, { width:s.value+'%', height:'100%', borderRadius:`${s.radius}px`, background:bg });
      document.getElementById('pb-pct').textContent = s.value + '%';
      labelRow.style.display = s.label ? 'flex' : 'none';

      if (s.striped) {
        stripedStyle.textContent = `#pb-fill-el { background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,.15) 8px, rgba(255,255,255,.15) 16px) !important; ${s.animated ? 'animation:slideIn 1s linear infinite;' : ''} }`;
        fill.id = 'pb-fill-el';
      } else {
        stripedStyle.textContent = '';
      }

      document.getElementById('out-progress-bar-code').textContent =
        `.progress-track {\n  height: ${s.height}px;\n  border-radius: ${s.radius}px;\n  background: ${s.trackBg};\n  overflow: hidden;\n}\n.progress-fill {\n  width: ${s.value}%;\n  height: 100%;\n  background: ${bg};\n  border-radius: ${s.radius}px;\n  transition: width 0.4s ease;\n}`;
      onChange(s);
    }

    controls.appendChild(ui$c.makeSlider({ label:'Value', id:'pb-val', min:0, max:100, value:s.value, unit:'%', onChange:v=>{s.value=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Fill Color', id:'pb-bg', value:s.bg, onChange:v=>{s.bg=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Gradient Fill', id:'pb-grad', value:s.gradient, onChange:v=>{s.gradient=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Gradient End', id:'pb-grad2', value:s.grad2, onChange:v=>{s.grad2=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Track Color', id:'pb-track', value:s.trackBg, onChange:v=>{s.trackBg=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Height', id:'pb-h', min:2, max:40, value:s.height, unit:'px', onChange:v=>{s.height=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'pb-r', min:0, max:20, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Show Label', id:'pb-label', value:s.label, onChange:v=>{s.label=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Striped', id:'pb-striped', value:s.striped, onChange:v=>{s.striped=v;update();} }));
    controls.appendChild(ui$c.makeToggle({ label:'Animated Stripes', id:'pb-anim', value:s.animated, onChange:v=>{s.animated=v;update();} }));
    update();
  },
});

CSSToolbox.register({
  id: 'skeleton-loader',
  name: 'Skeleton Loader',
  section: 'components',
  icon: '💀',
  description: 'Generate skeleton screen loading placeholders',
  keywords: ['skeleton', 'loader', 'placeholder', 'loading', 'shimmer'],
  presets: [
    { name: 'Card',     state: { type:'card',     speed:1.4, baseColor:'#1f2533', shimmerColor:'#2a3045', radius:8 }},
    { name: 'Profile',  state: { type:'profile',  speed:1.4, baseColor:'#1f2533', shimmerColor:'#2a3045', radius:8 }},
    { name: 'Article',  state: { type:'article',  speed:1.4, baseColor:'#1f2533', shimmerColor:'#2a3045', radius:4 }},
    { name: 'List',     state: { type:'list',     speed:1.4, baseColor:'#1f2533', shimmerColor:'#2a3045', radius:4 }},
    { name: 'Light Card', state: { type:'card',   speed:1.4, baseColor:'#e2e8f0', shimmerColor:'#f0f2f5', radius:8 }},
  ],
  defaultState: { type:'card', speed:1.4, baseColor:'#1f2533', shimmerColor:'#2a3045', radius:8 },
  render(controls, preview, s, onChange) {
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.cssText = 'min-height:280px;align-items:flex-start;padding:24px;';
    preview.appendChild(previewArea);

    let skStyle = document.getElementById('sk-style');
    if (!skStyle) { skStyle = document.createElement('style'); skStyle.id = 'sk-style'; document.head.appendChild(skStyle); }

    const skWrap = document.createElement('div');
    skWrap.id = 'sk-preview';
    skWrap.style.cssText = 'width:100%;max-width:320px;';
    previewArea.appendChild(skWrap);

    const outWrap = document.createElement('div');
    outWrap.className = 'output-area';
    outWrap.innerHTML = `
      <div class="output-tabs"><button class="output-tab active">CSS</button></div>
      <div class="output-content active">
        <pre class="output-code" id="out-skeleton-loader-code" style="max-height:200px;overflow:auto;"></pre>
        <div class="copy-row"><button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('out-skeleton-loader-code')">Copy CSS</button></div>
      </div>`;
    preview.appendChild(outWrap);

    function buildSkeleton() {
      const line = (w = '100%', h = '12px', extra = '') => `<div style="width:${w};height:${h};background:linear-gradient(90deg,${s.baseColor} 25%,${s.shimmerColor} 50%,${s.baseColor} 75%);background-size:200% 100%;animation:shimmer ${s.speed}s infinite;border-radius:${s.radius}px;${extra}"></div>`;
      const circle = (size = '48px') => `<div style="width:${size};height:${size};border-radius:50%;background:linear-gradient(90deg,${s.baseColor} 25%,${s.shimmerColor} 50%,${s.baseColor} 75%);background-size:200% 100%;animation:shimmer ${s.speed}s infinite;flex-shrink:0;"></div>`;

      const templates = {
        card:    `<div style="background:${s.baseColor}33;border-radius:${s.radius}px;padding:16px;border:1px solid ${s.baseColor};">${line('100%','140px','border-radius:6px;margin-bottom:12px;')}${line('70%','12px','margin-bottom:8px;')}${line('100%')}${line('85%','12px','margin-top:8px;')}${line('60%','12px','margin-top:8px;')}</div>`,
        profile: `<div style="display:flex;gap:12px;align-items:flex-start;">${circle()}  <div style="flex:1;display:flex;flex-direction:column;gap:8px;">${line('60%','14px')}${line('40%','10px')}${line('100%','10px','margin-top:4px;')}${line('90%')}${line('70%')}</div></div>`,
        article: `<div style="display:flex;flex-direction:column;gap:8px;">${line('100%','180px','border-radius:6px;margin-bottom:4px;')}${line('50%','10px')}${line('100%')}${line('100%')}${line('90%')}${line('60%','10px','margin-top:4px;')}</div>`,
        list:    `<div style="display:flex;flex-direction:column;gap:12px;">${[1,2,3].map(()=>`<div style="display:flex;gap:10px;align-items:center;">${circle('36px')}<div style="flex:1;display:flex;flex-direction:column;gap:6px;">${line('60%')}${line('40%','10px')}</div></div>`).join('')}</div>`,
      };
      return templates[s.type] || templates.card;
    }

    function update() {
      skWrap.innerHTML = buildSkeleton();
      document.getElementById('out-skeleton-loader-code').textContent =
        `@keyframes shimmer {\n  from { background-position: -200% 0; }\n  to   { background-position: 200% 0; }\n}\n\n.skeleton {\n  background: linear-gradient(\n    90deg,\n    ${s.baseColor} 25%,\n    ${s.shimmerColor} 50%,\n    ${s.baseColor} 75%\n  );\n  background-size: 200% 100%;\n  animation: shimmer ${s.speed}s infinite;\n  border-radius: ${s.radius}px;\n}`;
      onChange(s);
    }

    const TYPES = ['card','profile','article','list'].map(t=>({value:t,label:t.charAt(0).toUpperCase()+t.slice(1)}));
    controls.appendChild(ui$c.makeSelect({ label:'Layout', id:'sk-type', options:TYPES, value:s.type, onChange:v=>{s.type=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Base Color', id:'sk-base', value:s.baseColor, onChange:v=>{s.baseColor=v;update();} }));
    controls.appendChild(ui$c.makeColor({ label:'Shimmer Color', id:'sk-shimmer', value:s.shimmerColor, onChange:v=>{s.shimmerColor=v;update();} }));
    controls.appendChild(ui$c.makeSlider({ label:'Speed', id:'sk-speed', min:40, max:400, step:10, value:Math.round(s.speed*100), unit:'',
      onChange: v => { s.speed = v/100; document.getElementById('sk-speed-val').textContent = (v/100).toFixed(2)+'s'; update(); } }));
    controls.appendChild(ui$c.makeSlider({ label:'Border Radius', id:'sk-r', min:0, max:20, value:s.radius, unit:'px', onChange:v=>{s.radius=v;update();} }));
    update();
  },
});
