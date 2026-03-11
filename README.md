# KPI Mapper

## Проверил и пересобрал публикацию визуала

Сделал дополнительную защиту от ситуации, когда у вас отображается старый экран:
- включен cache-busting для `styles.css` и `dashboard.js` через версию `?v=20260311a`;
- добавлены no-cache meta-теги в `index.html`;
- собрана копия визуала в папке `docs/` (`docs/index.html`, `docs/styles.css`, `docs/dashboard.js`) для случая, когда GitHub Pages настроен на `/docs`.

## Что теперь должно работать

- Выпадающий список **«Набор данных (пример)»** (`База / Рост / Стресс-тест`) меняет значения по всем карточкам, таблицам и метрикам.
- Фильтр отдела и слайдер сценария также пересчитывают все показатели и дашборд завода.

## Как открыть визуал

Локально:

```bash
python3 -m http.server 8080
# открыть http://localhost:8080/
# или http://localhost:8080/docs/
```

Для GitHub Pages:
- если source = root, откройте `/index.html`;
- если source = `/docs`, откройте `/docs/`.

## Streamlit MVP (ввод и маппинг данных)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```
