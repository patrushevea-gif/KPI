const APP_VERSION = '2026.03.11-v2';

const DATASETS = {
  baseline: {
    name: 'База (текущий месяц)',
    employees: [
      { name: 'Иванов И.И.', dept: 'Служба главного инженера', kpiId: 'ENG_LEAD_MONTH', fact: 80.2 },
      { name: 'Петров П.П.', dept: 'Служба главного инженера', kpiId: 'ENG_TEAM_MONTH', fact: 92.4 },
      { name: 'Сидоров С.С.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 99.2 },
      { name: 'Кузнецов А.А.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 94.5 }
    ],
    departments: [
      { name: 'Служба главного инженера', kpiId: 'ENG_DEPT_MONTH', score: 86.4 },
      { name: 'Производственный отдел', kpiId: 'PROD_DEPT_MONTH', score: 92.2 }
    ],
    metrics: [
      { code: '0001', name: 'Закрытие задач в срок, %', value: 92, target: 95, direction: '↑' },
      { code: '0002', name: 'Просроченные задачи, %', value: 14, target: 10, direction: '↓' },
      { code: '0003', name: 'Аварийность (случаев/мес)', value: 3, target: 2, direction: '↓' },
      { code: '0004', name: 'Выполнение ППР, %', value: 88, target: 90, direction: '↑' },
      { code: '0005', name: 'Выполнение производственного плана, %', value: 101, target: 100, direction: '↑' },
      { code: '0006', name: 'Уровень брака, %', value: 1.8, target: 1.5, direction: '↓' }
    ]
  },
  growth: {
    name: 'Рост (улучшенный сценарий)',
    employees: [
      { name: 'Иванов И.И.', dept: 'Служба главного инженера', kpiId: 'ENG_LEAD_MONTH', fact: 90.4 },
      { name: 'Петров П.П.', dept: 'Служба главного инженера', kpiId: 'ENG_TEAM_MONTH', fact: 96.8 },
      { name: 'Сидоров С.С.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 104.1 },
      { name: 'Кузнецов А.А.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 100.9 }
    ],
    departments: [
      { name: 'Служба главного инженера', kpiId: 'ENG_DEPT_MONTH', score: 93.3 },
      { name: 'Производственный отдел', kpiId: 'PROD_DEPT_MONTH', score: 98.4 }
    ],
    metrics: [
      { code: '0001', name: 'Закрытие задач в срок, %', value: 97, target: 95, direction: '↑' },
      { code: '0002', name: 'Просроченные задачи, %', value: 9, target: 10, direction: '↓' },
      { code: '0003', name: 'Аварийность (случаев/мес)', value: 1.9, target: 2, direction: '↓' },
      { code: '0004', name: 'Выполнение ППР, %', value: 95, target: 90, direction: '↑' },
      { code: '0005', name: 'Выполнение производственного плана, %', value: 106, target: 100, direction: '↑' },
      { code: '0006', name: 'Уровень брака, %', value: 1.2, target: 1.5, direction: '↓' }
    ]
  },
  stress: {
    name: 'Стресс-тест (просадка)',
    employees: [
      { name: 'Иванов И.И.', dept: 'Служба главного инженера', kpiId: 'ENG_LEAD_MONTH', fact: 72.4 },
      { name: 'Петров П.П.', dept: 'Служба главного инженера', kpiId: 'ENG_TEAM_MONTH', fact: 84.1 },
      { name: 'Сидоров С.С.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 89.7 },
      { name: 'Кузнецов А.А.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 86.3 }
    ],
    departments: [
      { name: 'Служба главного инженера', kpiId: 'ENG_DEPT_MONTH', score: 79.6 },
      { name: 'Производственный отдел', kpiId: 'PROD_DEPT_MONTH', score: 84.8 }
    ],
    metrics: [
      { code: '0001', name: 'Закрытие задач в срок, %', value: 83, target: 95, direction: '↑' },
      { code: '0002', name: 'Просроченные задачи, %', value: 18, target: 10, direction: '↓' },
      { code: '0003', name: 'Аварийность (случаев/мес)', value: 3.8, target: 2, direction: '↓' },
      { code: '0004', name: 'Выполнение ППР, %', value: 79, target: 90, direction: '↑' },
      { code: '0005', name: 'Выполнение производственного плана, %', value: 94, target: 100, direction: '↑' },
      { code: '0006', name: 'Уровень брака, %', value: 2.4, target: 1.5, direction: '↓' }
    ]
  }
};

const datasetSelect = document.getElementById('datasetSelect');
const deptFilter = document.getElementById('departmentFilter');
const scenarioRange = document.getElementById('scenarioRange');
const scenarioLabel = document.getElementById('scenarioLabel');
const resetBtn = document.getElementById('resetBtn');
const versionNode = document.getElementById('appVersion');

function rag(score) { if (score >= 95) return { cls: 'green', text: 'GREEN' }; if (score >= 85) return { cls: 'yellow', text: 'YELLOW' }; return { cls: 'red', text: 'RED' }; }
function ringColor(score) { if (score >= 95) return '#2ed087'; if (score >= 85) return '#ffb84d'; return '#ff5f7a'; }
function seededNoise(name) { return [...name].reduce((s, c) => s + c.charCodeAt(0), 0) % 7; }
function applyScenario(value, factor, key) { return Math.round((value * factor + seededNoise(key) / 10) * 10) / 10; }
function currentDataset() { return DATASETS[datasetSelect.value] || DATASETS.baseline; }

function collectState() {
  const source = currentDataset();
  const factor = Number(scenarioRange.value) / 100;
  const selectedDept = deptFilter.value;

  const employees = source.employees
    .map((e) => ({ ...e, fact: applyScenario(e.fact, factor, e.name) }))
    .filter((e) => selectedDept === 'Все отделы' || e.dept === selectedDept);

  const departments = source.departments
    .map((d) => ({ ...d, score: applyScenario(d.score, factor, d.name) }))
    .filter((d) => selectedDept === 'Все отделы' || d.name === selectedDept);

  const metrics = source.metrics.map((m) => ({ ...m, value: applyScenario(m.value, factor * 0.95, m.code) }));
  const plantScore = Math.round((departments.reduce((s, d) => s + d.score, 0) / departments.length) * 10) / 10;

  return { source, factor, selectedDept, employees, departments, metrics, plantScore };
}

function render() {
  const { source, factor, selectedDept, employees, departments, metrics, plantScore } = collectState();
  scenarioLabel.textContent = `${Math.round(factor * 100)}%`;

  const employeeAvg = (employees.reduce((s, e) => s + e.fact, 0) / employees.length).toFixed(1);
  const departmentAvg = (departments.reduce((s, d) => s + d.score, 0) / departments.length).toFixed(1);

  document.getElementById('summaryCards').innerHTML = [
    { label: 'Версия визуала', value: APP_VERSION, delta: 'если видите другое — открыт старый кэш' },
    { label: 'Набор данных', value: source.name, delta: 'выпадающий список' },
    { label: 'KPI сотрудников', value: `${employeeAvg}%`, delta: selectedDept },
    { label: 'Индекс дашборда завода', value: `${plantScore}%`, delta: `отделы: ${departmentAvg}%` }
  ].map((c) => `<article class="card"><div class="label">${c.label}</div><div class="value">${c.value}</div><div class="delta">${c.delta}</div></article>`).join('');

  document.getElementById('employeeBars').innerHTML = [...employees].sort((a, b) => b.fact - a.fact).map((e) => `<div class="bar-item"><div class="bar-head"><span>${e.name}</span><strong>${e.fact}%</strong></div><div class="track"><div class="fill" style="width:${Math.min(e.fact, 100)}%"></div></div></div>`).join('');

  document.getElementById('departmentDonuts').innerHTML = departments
    .map((d) => `<div class="donut" style="--p:${Math.min(d.score, 100)}%;--ring:${ringColor(d.score)}"><span><strong>${d.score}%</strong>${d.name}</span></div>`)
    .join('');

  document.getElementById('employeeTable').innerHTML = employees
    .map((e) => { const status = rag(e.fact); return `<tr><td>${e.name}</td><td>${e.dept}</td><td>${e.kpiId}</td><td>${e.fact}%</td><td><span class="tag ${status.cls}">${status.text}</span></td></tr>`; })
    .join('');

  const orgRows = [
    ...departments.map((d) => ({ level: 'Отдел', object: d.name, kpi: d.kpiId, score: d.score })),
    { level: 'Дашборд', object: 'Завод (PLANT_MAIN)', kpi: 'EXEC_SUMMARY', score: plantScore }
  ];
  document.getElementById('orgTable').innerHTML = orgRows
    .map((r) => { const status = rag(r.score); return `<tr><td>${r.level}</td><td>${r.object}</td><td>${r.kpi}</td><td>${r.score}%</td><td><span class="tag ${status.cls}">${status.text}</span></td></tr>`; })
    .join('');

  document.getElementById('metricChips').innerHTML = metrics
    .map((m) => `<div class="chip"><div class="code">${m.code} · ${m.direction}</div><div class="name">${m.name}</div><div class="meta">Факт: ${m.value} · Цель: ${m.target}</div></div>`)
    .join('');

  if (versionNode) versionNode.textContent = `Build: ${APP_VERSION}`;
}

function initControls() {
  datasetSelect.innerHTML = Object.entries(DATASETS).map(([key, val]) => `<option value="${key}">${val.name}</option>`).join('');
  deptFilter.innerHTML = ['Все отделы', ...new Set(DATASETS.baseline.employees.map((e) => e.dept))].map((d) => `<option value="${d}">${d}</option>`).join('');

  datasetSelect.addEventListener('change', render);
  deptFilter.addEventListener('change', render);
  scenarioRange.addEventListener('input', render);
  resetBtn.addEventListener('click', () => {
    datasetSelect.value = 'baseline';
    deptFilter.value = 'Все отделы';
    scenarioRange.value = '100';
    render();
  });
}

initControls();
render();
