// ── STATE ──────────────────────────────────────────────────────────────────
const S = {
  token:         null,
  user:          null,
  fields:        [],
  field:         null,
  projects:      [],
  project:       null,
  campaign:      null,   // live campaign data
  campaignId:    null,
  revisionType:  null,
};

// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user  = localStorage.getItem('user');
  if (token && user) {
    S.token = token;
    S.user  = JSON.parse(user);
    showHeader();
    loadFieldsAndGo();
  }
});

// ── API HELPER ─────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(S.token ? { Authorization: `Bearer ${S.token}` } : {}),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
let loginTab = 'admin';
function setLoginTab(tab, el) {
  loginTab = tab;
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;
  const errEl = document.getElementById('login-err');
  const btn   = document.getElementById('btn-login');
  errEl.textContent = '';
  if (!email || !pass) { errEl.textContent = 'Please enter email and password.'; return; }
  btn.textContent = 'Signing in…'; btn.disabled = true;
  try {
    const data = await api('/api/auth/login', { method: 'POST', body: { email, password: pass } });
    S.token  = data.token;
    S.user   = data.user;
    S.fields = data.fields || [];
    localStorage.setItem('token', S.token);
    localStorage.setItem('user',  JSON.stringify(S.user));
    showHeader();
    showFieldPage();
  } catch(e) {
    errEl.textContent = e.message;
  } finally {
    btn.textContent = 'Sign In'; btn.disabled = false;
  }
}

// ── HEADER ────────────────────────────────────────────────────────────────
function showHeader() {
  if (!S.user) return;
  document.getElementById('header').classList.remove('hidden');
  document.getElementById('hd-avatar').textContent = S.user.name[0].toUpperCase();
  document.getElementById('hd-name').textContent   = S.user.name;
  const roleEl = document.getElementById('hd-role');
  roleEl.textContent  = S.user.role;
  roleEl.className    = `hd-role role-${S.user.role}`;
  if (S.user.role === 'admin') document.getElementById('btn-admin').style.display = '';
}

function setBreadcrumb(parts) {
  const bc = document.getElementById('breadcrumb');
  bc.innerHTML = parts.map((p, i) =>
    i === parts.length - 1
      ? `<span class="active">${p}</span>`
      : `<span>${p}</span><span class="sep">›</span>`
  ).join('');
}

function logout() {
  localStorage.clear();
  location.reload();
}

function goHome() {
  showPage('pg-fields');
  setBreadcrumb(['AI Agency']);
  closeSidebar();
  document.getElementById('hd-search-box').style.display = 'none';
}

// ── PAGES ─────────────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// ── FIELDS PAGE ───────────────────────────────────────────────────────────
async function loadFieldsAndGo() {
  try {
    S.fields = await api('/api/fields');
    showFieldPage();
  } catch(e) {
    showPage('pg-login');
  }
}

function showFieldPage() {
  setBreadcrumb(['AI Agency', 'Choose Workspace']);
  document.getElementById('fields-greeting').textContent =
    `Welcome back, ${S.user?.name?.split(' ')[0] || 'there'}. What are we building today?`;
  renderFields();
  showPage('pg-fields');
  document.getElementById('hd-search-box').style.display = 'none';
}

function renderFields() {
  const grid = document.getElementById('fields-grid');
  grid.innerHTML = S.fields.map(f => `
    <div class="field-card ${f.status === 'active' ? 'active-field' : 'coming-soon'}"
         onclick="${f.status === 'active' ? `selectField(${f.id})` : ''}">
      <span class="field-badge ${f.status === 'active' ? 'badge-active' : 'badge-soon'}">
        ${f.status === 'active' ? 'Active' : 'Coming Soon'}
      </span>
      <div class="field-card-icon">${f.icon}</div>
      <h3>${f.name}</h3>
      <p>${f.description || ''}</p>
    </div>`).join('');
}

async function selectField(fieldId) {
  S.field = S.fields.find(f => f.id === fieldId);
  if (!S.field) return;
  setBreadcrumb(['AI Agency', S.field.name]);
  document.getElementById('proj-field-name').textContent = S.field.name;
  document.getElementById('proj-field-desc').textContent = S.field.description || '';
  document.getElementById('hd-search-box').style.display = '';
  await loadProjects();
  showPage('pg-projects');
}

