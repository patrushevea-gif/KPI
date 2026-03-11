const baseEmployees = [
  { name: 'Иванов И.И.', dept: 'Служба главного инженера', kpiId: 'ENG_LEAD_MONTH', fact: 80.2 },
  { name: 'Петров П.П.', dept: 'Служба главного инженера', kpiId: 'ENG_TEAM_MONTH', fact: 92.4 },
  { name: 'Сидоров С.С.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 99.2 },
  { name: 'Кузнецов А.А.', dept: 'Производственный отдел', kpiId: 'PROD_TEAM_MONTH', fact: 94.5 }
];

const baseDepartments = [
  { name: 'Служба главного инженера', kpiId: 'ENG_DEPT_MONTH', score: 86.4 },
  { name: 'Производственный отдел', kpiId: 'PROD_DEPT_MONTH', score: 92.2 }
];

const baseMetrics = [
  { code: '0001', name: 'Закрытие задач в срок, %', value: 92, target: 95, direction: '↑' },
  { code: '0002', name: 'Просроченные задачи, %', value: 14, target: 10, direction: '↓' },
  { code: '0003', name: 'Аварийность (случаев/мес)', value: 3, target: 2, direction: '↓' },
  { code: '0004', name: 'Выполнение ППР, %', value: 88, target: 90, direction: '↑' },
  { code: '0005', name: 'Выполнение производственного плана, %', value: 101, target: 100, direction: '↑' },
  { code: '0006', name: 'Уровень брака, %', value: 1.8, target: 1.5, direction: '↓' }
];

const deptFilter = document.getElementById('departmentFilter');
const scenarioRange = document.getElementById('scenarioRange');
const scenarioLabel = document.getElementById('scenarioLabel');
const resetBtn = document.getElementById('resetBtn');

function rag(score) {
  if (score >= 95) return { cls: 'green', text: 'GREEN' };
  if (score >= 85) return { cls: 'yellow', text: 'YELLOW' };
  return { cls: 'red', text: 'RED' };
}

function ringColor(score) {
  if (score >= 95) return '#2ed087';
  if (score >= 85) return '#ffb84d';
  return '#ff5f7a';
}

function seededNoise(name) {
  return [...name].reduce((s, c) => s + c.charCodeAt(0), 0) % 7;
}

function applyScenario(value, factor, key) {
  const noise = seededNoise(key) / 10;
  const adjusted = value * factor + noise;
  return Math.round(adjusted * 10) / 10;
}

function collectState() {
  const factor = Number(scenarioRange.value) / 100;
  const selectedDept = deptFilter.value;

  const employees = baseEmployees
    .map((e) => ({ ...e, fact: applyScenario(e.fact, factor, e.name) }))
    .filter((e) => selectedDept === 'Все отделы' || e.dept === selectedDept);

  const departments = baseDepartments
    .map((d) => ({ ...d, score: applyScenario(d.score, factor, d.name) }))
    .filter((d) => selectedDept === 'Все отделы' || d.name === selectedDept);

  const metricFactor = factor * 0.95;
  const metrics = baseMetrics.map((m) => ({
    ...m,
    value: applyScenario(m.value, metricFactor, m.code)
  }));

  const plantScore = Math.round((departments.reduce((s, d) => s + d.score, 0) / departments.length) * 10) / 10;

  return { factor, selectedDept, employees, departments, metrics, plantScore };
}

function render() {
  const { factor, employees, departments, metrics, plantScore, selectedDept } = collectState();
  scenarioLabel.textContent = `${Math.round(factor * 100)}%`;

  const employeeAvg = (employees.reduce((s, e) => s + e.fact, 0) / employees.length).toFixed(1);
  const departmentAvg = (departments.reduce((s, d) => s + d.score, 0) / departments.length).toFixed(1);

  const summary = [
    { label: 'KPI сотрудников', value: `${employeeAvg}%`, delta: selectedDept },
    { label: 'KPI отделов', value: `${departmentAvg}%`, delta: `сценарий ${Math.round(factor * 100)}%` },
    { label: 'Индекс дашборда завода', value: `${plantScore}%`, delta: 'верхний уровень' },
    { label: 'Активные метрики', value: '6 / 20', delta: 'псевдоданные для демо' }
  ];

  document.getElementById('summaryCards').innerHTML = summary
    .map((c) => `<article class="card"><div class="label">${c.label}</div><div class="value">${c.value}</div><div class="delta">${c.delta}</div></article>`)
    .join('');

  document.getElementById('employeeBars').innerHTML = [...employees]
    .sort((a, b) => b.fact - a.fact)
    .map((e) => `<div class="bar-item"><div class="bar-head"><span>${e.name}</span><strong>${e.fact}%</strong></div><div class="track"><div class="fill" style="width:${Math.min(e.fact, 100)}%"></div></div></div>`)
    .join('');

  document.getElementById('departmentDonuts').innerHTML = departments
    .map((d) => `<div class="donut" style="--p:${Math.min(d.score, 100)}%;--ring:${ringColor(d.score)}"><span><strong>${d.score}%</strong>${d.name}</span></div>`)
    .join('');

  document.getElementById('employeeTable').innerHTML = employees
    .map((e) => {
      const status = rag(e.fact);
      return `<tr><td>${e.name}</td><td>${e.dept}</td><td>${e.kpiId}</td><td>${e.fact}%</td><td><span class="tag ${status.cls}">${status.text}</span></td></tr>`;
    })
    .join('');

  const orgRows = [
    ...departments.map((d) => ({ level: 'Отдел', object: d.name, kpi: d.kpiId, score: d.score })),
    { level: 'Дашборд', object: 'Завод (PLANT_MAIN)', kpi: 'EXEC_SUMMARY', score: plantScore }
  ];

  document.getElementById('orgTable').innerHTML = orgRows
    .map((r) => {
      const status = rag(r.score);
      return `<tr><td>${r.level}</td><td>${r.object}</td><td>${r.kpi}</td><td>${r.score}%</td><td><span class="tag ${status.cls}">${status.text}</span></td></tr>`;
    })
    .join('');

  document.getElementById('metricChips').innerHTML = metrics
    .map((m) => `<div class="chip"><div class="code">${m.code} · ${m.direction}</div><div class="name">${m.name}</div><div class="meta">Факт: ${m.value} · Цель: ${m.target}</div></div>`)
    .join('');
}

function initControls() {
  const departments = ['Все отделы', ...new Set(baseEmployees.map((e) => e.dept))];
  deptFilter.innerHTML = departments.map((d) => `<option value="${d}">${d}</option>`).join('');

  deptFilter.addEventListener('change', render);
  scenarioRange.addEventListener('input', render);
  resetBtn.addEventListener('click', () => {
    deptFilter.value = 'Все отделы';
    scenarioRange.value = '100';
    render();
  });
}

initControls();
render();
