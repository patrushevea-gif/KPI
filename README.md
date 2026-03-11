# KPI Mapper

## Что теперь есть в репозитории

- **Красивый демо-визуал для защиты/презентации**: `index.html` + `styles.css` + `dashboard.js`.
- **Рабочий MVP-инструмент для ввода/привязки KPI**: `app.py` (Streamlit).

## 1) Визуал для демонстрации (рекомендуется для показа)

Откройте `index.html` — это готовый презентационный экран с:
- KPI-карточками верхнего уровня,
- графиком KPI сотрудников,
- круговыми индикаторами KPI отделов,
- таблицами сотрудников/отделов/дашборда,
- блоком ключевых метрик `0001..0006` на псевдоданных.

### Локальный запуск визуала

```bash
python3 -m http.server 8080
# затем открыть http://localhost:8080/
```

> Если используете GitHub Pages, `index.html` автоматически будет главной страницей проекта.

## 2) Инструмент для заполнения данных (Streamlit)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

После первого запуска используются CSV в `data/`:
- `metrics.csv`
- `employee_mapping.csv`
- `department_mapping.csv`
- `dashboard_mapping.csv`

Ключ связи везде: `metric_code`.

## Логика расчета KPI (MVP)

- Для `higher_is_better`: `score = value / target * 100`.
- Для `lower_is_better`: `score = target / value * 100`.
- Итоговый KPI = взвешенное среднее по `weight`.

## Аналоги в интернете (референсы)

- **Power BI Scorecards / Metrics**
- **Tableau**
- **Airtable Interfaces**
- **Smartsheet**
- **Geckoboard**
