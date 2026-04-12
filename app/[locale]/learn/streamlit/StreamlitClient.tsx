"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface TipsSim  { type: "tips";  items: string[] }
interface StepsSim { type: "steps"; items: string[] }
interface CodeSim  { type: "code";  preview: string[] }  // lines shown as "rendered" UI
type Sim = TipsSim | StepsSim | CodeSim;

interface Lesson {
  id: string;
  title: string;
  concept: string;
  tip: string;
  code: string;
  sim: Sim;
  quiz: { q: string; options: [string,string,string,string]; correct: 0|1|2|3; explanation: string };
}
interface Module { id: string; label: string; icon: string; lessons: Lesson[] }

const MODULES: Module[] = [
  {
    id: "basics",
    label: "Basics",
    icon: "🧱",
    lessons: [
      {
        id: "st-write",
        title: "st.write & st.markdown",
        concept: "st.write() is Streamlit's universal display function — it renders strings, DataFrames, Plotly figures, dicts and more based on the type passed. st.markdown() renders Markdown text with headers, bold, links and horizontal rules. Use st.title(), st.header(), st.subheader() for semantic headings that appear in the outline.",
        tip: "Prefer st.markdown('---') for dividers and st.caption() for small grey footnote text. Avoid mixing st.write() and print() — print goes to terminal logs, not the browser.",
        code: `import streamlit as st
import pandas as pd

st.title("Sales Dashboard")
st.markdown("## Q1 2024 Overview")
st.write("Revenue grew **12%** vs prior year across all regions.")

# st.write auto-renders DataFrames
df = pd.DataFrame({
    "Region":  ["UK", "US", "EU"],
    "Revenue": [480_000, 720_000, 310_000],
})
st.write(df)

st.markdown("---")
st.caption("Data sourced from internal ERP — refreshed daily at 06:00 UTC")`,
        sim: { type: "code", preview: ["📌 Sales Dashboard","── Q1 2024 Overview","Revenue grew 12% vs prior year across all regions.","┌ Region │ Revenue ┐","│ UK     │ 480,000 │","│ US     │ 720,000 │","│ EU     │ 310,000 │","───────────────────","Data sourced from internal ERP — refreshed daily at 06:00 UTC"] },
        quiz: { q: "What does st.write() do when passed a pandas DataFrame?", options: ["Prints it to the terminal","Renders it as an interactive table in the browser","Raises a TypeError","Converts it to a string first"], correct: 1, explanation: "st.write() inspects the type of its argument. When it receives a DataFrame, it automatically renders it as an interactive sortable table — no extra call needed." },
      },
      {
        id: "st-columns",
        title: "st.columns — Multi-Column Layout",
        concept: "st.columns() splits the horizontal space into side-by-side containers. Pass an integer for equal columns or a list of proportions like [2, 1] for unequal widths. Use with col.metric(), col.chart() or any widget. Columns are the primary layout tool — they replace manual HTML tables.",
        tip: "Nest columns for complex grids: create an outer [1,1] and inside each column create another [1,1]. Limit to 3–4 top-level columns — more becomes unreadable on laptop screens.",
        code: `import streamlit as st

# Equal-width KPI row
col1, col2, col3 = st.columns(3)
col1.metric("Revenue",     "£480k",  "+12%")
col2.metric("Gross Margin","42%",    "+2pp")
col3.metric("Cash Runway", "14 mo",  "-2 mo", delta_color="inverse")

st.markdown("---")

# Unequal split: chart on left, controls on right
left, right = st.columns([3, 1])
with left:
    st.line_chart({"Jan":100,"Feb":120,"Mar":140})
with right:
    region = st.selectbox("Region", ["UK","US","EU"])
    st.write(f"Showing: **{region}**")`,
        sim: { type: "code", preview: ["┌── Revenue ──┐ ┌─ Margin ─┐ ┌─ Runway ─┐","│   £480k     │ │   42%    │ │  14 mo   │","│   ▲ +12%    │ │  ▲ +2pp  │ │  ▼ -2 mo │","└─────────────┘ └──────────┘ └──────────┘","────────────────────────────────────────","┌── Chart (75%) ────────────┐ ┌ Controls ┐","│  /‾‾╱‾‾‾‾              │ │ Region:  │","│ /  /                    │ │ [UK  ▾]  │","└────────────────────────────┘ └──────────┘"] },
        quiz: { q: "st.columns([2, 1]) creates:", options: ["3 equal columns","2 columns where the first is twice as wide","2 columns where the second is twice as wide","Columns 2px and 1px wide"], correct: 1, explanation: "The list [2, 1] defines relative proportions — the first column gets 2/3 of the width and the second gets 1/3. This is not pixel widths." },
      },
      {
        id: "st-sidebar",
        title: "st.sidebar — Navigation Panel",
        concept: "st.sidebar renders a collapsible left panel. All standard Streamlit widgets work inside it — prefix any widget call with st.sidebar. to place it there. The sidebar is ideal for global filters (date range, region) and navigation controls that apply across the entire app.",
        tip: "On mobile, the sidebar collapses by default. Users must tap ☰ to open it. For mobile-first apps, put critical filters on the main canvas in a collapsed st.expander() instead.",
        code: `import streamlit as st

# All sidebar content
st.sidebar.title("Filters")
st.sidebar.markdown("---")

year     = st.sidebar.selectbox("Fiscal Year", [2022, 2023, 2024], index=2)
regions  = st.sidebar.multiselect("Region", ["UK","US","EU","APAC"], default=["UK"])
min_rev  = st.sidebar.slider("Min Revenue £k", 0, 1000, 100)

st.sidebar.markdown("---")
st.sidebar.caption("FinancePlots · Finance Tools")

# Main canvas uses sidebar values
st.title(f"Revenue Report — FY{year}")
st.write(f"Regions: {', '.join(regions) or 'None selected'}")
st.write(f"Min Revenue: £{min_rev:,}k")`,
        sim: { type: "code", preview: ["◀ Filters ▶","  Fiscal Year","  [2024     ▾]","  Region","  [UK] [US] [+]","  Min Revenue £k","  ──●────── 100","  ────────────","  FinancePlots · Finance Tools","────────────────────────────────","Revenue Report — FY2024","Regions: UK, US","Min Revenue: £100k"] },
        quiz: { q: "To add a selectbox to the sidebar, you write:", options: ["st.sidebar(st.selectbox(...))","st.selectbox(..., location='sidebar')","st.sidebar.selectbox(...)","st.add_to_sidebar(st.selectbox(...))"], correct: 2, explanation: "st.sidebar.selectbox() is the sidebar-prefixed version. Every standard Streamlit widget has a sidebar equivalent — just prefix with st.sidebar." },
      },
      {
        id: "st-widgets",
        title: "Input Widgets",
        concept: "Streamlit's input widgets return their current value on every script rerun. The script reruns automatically whenever a widget changes. Use st.text_input for free text, st.number_input for bounded numbers, st.selectbox for dropdowns, st.multiselect for multi-choice, and st.slider for numeric ranges.",
        tip: "Set a key= parameter on widgets that appear inside loops or conditionals — without unique keys, Streamlit may confuse two widgets that look identical, causing unexpected resets.",
        code: `import streamlit as st

company  = st.text_input("Company Name", placeholder="Acme Ltd")
revenue  = st.number_input("Annual Revenue £",
               min_value=0, max_value=50_000_000,
               value=1_000_000, step=50_000)
sector   = st.selectbox("Sector",
               ["Technology","Finance","Healthcare","Retail","Manufacturing"])
features = st.multiselect("Export Options",
               ["PDF","Excel","CSV"], default=["PDF"])
growth   = st.slider("Growth Assumption %", -20, 100, value=10, step=1)
is_public = st.checkbox("Listed company")
submitted = st.button("Run Analysis", type="primary")

if submitted and company:
    st.success(f"Running for **{company}** — £{revenue:,} revenue, {sector}")`,
        sim: { type: "code", preview: ["Company Name: [Acme Ltd                 ]","Annual Revenue £: [  1,000,000  ] − +","Sector: [Technology              ▾]","Export Options: [PDF ×] [Excel ×]","Growth %: ──●──── 10","☑ Listed company","[  Run Analysis  ]","✅ Running for Acme Ltd — £1,000,000 revenue, Technology"] },
        quiz: { q: "What happens to a Streamlit script when a user moves a slider?", options: ["Only the slider updates in the browser (partial rerender)","The script reruns from top to bottom with the new slider value","A callback function is triggered","Nothing — user must press Submit"], correct: 1, explanation: "Streamlit's execution model reruns the entire script top-to-bottom whenever any widget changes. The new widget value is available on the rerun. This is simpler than callbacks but means order of execution matters." },
      },
      {
        id: "st-session-state",
        title: "st.button & session_state",
        concept: "st.button() returns True only on the single rerun immediately after it is clicked — it reverts to False on the next rerun. To persist values across reruns, use st.session_state — a dict-like object that survives reruns. Always initialise keys with defaults at the top of the script.",
        tip: "Use st.session_state for multi-step wizards, toggle states, and any value that must survive a widget interaction. Never rely on a module-level variable for persistence — it resets on every rerun.",
        code: `import streamlit as st

# Initialise all state at top of script
if "count" not in st.session_state:
    st.session_state.count = 0
if "history" not in st.session_state:
    st.session_state.history = []

col1, col2, col3 = st.columns(3)
if col1.button("+ Add"):
    st.session_state.count += 1
    st.session_state.history.append(st.session_state.count)
if col2.button("− Remove") and st.session_state.count > 0:
    st.session_state.count -= 1
if col3.button("Reset"):
    st.session_state.count = 0
    st.session_state.history = []

st.metric("Count", st.session_state.count)
if st.session_state.history:
    st.write("History:", st.session_state.history)`,
        sim: { type: "code", preview: ["[+ Add]  [− Remove]  [Reset]","","Count","   3","   ▲","History: [1, 2, 3]"] },
        quiz: { q: "st.button() returns True for how many reruns after being clicked?", options: ["Every rerun until clicked again","Exactly one rerun","Until the page is refreshed","Two reruns"], correct: 1, explanation: "st.button() returns True only during the single rerun triggered by the click. On the next rerun (triggered by any other interaction), it returns False again. Use session_state to persist the effect." },
      },
      {
        id: "st-dataframe",
        title: "st.dataframe & st.data_editor",
        concept: "st.dataframe() renders an interactive, sortable, searchable table. st.data_editor() makes it editable — users can modify cell values, add and delete rows, and you receive the changes as a new DataFrame. Use st.dataframe for read-only display and data_editor for user-input grids like budget templates.",
        tip: "Pass column_config to customise column display: set number formats, progress bars, image URLs and dropdown constraints. st.column_config.NumberColumn(format='£{:,.0f}') renders clean currency values.",
        code: `import streamlit as st
import pandas as pd

df = pd.DataFrame({
    "Category":  ["Revenue","COGS","Gross Profit","Opex","EBITDA"],
    "Budget £":  [500_000, 300_000, 200_000, 80_000, 120_000],
    "Actual £":  [480_000, 295_000, 185_000, 84_000, 101_000],
    "Variance %":[  -4.0,    1.7,    -7.5,    5.0,   -15.8],
})

st.dataframe(
    df,
    use_container_width=True,
    hide_index=True,
    column_config={
        "Budget £":   st.column_config.NumberColumn(format="£{:,.0f}"),
        "Actual £":   st.column_config.NumberColumn(format="£{:,.0f}"),
        "Variance %": st.column_config.NumberColumn(format="{:.1f}%"),
    }
)

# Editable version
edited = st.data_editor(df, num_rows="dynamic", use_container_width=True)
st.write("Total Actual:", f"£{edited['Actual £'].sum():,.0f}")`,
        sim: { type: "code", preview: ["Category      Budget £    Actual £  Variance %","Revenue       £500,000    £480,000    -4.0%","COGS          £300,000    £295,000    +1.7%","Gross Profit  £200,000    £185,000    -7.5%","Opex           £80,000     £84,000    +5.0%","EBITDA        £120,000    £101,000   -15.8%","","[Editable grid below — click any cell to edit]","Total Actual: £1,145,000"] },
        quiz: { q: "What does st.data_editor() return?", options: ["A JSON string of changes","The edited DataFrame with user modifications","A diff of changed cells only","None — edits happen in-place"], correct: 1, explanation: "st.data_editor() returns the full edited DataFrame including all user modifications. Assign it to a variable: edited_df = st.data_editor(df). Changes are reflected on the next script rerun." },
      },
      {
        id: "st-cache",
        title: "@st.cache_data",
        concept: "@st.cache_data caches function return values across reruns. The cache key is derived from the function arguments — when arguments change, the function re-runs and the new result is cached. Use it for all expensive operations: CSV loading, database queries and API calls. The ttl parameter sets time-to-live in seconds.",
        tip: "st.cache_data is for data (DataFrames, dicts, lists). st.cache_resource is for shared objects (database connections, ML models) — it creates one instance shared across all users and reruns.",
        code: `import streamlit as st
import pandas as pd
import time

@st.cache_data(ttl=3600)          # cache for 1 hour
def load_sales(file_path: str) -> pd.DataFrame:
    time.sleep(2)                  # simulates slow load
    df = pd.read_csv(file_path, parse_dates=["Date"])
    df["Quarter"] = df["Date"].dt.quarter
    return df

@st.cache_data(ttl=300)            # cache for 5 minutes
def fetch_fx_rates(base: str = "GBP") -> dict:
    import requests
    r = requests.get(f"https://api.exchangerate.host/latest?base={base}")
    return r.json()["rates"]

# First call: takes 2s. Subsequent calls: instant from cache.
df = load_sales("data/sales.csv")
st.write(f"Loaded {len(df):,} rows")

if st.button("Clear cache"):
    st.cache_data.clear()`,
        sim: { type: "tips", items: ["First run: function executes (slow). All reruns: returns cached result instantly","Cache key = function arguments — changing file_path causes a cache miss","ttl=3600 expires the cache after 1 hour — good for data that updates daily","st.cache_data.clear() clears all caches — add a button for admin use","max_entries=10 limits cache size — avoids memory issues with many unique argument combinations","Cached functions must be pure — no side effects, no global variable mutations"] },
        quiz: { q: "@st.cache_data caches based on:", options: ["Time only (fixed interval)","Function arguments (cache key)","The function name only","The user's session ID"], correct: 1, explanation: "The cache key is a hash of the function arguments. Same arguments → cached result. Different arguments → function re-executes and the new result is cached separately." },
      },
      {
        id: "st-file-uploader",
        title: "st.file_uploader",
        concept: "st.file_uploader renders a drag-and-drop file input. It returns a file-like object (or None if empty). Pass type=['csv','xlsx'] to restrict accepted formats. The uploaded file can be passed directly to pd.read_csv() or pd.read_excel(). Always handle the None case — never assume a file is uploaded.",
        tip: "Wrap the DataFrame load in @st.cache_data using the file's name + size as the cache key to avoid re-parsing the same file on every widget interaction.",
        code: `import streamlit as st
import pandas as pd

uploaded = st.file_uploader(
    "Upload your sales file",
    type=["csv", "xlsx"],
    help="Max 200MB · Supported: .csv, .xlsx"
)

if uploaded is None:
    st.info("Upload a file to begin analysis.")
    st.stop()

# Parse based on extension
if uploaded.name.endswith(".csv"):
    df = pd.read_csv(uploaded)
else:
    xl   = pd.ExcelFile(uploaded)
    sheet = st.selectbox("Sheet", xl.sheet_names)
    df   = xl.parse(sheet)

st.success(f"Loaded **{uploaded.name}** — {len(df):,} rows × {len(df.columns)} columns")
st.dataframe(df.head(10), use_container_width=True)`,
        sim: { type: "code", preview: ["┌─────────────────────────────────────┐","│  Drag and drop file here             │","│  ── or ──                            │","│  [Browse files]   Max 200MB         │","└─────────────────────────────────────┘","","After upload:","✅ Loaded sales_q1.xlsx — 1,234 rows × 8 columns","┌ Date │ Region │ Revenue │ ... ┐","│ ...  │  ...   │  ...    │     │"] },
        quiz: { q: "st.file_uploader returns None when:", options: ["The file is too large","No file has been uploaded yet","The file type is wrong","The user cancels the dialog"], correct: 1, explanation: "st.file_uploader returns None when no file is currently uploaded. Always check for None before accessing the file object — failure to do so causes an AttributeError on the first script load." },
      },
      {
        id: "st-multipage",
        title: "Multi-Page Apps",
        concept: "Streamlit supports multi-page apps two ways: (1) pages/ folder convention — each .py file becomes a page, numbered files set the order; (2) st.navigation() with st.Page() objects (Streamlit 1.36+) for programmatic control. st.navigation() is preferred for custom navbars, icons and conditional pages based on auth.",
        tip: "Use st.Page() with default=True on your home page to prevent Streamlit showing a blank screen on first load. Share data between pages via st.session_state — it persists across page navigation.",
        code: `# app.py — main entry point (st.navigation style)
import streamlit as st

# Optional: auth gate
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

pages = [
    st.Page("pages/home.py",             title="Home",           icon="🏠", default=True),
    st.Page("pages/financial_model.py",  title="Financial Model",icon="📈"),
    st.Page("pages/annual_budget.py",    title="Annual Budget",  icon="💰"),
    st.Page("pages/portfolio.py",        title="Portfolio",      icon="📊"),
]
pg = st.navigation(pages)
pg.run()

# pages/ folder alternative (simpler):
# pages/1_Home.py
# pages/2_Financial_Model.py   (number = order in nav)`,
        sim: { type: "code", preview: ["◀ Navigation ▶","  🏠 Home  ←── current","  📈 Financial Model","  💰 Annual Budget","  📊 Portfolio","──────────────────","[Page content renders here]","","(st.session_state shared across all pages)"] },
        quiz: { q: "To share data between pages in a multi-page Streamlit app, use:", options: ["Global Python variables","st.session_state","A temporary file on disk","URL query parameters"], correct: 1, explanation: "st.session_state persists across page navigation within the same session. Global variables are reset on each page load. Use session_state for filters, auth status and shared computation results." },
      },
      {
        id: "st-state-patterns",
        title: "st.session_state Patterns",
        concept: "Session state is essential for multi-step forms, toggle UX and any value that must outlive a single rerun. Initialise all keys with defaults at the very top of the script. Use st.rerun() to force a fresh render after state mutation (e.g. after a form submission changes the step).",
        tip: "Avoid storing large DataFrames in session_state — they consume server RAM for every active user. Cache the data with @st.cache_data instead and store only the filter/parameters in session_state.",
        code: `import streamlit as st

# ── Initialise defaults ────────────────────────────
DEFAULTS = {"step": 1, "company": "", "revenue": 0, "results": None}
for k, v in DEFAULTS.items():
    if k not in st.session_state:
        st.session_state[k] = v

# ── Multi-step form ────────────────────────────────
st.progress(st.session_state.step / 3, text=f"Step {st.session_state.step} of 3")

if st.session_state.step == 1:
    st.session_state.company = st.text_input("Company name")
    if st.button("Next →") and st.session_state.company:
        st.session_state.step = 2
        st.rerun()

elif st.session_state.step == 2:
    st.session_state.revenue = st.number_input("Annual Revenue £", value=500_000)
    col1, col2 = st.columns(2)
    if col1.button("← Back"):
        st.session_state.step = 1; st.rerun()
    if col2.button("Analyse →"):
        st.session_state.results = f"{st.session_state.company}: £{st.session_state.revenue:,}"
        st.session_state.step = 3; st.rerun()

elif st.session_state.step == 3:
    st.success(f"✅ {st.session_state.results}")
    if st.button("Start over"):
        for k, v in DEFAULTS.items(): st.session_state[k] = v
        st.rerun()`,
        sim: { type: "tips", items: ["Initialise every key at top: if 'key' not in st.session_state: st.session_state.key = default","st.rerun() triggers an immediate full rerun — use after state mutation to reflect changes","Store only small values (strings, ints, dicts) in session_state, not large DataFrames","Use .get() for optional keys: st.session_state.get('results', None)","Session state is per-user per-browser-tab — not shared between users","Debug: st.write(st.session_state) shows all current state — remove before deploying"] },
        quiz: { q: "After mutating st.session_state, you call st.rerun() to:", options: ["Save state to disk","Force an immediate full script rerun to reflect the new state","Clear all other session state","Send state to the server"], correct: 1, explanation: "st.rerun() causes Streamlit to immediately re-execute the script from the top. Without it, the mutation takes effect but the UI only updates on the next natural rerun (next widget interaction)." },
      },
    ],
  },

  {
    id: "charts",
    label: "Charts",
    icon: "📈",
    lessons: [
      {
        id: "ch-builtin",
        title: "Built-in Charts",
        concept: "st.line_chart, st.bar_chart, st.area_chart and st.scatter_chart are quick-start charts built on Vega-Lite/Altair. Pass a DataFrame directly — the index becomes the X-axis and columns become series. They support color= for custom colours. For anything beyond basic customisation, switch to Plotly Express.",
        tip: "Set use_container_width=True on all chart calls — charts default to a fixed pixel width and look wrong on different screen sizes without this.",
        code: `import streamlit as st
import pandas as pd

months = ["Jan","Feb","Mar","Apr","May","Jun"]
df = pd.DataFrame({
    "Revenue": [420,460,510,490,555,600],
    "Budget":  [400,440,480,500,520,560],
}, index=months)

st.line_chart(df, color=["#4299e1","#f6ad55"], use_container_width=True)
st.bar_chart(df["Revenue"], color="#4299e1", use_container_width=True)
st.area_chart(df, color=["#4299e120","#f6ad5520"], use_container_width=True)`,
        sim: { type: "tips", items: ["Index of the DataFrame = X-axis. Column names = series labels in the legend","color=['#hex1','#hex2'] sets colours in column order","use_container_width=True is almost always needed — add it every time","For time series: set the index to a DatetimeIndex before charting","st.scatter_chart needs x= and y= keyword args (different from line/bar)","These charts are non-interactive beyond hover tooltips — use Plotly for click events"] },
        quiz: { q: "In st.line_chart(df), what becomes the X-axis?", options: ["The first column","The DataFrame index","Row numbers","The column named 'x'"], correct: 1, explanation: "The DataFrame index is always the X-axis in Streamlit's built-in charts. Set a meaningful index (dates, categories) before calling the chart function." },
      },
      {
        id: "ch-plotly",
        title: "Plotly Express",
        concept: "Plotly Express is the primary charting library for professional Streamlit apps — interactive, publication-quality, with minimal code. Pass the resulting figure to st.plotly_chart(fig, use_container_width=True). Apply fig.update_layout() for theme, size and font customisation.",
        tip: "Set template='plotly_dark' and paper_bgcolor to match your app background to make Plotly charts look native rather than pasted-in. Store your layout defaults in a shared dict and unpack them with **layout_defaults.",
        code: `import streamlit as st
import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    "Month":   ["Jan","Feb","Mar","Apr","May","Jun"] * 2,
    "Revenue": [420,460,510,490,555,600, 380,420,460,470,510,540],
    "Region":  ["UK"]*6 + ["US"]*6,
})

fig = px.bar(df, x="Month", y="Revenue", color="Region",
             barmode="group",
             color_discrete_map={"UK":"#4299e1","US":"#48bb78"},
             title="Monthly Revenue by Region")

fig.update_layout(
    template="plotly_dark",
    paper_bgcolor="#0a0f1e",
    plot_bgcolor="#0d1426",
    font_color="#e2e8f0",
    legend_title_text="",
    margin=dict(t=50, b=20, l=20, r=20),
)
st.plotly_chart(fig, use_container_width=True)`,
        sim: { type: "tips", items: ["template='plotly_dark' sets dark background — then override paper_bgcolor to match your app","color_discrete_map={'UK':'#hex'} ensures consistent colour assignments across multiple charts","hover_data=['extra_col'] adds columns to the tooltip without mapping them to axes","fig.update_traces(texttemplate='%{y:,.0f}', textposition='outside') adds data labels","height=400 in px.bar() or update_layout(height=400) — always set explicit height","Use px.line() for trends, px.bar() for comparisons, px.scatter() for correlations, px.funnel() for pipelines"] },
        quiz: { q: "To render a Plotly figure in Streamlit, you call:", options: ["st.plot(fig)","st.show(fig)","st.plotly_chart(fig)","fig.streamlit()"], correct: 2, explanation: "st.plotly_chart(fig, use_container_width=True) is the correct function. Without use_container_width=True the chart renders at a default pixel width that may not fill the container." },
      },
      {
        id: "ch-matplotlib",
        title: "Matplotlib Charts",
        concept: "Matplotlib gives precise control over every element. Use the fig, ax = plt.subplots() pattern and pass the figure to st.pyplot(fig). Always call plt.close(fig) after rendering to free memory — Streamlit apps are long-running and unclosed figures accumulate RAM.",
        tip: "Set fig.patch.set_facecolor() and ax.set_facecolor() to match your app background. Matplotlib defaults to a white background that looks jarring on dark-themed apps.",
        code: `import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

months = range(1, 13)
revenue = [400+i*20+np.random.randint(-20,20) for i in months]
budget  = [380+i*22 for i in months]

fig, ax = plt.subplots(figsize=(10, 4))
fig.patch.set_facecolor("#0a0f1e")
ax.set_facecolor("#0d1426")

ax.plot(months, revenue, color="#4299e1", linewidth=2.5, label="Actual", marker="o", markersize=4)
ax.plot(months, budget,  color="#f6ad55", linewidth=1.5, label="Budget", linestyle="--")
ax.fill_between(months, revenue, budget, alpha=0.1, color="#4299e1")

ax.set_title("Actual vs Budget Revenue", color="white", pad=12)
ax.tick_params(colors="white")
ax.spines[["top","right"]].set_visible(False)
ax.spines[["bottom","left"]].set_color("#374151")
ax.legend(facecolor="#0d1426", labelcolor="white", framealpha=0.8)

st.pyplot(fig)
plt.close(fig)          # always close to free memory`,
        sim: { type: "tips", items: ["plt.close(fig) after st.pyplot(fig) — skipping this leaks memory in long-running apps","fig.patch = page background; ax.set_facecolor = chart area background","ax.spines[['top','right']].set_visible(False) removes unnecessary chart borders","Use tight_layout=True or fig.tight_layout() to prevent axis labels being clipped","Matplotlib renders at DPI — set dpi=150 for crisp output on retina screens","For multiple subplots: fig, axes = plt.subplots(2, 2, figsize=(12, 8))"] },
        quiz: { q: "Why must you call plt.close(fig) after st.pyplot(fig)?", options: ["It applies the final render","It sends the chart to the browser","It frees the figure from memory — unclosed figures accumulate over app sessions","It clears the Streamlit cache"], correct: 2, explanation: "Streamlit apps run continuously. Matplotlib figures remain in memory until explicitly closed. In a busy app without plt.close(), memory grows until the server crashes." },
      },
      {
        id: "ch-metric",
        title: "st.metric — KPI Cards",
        concept: "st.metric() displays a headline value with an optional delta indicator. Delta can be a number or formatted string. Use delta_color='inverse' for metrics where lower is better (costs, errors, churn). Place 3–4 metrics in st.columns for an executive KPI row at the top of every dashboard page.",
        tip: "Custom CSS can style metric containers. Inject st.markdown('<style>[data-testid=\"metric-container\"] {...}</style>', unsafe_allow_html=True) to add borders, backgrounds and rounded corners.",
        code: `import streamlit as st

col1, col2, col3, col4 = st.columns(4)

col1.metric(
    label="Revenue",
    value="£480k",
    delta="+12%",
    help="Total revenue for selected period"
)
col2.metric("Gross Margin", "42%",    delta="+2.1pp")
col3.metric("EBITDA",       "£96k",   delta="+18%")
col4.metric(
    label="Total Costs",
    value="£280k",
    delta="+5%",
    delta_color="inverse"   # red if up (bad), green if down (good)
)

# Custom styling for metric containers
st.markdown("""
<style>
[data-testid="metric-container"] {
    background: #0d1426;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 16px;
}
</style>""", unsafe_allow_html=True)`,
        sim: { type: "code", preview: ["┌─ Revenue ─┐ ┌ Margin ┐ ┌─ EBITDA ─┐ ┌─ Costs ──┐","│   £480k   │ │  42%   │ │   £96k   │ │  £280k   │","│  ▲ +12%   │ │ ▲+2.1pp│ │  ▲ +18%  │ │  ▼ +5%   │","└───────────┘ └────────┘ └──────────┘ └──────────┘","                                         (red=bad here)"] },
        quiz: { q: "delta_color='inverse' on a cost metric means:", options: ["The delta shows in grey","A positive delta (costs up) shows red; negative delta shows green","A negative delta (costs down) shows red","The delta is hidden"], correct: 1, explanation: "delta_color='inverse' reverses the green/red logic. For costs, an increase (+) is bad (red) and a decrease (-) is good (green). Default behaviour is the opposite: positive = green." },
      },
      {
        id: "ch-plotly-subplots",
        title: "Plotly Subplots",
        concept: "make_subplots() from plotly.subplots creates a grid of charts in one figure — ideal for executive dashboards combining KPI trends, mix charts and variance tables. Each trace is added with row= and col= to place it in the correct cell. Shared axes reduce visual clutter.",
        tip: "Use subplot_titles to label each cell. Set shared_xaxes=True when all charts share the same time period — this links pan/zoom across all cells simultaneously.",
        code: `import streamlit as st
import plotly.graph_objects as go
from plotly.subplots import make_subplots

months = ["Jan","Feb","Mar","Apr","May","Jun"]
rev    = [420,460,510,490,555,600]
cost   = [300,320,340,330,360,380]
margin = [r-c for r,c in zip(rev,cost)]
growth = [0,9.5,10.9,-3.9,13.3,8.1]

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=["Revenue £k","Cost £k","Gross Profit £k","MoM Growth %"],
    vertical_spacing=0.15, horizontal_spacing=0.1,
)
fig.add_trace(go.Bar(x=months, y=rev,    name="Revenue", marker_color="#4299e1"), row=1,col=1)
fig.add_trace(go.Bar(x=months, y=cost,   name="Cost",    marker_color="#fc8181"), row=1,col=2)
fig.add_trace(go.Scatter(x=months, y=margin, fill="tozeroy", fillcolor="#48bb7820",
                         line_color="#48bb78", name="GP"),                         row=2,col=1)
fig.add_trace(go.Bar(x=months, y=growth, name="Growth",  marker_color="#f6ad55"), row=2,col=2)

fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0f1e",
                  height=500, showlegend=False)
st.plotly_chart(fig, use_container_width=True)`,
        sim: { type: "tips", items: ["make_subplots(rows=2, cols=2) creates a 2×2 grid — always pass rows and cols","subplot_titles list must match total cell count (rows × cols)","Each fig.add_trace() needs row= and col= (1-indexed, not 0-indexed)","shared_xaxes=True links x-axis pan/zoom across all cells in the same column","specs=[[{'type':'bar'},{'type':'scatter'}],...] allows mixing chart types in subplots","fig.update_yaxes(tickprefix='£', row=1, col=1) formats only that subplot's axis"] },
        quiz: { q: "In make_subplots(), what row/col index does the top-left cell have?", options: ["(0, 0)","(1, 1)","(0, 1)","(1, 0)"], correct: 1, explanation: "Plotly subplot indices are 1-based, not 0-based. The top-left cell is row=1, col=1. Pass these values in every fig.add_trace() call." },
      },
      {
        id: "ch-dynamic",
        title: "Dynamic Chart Updates",
        concept: "Charts update reactively when any widget changes — Streamlit reruns the script and redraws the chart with the new filtered data. The pattern is: (1) widgets at top define filter params, (2) @st.cache_data loads raw data, (3) filter logic creates a subset, (4) chart renders the subset.",
        tip: "Wrap the data load in @st.cache_data and the filter+chart in the main script. Never put the filter inside the cached function — it would cache a specific filtered result and ignore slicer changes.",
        code: `import streamlit as st
import plotly.express as px
import pandas as pd

@st.cache_data
def load_data() -> pd.DataFrame:
    return pd.read_csv("data/sales.csv", parse_dates=["Date"])

df = load_data()

# Widgets — define filter parameters
col1, col2 = st.columns(2)
regions  = col1.multiselect("Region", df["Region"].unique(), default=df["Region"].unique())
year     = col2.selectbox("Year", sorted(df["Date"].dt.year.unique(), reverse=True))

# Apply filters (never mutate the cached df)
mask = (df["Region"].isin(regions)) & (df["Date"].dt.year == year)
filtered = df[mask].copy()

if filtered.empty:
    st.warning("No data for selected filters.")
    st.stop()

# Chart re-renders on every widget change
fig = px.line(filtered.groupby("Date")["Revenue"].sum().reset_index(),
              x="Date", y="Revenue", title=f"Revenue {year}")
fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0f1e")
st.plotly_chart(fig, use_container_width=True)`,
        sim: { type: "tips", items: ["Load once with @st.cache_data → filter in main script → render chart","filtered = df[mask].copy() — always copy to avoid SettingWithCopyWarning","st.stop() after st.warning() prevents chart errors when no data matches","Add st.spinner('Loading chart...') around slow chart renders to signal activity","Use st.empty() as a placeholder for charts that load asynchronously","If chart flickers on every interaction, add st.cache_data with stable arguments"] },
        quiz: { q: "Where should you apply filter logic (e.g. df[mask]) in a Streamlit app?", options: ["Inside the @st.cache_data function","In the main script, after the cached load function returns","In a separate thread","In a JavaScript callback"], correct: 1, explanation: "Filter logic belongs in the main script, after the cached data load. The cached function should return the full raw dataset; filtering in the main script allows the filter to change on every rerun without cache invalidation." },
      },
      {
        id: "ch-altair",
        title: "Altair Charts",
        concept: "Altair uses the Vega-Lite grammar of graphics — you declare encodings (what maps to x, y, color) rather than imperative chart commands. It excels at faceted/small-multiple charts and cross-filtering between linked charts. Use st.altair_chart(chart, use_container_width=True) to render.",
        tip: "Altair charts can be combined with & (horizontal) and | (vertical) operators to create linked multi-chart views where clicking one filters the others — unique to Altair among Streamlit chart libraries.",
        code: `import streamlit as st
import altair as alt
import pandas as pd

df = pd.DataFrame({
    "Month":    list(range(1, 13)) * 2,
    "Revenue":  [100+i*15+j*30 for j in range(2) for i in range(12)],
    "Region":   ["UK"]*12 + ["US"]*12,
})

chart = alt.Chart(df).mark_bar().encode(
    x=alt.X("Month:O", title="Month"),
    y=alt.Y("Revenue:Q", title="Revenue £k"),
    color=alt.Color("Region:N",
        scale=alt.Scale(range=["#4299e1","#48bb78"])),
    tooltip=["Month","Region","Revenue"],
).properties(
    title="Monthly Revenue by Region",
    width="container",
    height=300,
).interactive()

st.altair_chart(chart, use_container_width=True)`,
        sim: { type: "tips", items: ["Encoding types: :Q = quantitative, :O = ordinal, :N = nominal, :T = temporal","mark_bar(), mark_line(), mark_point(), mark_area() set the chart type",".interactive() adds pan/zoom — useful for exploring dense time series","layer(chart1, chart2) overlays two charts on the same axes","chart1 | chart2 places them side by side; chart1 & chart2 stacks vertically","alt.selection_point() creates cross-filtering between linked charts"] },
        quiz: { q: "In Altair, the encoding type :T means:", options: ["Text label","Temporal (date/time)","Total aggregate","Threshold colour"], correct: 1, explanation: ":T marks a field as temporal (date or datetime). Altair uses this to format axes as dates and enable time-based operations. Use :O for ordered categories (months 1-12) and :Q for continuous numbers." },
      },
      {
        id: "ch-theming",
        title: "Theming & Colours",
        concept: "Streamlit themes are set in .streamlit/config.toml — the primaryColor, backgroundColor, secondaryBackgroundColor and textColor control the entire app. For consistent chart colours, define a shared colour palette and apply it to Plotly templates. Coherent colour use separates professional apps from hobby projects.",
        tip: "Create a shared config.py with your COLORS list and LAYOUT_DEFAULTS dict. Import it in every page — one change updates all charts simultaneously.",
        code: `# .streamlit/config.toml
[theme]
primaryColor          = "#4299e1"
backgroundColor       = "#0a0f1e"
secondaryBackgroundColor = "#0d1426"
textColor             = "#e2e8f0"
font                  = "sans serif"

# shared/config.py — import in every page
COLORS = {
    "primary":   "#4299e1",
    "positive":  "#48bb78",
    "negative":  "#fc8181",
    "warning":   "#f6ad55",
    "neutral":   "#718096",
}

PLOTLY_LAYOUT = dict(
    template       = "plotly_dark",
    paper_bgcolor  = "#0a0f1e",
    plot_bgcolor   = "#0d1426",
    font_color     = "#e2e8f0",
    margin         = dict(t=50, b=30, l=20, r=20),
)

# In a chart page:
# from shared.config import COLORS, PLOTLY_LAYOUT
# fig.update_layout(**PLOTLY_LAYOUT)`,
        sim: { type: "tips", items: ["config.toml applies globally — no Python code needed for the base theme","primaryColor controls button colour, active widget borders and slider handles","Plotly charts ignore config.toml — apply PLOTLY_LAYOUT manually per chart","Use 2–3 data colours max for clean charts — rely on position/labels for additional distinction","Dark theme tip: ensure text contrast ratio ≥ 4.5:1 against the background for accessibility","Test your theme in both light and dark system OS modes — some users override with system preference"] },
        quiz: { q: "Streamlit's config.toml theme controls:", options: ["Plotly chart colours automatically","Streamlit UI elements (buttons, sliders, sidebar) — Plotly charts need separate configuration","Font sizes and chart sizes","Everything including Matplotlib charts"], correct: 1, explanation: "config.toml themes apply to Streamlit's own UI components. Plotly, Matplotlib and Altair charts have their own theming systems and must be configured separately." },
      },
      {
        id: "ch-map",
        title: "st.map & Geographic Charts",
        concept: "st.map() renders geographic data on a Mapbox map. Requires columns named 'lat'/'lon' or 'latitude'/'longitude'. Accepts a size= column and color= for point styling. For advanced maps (choropleth, custom layers, routes), use Plotly's px.choropleth_map or pydeck_chart.",
        tip: "For finance use cases: office locations by revenue, regional sales heatmaps, customer density maps. Pull lat/lon from a reference table — don't geocode in real-time during the app render.",
        code: `import streamlit as st
import pandas as pd
import plotly.express as px

# Office + revenue data
df = pd.DataFrame({
    "city":    ["London","New York","Paris","Singapore","Sydney"],
    "lat":     [51.507, 40.713,  48.857, 1.352,   -33.868],
    "lon":     [-0.128,-74.006,  2.352, 103.820,  151.209],
    "revenue": [8200,   12400,   5100,   3800,    2900],
    "growth":  [12, 8, 15, 22, -3],
})

# Quick map (built-in)
st.map(df, size="revenue")

# Or rich Plotly map
fig = px.scatter_geo(df, lat="lat", lon="lon",
                     size="revenue", color="growth",
                     hover_name="city",
                     color_continuous_scale="RdYlGn",
                     projection="natural earth",
                     title="Global Revenue by Office")
st.plotly_chart(fig, use_container_width=True)`,
        sim: { type: "tips", items: ["st.map() needs lat/lon columns — pre-join a geography reference table","size= maps a numeric column to dot radius on the map","px.scatter_mapbox() gives interactive Mapbox maps with zoom/pan (needs Mapbox token)","px.choropleth() colours countries/regions by a metric — great for country-level sales","pydeck_chart for 3D bar maps, arc layers (flows) and hexagon heatmaps","Cache geographic data — lat/lon lookups don't change, so cache with ttl=86400 (1 day)"] },
        quiz: { q: "st.map() requires DataFrame columns named:", options: ["x and y","longitude and latitude (full names only)","lat and lon (or latitude/longitude)","geo_lat and geo_lon"], correct: 2, explanation: "st.map() accepts both lat/lon (short) and latitude/longitude (full). Any other column names are ignored — you'll see an empty map without an error if the columns are wrong." },
      },
    ],
  },

  {
    id: "data",
    label: "Data",
    icon: "🗄️",
    lessons: [
      {
        id: "dat-csv",
        title: "Reading CSV with Pandas",
        concept: "pd.read_csv() is the most common data loading function in Streamlit finance apps. Always wrap it in @st.cache_data to avoid reloading on every rerun. Specify dtypes= and parse_dates= explicitly — auto-detection is slow on large files and unreliable with mixed formats.",
        tip: "Use usecols=['col1','col2'] to load only the columns you need. On a 100-column, 500k-row file this reduces parse time by 80% and cuts memory usage significantly.",
        code: `import streamlit as st
import pandas as pd

@st.cache_data(ttl=3600)
def load_sales(path: str = "data/sales.csv") -> pd.DataFrame:
    df = pd.read_csv(
        path,
        usecols     = ["Date","Region","Category","Revenue","Units","CustomerID"],
        parse_dates = ["Date"],
        dtype       = {"Region":"category","Category":"category",
                       "Revenue":"float32","Units":"int32"},
        thousands   = ",",      # handle £1,234 formatted numbers
    )
    # Add derived columns once (not on every filter rerun)
    df["Year"]    = df["Date"].dt.year
    df["Quarter"] = "Q" + df["Date"].dt.quarter.astype(str)
    df["Month"]   = df["Date"].dt.to_period("M").astype(str)
    return df

df = load_sales()
st.write(f"Loaded {len(df):,} rows | {df['Date'].min():%b %Y} – {df['Date'].max():%b %Y}")`,
        sim: { type: "tips", items: ["usecols reduces memory — only load what you'll actually use","dtype={'col':'category'} for low-cardinality string columns saves ~8× RAM","parse_dates=['Date'] converts on load — faster than pd.to_datetime() afterwards","thousands=',' handles Excel-exported CSVs with comma-formatted numbers","Add derived columns (Year, Quarter) inside the cached function — done once, not every rerun","nrows=1000 for a quick preview during development; remove before deploying"] },
        quiz: { q: "What parameter limits which columns are loaded from a CSV?", options: ["select_cols","columns","usecols","keep_cols"], correct: 2, explanation: "usecols=['col1','col2'] tells pd.read_csv() to only parse and load those columns. All others are skipped at the C level — faster parse AND less memory." },
      },
      {
        id: "dat-filter",
        title: "Filtering DataFrames",
        concept: "Filter DataFrames with boolean indexing df[condition] or the .query() method for readable string expressions. Chain multiple conditions with & (and) and | (or) — always wrap conditions in parentheses. Never mutate the cached DataFrame — always create a filtered copy.",
        tip: ".query() is more readable for complex filters: df.query('Region in @regions and Revenue > @min_rev') uses @ to reference Python variables. Fast on large DataFrames as it uses numexpr internally.",
        code: `import streamlit as st
import pandas as pd

# Widget-driven filter parameters
regions  = st.multiselect("Region",   df["Region"].unique(), default=list(df["Region"].unique()))
year     = st.selectbox("Year",       sorted(df["Year"].unique(), reverse=True))
min_rev  = st.number_input("Min Revenue £", 0, 1_000_000, 0, step=10_000)

# Boolean indexing (explicit)
mask = (
    df["Region"].isin(regions) &
    (df["Year"] == year) &
    (df["Revenue"] >= min_rev)
)
filtered = df[mask].copy()   # .copy() prevents SettingWithCopyWarning

# Equivalent with .query() (readable)
# filtered = df.query("Region in @regions and Year == @year and Revenue >= @min_rev").copy()

st.write(f"{len(filtered):,} rows match · £{filtered['Revenue'].sum():,.0f} total")`,
        sim: { type: "tips", items: ["Always .copy() after filtering — modifying a slice raises SettingWithCopyWarning","df.isin(list) for multi-value filters — faster than multiple df[col]==val conditions",".query('@var') references a Python variable — keep variable names short and clear","For date filtering: df[df['Date'].between(start, end)] is cleaner than two conditions","df.notna() / df.isna() filters for missing value presence — always check before aggregating","st.stop() after st.warning() when filtered is empty — prevents downstream errors"] },
        quiz: { q: "Why do you call .copy() after filtering a DataFrame?", options: ["To reset the index","To prevent SettingWithCopyWarning when modifying the filtered result","To create a deep copy for caching","To avoid mutating the original file"], correct: 1, explanation: "A filtered slice df[mask] returns a view or copy depending on Pandas internals. Calling .copy() explicitly ensures you have a full independent DataFrame — safe to modify without affecting the cached original." },
      },
      {
        id: "dat-groupby",
        title: "Groupby & Aggregation",
        concept: "df.groupby() aggregates rows by one or more columns. Use .agg() with a dict for multiple aggregations in one pass — faster than chaining multiple groupby calls. Always .reset_index() after groupby to flatten the result into a regular DataFrame for display and charting.",
        tip: "Named aggregations (pd.NamedAgg) give clean column names without renaming after: df.groupby('Region').agg(Total=('Revenue','sum'), Orders=('OrderID','count'))",
        code: `import streamlit as st
import pandas as pd

# Single column groupby
by_region = (
    df.groupby("Region")
    .agg(
        Total_Revenue  = ("Revenue",    "sum"),
        Avg_Revenue    = ("Revenue",    "mean"),
        Order_Count    = ("OrderID",    "count"),
        Unique_Customers=("CustomerID","nunique"),
    )
    .reset_index()
    .sort_values("Total_Revenue", ascending=False)
)

# Multi-level groupby
by_region_quarter = (
    df.groupby(["Region","Quarter"])["Revenue"]
    .sum()
    .reset_index()
    .rename(columns={"Revenue":"Total Revenue £"})
)

st.dataframe(
    by_region.style.format({"Total_Revenue":"£{:,.0f}","Avg_Revenue":"£{:,.0f}"}),
    use_container_width=True, hide_index=True
)`,
        sim: { type: "code", preview: ["Region   Total Revenue  Avg Revenue  Orders  Customers","UK       £4,820,000    £3,906       1,234   387","US       £7,200,000    £4,211       1,710   524","EU       £3,100,000    £3,444         900   283","","[Sorted by Total Revenue descending]"] },
        quiz: { q: "What does .reset_index() do after a groupby().agg()?", options: ["Resets all column values to zero","Converts the groupby key(s) from index back to regular columns","Removes the index entirely","Sorts the DataFrame by index"], correct: 1, explanation: "groupby sets the groupby columns as the DataFrame index. reset_index() moves them back into regular columns — needed for clean display in st.dataframe() and for charting with Plotly." },
      },
      {
        id: "dat-merge",
        title: "Merging DataFrames",
        concept: "pd.merge() joins two DataFrames on key columns — equivalent to SQL JOINs. The how parameter sets the join type: 'left' keeps all left rows, 'inner' keeps only matches, 'outer' keeps all rows from both. Use suffixes=('_budget','_actual') when both DataFrames have the same column name.",
        tip: "Always check len() before and after a merge — unexpected row count changes signal key mismatches or Many:Many joins. Add validate='m:1' or '1:1' to make pd.merge() raise an error if the expectation is violated.",
        code: `import streamlit as st
import pandas as pd

# Left join: keep all orders, bring in customer info
orders_enriched = pd.merge(
    orders,
    customers[["CustomerID","Name","Country","Segment"]],
    on="CustomerID",
    how="left",
    validate="m:1",     # each order has at most one customer
)

# Budget vs Actual — join on multiple keys
budget_actual = pd.merge(
    budget_df.rename(columns={"Revenue":"Budget"}),
    actual_df.rename(columns={"Revenue":"Actual"}),
    on=["Year","Month","Department"],
    how="outer",
    suffixes=("_bud","_act"),   # if column names clash after merge
)
budget_actual["Variance"]   = budget_actual["Actual"]   - budget_actual["Budget"]
budget_actual["Variance %"] = budget_actual["Variance"] / budget_actual["Budget"]

st.write(f"Before merge: {len(orders):,} orders | After: {len(orders_enriched):,}")`,
        sim: { type: "tips", items: ["validate='m:1' raises ValueError if the right key isn't unique — catches bugs early","indicator=True adds a '_merge' column showing 'left_only','right_only','both' — useful for QA","Rename conflicting columns before merging (rather than relying on suffixes) — clearer output","For large DataFrames, merge on integer keys (IDs) not string columns — hash comparison is faster","pd.merge() on multiple keys: on=['Year','Month','Dept'] — must match in both DataFrames","After outer join, fillna(0) on numeric columns to replace NaN with meaningful zeros"] },
        quiz: { q: "pd.merge(left, right, how='left') keeps:", options: ["Only rows present in both DataFrames","All rows from left, matched rows from right (NaN for no match)","All rows from right","All rows from both DataFrames"], correct: 1, explanation: "A left join keeps every row from the left DataFrame. Where a match exists in right, the right columns are filled in. Where no match, right columns are NaN." },
      },
      {
        id: "dat-datetime",
        title: "Date & Time Handling",
        concept: "Pandas datetime operations underpin all financial time series work. Parse on load with parse_dates= or pd.to_datetime(). Extract components with .dt accessor: .dt.year, .dt.quarter, .dt.month. Filter with comparison operators or .between(). Resample with .resample() for period aggregation.",
        tip: "pd.to_period('Q') creates quarterly periods (2024Q1, 2024Q2) that sort and group correctly. Convert to string with .astype(str) for display; keep as Period for sorting.",
        code: `import streamlit as st
import pandas as pd

df["Date"] = pd.to_datetime(df["Date"])

# Extract components for grouping/filtering
df["Year"]         = df["Date"].dt.year
df["Quarter"]      = df["Date"].dt.to_period("Q").astype(str)   # "2024Q1"
df["Month"]        = df["Date"].dt.strftime("%b %Y")             # "Jan 2024"
df["Week"]         = df["Date"].dt.isocalendar().week.astype(int)
df["Is_Weekend"]   = df["Date"].dt.dayofweek >= 5

# Date range filter widget
min_d, max_d = df["Date"].min().date(), df["Date"].max().date()
start, end   = st.date_input("Date Range", [min_d, max_d],
                              min_value=min_d, max_value=max_d)
filtered = df[df["Date"].between(pd.Timestamp(start), pd.Timestamp(end))]

# Monthly aggregation with resample
monthly = df.set_index("Date")["Revenue"].resample("ME").sum().reset_index()`,
        sim: { type: "tips", items: ["Always parse dates on load — post-load pd.to_datetime() is slower on large files","df['Date'].dt.to_period('Q') creates sortable quarterly periods — use for groupby quarterly","pd.Timestamp(date_widget_value) converts st.date_input output to a proper Timestamp","resample('ME').sum() aggregates to month-end — 'QE' for quarter-end, 'YE' for year-end","df.sort_values('Date') before charting — unsorted dates produce non-sequential lines","strftime('%b %Y') gives readable month labels ('Jan 2024') for chart axes"] },
        quiz: { q: "df['Date'].dt.quarter returns:", options: ["Quarter label like 'Q1'","Integer 1–4 representing the quarter","The first date of the quarter","Number of days in the quarter"], correct: 1, explanation: ".dt.quarter returns integers 1, 2, 3, 4. To get 'Q1', 'Q2' etc., use 'Q' + df['Date'].dt.quarter.astype(str) or df['Date'].dt.to_period('Q').astype(str)." },
      },
      {
        id: "dat-yfinance",
        title: "yfinance — Financial Data",
        concept: "yfinance downloads historical OHLCV data and financial statements from Yahoo Finance. Use @st.cache_data with ttl=3600 to avoid rate limits. yf.download() returns a DataFrame with a DatetimeIndex. For multiple tickers, use group_by='ticker' to get a MultiIndex.",
        tip: "Yahoo Finance rate-limits aggressive requests. Add ttl=3600 minimum, and consider ttl=86400 for historical data that doesn't change intraday. For real-time prices, yf.Ticker(t).fast_info.last_price is the fastest endpoint.",
        code: `import streamlit as st
import yfinance as yf
import plotly.express as px

ticker = st.text_input("Ticker", "AAPL").upper()
period = st.select_slider("Period", ["1mo","3mo","6mo","1y","2y","5y"], value="1y")

@st.cache_data(ttl=3600)
def get_stock(t: str, p: str):
    df = yf.download(t, period=p, auto_adjust=True, progress=False)
    df.index.name = "Date"
    return df.reset_index()

@st.cache_data(ttl=86400)
def get_info(t: str) -> dict:
    info = yf.Ticker(t).info
    return {k: info.get(k) for k in ["longName","sector","marketCap","trailingPE","dividendYield"]}

df  = get_stock(ticker, period)
info = get_info(ticker)

if df.empty:
    st.error(f"No data for {ticker}"); st.stop()

col1, col2, col3 = st.columns(3)
col1.metric("Sector",    info.get("sector","N/A"))
col2.metric("Mkt Cap",   f"${info.get('marketCap',0)/1e9:.1f}B")
col3.metric("P/E",       f"{info.get('trailingPE',0):.1f}×")

fig = px.line(df, x="Date", y="Close", title=f"{ticker} — Closing Price")
fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0f1e")
st.plotly_chart(fig, use_container_width=True)`,
        sim: { type: "tips", items: ["auto_adjust=True adjusts for dividends and splits — use for price charts","progress=False silences the tqdm progress bar in the terminal","yf.download(['AAPL','MSFT'], period='1y') returns MultiIndex columns — use df['Close'] to get both","Ticker.financials returns the annual income statement as a DataFrame","Ticker.quarterly_cashflow for quarterly cash flow data","Ticker.recommendations for analyst ratings history"] },
        quiz: { q: "Why is ttl=3600 important for yfinance @st.cache_data?", options: ["It limits the file size of downloaded data","It prevents hitting Yahoo Finance rate limits by reusing cached data for 1 hour","It compresses the data after 1 hour","It refreshes the chart every hour automatically"], correct: 1, explanation: "Without caching, every rerun (every widget interaction) calls Yahoo Finance's API. Multiple users or rapid widget changes would hit rate limits and return errors. Caching reuses the downloaded data for 1 hour." },
      },
      {
        id: "dat-api",
        title: "API Calls with requests",
        concept: "The requests library fetches data from REST APIs. Always cache API responses with @st.cache_data(ttl=...). Store API keys in st.secrets — never hardcode them. Handle network errors with try/except and show friendly error messages with st.error().",
        tip: "Set timeout=10 on every requests.get() call. Without a timeout, a slow API can hang the entire Streamlit app indefinitely for that user session.",
        code: `import streamlit as st
import requests

@st.cache_data(ttl=300)          # refresh every 5 minutes
def get_exchange_rates(base: str = "GBP") -> dict:
    api_key = st.secrets["exchange"]["api_key"]
    try:
        r = requests.get(
            "https://api.exchangerate.host/latest",
            params={"base": base, "symbols": "USD,EUR,JPY,CHF"},
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10,
        )
        r.raise_for_status()    # raises HTTPError for 4xx/5xx
        return r.json()["rates"]
    except requests.Timeout:
        st.error("Exchange rate API timed out — using cached values.")
        return {}
    except requests.HTTPError as e:
        st.error(f"API error {e.response.status_code}: {e}")
        return {}

base   = st.selectbox("Base Currency", ["GBP","USD","EUR"])
rates  = get_exchange_rates(base)
for currency, rate in rates.items():
    st.metric(f"{base} → {currency}", f"{rate:.4f}")`,
        sim: { type: "tips", items: ["timeout=10 on every request — missing timeout can hang the app indefinitely","r.raise_for_status() converts 4xx/5xx HTTP errors to exceptions — always call it","st.secrets['section']['key'] accesses nested secrets.toml values","Cache with ttl matching the API's update frequency — daily data → ttl=86400","Use a retry strategy (requests.adapters.HTTPAdapter with Retry) for flaky APIs","st.spinner('Fetching rates...') around uncached API calls signals activity to the user"] },
        quiz: { q: "What does r.raise_for_status() do?", options: ["Raises a timeout error","Raises an HTTPError if the response code is 4xx or 5xx","Returns the HTTP status code","Logs the error to the terminal"], correct: 1, explanation: "raise_for_status() checks the HTTP status code and raises requests.HTTPError for any 4xx or 5xx response. Without it, a 404 or 500 silently returns an empty/error JSON that can be hard to debug." },
      },
      {
        id: "dat-excel",
        title: "Excel Upload & Processing",
        concept: "pd.read_excel() parses .xlsx and .xls files. Pass skiprows= to skip headers/logos, sheet_name= to target specific sheets and usecols to limit columns. Use pd.ExcelFile() to list available sheets before parsing. The openpyxl engine (default) is required — it's included in requirements.txt.",
        tip: "Finance Excel files often have merged header cells, units rows and formula cells. Inspect the raw upload with df.head(10) before processing — never assume the structure matches your template.",
        code: `import streamlit as st
import pandas as pd

uploaded = st.file_uploader("Upload P&L Template (.xlsx)", type=["xlsx","xls"])

if uploaded is None:
    st.info("Upload the Excel template to begin."); st.stop()

# Preview all sheets
xl = pd.ExcelFile(uploaded)
sheet = st.selectbox("Select sheet", xl.sheet_names)

# Parse with explicit settings
try:
    df = xl.parse(
        sheet_name = sheet,
        skiprows   = 3,        # skip logo + title rows
        usecols    = "B:H",    # columns B through H
        na_values  = ["-","N/A","n/a",""],
    )
    df.columns = df.columns.str.strip()    # remove whitespace from headers
    df = df.dropna(how="all")              # remove fully empty rows
except Exception as e:
    st.error(f"Could not parse sheet '{sheet}': {e}"); st.stop()

st.success(f"Parsed {len(df):,} rows × {len(df.columns)} columns")
st.dataframe(df.head(), use_container_width=True)`,
        sim: { type: "tips", items: ["pd.ExcelFile() reads sheet names without parsing data — fast for the sheet selector widget","skiprows=N skips the first N rows — useful for Excel files with logo/title rows","na_values=['-','N/A'] treats common finance placeholders as NaN","df.columns.str.strip() removes leading/trailing spaces from Excel header cells","openpyxl required for .xlsx — add to requirements.txt; xlrd for legacy .xls files","Validate required columns after parsing: missing = {'Revenue','Date'} - set(df.columns)"] },
        quiz: { q: "pd.ExcelFile(uploaded).sheet_names returns:", options: ["The first sheet's data","A list of all sheet names in the workbook","The active sheet name only","The number of sheets"], correct: 1, explanation: "pd.ExcelFile() opens the workbook without parsing any data. .sheet_names returns a list of all sheet tab names — use this to populate a selectbox before parsing the chosen sheet with .parse()." },
      },
      {
        id: "dat-validation",
        title: "Data Validation & Error Handling",
        concept: "Validate user-uploaded data before processing to surface helpful errors rather than cryptic stack traces. Check required columns, correct dtypes, value ranges and missing data. Use st.error for blockers, st.warning for non-fatal issues, and st.success when validation passes.",
        tip: "Call st.stop() after displaying a blocking error — it halts further script execution without raising an exception, giving a clean UX rather than a stack trace.",
        code: `import streamlit as st
import pandas as pd

REQUIRED_COLS = {"Date", "Revenue", "Category", "Region"}
NUMERIC_COLS  = ["Revenue"]

def validate(df: pd.DataFrame) -> list[str]:
    errors = []
    # Required columns
    missing = REQUIRED_COLS - set(df.columns)
    if missing:
        errors.append(f"Missing columns: {', '.join(sorted(missing))}")
        return errors          # skip further checks — columns don't exist
    # Numeric check
    for col in NUMERIC_COLS:
        if not pd.api.types.is_numeric_dtype(df[col]):
            errors.append(f"'{col}' must be numeric — contains text values")
    # Value checks
    if (df["Revenue"] < 0).any():
        errors.append(f"Negative Revenue: {(df['Revenue']<0).sum()} rows")
    if df["Revenue"].isna().mean() > 0.1:
        errors.append(f"Revenue is >10% null ({df['Revenue'].isna().mean():.0%})")
    return errors

errors = validate(df)
if errors:
    st.error("**Validation failed:**")
    for e in errors: st.write(f"  ✗ {e}")
    st.stop()
st.success(f"✅ {len(df):,} rows passed validation")`,
        sim: { type: "tips", items: ["Return early from validate() if required columns are missing — later checks will raise KeyError","st.stop() after st.error() — halts execution cleanly without a stack trace","Use st.warning() for non-blocking issues (e.g. 2% nulls) — processing continues","pd.api.types.is_numeric_dtype(col) is more reliable than df.dtypes checks","Log validation results: st.expander('Validation details') for power users","Show a sample of bad rows: st.dataframe(df[df['Revenue']<0].head(5))"] },
        quiz: { q: "What does st.stop() do when called after st.error()?", options: ["Raises a StopException in the browser","Halts script execution cleanly — nothing after it runs","Clears the error message","Refreshes the page"], correct: 1, explanation: "st.stop() raises StopException internally, which Streamlit catches and uses to stop script execution. The UI shows everything rendered before the stop — including the error message — with no stack trace." },
      },
      {
        id: "dat-export",
        title: "Exporting: CSV, Excel & PDF",
        concept: "st.download_button() creates a one-click file export. CSV export is simplest — df.to_csv(). Excel export requires writing to a BytesIO buffer. PDF requires ReportLab or similar. Always set the correct MIME type so the browser handles the download correctly.",
        tip: "For Excel with multiple sheets and formatting (borders, colours, bold headers), use xlsxwriter engine instead of openpyxl — it has a richer formatting API and writes faster.",
        code: `import streamlit as st
import pandas as pd
from io import BytesIO

# ── CSV (simplest) ────────────────────────────────
csv_bytes = filtered.to_csv(index=False).encode("utf-8")
st.download_button("⬇ Download CSV", csv_bytes, "data.csv", "text/csv")

# ── Excel with formatting ─────────────────────────
def to_excel(df: pd.DataFrame) -> bytes:
    buf = BytesIO()
    with pd.ExcelWriter(buf, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Data")
        wb  = writer.book
        ws  = writer.sheets["Data"]
        hdr = wb.add_format({"bold":True,"bg_color":"#1e3a5f","font_color":"white"})
        for col_num, val in enumerate(df.columns):
            ws.write(0, col_num, val, hdr)
        ws.set_column(0, len(df.columns)-1, 18)   # column width
    return buf.getvalue()

xlsx = to_excel(filtered)
XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
st.download_button("⬇ Download Excel", xlsx, "report.xlsx", XLSX_MIME)`,
        sim: { type: "tips", items: ["BytesIO() creates an in-memory file buffer — no temp files on disk","xlsxwriter engine for formatting; openpyxl engine for reading/modifying existing files","Multiple sheets: df1.to_excel(writer, sheet_name='Revenue'); df2.to_excel(writer, sheet_name='Costs')","PDF with ReportLab: canvas.Canvas(buf) → draw text/tables → canvas.save() → buf.getvalue()","File name with date: f'report_{pd.Timestamp.now():%Y-%m-%d}.xlsx' — avoids overwriting","MIME types: text/csv · application/vnd.openxmlformats-officedocument.spreadsheetml.sheet · application/pdf"] },
        quiz: { q: "BytesIO() is used in Excel export to:", options: ["Compress the Excel file","Create an in-memory file buffer instead of writing to disk","Encrypt the file","Convert bytes to a string"], correct: 1, explanation: "BytesIO() creates a file-like object in RAM. pd.ExcelWriter writes to it as if it were a file. .getvalue() then returns the bytes for st.download_button — no temp files written to disk." },
      },
    ],
  },

  {
    id: "deployment",
    label: "Deployment",
    icon: "🚀",
    lessons: [
      {
        id: "dep-requirements",
        title: "requirements.txt",
        concept: "requirements.txt lists all Python packages needed to run your app. Pin major versions for reproducibility but allow minor updates for security patches. Group packages by purpose with comments. Streamlit Cloud, Railway and Docker all read this file automatically.",
        tip: "Use pip freeze > requirements.txt only as a starting point — it includes every transitive dependency and becomes a maintenance burden. Manually build requirements.txt with only your direct dependencies.",
        code: `# requirements.txt — direct dependencies only

# Core
streamlit>=1.32,<2.0
python-dotenv>=1.0

# Data
pandas>=2.0
numpy>=1.26
openpyxl>=3.1          # Excel read
xlsxwriter>=3.1        # Excel write with formatting

# Charts
plotly>=5.18
altair>=5.2

# Finance data
yfinance>=0.2
requests>=2.31

# PDF export (optional)
reportlab>=4.1

# ──────────────────────────────
# Dev / CI only (don't install in production Docker image)
# ruff
# black
# pytest`,
        sim: { type: "tips", items: ["Never pin exact versions (==1.32.0) for all packages — security patches won't be applied","Use >= lower bound, < next major: streamlit>=1.32,<2.0 is safe and updateable","openpyxl for reading xlsx; xlsxwriter for writing with formatting — you often need both","Add packages.txt for system-level dependencies (e.g. fonts for PDF generation)","Test requirements locally: python -m pip install -r requirements.txt in a clean venv","Railway/Streamlit Cloud auto-installs from requirements.txt — no Dockerfile needed"] },
        quiz: { q: "Why avoid pinning all packages to exact versions (==)?", options: ["It makes the app start slower","Security patches in minor versions won't be applied automatically","Streamlit Cloud doesn't support == pinning","It causes import conflicts"], correct: 1, explanation: "Exact pinning (==1.32.0) means you receive no patch-level security fixes unless you manually update every version. Use >= and < major version bounds to get patches while staying compatible." },
      },
      {
        id: "dep-secrets",
        title: "st.secrets — Secure API Keys",
        concept: "st.secrets reads credentials from .streamlit/secrets.toml locally and from the Secrets configuration in Streamlit Cloud or environment variables on Railway. Never commit secrets.toml to Git — add it to .gitignore. Structure secrets in sections for clarity.",
        tip: "Use st.secrets.get('key', 'default') for optional secrets to avoid KeyError during local development when a secret isn't configured. Always test with a secrets.toml locally before deploying.",
        code: `# .streamlit/secrets.toml (LOCAL ONLY — add to .gitignore)
[api]
openai_key       = "sk-..."
exchange_api_key = "abc123"
alpha_vantage    = "xyz789"

[database]
host     = "db.company.com"
port     = 5432
user     = "finance_app"
password = "s3cr3t"
name     = "finance_prod"

[app]
debug_mode = false

# ── In Python ──────────────────────────────────────
import streamlit as st

# Access secrets
api_key  = st.secrets["api"]["openai_key"]
db_host  = st.secrets["database"]["host"]
debug    = st.secrets.get("app", {}).get("debug_mode", False)

# On Railway: set as environment variables, read via:
import os
api_key = os.environ.get("OPENAI_API_KEY") or st.secrets.get("api",{}).get("openai_key")`,
        sim: { type: "steps", items: ["Create .streamlit/secrets.toml with your credentials (TOML format)", "Add .streamlit/secrets.toml to .gitignore — never commit this file", "Streamlit Cloud: App → Settings → Secrets → paste your TOML content", "Railway: Variables tab → add key=value pairs (no TOML format needed)", "Access in Python: st.secrets['section']['key']", "Test: add a st.write(list(st.secrets.keys())) temporarily to verify secrets load"] },
        quiz: { q: "Where do you configure secrets when deploying to Streamlit Cloud?", options: ["In a .env file committed to GitHub","In secrets.toml committed to GitHub","In the App → Settings → Secrets UI on share.streamlit.io","In the requirements.txt file"], correct: 2, explanation: "Streamlit Cloud has a Secrets UI (App → Settings → Secrets) where you paste your TOML-formatted secrets. They're stored encrypted and injected into st.secrets at runtime — never in your GitHub repo." },
      },
      {
        id: "dep-streamlit-cloud",
        title: "Deploying to Streamlit Cloud",
        concept: "Streamlit Cloud hosts public apps free (3 apps on free tier). Connect your GitHub repo, select the branch and main file, add secrets, and deploy. Updates deploy automatically on every push to the connected branch. A running app URL is generated immediately.",
        tip: "Private repos require a connected GitHub account with appropriate repo access. Free tier apps sleep after inactivity — users see a 'Waking up' screen. Upgrade to a paid plan for always-on apps.",
        code: `# Deployment checklist for Streamlit Cloud

# 1. Ensure repo structure:
# ├── app.py              ← main file (or pages/ for multi-page)
# ├── requirements.txt    ← all dependencies
# ├── .streamlit/
# │   └── config.toml     ← theme (OK to commit, no secrets)
# └── data/               ← any static data files

# 2. Push to GitHub
git add app.py requirements.txt .streamlit/config.toml
git commit -m "ready for deployment"
git push origin main

# 3. Go to share.streamlit.io
#    → New app → GitHub → select repo/branch/file
#    → Advanced settings → add Python version (3.11 recommended)
#    → Deploy!

# 4. Add secrets: App menu (⋮) → Settings → Secrets → paste TOML

# 5. Custom domain (paid): Settings → Custom domain`,
        sim: { type: "steps", items: ["share.streamlit.io → Sign in with GitHub → New app", "Select repository, branch (main) and main file path (app.py)", "Expand Advanced settings → set Python version to 3.11", "Click Deploy — build logs show in real-time", "App menu (⋮) → Settings → Secrets → paste your secrets.toml content", "Share the generated URL: https://your-app.streamlit.app"] },
        quiz: { q: "Streamlit Cloud free tier apps do what after inactivity?", options: ["Delete themselves","Sleep — users see 'Waking up' until the app restarts","Stay always-on","Email you to restart them"], correct: 1, explanation: "Free tier apps sleep after inactivity to save resources. The next visitor sees a 'Waking up' screen while the app container starts (~20-30 seconds). Paid plans provide always-on instances." },
      },
      {
        id: "dep-railway",
        title: "Railway Deployment",
        concept: "Railway runs containerized apps with persistent secrets, custom domains, usage-based billing and GitHub auto-deploy. Streamlit apps need a Procfile or Dockerfile specifying the start command. The PORT environment variable must be used — Railway assigns a dynamic port.",
        tip: "Add --server.headless=true to the Streamlit start command on Railway — without it, the app tries to open a browser window and fails silently in a headless container.",
        code: `# Procfile (simplest — Railway detects automatically)
web: streamlit run app.py --server.port $PORT --server.address 0.0.0.0 --server.headless true

# Alternatively, Dockerfile for full control:
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
CMD streamlit run app.py \\
    --server.port=8501 \\
    --server.address=0.0.0.0 \\
    --server.headless=true

# .streamlit/config.toml (commit this — no secrets)
[server]
headless = true
enableCORS = false
enableXsrfProtection = false`,
        sim: { type: "steps", items: ["railway.app → New Project → Deploy from GitHub repo → select repo", "Railway auto-detects Procfile or Python project → builds automatically", "Variables tab → add your secrets as key=value env vars (OPENAI_API_KEY=sk-...)", "Settings tab → Networking → Generate Domain (or add custom domain)", "In app: read secrets via os.environ.get('KEY') or Railway sets them as st.secrets too", "Redeploys automatically on every push to your connected branch"] },
        quiz: { q: "In the Railway Procfile, $PORT is:", options: ["Always 8501","A fixed port you choose in Railway settings","A dynamic port assigned by Railway — must be read from the environment","The HTTPS port (443)"], correct: 2, explanation: "Railway assigns a dynamic PORT environment variable per deployment. Your Streamlit start command must use $PORT (--server.port $PORT) — hardcoding 8501 or another port will cause Railway's health check to fail." },
      },
      {
        id: "dep-docker",
        title: "Docker Containerisation",
        concept: "Docker packages your app with all dependencies into a portable image. A multi-stage build reduces final image size. Use .dockerignore to exclude unnecessary files. Mount secrets at runtime — never bake API keys into the image layer, as they become part of the image history.",
        tip: "Use python:3.11-slim not python:3.11 — the slim variant is ~180MB vs ~900MB. Add --no-cache-dir to pip install to avoid caching downloaded wheels inside the image layer.",
        code: `# Dockerfile (multi-stage for smaller image)
FROM python:3.11-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS final
COPY . .
EXPOSE 8501
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health
CMD ["streamlit","run","app.py",
     "--server.port=8501","--server.address=0.0.0.0","--server.headless=true"]

# .dockerignore
__pycache__/
.streamlit/secrets.toml
*.pyc
.env
.git/
tests/

# Build and run locally:
# docker build -t finance-app .
# docker run -p 8501:8501 \\
#   -v $(pwd)/.streamlit/secrets.toml:/app/.streamlit/secrets.toml \\
#   finance-app`,
        sim: { type: "steps", items: ["Create Dockerfile and .dockerignore in project root", "Build: docker build -t my-finance-app . (--no-cache on first troubleshoot)", "Run locally: docker run -p 8501:8501 -v ./secrets.toml:/app/.streamlit/secrets.toml my-app", "Push to registry: docker tag my-app registry.railway.app/xxx && docker push", "Verify: docker run shows no 'No module named' errors → requirements.txt is complete", "HEALTHCHECK line lets Railway/cloud platforms detect if the app is healthy"] },
        quiz: { q: "Why should API keys NOT be copied into the Docker image with COPY . .?", options: ["They slow down the build","They become part of the image layers and can be extracted even if deleted later","Docker doesn't support environment variables","It causes a build error"], correct: 1, explanation: "Docker image layers are immutable history. Even if you add a 'RUN rm secrets.toml' step, the key remains in the previous layer and can be extracted with docker history. Mount secrets at runtime or use environment variables." },
      },
      {
        id: "dep-components",
        title: "st.components.v1 — Custom HTML/JS",
        concept: "st.components.v1.html() renders arbitrary HTML and JavaScript in an iframe. Use it for D3.js charts, custom widgets, or embedding third-party tools. st.components.v1.iframe() loads an external URL. Custom bidirectional components (send values back to Python) require the streamlit-component-template.",
        tip: "The HTML runs in a sandboxed iframe — it can't access parent window variables or cookies. Communication from JS to Python uses window.parent.postMessage() and is handled by the Streamlit component protocol.",
        code: `import streamlit as st
import streamlit.components.v1 as components

# Inline HTML/JS — Chart.js donut chart
html_code = """
<canvas id="chart" width="300" height="300"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script>
new Chart(document.getElementById('chart'), {
  type: 'doughnut',
  data: {
    labels: ['Equity','Debt','Cash'],
    datasets: [{ data: [60, 30, 10],
      backgroundColor: ['#4299e1','#48bb78','#f6ad55'] }]
  },
  options: { plugins: { legend: { labels: { color: '#e2e8f0' } } } }
});
</script>
<style>body{background:#0a0f1e;margin:0}</style>
"""
components.html(html_code, height=320)

# External URL embed (Power BI, Grafana, etc.)
components.iframe("https://app.powerbi.com/view?r=...", height=600, scrolling=True)`,
        sim: { type: "tips", items: ["height= in components.html() must be set explicitly — the iframe doesn't auto-resize","The HTML runs isolated in an iframe — no access to st.session_state or Python variables","Pass Python data to JS by f-string interpolating values into the HTML: data: [{json.dumps(my_list)}]","scrolling=True on components.iframe() enables scroll within the iframe","For bidirectional components: use streamlit-component-template on GitHub as starting point","Prefer native Plotly/Altair over components for charts — components are harder to theme"] },
        quiz: { q: "st.components.v1.html() renders content in:", options: ["The main Streamlit canvas directly","A sandboxed iframe","A modal overlay","A new browser tab"], correct: 1, explanation: "components.html() renders in a sandboxed iframe — isolated from the parent page. This provides security but limits interaction with Streamlit's Python environment and prevents access to parent window variables." },
      },
      {
        id: "dep-auth",
        title: "Authentication Patterns",
        concept: "Streamlit has no built-in auth. Options: (1) Simple password gate with session_state — good for internal tools; (2) streamlit-authenticator library for username/password with bcrypt; (3) OAuth via Auth0, Google or Supabase for production SaaS. Always hash passwords — never store plaintext.",
        tip: "For finance tools with sensitive data, use a proper auth provider (Auth0 or Supabase) rather than a DIY password gate — it gives you audit logs, MFA support and password reset flows out of the box.",
        code: `import streamlit as st
import hashlib, hmac

# ── Simple password gate (internal tools) ─────────
def check_password(pwd: str) -> bool:
    stored_hash = st.secrets.get("auth", {}).get("password_hash", "")
    entered_hash = hashlib.sha256(pwd.encode()).hexdigest()
    return hmac.compare_digest(stored_hash, entered_hash)

if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    st.title("Finance Dashboard — Login")
    pwd = st.text_input("Password", type="password")
    if st.button("Login", type="primary"):
        if check_password(pwd):
            st.session_state.authenticated = True
            st.rerun()
        else:
            st.error("Incorrect password")
    st.stop()

# ── All content below only shows to authenticated users ──
st.title("Finance Dashboard")`,
        sim: { type: "tips", items: ["hmac.compare_digest() prevents timing attacks vs == comparison — always use it for password checks","Generate hash: python -c \"import hashlib; print(hashlib.sha256('yourpass'.encode()).hexdigest())\"","Store the hash in st.secrets['auth']['password_hash'] — never the plaintext password","st.stop() after the login block ensures nothing below renders for unauthenticated users","streamlit-authenticator library: pip install streamlit-authenticator — supports multiple users","For multi-user with roles: Supabase Auth + supabase-py gives you full auth in <50 lines"] },
        quiz: { q: "Why use hmac.compare_digest() instead of == for password comparison?", options: ["It's faster for long strings","It prevents timing attacks — == returns early on first mismatch, leaking timing info","It supports Unicode passwords","It auto-hashes the input"], correct: 1, explanation: "String == comparison short-circuits (returns False as soon as one character differs). An attacker can measure timing to guess characters. hmac.compare_digest() always takes the same time regardless of where the mismatch is." },
      },
      {
        id: "dep-performance",
        title: "Performance Optimisation",
        concept: "Streamlit reruns the entire script on every widget interaction. Performance comes from: (1) caching data loads and API calls with @st.cache_data, (2) minimising data transferred to the browser (aggregate before display), (3) using st.fragment for partial reruns (Streamlit 1.37+). Avoid calling measures inside loops without caching.",
        tip: "Profile slow apps with st.write(time.time() - start) markers around expensive blocks. The bottleneck is almost always an uncached data load or an unneeded chart re-render.",
        code: `import streamlit as st
import pandas as pd

# ❌ SLOW — reloads on every widget interaction
def bad():
    df = pd.read_csv("large_file.csv")   # 3 seconds every rerun
    return df

# ✅ FAST — cached after first load
@st.cache_data(ttl=3600, max_entries=5)
def load(path: str) -> pd.DataFrame:
    return pd.read_csv(path, usecols=["Date","Revenue","Region"])

# ✅ Partial rerun — only this section reruns when chart_type changes
@st.fragment
def chart_section(df: pd.DataFrame):
    chart_type = st.selectbox("Chart type", ["Line","Bar","Area"])
    if chart_type == "Line": st.line_chart(df)
    elif chart_type == "Bar": st.bar_chart(df)

df = load("data/sales.csv")            # from cache after first run
chart_section(df)                       # only this fragment reruns`,
        sim: { type: "tips", items: ["@st.cache_data is the single biggest performance win — use it everywhere for data loading","max_entries=N limits cache size — prevents memory growth when many unique args are used","Aggregate server-side: don't send 1M rows to the browser — send 12 monthly totals","st.fragment (1.37+): partial reruns avoid re-executing the full script for isolated sections","Avoid st.empty() loops with sleep — use proper background task patterns","Disable animated transitions: st.set_page_config(page_icon='📊') doesn't affect perf, but heavy CSS animations do"] },
        quiz: { q: "The main purpose of @st.cache_data is:", options: ["To save data to disk permanently","To cache function results in memory, returning them instantly on subsequent calls with same args","To share data between users","To compress DataFrames"], correct: 1, explanation: "@st.cache_data stores function return values in memory. Subsequent calls with the same arguments skip the function body and return the cached result immediately — critical for expensive CSV/API/DB operations." },
      },
      {
        id: "dep-cicd",
        title: "GitHub Actions CI/CD",
        concept: "GitHub Actions automates testing and quality checks on every push. For Streamlit apps: run ruff for linting, import checks and unit tests. Railway and Streamlit Cloud auto-deploy from GitHub on push — so your CI only needs to prevent broken code reaching main.",
        tip: "Add a simple import test: python -c 'import app' as part of CI. This catches missing imports, syntax errors and bad requirements.txt without needing a full test suite.",
        code: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }

      - name: Install dependencies
        run: pip install -r requirements.txt ruff pytest

      - name: Lint with ruff
        run: ruff check .

      - name: Import check
        run: python -c "import app"          # catches missing packages

      - name: Run tests (if any)
        run: pytest tests/ -v --tb=short
        if: hashFiles('tests/') != ''       # skip if no tests dir`,
        sim: { type: "steps", items: ["Create .github/workflows/ci.yml in your repo root", "On every push: GitHub runs the workflow — green tick = clean code", "ruff check . lints for errors, unused imports and style issues (faster than flake8)", "python -c 'import app' verifies all imports resolve — catches missing requirements.txt entries", "Railway auto-deploys after the CI succeeds (configure in Railway: 'Deploy on push to main')", "Add branch protection: require CI to pass before merging to main"] },
        quiz: { q: "The import check `python -c 'import app'` in CI catches:", options: ["Logic errors in calculations","Missing packages in requirements.txt and syntax errors","Performance regressions","Memory leaks"], correct: 1, explanation: "Importing the app module runs all top-level imports. If a package is used in app.py but missing from requirements.txt, this check raises ImportError in CI before the broken code reaches the deployed app." },
      },
      {
        id: "dep-database",
        title: "Streamlit + Database",
        concept: "For persistent storage, connect Streamlit to PostgreSQL (SQLAlchemy + psycopg2), SQLite (simple single-user cases) or Supabase (managed Postgres with REST API). Use @st.cache_resource for the connection engine — one engine shared across all reruns. Use @st.cache_data(ttl=60) for query results.",
        tip: "Use st.cache_resource for the SQLAlchemy engine (one shared connection pool) and st.cache_data for query DataFrames (per-user, expires). Mixing these up causes resource leaks or stale data.",
        code: `import streamlit as st
import sqlalchemy
import pandas as pd

# One connection pool shared across all reruns and users
@st.cache_resource
def get_engine():
    url = sqlalchemy.URL.create(
        "postgresql+psycopg2",
        username = st.secrets["db"]["user"],
        password = st.secrets["db"]["password"],
        host     = st.secrets["db"]["host"],
        port     = int(st.secrets["db"].get("port", 5432)),
        database = st.secrets["db"]["name"],
    )
    return sqlalchemy.create_engine(url, pool_size=5, max_overflow=10)

# Cache query results (60-second TTL)
@st.cache_data(ttl=60)
def query(sql: str) -> pd.DataFrame:
    with get_engine().connect() as conn:
        return pd.read_sql_query(sqlalchemy.text(sql), conn)

# Usage
df = query("SELECT date, region, SUM(revenue) as revenue FROM sales GROUP BY date, region ORDER BY date")
st.dataframe(df, use_container_width=True)`,
        sim: { type: "tips", items: ["@st.cache_resource for connection engines — creates ONE engine shared by all users and reruns","@st.cache_data(ttl=60) for query results — fresh data every 60 seconds, per-user caching","Use parameterised queries (sqlalchemy.text with :param) — never f-string SQL (SQL injection risk)","Supabase: pip install supabase → from supabase import create_client — REST + realtime","SQLite for local/single-user: engine = sqlalchemy.create_engine('sqlite:///data.db')","Pool size 5 handles ~5 concurrent users — increase for high-traffic public apps"] },
        quiz: { q: "Why use @st.cache_resource for a database engine vs @st.cache_data?", options: ["cache_resource is faster than cache_data","cache_resource creates one shared instance across all users/reruns — avoiding connection pool exhaustion","cache_data doesn't support SQLAlchemy objects","They are interchangeable"], correct: 1, explanation: "@st.cache_resource creates a single shared instance (like a connection pool). @st.cache_data creates per-call copies. Using cache_data for a DB engine would create a new connection pool on every query call, exhausting database connections." },
      },
    ],
  },
];