// ── PROJECTS ──────────────────────────────────────────────────────────────
async function loadProjects(search = '') {
  if (!S.field) return;
  try {
    const params = new URLSearchParams({ field_id: S.field.id });
    if (search) params.append('search', search);
    S.projects = await api(`/api/projects?${params}`);
    renderProjects();
    renderSidebarProjects();
  } catch(e) { console.error(e); }
}

function renderProjects() {
  const grid = document.getElementById('proj-grid');
  if (!S.projects.length) {
    grid.innerHTML = `<div class="empty-state"><div class="ei">📁</div><h3>No projects yet</h3><p>Create your first project to start running campaigns.</p><button class="btn btn-primary btn-sm" onclick="openNewProject()">+ New Project</button></div>`;
    return;
  }
  grid.innerHTML = S.projects.map(p => `
    <div class="proj-card" onclick="selectProject(${p.id})">
      <div class="proj-card-header">
        <div class="proj-brand">${p.brand}</div>
        <span class="badge badge-purple" style="font-size:9px">${S.field?.name || ''}</span>
      </div>
      <div class="proj-name">${p.name}</div>
      <div class="proj-stats">
        <span class="proj-stat">📊 ${p.campaign_count || 0} campaign${p.campaign_count !== 1 ? 's' : ''}</span>
        <span class="proj-stat">🕐 ${timeAgo(p.updated_at)}</span>
      </div>
    </div>`).join('');
}

function renderSidebarProjects() {
  const list = document.getElementById('sb-proj-list');
  list.innerHTML = S.projects.slice(0, 6).map(p => `
    <div class="sb-item ${S.project?.id === p.id ? 'active' : ''}" onclick="selectProject(${p.id})">
      <div class="sb-dot"></div>
      <div class="sb-info"><div class="sb-name">${p.brand}</div><div class="sb-meta">${p.campaign_count || 0} campaigns</div></div>
    </div>`).join('');
}

function searchProjects(q) { loadProjects(q); }

async function selectProject(id) {
  S.project = S.projects.find(p => p.id === id) || await api(`/api/projects/${id}`);
  document.getElementById('ws-brand-name').textContent = S.project.brand;
  document.getElementById('ws-proj-name').textContent  = S.project.name;
  document.getElementById('ws-db-brand').textContent   = S.project.brand;
  document.getElementById('ws-db-meta').textContent    = S.project.niche || S.project.goals?.slice(0, 60) || '';
  document.getElementById('ws-camp-proj').textContent  = `Project: ${S.project.brand}`;
  setBreadcrumb(['AI Agency', S.field?.name || '', S.project.brand]);
  document.getElementById('hd-search-box').style.display = 'none';
  renderSidebarProjects();
  renderCampaignHistory();
  wsShow('dashboard');
  showPage('pg-workspace');
  closeSidebar();
}

function renderCampaignHistory() {
  const hist  = document.getElementById('ws-history');
  const camps = S.project.campaigns || [];
  if (!camps.length) { hist.innerHTML = '<p style="font-size:13px;color:var(--muted)">No campaigns yet. Start one above.</p>'; return; }
  hist.innerHTML = [...camps].reverse().map(c => `
    <div class="history-item">
      <div><b>${c.product_focus || c.name || 'Campaign'}</b><p>${fmtDate(c.created_at)}</p></div>
      <span class="badge badge-green">${c.status === 'complete' ? 'Complete' : c.status}</span>
    </div>`).join('');

  const sbList = document.getElementById('sb-camp-list');
  sbList.innerHTML = [...camps].reverse().slice(0,5).map(c => `
    <div class="sb-item"><div class="sb-dot"></div><div class="sb-info"><div class="sb-name" style="font-size:11px">${c.product_focus || 'Campaign'}</div></div></div>`).join('');
}

function goBack() {
  showPage('pg-projects');
  document.getElementById('hd-search-box').style.display = '';
  setBreadcrumb(['AI Agency', S.field?.name || '']);
}

// ── NEW PROJECT MODAL ─────────────────────────────────────────────────────
function openNewProject() { openModal('modal-project'); document.getElementById('mp-name').focus(); }

