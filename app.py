import io
from pathlib import Path

import pandas as pd
import streamlit as st

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

METRICS_COLUMNS = [
    "metric_code",
    "metric_name",
    "value",
    "target",
    "period",
    "source",
    "aggregation_type",
    "direction",
    "weight",
]

EMPLOYEE_COLUMNS = [
    "metric_code",
    "employee_id",
    "employee_name",
    "employee_kpi_id",
    "weight",
    "note",
]

DEPARTMENT_COLUMNS = [
    "metric_code",
    "department_id",
    "department_name",
    "department_kpi_id",
    "weight",
    "note",
]

DASHBOARD_COLUMNS = [
    "metric_code",
    "dashboard_id",
    "dashboard_name",
    "widget_name",
    "weight",
    "note",
]


def demo_employee_mapping() -> pd.DataFrame:
    return pd.DataFrame(
        [
            ["0001", "E001", "Иванов И.И.", "ENG_LEAD_MONTH", 0.35, "Закрытые задачи в срок"],
            ["0002", "E001", "Иванов И.И.", "ENG_LEAD_MONTH", 0.25, "Просроченные задачи (обратная метрика)"],
            ["0003", "E001", "Иванов И.И.", "ENG_LEAD_MONTH", 0.40, "Аварийность оборудования"],
            ["0001", "E002", "Петров П.П.", "ENG_TEAM_MONTH", 0.50, "Закрытые задачи в срок"],
            ["0004", "E002", "Петров П.П.", "ENG_TEAM_MONTH", 0.50, "Выполнение ППР"],
            ["0001", "E003", "Сидоров С.С.", "PROD_TEAM_MONTH", 0.40, "Закрытые задачи в срок"],
            ["0005", "E003", "Сидоров С.С.", "PROD_TEAM_MONTH", 0.60, "Соблюдение производственного плана"],
        ],
        columns=EMPLOYEE_COLUMNS,
    )


def demo_department_mapping() -> pd.DataFrame:
    return pd.DataFrame(
        [
            ["0001", "D001", "Служба главного инженера", "ENG_DEPT_MONTH", 0.30, "Доля задач в срок"],
            ["0002", "D001", "Служба главного инженера", "ENG_DEPT_MONTH", 0.20, "Просроченные задачи"],
            ["0003", "D001", "Служба главного инженера", "ENG_DEPT_MONTH", 0.30, "Аварийность"],
            ["0004", "D001", "Служба главного инженера", "ENG_DEPT_MONTH", 0.20, "Выполнение ППР"],
            ["0005", "D002", "Производственный отдел", "PROD_DEPT_MONTH", 0.50, "План производства"],
            ["0006", "D002", "Производственный отдел", "PROD_DEPT_MONTH", 0.50, "Брак"],
        ],
        columns=DEPARTMENT_COLUMNS,
    )


def demo_dashboard_mapping() -> pd.DataFrame:
    return pd.DataFrame(
        [
            ["0001", "PLANT_MAIN", "Дашборд завода", "Исполнение задач в срок", 0.25, "Сводный показатель"],
            ["0003", "PLANT_MAIN", "Дашборд завода", "Надежность оборудования", 0.25, "Сводный показатель"],
            ["0005", "PLANT_MAIN", "Дашборд завода", "Выполнение производственного плана", 0.25, "Сводный показатель"],
            ["0006", "PLANT_MAIN", "Дашборд завода", "Качество (уровень брака)", 0.25, "Сводный показатель"],
        ],
        columns=DASHBOARD_COLUMNS,
    )


