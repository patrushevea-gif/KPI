const employees = [
  { name: 'Иванов И.И.', kpiId: 'ENG_LEAD_MONTH', plan: 100, fact: 80.2 },
  { name: 'Петров П.П.', kpiId: 'ENG_TEAM_MONTH', plan: 100, fact: 92.4 },
  { name: 'Сидоров С.С.', kpiId: 'PROD_TEAM_MONTH', plan: 100, fact: 99.2 }
];

const departments = [
  { name: 'Служба главного инженера', kpiId: 'ENG_DEPT_MONTH', score: 86.4 },
  { name: 'Производственный отдел', kpiId: 'PROD_DEPT_MONTH', score: 92.2 }
];

const dashboards = [
  { level: 'Дашборд', object: 'Завод (PLANT_MAIN)', kpi: 'EXEC_SUMMARY', score: 89.3 }
];

const metrics = [
  { code: '0001', name: 'Закрытие задач в срок, %', value: 92, target: 95, direction: '↑' },
  { code: '0002', name: 'Просроченные задачи, %', value: 14, target: 10, direction: '↓' },
  { code: '0003', name: 'Аварийность (случаев/мес)', value: 3, target: 2, direction: '↓' },
  { code: '0004', name: 'Выполнение ППР, %', value: 88, target: 90, direction: '↑' },
  { code: '0005', name: 'Выполнение производственного плана, %', value: 101, target: 100, direction: '↑' },
  { code: '0006', name: 'Уровень брака, %', value: 1.8, target: 1.5, direction: '↓' }
];

function rag(score) {
  if (score >= 95) return { cls: 'green', text: 'GREEN' };
  if (score >= 85) return { cls: 'yellow', text: 'YELLOW' };
  return { cls: 'red', text: 'RED' };
}

function render() {
  const averageEmployee = (employees.reduce((s, x) => s + x.fact, 0) / employees.length).toFixed(1);
  const averageDept = (departments.reduce((s, x) => s + x.score, 0) / departments.length).toFixed(1);
  const mainDashboard = dashboards[0].score.toFixed(1);

  const summary = [
    { label: 'KPI сотрудников (средний)', value: `${averageEmployee}%`, delta: '+3.2% к прошлому месяцу' },
    { label: 'KPI отделов (средний)', value: `${averageDept}%`, delta: '+1.4% тренд устойчивый' },
    { label: 'Индекс дашборда завода', value: `${mainDashboard}%`, delta: 'цель 92% на квартал' },
    { label: 'Метрик в контуре', value: '20', delta: '6 активных в демо' }
  ];

  document.getElementById('summaryCards').innerHTML = summary
    .map((c) => `<article class="card"><div class="label">${c.label}</div><div class="value">${c.value}</div><div class="delta">${c.delta}</div></article>`)
    .join('');

  document.getElementById('employeeBars').innerHTML = [...employees]
    .sort((a, b) => b.fact - a.fact)
    .map(
      (e) => `<div class="bar-item"><div class="bar-head"><span>${e.name}</span><strong>${e.fact}%</strong></div><div class="track"><div class="fill" style="width:${Math.min(e.fact, 100)}%"></div></div></div>`
    )
    .join('');

  document.getElementById('departmentDonuts').innerHTML = departments
    .map((d) => `<div class="donut" style="--p:${d.score}%"><span><strong>${d.score}%</strong>${d.name}</span></div>`)
    .join('');

  document.getElementById('employeeTable').innerHTML = employees
    .map((e) => {
      const status = rag(e.fact);
      return `<tr><td>${e.name}</td><td>${e.kpiId}</td><td>${e.plan}</td><td>${e.fact}</td><td><span class="tag ${status.cls}">${status.text}</span></td></tr>`;
    })
    .join('');

  const orgRows = [
    ...departments.map((d) => ({ level: 'Отдел', object: d.name, kpi: d.kpiId, score: d.score })),
    ...dashboards
  ];

  document.getElementById('orgTable').innerHTML = orgRows
    .map((r) => {
      const status = rag(r.score);
      return `<tr><td>${r.level}</td><td>${r.object}</td><td>${r.kpi}</td><td>${r.score}%</td><td><span class="tag ${status.cls}">${status.text}</span></td></tr>`;
    })
    .join('');

  document.getElementById('metricChips').innerHTML = metrics
    .map(
      (m) => `<div class="chip"><div class="code">${m.code} · ${m.direction}</div><div class="name">${m.name}</div><div class="meta">Факт: ${m.value} · Цель: ${m.target}</div></div>`
    )
    .join('');
}

render();