async function createProject() {
  const name  = document.getElementById('mp-name').value.trim();
  const brand = document.getElementById('mp-brand').value.trim();
  const niche = document.getElementById('mp-niche').value.trim();
  const goals = document.getElementById('mp-goals').value.trim();
  if (!name || !brand) { alert('Project name and brand name required.'); return; }
  try {
    const p = await api('/api/projects', { method: 'POST', body: { name, brand, niche, goals, field_id: S.field?.id } });
    S.projects.unshift({ ...p, campaign_count: 0 });
    closeModal('modal-project');
    ['mp-name','mp-brand','mp-niche','mp-goals'].forEach(id => document.getElementById(id).value = '');
    renderProjects();
    renderSidebarProjects();
    selectProject(p.id);
  } catch(e) { alert(e.message); }
}

// ── WORKSPACE SCREENS ─────────────────────────────────────────────────────
function wsShow(name) {
  document.querySelectorAll('.ws-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`ws-${name}`)?.classList.add('active');
}

// ── WORKFLOW ──────────────────────────────────────────────────────────────
const STEPS = {
  brief:        { label: 'Brief Agent',                 icon: '📋' },
  initial_copy: { label: 'Initial Draft (pre-research)',icon: '📝' },
  research:     { label: 'Research Hub (3 parallel)',   icon: '🔍' },
  synthesis:    { label: 'Research Synthesis Agent',    icon: '🔀' },
  copy:         { label: 'Copywriting Agent',           icon: '✍️' },
  copyQA:       { label: 'Copy QA Agent',               icon: '⭐' },
  design:       { label: 'Designer Agent',              icon: '🎨' },
  designQA:     { label: 'Design QA Agent',             icon: '🔍' },
};

function getForm() {
  return {
    brandName:       S.project?.brand || '',
    websiteUrl:      v('f-url'),
    emailType:       v('f-type'),
    productFocus:    v('f-product'),
    campaignGoal:    v('f-goal'),
    targetAudience:  v('f-audience'),
    offer:           v('f-offer'),
    callToAction:    v('f-cta'),
    tone:            v('f-tone'),
    urgency:         v('f-urgency'),
    metaAdsInsights: v('f-meta'),
    constraints:     v('f-constraints'),
    additionalNotes: v('f-notes'),
  };
}

async function runWorkflow() {
  const input = getForm();
  if (!input.productFocus || !input.campaignGoal) { alert('Please fill in Product Focus and Campaign Goal.'); return; }
  S.campaign = { input };
  S.campaignId = null;
  document.getElementById('run-progress').innerHTML = '';
  wsShow('running');

  try {
    const res = await fetch('/api/campaigns/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${S.token}` },
      body: JSON.stringify({ project_id: S.project.id, input }),
    });
    await streamEvents(res, handleRunEvent);
  } catch(e) {
    renderStep('run-progress', 'error', 'error', e.message);
  }
}

function handleRunEvent(ev) {
  if (ev.campaignId) S.campaignId = ev.campaignId;
  const { step, status, message, data } = ev;

  if (step === 'checkpoint1') {
    renderStep('run-progress', 'copyQA', 'done');
    if (data) {
      S.campaign.initialCopy   = data.initialCopy;
      S.campaign.comparison    = data.comparison;
      S.campaign.top2          = data.top2;
      S.campaign.evaluation    = data.evaluation;
      S.campaign.brief         = data.brief;
      S.campaign.synthesis     = data.synthesis;
    }
    buildCP1();
    return;
  }
  if (step === 'stream_complete' || step === 'complete') return;
  if (step === 'error') { renderStep('run-progress', 'error', 'error', message); return; }

  renderStep('run-progress', step, status, message);
  if (data && status === 'done') {
    if (step === 'brief')     S.campaign.brief     = data;
    if (step === 'synthesis') S.campaign.synthesis = data;
    if (step === 'copy')      S.campaign.copies    = data;
    if (step === 'copyQA')    S.campaign.copyEval  = data;
  }
}