def default_metrics() -> pd.DataFrame:
    rows = [
        {
            "metric_code": "0001",
            "metric_name": "Закрытие задач в срок, %",
            "value": 92.0,
            "target": 95.0,
            "period": "month",
            "source": "manual",
            "aggregation_type": "sum",
            "direction": "higher_is_better",
            "weight": 1.0,
        },
        {
            "metric_code": "0002",
            "metric_name": "Просроченные задачи, %",
            "value": 14.0,
            "target": 10.0,
            "period": "month",
            "source": "manual",
            "aggregation_type": "sum",
            "direction": "lower_is_better",
            "weight": 1.0,
        },
        {
            "metric_code": "0003",
            "metric_name": "Аварийность (случаев/мес)",
            "value": 3.0,
            "target": 2.0,
            "period": "month",
            "source": "manual",
            "aggregation_type": "sum",
            "direction": "lower_is_better",
            "weight": 1.0,
        },
        {
            "metric_code": "0004",
            "metric_name": "Выполнение ППР, %",
            "value": 88.0,
            "target": 90.0,
            "period": "month",
            "source": "manual",
            "aggregation_type": "sum",
            "direction": "higher_is_better",
            "weight": 1.0,
        },
        {
            "metric_code": "0005",
            "metric_name": "Выполнение производственного плана, %",
            "value": 101.0,
            "target": 100.0,
            "period": "month",
            "source": "manual",
            "aggregation_type": "sum",
            "direction": "higher_is_better",
            "weight": 1.0,
        },
        {
            "metric_code": "0006",
            "metric_name": "Уровень брака, %",
            "value": 1.8,
            "target": 1.5,
            "period": "month",
            "source": "manual",
            "aggregation_type": "sum",
            "direction": "lower_is_better",
            "weight": 1.0,
        },
    ]
    for i in range(1, 21):
        code = f"{i:04d}"
        if int(code) <= 6:
            continue
        rows.append(
            {
                "metric_code": code,
                "metric_name": f"Метрика {i}",
                "value": 0.0,
                "target": 100.0,
                "period": "month",
                "source": "manual",
                "aggregation_type": "sum",
                "direction": "higher_is_better",
                "weight": 1.0,
            }
        )
    return pd.DataFrame(rows, columns=METRICS_COLUMNS)


def _empty_df(columns: list[str]) -> pd.DataFrame:
    return pd.DataFrame(columns=columns)


def ensure_csv(path: Path, default_df: pd.DataFrame) -> pd.DataFrame:
    if path.exists():
        df = pd.read_csv(path)
        for col in default_df.columns:
            if col not in df.columns:
                df[col] = None
        return df[default_df.columns]
    default_df.to_csv(path, index=False)
    return default_df


def save_df(df: pd.DataFrame, name: str) -> None:
    (DATA_DIR / name).write_text(df.to_csv(index=False), encoding="utf-8")


def metric_score(row: pd.Series) -> float:
    value = row.get("value", 0) or 0
    target = row.get("target", 0) or 0
    direction = row.get("direction", "higher_is_better")

    if target == 0 or value == 0:
        return 0.0
    if direction == "higher_is_better":
        return (value / target) * 100
    return (target / value) * 100


def build_kpi_table(metrics: pd.DataFrame, mapping: pd.DataFrame, group_cols: list[str], kpi_col: str) -> pd.DataFrame:
    if mapping.empty:
        return pd.DataFrame()

    merged = mapping.merge(metrics[["metric_code", "value", "target", "direction"]], on="metric_code", how="left")
    merged["weight"] = pd.to_numeric(merged["weight"], errors="coerce").fillna(0)
    merged["metric_score"] = merged.apply(metric_score, axis=1)
    merged["weighted_score"] = merged["metric_score"] * merged["weight"]

    grouped = (
        merged.groupby(group_cols + [kpi_col], dropna=False)
        .agg(total_weight=("weight", "sum"), score_sum=("weighted_score", "sum"), metric_count=("metric_code", "count"))
        .reset_index()
    )
    grouped["kpi_score"] = grouped.apply(
        lambda r: round(r["score_sum"] / r["total_weight"], 2) if r["total_weight"] else 0,
        axis=1,
    )
    return grouped.sort_values("kpi_score", ascending=False)


def to_download(df: pd.DataFrame) -> bytes:
    return df.to_csv(index=False).encode("utf-8")


st.set_page_config(page_title="KPI Mapper", layout="wide")
st.title("KPI Mapper: 20 показателей → сотрудники/отделы/дашборды")
st.caption("Заполняйте метрики по коду (0001..0020), привязывайте их к KPI и сразу смотрите агрегированные результаты.")

metrics_df = ensure_csv(DATA_DIR / "metrics.csv", default_metrics())
employee_df = ensure_csv(DATA_DIR / "employee_mapping.csv", _empty_df(EMPLOYEE_COLUMNS))
department_df = ensure_csv(DATA_DIR / "department_mapping.csv", _empty_df(DEPARTMENT_COLUMNS))
dashboard_df = ensure_csv(DATA_DIR / "dashboard_mapping.csv", _empty_df(DASHBOARD_COLUMNS))

metric_codes = metrics_df["metric_code"].astype(str).tolist()

