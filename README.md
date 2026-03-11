# KPI Mapper

## Что было причиной старой версии и что исправлено окончательно

Причина была в конфликте и дублировании ассетов (`dashboard.js`/`dashboard.v2.js`, `styles.css`/`styles.v2.css`) + разные точки публикации (`/` и `/docs`).
Из-за этого браузер/Pages могли тянуть старую связку файлов.

Сейчас сделано окончательно:
- оставлен **один рабочий комплект** ассетов: `dashboard.js` + `styles.css`;
- удалены неиспользуемые дубли: `dashboard.v2.js`, `styles.v2.css`, `docs/dashboard.v2.js`, `docs/styles.v2.css`;
- root и docs используют один и тот же набор (`dashboard.js?v=20260311c`, `styles.css?v=20260311c`);
- в UI есть маркер версии: `Build: 2026.03.11-v2`.

## Как проверить, что точно новая версия

1. Откройте:
   - `https://patrushevea-gif.github.io/KPI/`
   - `https://patrushevea-gif.github.io/KPI/docs/`
2. На экране должен быть текст: **Build: 2026.03.11-v2**.
3. Проверьте функции:
   - выпадающий список набора данных (База/Рост/Стресс) меняет все KPI;
   - фильтр отдела меняет таблицы и графики;
   - слайдер сценария меняет значения карточек и верхнего дашборда.

## Локальный запуск

```bash
python3 -m http.server 8080
# http://localhost:8080/
# http://localhost:8080/docs/
```

## Streamlit MVP (ввод и маппинг данных)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```