// ── CHECKPOINT 1 ──────────────────────────────────────────────────────────
function buildCP1() {
  const init = S.campaign.initialCopy || {};
  const comp = S.campaign.comparison  || {};
  const syn  = S.campaign.synthesis   || {};

  document.getElementById('cp1-init-subj').textContent   = init.subjectLine || '—';
  document.getElementById('cp1-init-body').textContent   = init.body?.slice(0, 300) || '—';
  document.getElementById('cp1-insight').textContent     = comp.whatInitialMissed || comp.keyResearchInsight || '—';
  document.getElementById('cp1-lang').textContent        = comp.languageUpgrades  || '—';
  document.getElementById('cp1-research-summary').textContent = syn.researchSummary || '';

  const container = document.getElementById('cp1-copies');
  container.innerHTML = '';
  S.campaign.selectedCopyId = null;
  document.getElementById('btn-design').disabled = true;
  document.getElementById('cp1-hint').textContent = 'Select a variation above';

  const copies = S.campaign.top2 || [];
  const scores = S.campaign.evaluation?.scores || [];

  copies.forEach(copy => {
    const sc  = scores.find(s => s.id === copy.id);
    const card = document.createElement('div');
    card.className = 'copy-card';
    card.id = `cc-${copy.id}`;
    card.onclick = () => pickCopy(copy.id);
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span class="copy-angle">${escH(copy.angle || `Variation ${copy.id}`)}</span>
        ${sc ? `<span class="copy-score">${sc.totalScore}/10</span>` : ''}
      </div>
      <div class="copy-subject">${escH(copy.subjectLine)}</div>
      <div class="copy-preview">Preview: ${escH(copy.previewText)}</div>
      <div class="copy-body">${escH(copy.body)}</div>
      <div class="copy-cta-tag">${escH(copy.cta)}</div>
      ${copy.whyItWorks ? `<div class="copy-why">✓ ${escH(copy.whyItWorks)}</div>` : ''}`;
    container.appendChild(card);
  });

  wsShow('cp1');
}

function pickCopy(id) {
  S.campaign.selectedCopyId = id;
  document.querySelectorAll('.copy-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`cc-${id}`)?.classList.add('selected');
  document.getElementById('btn-design').disabled = false;
  document.getElementById('cp1-hint').textContent = '✓ Selected';
}

// ── DESIGN PHASE ──────────────────────────────────────────────────────────
async function proceedToDesign() {
  if (!S.campaign.selectedCopyId) return;
  const copy  = (S.campaign.top2 || []).find(c => c.id === S.campaign.selectedCopyId);
  const brief = S.campaign.brief;
  S.campaign.selectedCopy = copy;

  document.getElementById('design-progress').innerHTML = '';
  wsShow('designing');

  try {
    const res = await fetch('/api/campaigns/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${S.token}` },
      body: JSON.stringify({ campaign_id: S.campaignId, brief, selected_copy: copy }),
    });
    await streamEvents(res, handleDesignEvent);
  } catch(e) {
    renderStep('design-progress', 'error', 'error', e.message);
  }
}

function handleDesignEvent(ev) {
  const { step, status, message, data } = ev;
  if (step === 'checkpoint2') {
    if (data) { S.campaign.design = data.design; S.campaign.designQA = data.designQA; }
    buildCP2();
    return;
  }
  if (step === 'stream_complete' || step === 'complete') return;
  if (step === 'error') { renderStep('design-progress', 'error', 'error', message); return; }
  renderStep('design-progress', step, status, message);
  if (data && status === 'done') {
    if (step === 'design')   S.campaign.design   = data;
    if (step === 'designQA') S.campaign.designQA = data;
  }
}

// ── CHECKPOINT 2 ──────────────────────────────────────────────────────────
function buildCP2() {
  const html = S.campaign.design?.html || '';
  document.getElementById('email-frame').srcdoc = html || '<p style="padding:40px;text-align:center;font-family:sans-serif">No preview</p>';

  const qa = S.campaign.designQA || {};
  const sc = qa.overallScore || 0;
  const col = sc >= 7 ? 'var(--green)' : sc >= 5 ? 'var(--amber)' : 'var(--red)';
  document.getElementById('qa-score').innerHTML = `
    <div class="qa-score-row">
      <div class="qa-big" style="color:${col}">${sc}<span style="font-size:14px;color:var(--muted)">/10</span></div>
      <div>
        <div style="font-size:12px;font-weight:600;color:${qa.approved ? 'var(--green)' : 'var(--amber)'}">${qa.approved ? '✓ Approved' : '⚠ Review needed'}</div>
        <div style="font-size:11px;color:var(--muted)">Spam risk: ${qa.spamRisk || 'low'}</div>
      </div>
    </div>
    <p style="font-size:11px;color:var(--muted);line-height:1.5">${escH(qa.summary || '')}</p>`;

  const items = document.getElementById('qa-items');
  items.innerHTML = [
    ...(qa.positives      || []).slice(0,3).map(p => `<div class="qa-item qa-pass">✓ ${escH(p)}</div>`),
    ...(qa.fixesRequired  || []).map(f => `<div class="qa-item qa-fail">⚠ ${escH(f)}</div>`),
    ...(qa.warnings       || []).slice(0,2).map(w => `<div class="qa-item qa-warn">~ ${escH(w)}</div>`),
  ].join('');

  wsShow('cp2');
}

