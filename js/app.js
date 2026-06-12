/**
 * CSS Design Toolbox — Core Framework (app.js)
 * Handles: tool registry, navigation, theme, storage, search,
 *          favorites, history, export/import, generic controls, toast.
 */

'use strict';

/* ══════════════════════════════════════════════════
   1.  Global Toolbox Object
══════════════════════════════════════════════════ */
const CSSToolbox = (() => {

  /* ── State ── */
  const state = {
    theme: 'dark',
    activeTool: null,
    sidebarCollapsed: false,
    deviceMode: 'desktop',
    compareMode: false,
    favorites: [],       // array of tool IDs
    toolStates: {},      // { toolId: stateObj }
    history: {},         // { toolId: [{ css, state, ts }] }
    maxHistory: 20,
  };

  /* Tool registry: id → toolDef */
  const registry = {};

  /* Section metadata */
  const sections = {
    'core-css':    { label: 'Core CSS',        icon: '🎨' },
    'typography':  { label: 'Typography',       icon: '📝' },
    'shapes':      { label: 'Shapes & Effects', icon: '🔷' },
    'components':  { label: 'Components',       icon: '🧩' },
    'utilities':   { label: 'Utilities',        icon: '🔧' },
    'suggestions': { label: 'Suggestions',      icon: '💡' },
  };

  /* ══════════════════════════════════════════════
     2.  Tool Registration
  ══════════════════════════════════════════════ */
  function register(toolDef) {
    registry[toolDef.id] = toolDef;
  }

  /* ══════════════════════════════════════════════
     3.  Initialisation
  ══════════════════════════════════════════════ */
  function init() {
    loadPersistedState();
    applyTheme(state.theme);
    buildSidebarNav();
    buildWelcomeGrid();
    bindGlobalEvents();
    // restore last active tool
    const last = localStorage.getItem('ctb_last_tool');
    if (last && registry[last]) {
      showTool(last);
    }
  }

  /* ══════════════════════════════════════════════
     4.  Persistence
  ══════════════════════════════════════════════ */
  function loadPersistedState() {
    try {
      const saved = JSON.parse(localStorage.getItem('ctb_state') || '{}');
      if (saved.theme)     state.theme     = saved.theme;
      if (saved.favorites) state.favorites = saved.favorites;
      if (saved.toolStates) state.toolStates = saved.toolStates;
      if (saved.sidebarCollapsed) state.sidebarCollapsed = saved.sidebarCollapsed;
      if (saved.history)   state.history   = saved.history;
    } catch (_) { /* ignore */ }
  }

  function persistState() {
    try {
      const toSave = {
        theme: state.theme,
        favorites: state.favorites,
        toolStates: state.toolStates,
        sidebarCollapsed: state.sidebarCollapsed,
        history: state.history,
      };
      localStorage.setItem('ctb_state', JSON.stringify(toSave));
    } catch (_) { /* ignore */ }
  }

  /* ══════════════════════════════════════════════
     5.  Sidebar Navigation
  ══════════════════════════════════════════════ */
  function buildSidebarNav() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    nav.innerHTML = '';

    // Pinned/favorites section first (if any)
    if (state.favorites.length) {
      nav.appendChild(buildSection('Pinned', '📌', state.favorites.map(id => registry[id]).filter(Boolean)));
    }

    // Then each section
    for (const [secId, secMeta] of Object.entries(sections)) {
      const tools = Object.values(registry).filter(t => t.section === secId);
      if (!tools.length) continue;
      nav.appendChild(buildSection(secMeta.label, secMeta.icon, tools));
    }

    if (state.sidebarCollapsed) {
      document.getElementById('sidebar').classList.add('collapsed');
    }
  }

  function buildSection(label, icon, tools) {
    const sec = document.createElement('div');
    sec.className = 'nav-section';

    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = `${icon} ${label}`;
    sec.appendChild(title);

    for (const tool of tools) {
      sec.appendChild(buildNavLink(tool));
    }
    return sec;
  }

  function buildNavLink(tool) {
    const a = document.createElement('div');
    a.className = 'nav-link' + (state.favorites.includes(tool.id) ? ' pinned' : '');
    a.dataset.toolId = tool.id;
    a.setAttribute('role', 'button');
    a.setAttribute('tabindex', '0');
    a.setAttribute('aria-label', tool.name);
    a.innerHTML = `
      <span class="nav-icon">${tool.icon}</span>
      <span class="nav-label">${tool.name}</span>
      <span class="nav-pin" title="${state.favorites.includes(tool.id) ? 'Unpin' : 'Pin'}" data-pin="${tool.id}">
        ${state.favorites.includes(tool.id) ? '★' : '☆'}
      </span>`;

    a.addEventListener('click', (e) => {
      // Check if pin button was clicked
      if (e.target.dataset.pin) {
        toggleFavorite(e.target.dataset.pin);
        return;
      }
      showTool(tool.id);
    });
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showTool(tool.id); }
    });
    return a;
  }

  /* ══════════════════════════════════════════════
     6.  Welcome Grid
  ══════════════════════════════════════════════ */
  function buildWelcomeGrid() {
    const grid = document.getElementById('welcomeGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const [secId, secMeta] of Object.entries(sections)) {
      const tools = Object.values(registry).filter(t => t.section === secId);
      if (!tools.length) continue;

      const card = document.createElement('div');
      card.className = 'welcome-card';
      card.innerHTML = `
        <div class="welcome-card-icon">${secMeta.icon}</div>
        <h3>${secMeta.label}</h3>
        <p>${tools.length} tools</p>`;
      card.addEventListener('click', () => showTool(tools[0].id));
      grid.appendChild(card);
    }
  }

  /* ══════════════════════════════════════════════
     7.  Show Tool
  ══════════════════════════════════════════════ */
  function showTool(toolId) {
    const tool = registry[toolId];
    if (!tool) return;

    state.activeTool = toolId;
    localStorage.setItem('ctb_last_tool', toolId);

    // Hide welcome screen
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.style.display = 'none';

    // Remove all active panels
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));

    // Get or create the panel
    let panel = document.getElementById(`panel-${toolId}`);
    if (!panel) {
      panel = createPanel(tool);
      if (!panel.isConnected) {
        document.getElementById('mainContent').appendChild(panel);
      }
    }
    panel.classList.add('active');

    // Update sidebar active state
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.toolId === toolId);
    });

    // Update breadcrumb
    updateBreadcrumb(tool);

    // Update pin button
    const pinBtn = document.getElementById('pinBtn');
    if (pinBtn) {
      pinBtn.textContent = state.favorites.includes(toolId) ? '★' : '☆';
      pinBtn.title = state.favorites.includes(toolId) ? 'Unpin tool' : 'Pin tool';
    }

    persistState();
  }

  function createPanel(tool) {
    const panel = document.createElement('div');
    panel.className = 'tool-panel';
    panel.id = `panel-${tool.id}`;

    // Get saved state or use defaults
    const toolState = state.toolStates[tool.id]
      ? JSON.parse(JSON.stringify(state.toolStates[tool.id]))
      : JSON.parse(JSON.stringify(tool.defaultState || {}));

    // Header
    panel.innerHTML = `
      <div class="panel-header">
        <div>
          <div class="panel-title">
            <span class="panel-icon">${tool.icon}</span>
            ${tool.name}
          </div>
          ${tool.description ? `<div class="panel-desc">${tool.description}</div>` : ''}
        </div>
        <div class="panel-actions"></div>
      </div>`;

    // Presets bar
    if (tool.presets && tool.presets.length) {
      const presetsBar = document.createElement('div');
      presetsBar.className = 'presets-bar';
      presetsBar.innerHTML = `<span class="preset-label">Presets:</span>`;
      for (const preset of tool.presets) {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.textContent = preset.name;
        btn.addEventListener('click', () => {
          applyPreset(tool, panel, toolState, preset);
          presetsBar.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
        presetsBar.appendChild(btn);
      }
      panel.appendChild(presetsBar);
    }

    // Body (controls + preview)
    const body = document.createElement('div');
    body.className = 'panel-body';

    const controls = document.createElement('div');
    controls.className = 'panel-controls';
    controls.id = `controls-${tool.id}`;

    const preview = document.createElement('div');
    preview.className = 'panel-preview';
    preview.id = `preview-${tool.id}`;

    body.appendChild(controls);
    body.appendChild(preview);
    panel.appendChild(body);

    const mainContent = document.getElementById('mainContent');
    if (mainContent && !panel.isConnected) {
      mainContent.appendChild(panel);
    }

    // Let the tool render itself
    if (typeof tool.render === 'function') {
      tool.render(controls, preview, toolState, (newState) => {
        onToolChange(tool, panel, newState);
      });
    }

    // Apply device mode
    applyDeviceMode(preview);

    return panel;
  }

  function applyPreset(tool, panel, toolState, preset) {
    Object.assign(toolState, JSON.parse(JSON.stringify(preset.state)));
    // Re-render controls
    const controls = panel.querySelector('.panel-controls');
    const preview = panel.querySelector('.panel-preview');
    controls.innerHTML = '';
    preview.innerHTML = '';
    if (typeof tool.render === 'function') {
      tool.render(controls, preview, toolState, (newState) => {
        onToolChange(tool, panel, newState);
      });
    }
    onToolChange(tool, panel, toolState);
  }

  function onToolChange(tool, panel, newState) {
    state.toolStates[tool.id] = JSON.parse(JSON.stringify(newState));
    addToHistory(tool.id, newState);
    persistState();
  }

  /* ══════════════════════════════════════════════
     8.  History
  ══════════════════════════════════════════════ */
  function addToHistory(toolId, toolState) {
    if (!state.history[toolId]) state.history[toolId] = [];
    const entry = {
      state: JSON.parse(JSON.stringify(toolState)),
      ts: Date.now(),
    };
    state.history[toolId].unshift(entry);
    if (state.history[toolId].length > state.maxHistory) {
      state.history[toolId].pop();
    }
  }

  function renderHistoryDrawer() {
    const listEl = document.getElementById('historyList');
    if (!listEl) return;
    const toolId = state.activeTool;
    const entries = toolId ? (state.history[toolId] || []) : [];
    if (!entries.length) {
      listEl.innerHTML = '<p class="text-muted text-sm">No history yet.</p>';
      return;
    }
    listEl.innerHTML = '';
    entries.forEach((entry, i) => {
      const d = new Date(entry.ts);
      const el = document.createElement('div');
      el.className = 'history-entry';
      el.innerHTML = `<span class="he-time">${d.toLocaleTimeString()}</span>
        <span class="he-css">State #${entries.length - i}</span>`;
      el.addEventListener('click', () => {
        const tool = registry[toolId];
        if (tool) {
          const panel = document.getElementById(`panel-${toolId}`);
          if (panel) applyPreset(tool, panel, state.toolStates[toolId] || {}, { name: 'History', state: entry.state });
        }
        closeDrawers();
        toast('State restored from history');
      });
      listEl.appendChild(el);
    });
  }

  /* ══════════════════════════════════════════════
     9.  Favorites
  ══════════════════════════════════════════════ */
  function toggleFavorite(toolId) {
    const idx = state.favorites.indexOf(toolId);
    if (idx === -1) {
      state.favorites.push(toolId);
      toast(`Pinned "${registry[toolId]?.name}"`, 'success');
    } else {
      state.favorites.splice(idx, 1);
      toast(`Unpinned "${registry[toolId]?.name}"`);
    }
    buildSidebarNav();
    persistState();
    // update pin button
    const pinBtn = document.getElementById('pinBtn');
    if (pinBtn && state.activeTool === toolId) {
      pinBtn.textContent = state.favorites.includes(toolId) ? '★' : '☆';
    }
  }

  /* ══════════════════════════════════════════════
     10.  Theme
  ══════════════════════════════════════════════ */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  /* ══════════════════════════════════════════════
     11.  Device Preview
  ══════════════════════════════════════════════ */
  function applyDeviceMode(previewEl) {
    if (!previewEl) return;
    const area = previewEl.querySelector('.preview-area');
    if (!area) return;
    area.dataset.device = state.deviceMode;
  }

  /* ══════════════════════════════════════════════
     12.  Breadcrumb
  ══════════════════════════════════════════════ */
  function updateBreadcrumb(tool) {
    const bc = document.getElementById('breadcrumb');
    if (!bc) return;
    const secMeta = sections[tool.section] || {};
    bc.innerHTML = `<span>${secMeta.icon || ''} ${secMeta.label || ''}</span>
      <span class="bc-sep">›</span>
      <span class="bc-current">${tool.name}</span>`;
  }

  /* ══════════════════════════════════════════════
     13.  Search
  ══════════════════════════════════════════════ */
  function filterNav(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.nav-link').forEach(link => {
      const toolId = link.dataset.toolId;
      const tool = registry[toolId];
      if (!tool) { link.style.display = ''; return; }
      const match = !q
        || tool.name.toLowerCase().includes(q)
        || (tool.keywords || []).some(k => k.toLowerCase().includes(q));
      link.style.display = match ? '' : 'none';
    });
    // Show/hide section titles based on visible children
    document.querySelectorAll('.nav-section').forEach(sec => {
      const visCount = [...sec.querySelectorAll('.nav-link')].filter(l => l.style.display !== 'none').length;
      sec.style.display = visCount ? '' : 'none';
    });
  }

  /* ══════════════════════════════════════════════
     14.  Export / Import
  ══════════════════════════════════════════════ */
  function exportJSON() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      theme: state.theme,
      favorites: state.favorites,
      toolStates: state.toolStates,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'css-toolbox-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Settings exported!', 'success');
  }

  function importJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.theme)      state.theme      = data.theme;
        if (data.favorites)  state.favorites  = data.favorites;
        if (data.toolStates) state.toolStates = data.toolStates;
        applyTheme(state.theme);
        buildSidebarNav();
        persistState();
        // Refresh active tool if any
        if (state.activeTool) showTool(state.activeTool);
        toast('Settings imported!', 'success');
      } catch (_) {
        toast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
  }

  /* ══════════════════════════════════════════════
     15.  Toast
  ══════════════════════════════════════════════ */
  let toastTimer = null;
  function toast(message, type = '') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.className = `toast show ${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = 'toast'; }, 2600);
  }

  /* ══════════════════════════════════════════════
     16.  Drawers & Overlay
  ══════════════════════════════════════════════ */
  function openDrawer(id) {
    closeDrawers();
    const drawer = document.getElementById(id);
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    if (id === 'historyDrawer') renderHistoryDrawer();
    if (id === 'cheatDrawer') renderCheatSheet();
  }

  function closeDrawers() {
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
  }

  /* ══════════════════════════════════════════════
     17.  Cheat Sheet
  ══════════════════════════════════════════════ */
  const cheatData = {
    'Shadows': [
      ['box-shadow', 'h-offset v-offset blur spread color'],
      ['text-shadow', 'h-offset v-offset blur color'],
      ['filter: drop-shadow()', 'Similar to box-shadow but for non-rectangular elements'],
    ],
    'Borders': [
      ['border-radius', 'top-left top-right bottom-right bottom-left'],
      ['border', 'width style color'],
      ['outline', 'width style color — no layout impact'],
      ['outline-offset', 'Spacing between element and outline'],
    ],
    'Transforms': [
      ['translate(x, y)', 'Move element without affecting layout'],
      ['scale(x, y)', 'Scale element'],
      ['rotate(deg)', 'Rotate element'],
      ['skew(x, y)', 'Skew element'],
    ],
    'Typography': [
      ['clamp(min, val, max)', 'Responsive sizing: clamp(1rem, 2.5vw, 2rem)'],
      ['line-height', 'Leading — use unitless values like 1.5'],
      ['letter-spacing', 'Tracking — use em for proportional spacing'],
      ['font-variant-numeric', 'tabular-nums for aligned numbers'],
    ],
    'Filters': [
      ['blur(px)', 'Gaussian blur'],
      ['brightness(0-2)', '1 = normal, <1 darker, >1 brighter'],
      ['contrast(0-2)', '1 = normal'],
      ['saturate(0-∞)', '0 = grayscale, 1 = normal, >1 saturated'],
      ['hue-rotate(deg)', 'Rotate hue wheel'],
      ['grayscale(0-1)', '0 = color, 1 = full gray'],
      ['sepia(0-1)', 'Warm brownish tone'],
      ['invert(0-1)', 'Invert colors'],
    ],
    'Animations': [
      ['animation-timing-function', 'ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier()'],
      ['animation-fill-mode', 'forwards | backwards | both | none'],
      ['animation-direction', 'normal | reverse | alternate | alternate-reverse'],
      ['will-change: transform', 'GPU compositing hint for performance'],
    ],
    'Clip-path': [
      ['circle(r at cx cy)', 'Circular clip'],
      ['ellipse(rx ry at cx cy)', 'Ellipse clip'],
      ['polygon(x1 y1, x2 y2, …)', 'Custom polygon'],
      ['inset(top right bottom left round r)', 'Inset rectangle'],
    ],
    'Grid': [
      ['grid-template-columns', 'repeat(3, 1fr) | 200px auto 1fr'],
      ['grid-template-rows', 'auto 1fr auto'],
      ['gap', 'row-gap col-gap shorthand'],
      ['place-items', 'align + justify shorthand'],
    ],
    'Flexbox': [
      ['flex', 'grow shrink basis shorthand'],
      ['justify-content', 'flex-start | center | flex-end | space-between | space-around'],
      ['align-items', 'stretch | center | flex-start | flex-end | baseline'],
      ['flex-wrap', 'nowrap | wrap | wrap-reverse'],
    ],
  };

  function renderCheatSheet() {
    const el = document.getElementById('cheatContent');
    if (!el) return;
    el.innerHTML = Object.entries(cheatData).map(([section, items]) => `
      <div class="cheat-section">
        <h4>${section}</h4>
        ${items.map(([prop, desc]) => `
          <div class="cheat-item">
            <span class="cheat-prop">${prop}</span>
            <span class="cheat-desc"> — ${desc}</span>
          </div>`).join('')}
      </div>`).join('');
  }

  /* ══════════════════════════════════════════════
     18.  Compare Mode
  ══════════════════════════════════════════════ */
  function toggleCompare() {
    state.compareMode = !state.compareMode;
    const cc = document.getElementById('compareContainer');
    if (!cc) return;
    cc.classList.toggle('hidden', !state.compareMode);
    if (state.compareMode) {
      // Clone current preview into both panes
      const tool = registry[state.activeTool];
      if (tool) {
        const previewA = document.getElementById('compareA');
        const previewB = document.getElementById('compareB');
        const src = document.getElementById(`preview-${state.activeTool}`);
        if (src && previewA) {
          previewA.innerHTML = `<span class="compare-label">Before</span>` + src.innerHTML;
          previewB.innerHTML = `<span class="compare-label">After (edit to update)</span>` + src.innerHTML;
        }
      }
      toast('Compare mode on — edit controls to see "After" change', 'info');
    }
  }

  /* ══════════════════════════════════════════════
     19.  Randomize
  ══════════════════════════════════════════════ */
  function randomizeTool() {
    const tool = registry[state.activeTool];
    if (!tool || !tool.randomize) {
      toast('No randomize function for this tool', 'warning');
      return;
    }
    const panel = document.getElementById(`panel-${state.activeTool}`);
    if (!panel) return;
    const currentState = state.toolStates[state.activeTool] || {};
    const randomState = tool.randomize(currentState);
    applyPreset(tool, panel, currentState, { name: 'Random', state: randomState });
    toast('Randomized! 🎲', 'success');
  }

  /* ══════════════════════════════════════════════
     20.  Global Event Bindings
  ══════════════════════════════════════════════ */
  function bindGlobalEvents() {
    // Sidebar collapse
    const collapseBtn = document.getElementById('collapseBtn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        const sb = document.getElementById('sidebar');
        state.sidebarCollapsed = !state.sidebarCollapsed;
        sb.classList.toggle('collapsed', state.sidebarCollapsed);
        persistState();
      });
    }

    // Mobile sidebar toggle
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const sb = document.getElementById('sidebar');
        sb.classList.toggle('open');
      });
    }

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => filterNav(e.target.value));
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        persistState();
      });
    }

    // Device buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        state.deviceMode = btn.dataset.device;
        // Apply to current preview
        const previewEl = state.activeTool ? document.getElementById(`preview-${state.activeTool}`) : null;
        if (previewEl) applyDeviceMode(previewEl);
      });
    });

    // Topbar buttons
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) historyBtn.addEventListener('click', () => openDrawer('historyDrawer'));

    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) randomizeBtn.addEventListener('click', randomizeTool);

    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) compareBtn.addEventListener('click', toggleCompare);

    const pinBtn = document.getElementById('pinBtn');
    if (pinBtn) pinBtn.addEventListener('click', () => { if (state.activeTool) toggleFavorite(state.activeTool); });

    // Drawers
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', closeDrawers);
    const cheatSheetBtn = document.getElementById('cheatSheetBtn');
    if (cheatSheetBtn) cheatSheetBtn.addEventListener('click', () => openDrawer('cheatDrawer'));
    const closeCheatBtn = document.getElementById('closeCheatBtn');
    if (closeCheatBtn) closeCheatBtn.addEventListener('click', closeDrawers);

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeDrawers);

    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => {
      if (state.activeTool) { state.history[state.activeTool] = []; persistState(); renderHistoryDrawer(); }
    });

    const closeCompareBtn = document.getElementById('closeCompareBtn');
    if (closeCompareBtn) closeCompareBtn.addEventListener('click', () => {
      state.compareMode = false;
      document.getElementById('compareContainer')?.classList.add('hidden');
    });

    // Export / Import
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportJSON);

    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e) => { importJSON(e.target.files[0]); e.target.value = ''; });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawers();
      // Ctrl+/ → open cheat sheet
      if (e.ctrlKey && e.key === '/') { e.preventDefault(); openDrawer('cheatDrawer'); }
    });
  }

  /* ══════════════════════════════════════════════
     21.  Generic Control Helpers (used by tools)
  ══════════════════════════════════════════════ */

  /** Build a slider + value display row */
  function makeSlider({ label, id, min, max, step = 1, value, unit = '', onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    wrap.innerHTML = `
      <div class="ctrl-label-row">
        <label class="ctrl-label" for="${id}">${label}</label>
        <span class="ctrl-value" id="${id}-val">${value}${unit}</span>
      </div>
      <input type="range" class="ctrl-slider" id="${id}"
             min="${min}" max="${max}" step="${step}" value="${value}">`;
    const input = wrap.querySelector('input');
    const valEl = wrap.querySelector(`#${id}-val`);
    input.addEventListener('input', () => {
      valEl.textContent = input.value + unit;
      onChange(Number(input.value));
    });
    return wrap;
  }

  /** Build a color + hex text input row */
  function makeColor({ label, id, value, onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    wrap.innerHTML = `
      <div class="ctrl-label-row">
        <label class="ctrl-label" for="${id}">${label}</label>
      </div>
      <div class="color-row">
        <input type="color" id="${id}" value="${value}">
        <input type="text" class="ctrl-value color-text" id="${id}-text" value="${value}" maxlength="9">
      </div>`;
    const colorInput = wrap.querySelector(`#${id}`);
    const textInput  = wrap.querySelector(`#${id}-text`);
    colorInput.addEventListener('input', () => { textInput.value = colorInput.value; onChange(colorInput.value); });
    textInput.addEventListener('change', () => {
      if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(textInput.value)) {
        colorInput.value = textInput.value.slice(0, 7);
        onChange(textInput.value);
      }
    });
    return wrap;
  }

  /** Build a select dropdown row */
  function makeSelect({ label, id, options, value, onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    const opts = options.map(o => {
      const v = typeof o === 'string' ? o : o.value;
      const l = typeof o === 'string' ? o : (o.label || o.value);
      return `<option value="${v}" ${v === value ? 'selected' : ''}>${l}</option>`;
    }).join('');
    wrap.innerHTML = `
      <div class="ctrl-label-row">
        <label class="ctrl-label" for="${id}">${label}</label>
      </div>
      <select id="${id}">${opts}</select>`;
    const sel = wrap.querySelector('select');
    sel.addEventListener('change', () => onChange(sel.value));
    return wrap;
  }

  /** Build a toggle switch */
  function makeToggle({ label, id, value, onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    wrap.innerHTML = `
      <div class="toggle-wrap" role="switch" aria-checked="${value}" tabindex="0" id="${id}-wrap">
        <div class="toggle-track ${value ? 'on' : ''}" id="${id}-track">
          <div class="toggle-thumb"></div>
        </div>
        <span class="ctrl-label">${label}</span>
      </div>`;
    let current = value;
    const track = wrap.querySelector('.toggle-track');
    const wrapEl = wrap.querySelector('.toggle-wrap');
    const toggle = () => {
      current = !current;
      track.classList.toggle('on', current);
      wrapEl.setAttribute('aria-checked', current);
      onChange(current);
    };
    wrapEl.addEventListener('click', toggle);
    wrapEl.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
    return wrap;
  }

  /** Build a plain text input */
  function makeTextInput({ label, id, value, placeholder = '', onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    wrap.innerHTML = `
      <div class="ctrl-label-row"><label class="ctrl-label" for="${id}">${label}</label></div>
      <input type="text" id="${id}" value="${value}" placeholder="${placeholder}">`;
    const inp = wrap.querySelector('input');
    inp.addEventListener('input', () => onChange(inp.value));
    return wrap;
  }

  /** Build a number input */
  function makeNumber({ label, id, min, max, step = 1, value, unit = '', onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    wrap.innerHTML = `
      <div class="ctrl-label-row">
        <label class="ctrl-label" for="${id}">${label}</label>
        ${unit ? `<span class="ctrl-value">${unit}</span>` : ''}
      </div>
      <input type="number" class="num-input" id="${id}"
             min="${min}" max="${max}" step="${step}" value="${value}" style="width:100%">`;
    const inp = wrap.querySelector('input');
    inp.addEventListener('input', () => onChange(Number(inp.value)));
    return wrap;
  }

  /** Build a textarea */
  function makeTextarea({ label, id, value, rows = 4, placeholder = '', onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ctrl-row';
    wrap.innerHTML = `
      <div class="ctrl-label-row"><label class="ctrl-label" for="${id}">${label}</label></div>
      <textarea id="${id}" rows="${rows}" placeholder="${placeholder}">${value}</textarea>`;
    const ta = wrap.querySelector('textarea');
    ta.addEventListener('input', () => onChange(ta.value));
    return wrap;
  }

  /** Build a section title */
  function makeSectionTitle(text) {
    const div = document.createElement('div');
    div.className = 'ctrl-group-title';
    div.textContent = text;
    return div;
  }

  /** Build a divider */
  function makeDivider() {
    const div = document.createElement('div');
    div.className = 'ctrl-divider';
    return div;
  }

  /** Build a copy-ready output block (preview area with CSS output tabs) */
  function makeOutputBlock(container, { cssId, htmlId, onTabChange } = {}) {
    const output = document.createElement('div');
    output.className = 'output-area';

    const tabs = [
      { id: 'css', label: 'CSS' },
      { id: 'html', label: 'HTML' },
    ];

    let tabsHtml = '<div class="output-tabs">';
    for (const t of tabs) {
      tabsHtml += `<button class="output-tab${t.id === 'css' ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`;
    }
    tabsHtml += '</div>';

    tabsHtml += `
      <div class="output-content active" id="${cssId || 'out-css'}" data-tab-content="css">
        <pre class="output-code" id="${cssId || 'out-css'}-code">/* CSS will appear here */</pre>
        <div class="copy-row">
          <button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('${cssId || 'out-css'}-code')">Copy CSS</button>
        </div>
      </div>
      <div class="output-content" id="${htmlId || 'out-html'}" data-tab-content="html">
        <pre class="output-code" id="${htmlId || 'out-html'}-code"><!-- HTML snippet --></pre>
        <div class="copy-row">
          <button class="btn btn-secondary btn-sm" onclick="CSSToolbox.copyCode('${htmlId || 'out-html'}-code')">Copy HTML</button>
        </div>
      </div>`;

    output.innerHTML = tabsHtml;

    // Tab switching
    output.querySelectorAll('.output-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        output.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
        output.querySelectorAll('.output-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = output.querySelector(`[data-tab-content="${tab.dataset.tab}"]`);
        if (content) content.classList.add('active');
        if (onTabChange) onTabChange(tab.dataset.tab);
      });
    });

    container.appendChild(output);
    return output;
  }

  /** Copy code from a pre element */
  function copyCode(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      toast('Copied to clipboard!', 'success');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = el.textContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast('Copied!', 'success');
    });
  }

  /** Make a standard preview area + output tabs */
  function makePreviewAndOutput(previewContainer, { toolId, preview: previewContent }) {
    previewContainer.innerHTML = '';

    const area = document.createElement('div');
    area.className = 'preview-area';
    area.innerHTML = previewContent;
    previewContainer.appendChild(area);

    makeOutputBlock(previewContainer, {
      cssId: `out-${toolId}-css`,
      htmlId: `out-${toolId}-html`,
    });

    return area;
  }

  /* Update output code */
  function setOutput(toolId, css, html = '') {
    const cssEl = document.getElementById(`out-${toolId}-css-code`);
    const htmlEl = document.getElementById(`out-${toolId}-html-code`);
    if (cssEl) cssEl.textContent = css;
    if (htmlEl) htmlEl.textContent = html || `<!-- Apply the CSS above to your element -->`;
  }

  /* ══════════════════════════════════════════════
     22.  Expose public API
  ══════════════════════════════════════════════ */
  return {
    register,
    init,
    showTool,
    toast,
    copyCode,
    // Control builders (used by tool files)
    ui: {
      makeSlider,
      makeColor,
      makeSelect,
      makeToggle,
      makeTextInput,
      makeNumber,
      makeTextarea,
      makeSectionTitle,
      makeDivider,
      makeOutputBlock,
      makePreviewAndOutput,
      setOutput,
    },
    // Utilities for tools
    getTool: (id) => registry[id],
    getToolState: (id) => state.toolStates[id],
    getTheme: () => state.theme,
  };

})();

/* Auto-init after all scripts load */
document.addEventListener('DOMContentLoaded', () => CSSToolbox.init());
