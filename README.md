# KPI Mapper

## Что исправлено

Теперь в проекте есть **реальный интерактивный board**, а не только инструкция:
- `index.html` — презентационный дашборд;
- `dashboard.js` — интерактив: фильтр по отделу + слайдер сценария месяца + пересчет KPI на лету;
- `styles.css` — современный UI для защиты проекта.

## Быстрый запуск интерактивного борда

```bash
python3 -m http.server 8080
# открыть: http://localhost:8080/
```

## Если в браузере всё ещё старый вывод

1. Жестко обновите страницу: `Ctrl+F5`.
2. Проверьте, что открываете именно `index.html` (а не markdown-страницу репозитория).
3. Для GitHub Pages убедитесь, что source указывает на ветку/папку с этим `index.html`.

## Streamlit MVP (ввод и маппинг данных)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

Streamlit остается рабочим инструментом ввода данных, а `index.html` — красивым слоем для демонстрации и защиты.