// ── Sim Widgets ───────────────────────────────────────────────────────────────

function TipsSim({ sim }: { sim: TipsSim }) {
  return (
    <ul className="space-y-2">
      {sim.items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
          <span className="text-green-400 mt-0.5 shrink-0">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StepsSim({ sim }: { sim: StepsSim }) {
  return (
    <ol className="space-y-2">
      {sim.items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
          <span className="shrink-0 w-6 h-6 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center">{i + 1}</span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function CodeSim({ sim }: { sim: CodeSim }) {
  return (
    <div className="bg-[#050810] border border-gray-700 rounded-xl p-4 font-mono text-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="text-gray-600 text-xs ml-2">Streamlit Preview</span>
      </div>
      {sim.preview.map((line, i) => (
        <p key={i} className={`leading-relaxed ${line.startsWith("──") || line.startsWith("┌") || line.startsWith("└") || line.startsWith("│") ? "text-gray-600" : "text-gray-300"}`}>{line || "\u00A0"}</p>
      ))}
    </div>
  );
}

function SimWidget({ sim }: { sim: Sim }) {
  if (sim.type === "tips")  return <TipsSim sim={sim} />;
  if (sim.type === "steps") return <StepsSim sim={sim} />;
  if (sim.type === "code")  return <CodeSim sim={sim} />;
  return null;
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

function QuizWidget({ quiz, onCorrect }: { quiz: Lesson["quiz"]; onCorrect: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function pick(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === quiz.correct) onCorrect();
  }

  return (
    <div className="bg-[#0d1426] border border-gray-700 rounded-2xl p-5">
      <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-3">Quick Check</p>
      <p className="text-sm text-white font-semibold mb-4">{quiz.q}</p>
      <div className="grid sm:grid-cols-2 gap-2 mb-4">
        {quiz.options.map((opt, i) => {
          let cls = "text-left text-sm px-4 py-3 rounded-xl border transition ";
          if (!answered) cls += "border-gray-700 text-gray-300 hover:border-red-500/50 hover:text-white cursor-pointer";
          else if (i === quiz.correct) cls += "border-green-500 bg-green-500/10 text-green-300";
          else if (i === selected)     cls += "border-red-500 bg-red-500/10 text-red-300";
          else                         cls += "border-gray-800 text-gray-600 opacity-50";
          return <button key={i} className={cls} onClick={() => pick(i)}>{opt}</button>;
        })}
      </div>
      {answered && (
        <div className={`text-xs rounded-xl px-4 py-3 border ${selected === quiz.correct ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
          {selected === quiz.correct ? "✓ Correct! " : "✗ Not quite. "}
          <span className="text-gray-300">{quiz.explanation}</span>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StreamlitClient() {
  const [moduleIdx, setModuleIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("st-completed");
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  function markComplete(id: string) {
    setCompleted(prev => {
      const next = new Set(prev).add(id);
      localStorage.setItem("st-completed", JSON.stringify([...next]));
      return next;
    });
  }

  function goLesson(mIdx: number, lIdx: number) {
    setModuleIdx(mIdx);
    setLessonIdx(lIdx);
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const mod    = MODULES[moduleIdx];
  const lesson = mod.lessons[lessonIdx];
  const totalDone    = completed.size;
  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0);

  function nextLesson() {
    if (lessonIdx < mod.lessons.length - 1) goLesson(moduleIdx, lessonIdx + 1);
    else if (moduleIdx < MODULES.length - 1) goLesson(moduleIdx + 1, 0);
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/learn" className="text-gray-500 hover:text-gray-300 text-sm transition">← Learn</Link>
          <span className="text-gray-700">/</span>
          <span className="text-red-400 text-sm font-semibold">Streamlit</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Learn Streamlit</h1>
            <p className="text-gray-400 text-sm mt-1">40 lessons · Basics · Charts · Data · Deployment</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">{totalDone}/{totalLessons} completed</div>
            <div className="w-40 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(totalDone/totalLessons)*100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6 flex-wrap">
          {MODULES.map((m, i) => {
            const done = m.lessons.filter(l => completed.has(l.id)).length;
            return (
              <button key={m.id} onClick={() => { setModuleIdx(i); setLessonIdx(0); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${moduleIdx === i ? "bg-red-500/10 border-red-500/40 text-red-300" : "bg-white/[0.03] border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"}`}>
                <span>{m.icon}</span>{m.label}
                <span className="text-xs opacity-60">{done}/{m.lessons.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-1">
          {mod.lessons.map((l, i) => (
            <button key={l.id} onClick={() => goLesson(moduleIdx, i)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${lessonIdx === i ? "bg-red-500/10 border border-red-500/20 text-red-200" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <span className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center shrink-0 ${completed.has(l.id) ? "bg-green-500 border-green-400 text-white" : lessonIdx === i ? "border-red-400 text-red-400" : "border-gray-600 text-gray-600"}`}>
                {completed.has(l.id) ? "✓" : i + 1}
              </span>
              <span className="leading-tight">{l.title}</span>
            </button>
          ))}
        </aside>

        <div ref={contentRef} className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-600 font-mono">Lesson {lessonIdx + 1} of {mod.lessons.length}</span>
            {completed.has(lesson.id) && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Completed</span>}
          </div>
          <h2 className="text-2xl font-extrabold text-white">{lesson.title}</h2>

          <div className="bg-white/[0.03] border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-300 leading-relaxed">{lesson.concept}</p>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">💡</span>
              <p className="text-red-200/80 text-sm">{lesson.tip}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Code Example</span>
              <span className="text-xs text-gray-600 bg-white/5 border border-gray-700 px-2 py-0.5 rounded-md font-mono">Python · Streamlit</span>
            </div>
            <pre className="bg-[#050810] border border-gray-800 rounded-2xl p-5 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">{lesson.code}</pre>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Simulator</p>
            <div className="bg-white/[0.02] border border-gray-800 rounded-2xl p-5">
              <SimWidget sim={lesson.sim} />
            </div>
          </div>

          <QuizWidget quiz={lesson.quiz} onCorrect={() => markComplete(lesson.id)} />

          <div className="flex items-center justify-between pt-2">
            <button onClick={() => lessonIdx > 0 ? goLesson(moduleIdx, lessonIdx - 1) : moduleIdx > 0 && goLesson(moduleIdx - 1, MODULES[moduleIdx - 1].lessons.length - 1)}
              disabled={moduleIdx === 0 && lessonIdx === 0}
              className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white hover:border-gray-500 transition disabled:opacity-30">
              ← Previous
            </button>
            <button onClick={nextLesson}
              disabled={moduleIdx === MODULES.length - 1 && lessonIdx === mod.lessons.length - 1}
              className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold hover:bg-red-500/20 transition disabled:opacity-30">
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