with st.sidebar:
    st.header("Шаблоны")
    if st.button("Загрузить демо-данные", use_container_width=True):
        save_df(default_metrics(), "metrics.csv")
        save_df(demo_employee_mapping(), "employee_mapping.csv")
        save_df(demo_department_mapping(), "department_mapping.csv")
        save_df(demo_dashboard_mapping(), "dashboard_mapping.csv")
        st.success("Демо-данные загружены. Обновите страницу.")

    st.download_button("Скачать metrics.csv", to_download(metrics_df), "metrics.csv", "text/csv")
    st.download_button("Скачать employee_mapping.csv", to_download(employee_df), "employee_mapping.csv", "text/csv")
    st.download_button("Скачать department_mapping.csv", to_download(department_df), "department_mapping.csv", "text/csv")
    st.download_button("Скачать dashboard_mapping.csv", to_download(dashboard_df), "dashboard_mapping.csv", "text/csv")

    uploaded = st.file_uploader("Загрузить CSV (metrics/employee/department/dashboard)", type=["csv"], accept_multiple_files=True)
    if uploaded:
        for file in uploaded:
            name = file.name
            content = pd.read_csv(io.BytesIO(file.getvalue()))
            if name == "metrics.csv":
                save_df(content.reindex(columns=METRICS_COLUMNS), name)
            elif name == "employee_mapping.csv":
                save_df(content.reindex(columns=EMPLOYEE_COLUMNS), name)
            elif name == "department_mapping.csv":
                save_df(content.reindex(columns=DEPARTMENT_COLUMNS), name)
            elif name == "dashboard_mapping.csv":
                save_df(content.reindex(columns=DASHBOARD_COLUMNS), name)
        st.success("Файлы загружены. Обновите страницу.")


tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "1) Метрики",
    "2) Привязка к сотрудникам",
    "3) Привязка к отделам",
    "4) Привязка к дашбордам",
    "5) Визуализация",
])

with tab1:
    st.subheader("Метрики (20 показателей)")
    edited_metrics = st.data_editor(metrics_df, num_rows="dynamic", use_container_width=True)
    if st.button("Сохранить метрики"):
        save_df(edited_metrics, "metrics.csv")
        st.success("metrics.csv сохранен")

with tab2:
    st.subheader("Маппинг: метрика → KPI сотрудника")
    st.info("Колонка metric_code должна ссылаться на коды из metrics.csv.")
    edited_employee = st.data_editor(
        employee_df,
        num_rows="dynamic",
        use_container_width=True,
        column_config={"metric_code": st.column_config.SelectboxColumn(options=metric_codes)},
    )
    if st.button("Сохранить привязки сотрудников"):
        save_df(edited_employee, "employee_mapping.csv")
        st.success("employee_mapping.csv сохранен")

with tab3:
    st.subheader("Маппинг: метрика → KPI отдела")
    edited_department = st.data_editor(
        department_df,
        num_rows="dynamic",
        use_container_width=True,
        column_config={"metric_code": st.column_config.SelectboxColumn(options=metric_codes)},
    )
    if st.button("Сохранить привязки отделов"):
        save_df(edited_department, "department_mapping.csv")
        st.success("department_mapping.csv сохранен")

with tab4:
    st.subheader("Маппинг: метрика → верхнеуровневый дашборд")
    edited_dashboard = st.data_editor(
        dashboard_df,
        num_rows="dynamic",
        use_container_width=True,
        column_config={"metric_code": st.column_config.SelectboxColumn(options=metric_codes)},
    )
    if st.button("Сохранить привязки дашбордов"):
        save_df(edited_dashboard, "dashboard_mapping.csv")
        st.success("dashboard_mapping.csv сохранен")

with tab5:
    st.subheader("Агрегированные KPI")
    employee_table = build_kpi_table(metrics_df, employee_df, ["employee_id", "employee_name"], "employee_kpi_id")
    department_table = build_kpi_table(metrics_df, department_df, ["department_id", "department_name"], "department_kpi_id")
    dashboard_table = build_kpi_table(metrics_df, dashboard_df, ["dashboard_id", "dashboard_name"], "widget_name")

    c1, c2, c3 = st.columns(3)
    c1.metric("Метрик", int(metrics_df.shape[0]))
    c2.metric("Привязок сотрудников", int(employee_df.shape[0]))
    c3.metric("Привязок отделов + дашбордов", int(department_df.shape[0] + dashboard_df.shape[0]))

    st.markdown("#### KPI сотрудников")
    st.dataframe(employee_table, use_container_width=True)

    st.markdown("#### KPI отделов")
    st.dataframe(department_table, use_container_width=True)

    st.markdown("#### Дашборды (виджеты)")
    st.dataframe(dashboard_table, use_container_width=True)

    if not employee_table.empty:
        st.bar_chart(employee_table.set_index("employee_name")["kpi_score"])
    if not department_table.empty:
        st.bar_chart(department_table.set_index("department_name")["kpi_score"])