// ── EXPORT ────────────────────────────────────────────────────────────────
async function approveExport() {
  const html = S.campaign?.design?.html || '';
  S.campaign.finalHtml = html;
  if (S.campaignId) {
    try { await api(`/api/campaigns/${S.campaignId}/approve`, { method: 'POST', body: { html } }); } catch(e) {}
  }
  document.getElementById('final-html').textContent = html;
  wsShow('complete');
  // Refresh project history
  if (S.project?.id) { try { S.project = await api(`/api/projects/${S.project.id}`); renderCampaignHistory(); } catch(e) {} }
}

function copyHTML() {
  const html = S.campaign?.finalHtml || S.campaign?.design?.html || '';
  if (!html) { alert('No HTML ready — approve the design first.'); return; }
  navigator.clipboard.writeText(html).then(() => {
    alert('HTML copied! Paste into Klaviyo → Templates → Custom HTML.');
  }).catch(() => {
    const ta = document.createElement('textarea'); ta.value = html; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    alert('HTML copied!');
  });
}

function downloadHTML() {
  const html = S.campaign?.finalHtml || S.campaign?.design?.html || '';
  if (!html) { alert('No HTML ready — approve first.'); return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = `${S.project?.brand || 'email'}_${Date.now()}.html`;
  a.click();
}

// ── REVISION REQUEST ──────────────────────────────────────────────────────
function requestRevision(type) {
  S.revisionType = type;
  document.getElementById('rev-title').textContent = type === 'copy' ? 'Request Copy Changes' : 'Request Design Changes';
  document.getElementById('rev-feedback').value = '';
  openModal('modal-revision');
}

async function submitRevision() {
  const feedback = document.getElementById('rev-feedback').value.trim();
  if (!feedback) { alert('Please describe what you want changed.'); return; }
  if (!S.campaignId) { alert('No active campaign to revise.'); return; }
  closeModal('modal-revision');

  const type = S.revisionType;
  const progressId = type === 'copy' ? 'run-progress' : 'design-progress';
  document.getElementById(progressId).innerHTML = '';
  wsShow(type === 'copy' ? 'running' : 'designing');

  try {
    const res = await fetch(`/api/campaigns/${S.campaignId}/revision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${S.token}` },
      body: JSON.stringify({ type, feedback }),
    });
    await streamEvents(res, (ev) => {
      if (ev.step === 'revision_complete') {
        if (type === 'copy') { S.campaign.top2 = ev.data?.copies; S.campaign.evaluation = ev.data?.evaluation; buildCP1(); }
        else { S.campaign.design = ev.data?.design; S.campaign.designQA = ev.data?.designQA; buildCP2(); }
        return;
      }
      renderStep(progressId, ev.step, ev.status, ev.message);
    });
  } catch(e) {
    renderStep(progressId, 'error', 'error', e.message);
  }
}

// ── ADMIN ─────────────────────────────────────────────────────────────────
async function showAdmin() {
  showPage('pg-admin');
  setBreadcrumb(['AI Agency', 'Admin Panel']);
  await loadUsers();
}

async function loadUsers() {
  try {
    const users = await api('/api/users');
    const tbody = document.getElementById('user-tbody');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td><b>${escH(u.name)}</b></td>
        <td style="color:var(--muted)">${escH(u.email)}</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}">${u.role}</span></td>
        <td style="font-size:11px;color:var(--muted)">${(u.fields || []).map(f => f.name).join(', ') || 'All'}</td>
        <td><span class="badge ${u.active ? 'badge-green' : 'badge-amber'}">${u.active ? 'Active' : 'Inactive'}</span></td>
        <td>
          ${u.role !== 'admin' ? `<button class="btn btn-secondary btn-sm" onclick="toggleUser(${u.id})" style="font-size:11px">${u.active ? 'Deactivate' : 'Activate'}</button>` : ''}
        </td>
      </tr>`).join('');

    document.getElementById('admin-stats').innerHTML = `
      <div style="background:var(--bg);border-radius:8px;padding:14px">
        <div style="font-size:22px;font-weight:700">${users.length}</div>
        <div style="font-size:12px;color:var(--muted)">Total Users</div>
      </div>
      <div style="background:var(--bg);border-radius:8px;padding:14px">
        <div style="font-size:22px;font-weight:700">${users.filter(u=>u.active).length}</div>
        <div style="font-size:12px;color:var(--muted)">Active Members</div>
      </div>`;
  } catch(e) { console.error(e); }
}

async function openAddMember() {
  try {
    const fields = await api('/api/users/fields');
    document.getElementById('mm-fields').innerHTML = fields.map(f => `
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;text-transform:none;letter-spacing:0;font-weight:400;cursor:pointer">
        <input type="checkbox" name="mm-field" value="${f.id}" style="width:auto">
        ${f.icon} ${f.name}
      </label>`).join('');
  } catch(e) {}
  ['mm-name','mm-email','mm-pass'].forEach(id => document.getElementById(id).value = '');
  openModal('modal-member');
}

async function addMember() {
  const name  = document.getElementById('mm-name').value.trim();
  const email = document.getElementById('mm-email').value.trim();
  const pass  = document.getElementById('mm-pass').value;
  const field_ids = [...document.querySelectorAll('input[name="mm-field"]:checked')].map(cb => parseInt(cb.value));
  if (!name || !email || !pass) { alert('Name, email, and password required.'); return; }
  try {
    await api('/api/users', { method: 'POST', body: { name, email, password: pass, field_ids } });
    closeModal('modal-member');
    await loadUsers();
  } catch(e) { alert(e.message); }
}

async function toggleUser(id) {
  try { await api(`/api/users/${id}/toggle`, { method: 'PUT' }); await loadUsers(); }
  catch(e) { alert(e.message); }
}

// ── SIDEBAR (MOBILE) ──────────────────────────────────────────────────────
function toggleSidebar() {
  const sidebars = document.querySelectorAll('.sidebar');
  const overlay  = document.getElementById('mob-overlay');
  const isOpen   = sidebars[0]?.classList.contains('open');
  sidebars.forEach(s => s.classList.toggle('open', !isOpen));
  overlay.classList.toggle('show', !isOpen);
}
function closeSidebar() {
  document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('open'));
  document.getElementById('mob-overlay').classList.remove('show');
}

// ── MODALS ────────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── PROGRESS STEPS ────────────────────────────────────────────────────────
function renderStep(containerId, stepId, status, message = '') {
  const list = document.getElementById(containerId);
  if (!list) return;
  let el = document.getElementById(`step-${containerId}-${stepId}`);
  if (!el) { el = document.createElement('div'); el.id = `step-${containerId}-${stepId}`; list.appendChild(el); }

  const cfg = STEPS[stepId] || { label: stepId, icon: '⚙️' };
  const icon = status === 'running' ? `<span class="spin">⏳</span>` : status === 'done' ? '✓' : status === 'error' ? '✗' : cfg.icon;
  const badge = status === 'done' ? '<span class="badge badge-green">Done</span>' : status === 'running' ? '<span class="badge badge-purple">Running…</span>' : status === 'error' ? '<span class="badge badge-red">Error</span>' : '';

  el.className = `step-item ${status}`;
  el.innerHTML = `
    <div class="step-icon ${status}">${icon}</div>
    <div style="flex:1">
      <div class="step-label">${cfg.label}</div>
      ${message ? `<div class="step-msg">${escH(message)}</div>` : ''}
    </div>
    ${badge}`;
}

// ── SSE STREAM ────────────────────────────────────────────────────────────
async function streamEvents(res, handler) {
  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let   buf     = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try { handler(JSON.parse(line.slice(6))); } catch(_) {}
    }
  }
  if (buf.startsWith('data: ')) { try { handler(JSON.parse(buf.slice(6))); } catch(_) {} }
}

// ── UTILS ─────────────────────────────────────────────────────────────────
function v(id)    { return document.getElementById(id)?.value || ''; }
function escH(s)  { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function timeAgo(d) {
  if (!d) return '—';
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}