"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TableSim {
  type: "table";
  before: { headers: string[]; rows: string[][] };
  after:  { headers: string[]; rows: string[][] };
  note: string;
}
interface DaxSim {
  type: "dax";
  scenario: string;
  lines: { label: string; value: string; highlight?: boolean }[];
}
interface TipsSim {
  type: "tips";
  items: string[];
}
interface StepsSim {
  type: "steps";
  items: string[];
}
type Sim = TableSim | DaxSim | TipsSim | StepsSim;

interface Lesson {
  id: string;
  title: string;
  concept: string;
  tip: string;
  code: string;
  codeLabel: string;
  sim: Sim;
  quiz: { q: string; options: [string,string,string,string]; correct: 0|1|2|3; explanation: string };
}
interface Module { id: string; label: string; icon: string; lessons: Lesson[] }

// ── Lesson Data ───────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  {
    id: "power-query",
    label: "Power Query",
    icon: "🔄",
    lessons: [
      {
        id: "pq-remove-columns",
        title: "Remove & Select Columns",
        concept: "Removing unwanted columns is the first step in any Power Query pipeline. Table.RemoveColumns drops named columns; Table.SelectColumns keeps only what you specify and discards the rest. Both return a new table — Power Query transforms are non-destructive. Dropping columns early reduces memory usage and improves refresh performance.",
        tip: "Use Table.SelectColumns over Table.RemoveColumns when the output schema is fixed — it protects against new source columns silently appearing in your model.",
        code: `let
    Source = Excel.CurrentWorkbook(){[Name="Sales"]}[Content],

    // Keep only the columns you need
    Clean = Table.SelectColumns(Source, {
        "Date", "Region", "Product", "Revenue"
    }),

    // Or remove specific unwanted columns
    // Clean = Table.RemoveColumns(Source, {"Notes","InternalID","Legacy"})
in
    Clean`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Date","Region","Product","Revenue","Notes","InternalID","Legacy"], rows: [["2024-01-15","UK","Widget A","4500","n/a","XZ001","Y"],["2024-01-22","US","Widget B","7200","","XZ002","N"]] },
          after:  { headers: ["Date","Region","Product","Revenue"], rows: [["2024-01-15","UK","Widget A","4500"],["2024-01-22","US","Widget B","7200"]] },
          note: "Notes, InternalID and Legacy dropped — model is cleaner and faster.",
        },
        quiz: { q: "Which function keeps ONLY the columns you list, discarding all others?", options: ["Table.RemoveColumns","Table.SelectColumns","Table.KeepColumns","Table.ChooseColumns"], correct: 1, explanation: "Table.SelectColumns keeps only the listed columns. Table.RemoveColumns drops only the listed ones (all others are kept)." },
      },
      {
        id: "pq-filter-rows",
        title: "Filter Rows",
        concept: "Table.SelectRows filters rows using a condition function. The each shorthand passes each row as a record. Filtering early in the query reduces the rows processed by all subsequent steps — always push filters as close to the source as possible for best performance.",
        tip: "Combine multiple conditions with and / or inside the condition function. Avoid filtering on calculated columns — filter on raw source columns to allow query folding.",
        code: `let
    Source = ...,

    // Filter: Sales > 0 AND Region is UK or US
    Filtered = Table.SelectRows(Source, each
        [Revenue] > 0 and
        ([Region] = "UK" or [Region] = "US") and
        [Date] >= #date(2024, 1, 1)
    )
in
    Filtered`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Date","Region","Revenue"], rows: [["2024-01-05","UK","4500"],["2023-12-10","EU","2100"],["2024-02-01","US","0"],["2024-03-15","US","8800"]] },
          after:  { headers: ["Date","Region","Revenue"], rows: [["2024-01-05","UK","4500"],["2024-03-15","US","8800"]] },
          note: "EU row excluded by Region filter; US row with Revenue=0 excluded; pre-2024 EU row excluded by date.",
        },
        quiz: { q: "What is the M keyword used to reference each row inside Table.SelectRows?", options: ["row =>","each","this","self"], correct: 1, explanation: "The each keyword is shorthand for _ => _ and passes each row as the implicit parameter inside the condition function." },
      },
      {
        id: "pq-data-types",
        title: "Change Data Types",
        concept: "Power Query auto-detects types on first load but often gets dates and decimals wrong — especially from CSV sources. Incorrect types cause downstream DAX errors and incorrect aggregations. Always set types explicitly with Table.TransformColumnTypes after loading.",
        tip: "Set types AFTER all column renames so you're referencing final column names. Type Date (not DateTime) when you only need the date portion — it saves memory.",
        code: `let
    Source = Csv.Document(File.Contents("sales.csv")),

    // Always rename before typing
    Renamed = Table.RenameColumns(Source, {{"Column1","Date"},{"Column2","Revenue"}}),

    // Set types explicitly — never rely on auto-detect
    Typed = Table.TransformColumnTypes(Renamed, {
        {"Date",    type date},
        {"Revenue", type number},
        {"Units",   Int64.Type},
        {"Region",  type text},
        {"IsActive",type logical}
    })
in
    Typed`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Date","Revenue","Units","IsActive"], rows: [["2024-01-15 (text)","4500 (text)","12 (text)","1 (text)"],["2024-02-20 (text)","7200 (text)","18 (text)","0 (text)"]] },
          after:  { headers: ["Date","Revenue","Units","IsActive"], rows: [["15/01/2024 (date)","4,500 (number)","12 (int)","true (logical)"],["20/02/2024 (date)","7,200 (number)","18 (int)","false (logical)"]] },
          note: "Correct types allow SUM(Revenue), date filters and logical conditions to work in DAX.",
        },
        quiz: { q: "What M type should you use for a column that only contains dates (no time)?", options: ["type datetime","type date","DateTime.Type","type timestamp"], correct: 1, explanation: "type date stores only the date portion. DateTime includes a time component which wastes memory and complicates date table joins." },
      },
      {
        id: "pq-rename-reorder",
        title: "Rename & Reorder Columns",
        concept: "Clean column names matter: they appear in report field lists, tooltips and measure references. Remove underscores, technical prefixes and abbreviations. Table.RenameColumns takes pairs of {old, new}. Table.ReorderColumns sets the visual order in the query editor.",
        tip: "Standardise naming conventions: Title Case for dimension attributes (Customer Name), ALLCAPS for system IDs, and £ suffix for monetary values so users can distinguish them at a glance.",
        code: `let
    Source = ...,

    Renamed = Table.RenameColumns(Source, {
        {"cust_id",      "Customer ID"},
        {"tx_dt",        "Transaction Date"},
        {"amt_gbp",      "Amount £"},
        {"prod_cat",     "Product Category"},
        {"rgn_code",     "Region"}
    }),

    Reordered = Table.ReorderColumns(Renamed, {
        "Transaction Date", "Customer ID", "Region",
        "Product Category", "Amount £"
    })
in
    Reordered`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["cust_id","tx_dt","amt_gbp","prod_cat","rgn_code"], rows: [["C001","2024-01-15","4500","SaaS","UK"],["C002","2024-01-22","7200","Hardware","US"]] },
          after:  { headers: ["Transaction Date","Customer ID","Region","Product Category","Amount £"], rows: [["2024-01-15","C001","UK","SaaS","4500"],["2024-01-22","C002","US","Hardware","7200"]] },
          note: "Finance users see clean labels in field lists and auto-complete — no translation needed.",
        },
        quiz: { q: "Table.RenameColumns takes a list of what?", options: ["Single strings","Pairs of {old, new}","A record","A function"], correct: 1, explanation: "Table.RenameColumns(table, {{\"OldName\", \"NewName\"},...}) takes a list of two-element lists — each inner list is {original name, new name}." },
      },
      {
        id: "pq-merge-queries",
        title: "Merge Queries (JOIN)",
        concept: "Table.NestedJoin performs a SQL-style JOIN between two Power Query tables. You specify the join columns and JoinKind (LeftOuter, Inner, FullOuter, LeftAnti etc.). The result has a new column containing the matched rows as a nested table — you then expand it to get the columns you want.",
        tip: "Always filter both tables before merging — joins on large unfiltered tables won't fold to the source database and will be slow. For lookup joins (Many:1), prefer RELATED in DAX over merging in Power Query.",
        code: `let
    Orders = ...,
    Customers = ...,

    // Left join: keep all Orders, add Customer info
    Merged = Table.NestedJoin(
        Orders,    {"CustomerID"},
        Customers, {"ID"},
        "CustData",
        JoinKind.LeftOuter
    ),

    // Expand the nested table to get columns
    Expanded = Table.ExpandTableColumn(
        Merged, "CustData",
        {"Name", "Country", "Segment"}
    )
in
    Expanded`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["OrderID","CustomerID","Revenue"], rows: [["O001","C001","4500"],["O002","C002","7200"],["O003","C999","1100"]] },
          after:  { headers: ["OrderID","CustomerID","Revenue","Name","Country","Segment"], rows: [["O001","C001","4500","Acme Ltd","UK","Enterprise"],["O002","C002","7200","Globex","US","SMB"],["O003","C999","1100","null","null","null"]] },
          note: "O003 has no matching customer (LeftOuter keeps it with nulls). Inner join would have dropped it.",
        },
        quiz: { q: "After Table.NestedJoin, what must you do to see the joined columns?", options: ["Use Table.Join","Call Table.ExpandTableColumn","Use RELATED in DAX","Merge manually"], correct: 1, explanation: "NestedJoin adds a nested table column. You must call Table.ExpandTableColumn to flatten it and bring the joined columns into your query." },
      },
      {
        id: "pq-append-queries",
        title: "Append Queries (UNION)",
        concept: "Table.Combine stacks two or more tables vertically — equivalent to SQL UNION ALL. Column matching is by name, not position, so column order doesn't need to match between tables. Columns missing in one table are filled with null. Use this to combine monthly exports, regional files or historical + current data.",
        tip: "Set up a folder query (Folder.Files) and combine all files dynamically — then you never need to manually append new monthly files again.",
        code: `let
    // Combine monthly sales files from a folder
    FolderFiles = Folder.Files("C:\\Sales Data\\"),

    // Filter to .xlsx only
    XlsxOnly = Table.SelectRows(FolderFiles, each [Extension] = ".xlsx"),

    // Parse and stack all files
    Combined = Table.Combine(
        Table.TransformColumns(XlsxOnly, {
            {"Content", each Table.PromoteHeaders(
                Excel.Workbook(_){0}[Data]
            )}
        })[Content]
    )
in
    Combined`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Source","Date","Revenue"], rows: [["Jan.xlsx","Jan-24","120k"],["Feb.xlsx","Feb-24","135k"],["Mar.xlsx","Mar-24","140k"]] },
          after:  { headers: ["Date","Revenue"], rows: [["Jan-24","120k"],["Feb-24","135k"],["Mar-24","140k"]] },
          note: "Three separate files stacked into one table automatically — add a new monthly file to the folder and refresh picks it up.",
        },
        quiz: { q: "Table.Combine matches columns between tables by:", options: ["Column position","Column name","Column index","Data type"], correct: 1, explanation: "Table.Combine matches by column name. Mismatched names produce extra null-filled columns — always standardise column names before appending." },
      },
      {
        id: "pq-group-by",
        title: "Group By (Aggregate)",
        concept: "Table.Group aggregates rows into summary results — equivalent to SQL GROUP BY. You define the grouping columns and a list of aggregation operations {name, function, type}. Use List.Sum, List.Average, Table.RowCount or any custom M expression.",
        tip: "For complex aggregations (e.g. distinct counts, conditional sums), use the each syntax with a custom function inside Table.Group. This gives you the full power of M on the grouped sub-tables.",
        code: `let
    Source = ...,

    Grouped = Table.Group(Source,
        // Group by columns
        {"Region", "Product Category"},
        // Aggregations: {name, function, type}
        {
            {"Total Revenue",  each List.Sum([Revenue]),      type number},
            {"Order Count",    each Table.RowCount(_),        Int64.Type},
            {"Avg Order Value",each List.Average([Revenue]),  type number},
            {"Max Revenue",    each List.Max([Revenue]),      type number}
        }
    )
in
    Grouped`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Region","Product Category","Revenue"], rows: [["UK","SaaS","4500"],["UK","SaaS","3200"],["UK","Hardware","8100"],["US","SaaS","9200"]] },
          after:  { headers: ["Region","Product Category","Total Revenue","Order Count","Avg Order Value"], rows: [["UK","SaaS","7,700","2","3,850"],["UK","Hardware","8,100","1","8,100"],["US","SaaS","9,200","1","9,200"]] },
          note: "Detail rows collapsed to one summary row per Region + Category combination.",
        },
        quiz: { q: "In Table.Group, the _ parameter inside the aggregation function refers to:", options: ["The source table","The grouped sub-table for that group","The current row","The column being aggregated"], correct: 1, explanation: "_ is the sub-table containing only the rows belonging to that group. Table.RowCount(_) counts the rows in the group; List.Sum([Revenue]) sums the Revenue column of that sub-table." },
      },
      {
        id: "pq-custom-column",
        title: "Add Custom Column",
        concept: "Table.AddColumn creates a new column with a value derived from other columns using an M expression. Use it for calculated margins, IF conditions, date extractions and string transformations. The expression runs row-by-row. Avoid complex logic here that could be a DAX measure — measures are recalculated in filter context; custom columns are static.",
        tip: "Use try...otherwise to handle errors gracefully: each try [Revenue]/[Units] otherwise 0 prevents a division-by-zero from crashing the entire query.",
        code: `let
    Source = ...,

    // Calculated margin %
    WithMargin = Table.AddColumn(Source, "Gross Margin %",
        each if [Revenue] = 0 then null
             else ([Revenue] - [COGS]) / [Revenue] * 100,
        type number),

    // Quarter derived from date
    WithQuarter = Table.AddColumn(WithMargin, "Quarter",
        each "Q" & Text.From(Date.QuarterOfYear([Date])) &
             " " & Text.From(Date.Year([Date])),
        type text),

    // Safe division with error handling
    WithAOV = Table.AddColumn(WithQuarter, "Avg Order Value",
        each try [Revenue] / [Units] otherwise 0,
        type number)
in
    WithAOV`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Date","Revenue","COGS","Units"], rows: [["2024-01-15","10000","6000","5"],["2024-04-20","8000","5500","0"]] },
          after:  { headers: ["Date","Revenue","COGS","Units","Gross Margin %","Quarter","Avg Order Value"], rows: [["2024-01-15","10000","6000","5","40.0","Q1 2024","2,000"],["2024-04-20","8000","5500","0","31.25","Q2 2024","0 (error handled)"]] },
          note: "Margin %, Quarter label and safe Avg Order Value all derived from existing columns.",
        },
        quiz: { q: "What M pattern safely handles division-by-zero in a custom column?", options: ["if [Units]>0 then ... else 0","try [Rev]/[Units] otherwise 0","iferror([Rev]/[Units],0)","IFERROR([Rev]/[Units],0)"], correct: 1, explanation: "M uses try...otherwise for error handling. IFERROR is a DAX function, not M. The if [Units]>0 pattern also works but try...otherwise handles all error types." },
      },
      {
        id: "pq-unpivot",
        title: "Unpivot Columns",
        concept: "Unpivot converts wide format (months as columns) to long format (one row per month). This is essential for time intelligence in Power BI — your date table needs one date per row to match. Table.UnpivotOtherColumns is the safer version: it keeps ID columns and unpivots everything else.",
        tip: "Source files from Excel often have months as column headers. Always unpivot them in Power Query rather than reshaping in DAX — it keeps the model clean and fast.",
        code: `let
    Source = ...,
    // Wide format: Product | Jan | Feb | Mar | Apr...

    // Unpivot all month columns (keep Product)
    Unpivoted = Table.UnpivotOtherColumns(
        Source,
        {"Product", "Region"},  // columns to KEEP
        "Month",                 // new attribute column name
        "Revenue"                // new value column name
    ),

    // Parse month text to a proper date
    WithDate = Table.AddColumn(Unpivoted, "Date",
        each Date.FromText("1 " & [Month] & " 2024"),
        type date)
in
    WithDate`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Product","Region","Jan","Feb","Mar"], rows: [["Widget A","UK","4500","4800","5100"],["Widget B","US","7200","6900","7800"]] },
          after:  { headers: ["Product","Region","Month","Revenue","Date"], rows: [["Widget A","UK","Jan","4500","01/01/2024"],["Widget A","UK","Feb","4800","01/02/2024"],["Widget A","UK","Mar","5100","01/03/2024"],["Widget B","US","Jan","7200","01/01/2024"]] },
          note: "Wide → long format enables proper date table JOIN and time intelligence DAX functions.",
        },
        quiz: { q: "Table.UnpivotOtherColumns requires you to specify:", options: ["The columns TO unpivot","The columns TO KEEP (identity columns)","The target date format","The aggregation method"], correct: 1, explanation: "UnpivotOtherColumns keeps the columns you list and unpivots everything else. This is safer than Table.Unpivot which requires you to explicitly list all columns to unpivot." },
      },
      {
        id: "pq-replace-fill",
        title: "Replace Values & Fill Down",
        concept: "Table.ReplaceValue substitutes specific values (including nulls) throughout a column. Table.FillDown propagates the last non-null value downward — critical for source data with merged cells. Table.ReplaceErrorValues catches step errors before they cascade. Always clean data before loading to the model.",
        tip: "Chain these steps in order: first fill down, then replace nulls, then handle errors. Reversing the order can cause null replacements to overwrite filled values.",
        code: `let
    Source = ...,

    // Fill merged-cell Region values downward
    FilledDown = Table.FillDown(Source, {"Region", "Category"}),

    // Replace null in Category with "Uncategorised"
    Replaced = Table.ReplaceValue(FilledDown,
        null, "Uncategorised",
        Replacer.ReplaceValue, {"Category"}),

    // Replace error values in Revenue with 0
    ErrorsCleaned = Table.ReplaceErrorValues(Replaced, {
        {"Revenue", 0},
        {"Units",   0}
    }),

    // Standardise text values
    Standardised = Table.ReplaceValue(ErrorsCleaned,
        "n/a", null,
        Replacer.ReplaceValue, {"Notes"})
in
    Standardised`,
        codeLabel: "Power Query M",
        sim: {
          type: "table",
          before: { headers: ["Region","Category","Revenue","Notes"], rows: [["UK","SaaS","4500","n/a"],["","null","ERROR","client visit"],["","Hardware","8100","n/a"]] },
          after:  { headers: ["Region","Category","Revenue","Notes"], rows: [["UK","SaaS","4500","null"],["UK","Uncategorised","0","client visit"],["UK","Hardware","8100","null"]] },
          note: "Region filled down, null Category replaced, error Revenue set to 0, 'n/a' Notes nulled.",
        },
        quiz: { q: "Table.FillDown propagates values in which direction?", options: ["Upward to fill from below","Downward from the last non-null value","Left to right across columns","It averages surrounding values"], correct: 1, explanation: "Table.FillDown copies the last non-null value in a column downward. Use Table.FillUp for the reverse. This mirrors the behaviour of Excel's merged cells when source data is exported." },
      },
    ],
  },

  {
    id: "modeling",
    label: "Modelling",
    icon: "🧮",
    lessons: [
      {
        id: "mod-star-schema",
        title: "Star Schema vs Snowflake",
        concept: "A Star Schema has one central fact table connected directly to flat dimension tables. This is the Power BI optimal pattern — it minimises relationship hops and makes DAX faster. A Snowflake schema normalises dimensions into sub-dimensions (e.g. Product → Category → Department), adding join complexity and slowing DAX context transitions.",
        tip: "Denormalise your dimensions in Power Query — merge category/subcategory into the product table before loading. The storage overhead is minimal; the performance gain is significant.",
        code: `-- Ideal Star Schema for a sales model:

-- FACT TABLE (large, many rows)
FactSales: DateKey | ProductKey | CustomerKey | RegionKey | Revenue | Units

-- DIMENSION TABLES (small, one row per entity)
DimDate:     DateKey | Date | Year | Quarter | Month | WeekDay
DimProduct:  ProductKey | Name | Category | SubCategory | Brand
DimCustomer: CustomerKey | Name | Segment | Country | Industry
DimRegion:   RegionKey | Country | Region | Territory

-- All dimensions connect DIRECTLY to FactSales
-- No dimension-to-dimension relationships
-- No chained lookups`,
        codeLabel: "Model Design",
        sim: { type: "tips", items: ["Keep fact table thin: only keys + numeric measures","Flatten all category hierarchies into one dimension table","Avoid many-to-many relationships — create a bridge table","One Date table, connected to every date key in every fact table","Mark your Date table: Table Tools → Mark as date table"] },
        quiz: { q: "Why does Power BI prefer a Star Schema over Snowflake?", options: ["It uses less disk space","Fewer relationship hops means faster DAX filter propagation","It's easier to create in the UI","Snowflake schemas aren't supported"], correct: 1, explanation: "Each relationship hop in a filter requires a context transition. Star schemas have only one hop (Fact → Dimension), while Snowflake chains multiple hops, making each DAX calculation slower." },
      },
      {
        id: "mod-relationships",
        title: "Creating Relationships",
        concept: "Relationships link tables via key columns. Cardinality: Many:1 is standard (many fact rows : one dimension row) and is the recommended type. One:One for extended dimension tables. Avoid Many:Many without a bridge table. Cross-filter direction: Single (dimension filters fact) is faster and safer than Bidirectional.",
        tip: "Enable Bidirectional cross-filtering only when you have a specific reporting need — it creates ambiguous filter paths, slows DAX and can produce wrong results with multiple fact tables.",
        code: `-- Relationships to create in Model View (drag and drop):

-- FactSales[DateKey]     → DimDate[DateKey]        (Many:1, Single)
-- FactSales[ProductKey]  → DimProduct[ProductKey]   (Many:1, Single)
-- FactSales[CustomerKey] → DimCustomer[CustomerKey] (Many:1, Single)
-- FactSales[RegionKey]   → DimRegion[RegionKey]     (Many:1, Single)

-- Inactive relationship example (multiple date roles):
-- FactSales[ShipDateKey] → DimDate[DateKey]         (Many:1, inactive)
-- Use USERELATIONSHIP() in DAX to activate per measure

-- Check in Model view: no circular paths, no Many:Many without bridge`,
        codeLabel: "Model Design",
        sim: { type: "steps", items: ["Open Model view (diagram icon in left panel)","Drag DateKey from FactSales onto DateKey in DimDate — relationship created","Click the relationship line → verify: Cardinality = Many to one (*:1), Cross filter = Single","Repeat for all dimension keys","Check for ambiguous paths: if two routes exist from Fact to a Dimension, one must be inactive"] },
        quiz: { q: "What cardinality should most fact-to-dimension relationships have?", options: ["One to one (1:1)","Many to many (*:*)","Many to one (*:1)","One to many (1:*)"], correct: 2, explanation: "Many to one (*:1) means many fact rows map to one dimension row (e.g. many sales transactions for one product). This is the standard star schema pattern." },
      },
      {
        id: "mod-col-vs-measure",
        title: "Calculated Columns vs Measures",
        concept: "Calculated Columns are evaluated row-by-row when data loads and are stored in memory — they increase model size. Measures are calculated on-the-fly when a visual renders, in the current filter context — they don't increase model size. Use Measures for anything aggregated; Calculated Columns only for row-level attributes used in slicers or as dimension values.",
        tip: "A rule of thumb: if the calculation produces a category or label (High/Medium/Low), use a Calculated Column. If it produces a number shown in a visual value, use a Measure.",
        code: `// ✅ Calculated Column — row-level classification for slicing
Margin Band =
    IF([Gross Margin %] >= 30, "High",
    IF([Gross Margin %] >= 15, "Medium", "Low"))

// ✅ Measure — aggregated value, recalculated per filter context
Total Revenue = SUM(FactSales[Revenue])

Gross Margin % =
    DIVIDE(
        SUM(FactSales[Revenue]) - SUM(FactSales[COGS]),
        SUM(FactSales[Revenue])
    )

// ❌ Don't do this: Calculated Column for an aggregation
// Revenue Total = SUM(FactSales[Revenue])  ← always returns grand total, ignores filters`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "FactSales has 1M rows. User filters to UK, Q1 2024.", lines: [{ label: "Calc Column: Margin Band (pre-computed)", value: "UK rows: 'High', 'Medium'... (static, stored in RAM)" },{ label: "Measure: Total Revenue", value: "£2.4M (recalculated for UK, Q1 2024 filter context)", highlight: true },{ label: "Measure: Gross Margin %", value: "38.5% (recalculated for UK, Q1 2024 filter context)", highlight: true }] },
        quiz: { q: "Which should you use to show total revenue in a chart visual?", options: ["Calculated Column: Revenue Total = SUM(FactSales[Revenue])","Measure: Total Revenue = SUM(FactSales[Revenue])","Either — they produce the same result","Implicit measure (drag Revenue column to Values)"], correct: 1, explanation: "Measures respect the visual's filter context. A Calculated Column SUM always returns the grand total regardless of slicers. Explicit measures also enable referencing from other measures." },
      },
      {
        id: "mod-basic-dax",
        title: "Basic DAX: SUM, COUNT, AVERAGE",
        concept: "The core DAX aggregation functions mirror SQL aggregates. Always write explicit measures (named in the measure pane) rather than relying on implicit aggregations dragged from field lists — explicit measures are reusable, can be referenced by other measures, and show correct labels in tooltips.",
        tip: "DISTINCTCOUNT is the most useful 'hidden' aggregation — use it for unique customer counts, SKU counts and period counts. COUNTROWS(table) is faster than COUNT(column) for row counts.",
        code: `// All measures go in a dedicated Measures table (create an empty table)

Total Revenue      = SUM(FactSales[Revenue])
Total COGS         = SUM(FactSales[COGS])
Total Units        = SUM(FactSales[Units])

Order Count        = COUNTROWS(FactSales)
Distinct Customers = DISTINCTCOUNT(FactSales[CustomerID])
Distinct SKUs      = DISTINCTCOUNT(FactSales[ProductID])

Avg Order Value    = AVERAGE(FactSales[Revenue])
// or: = DIVIDE([Total Revenue], [Order Count])

Max Single Order   = MAX(FactSales[Revenue])
Min Single Order   = MIN(FactSales[Revenue])`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "Dashboard filtered to UK, Q1 2024 (1,234 rows).", lines: [{ label: "Total Revenue",      value: "£4,820,000" },{ label: "Total Units",        value: "9,450" },{ label: "Order Count",        value: "1,234 rows" },{ label: "Distinct Customers", value: "387 unique", highlight: true },{ label: "Avg Order Value",   value: "£3,906",      highlight: true }] },
        quiz: { q: "Which DAX function counts rows in a table (ignoring nulls in a specific column)?", options: ["COUNT(FactSales[Revenue])","COUNTA(FactSales[Revenue])","COUNTROWS(FactSales)","COUNTBLANK(FactSales[Revenue])"], correct: 2, explanation: "COUNTROWS counts all rows in the table regardless of column values. COUNT(column) counts only non-blank values in that column. For row counts, COUNTROWS is more explicit and faster." },
      },
      {
        id: "mod-calculate",
        title: "CALCULATE — The Most Important DAX Function",
        concept: "CALCULATE evaluates an expression in a modified filter context. It can ADD new filters, REMOVE existing filters (with ALL), or OVERRIDE existing filters. Nearly every advanced DAX measure uses CALCULATE. It's how you compute things like 'sales for a fixed period', 'sales excluding a slicer', or '% of total'.",
        tip: "CALCULATE processes its filter arguments before passing them to the expression. Multiple filter arguments are ANDed together. Use KEEPFILTERS() when you want to intersect rather than override a filter.",
        code: `// Add a new filter (UK sales only, regardless of Region slicer)
UK Revenue = CALCULATE([Total Revenue], DimRegion[Country] = "UK")

// Remove all filters from Product (% of total products)
All Products Revenue = CALCULATE([Total Revenue], ALL(DimProduct))

Category % of Total =
    DIVIDE([Total Revenue],
           CALCULATE([Total Revenue], ALL(DimProduct[Category])))

// Override the year to always show last year's value
LY Revenue = CALCULATE([Total Revenue],
    SAMEPERIODLASTYEAR(DimDate[Date]))

// Multiple filters (ANDed)
UK SaaS Revenue = CALCULATE([Total Revenue],
    DimRegion[Country] = "UK",
    DimProduct[Category] = "SaaS")`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "Slicer: Region = 'UK'. Category slicer: 'SaaS'.", lines: [{ label: "[Total Revenue] (respects both slicers)", value: "£1,200,000" },{ label: "[UK Revenue] (forces UK, ignores Region slicer override)", value: "£1,200,000 ← same here, but fixed" },{ label: "[All Products Revenue] (removes Category filter)", value: "£4,820,000", highlight: true },{ label: "[Category % of Total]", value: "24.9% (SaaS / All)", highlight: true }] },
        quiz: { q: "CALCULATE with ALL(DimProduct) as a filter argument does what?", options: ["Sums all products","Removes the DimProduct table from the filter context","Adds a DimProduct filter","Counts all products"], correct: 1, explanation: "ALL(table or column) removes all filters on that table/column from the filter context before evaluating the expression. This is how you compute % of total and other 'ignore this slicer' metrics." },
      },
      {
        id: "mod-time-intelligence",
        title: "Time Intelligence: YTD, LY, DATEADD",
        concept: "Time Intelligence functions compute values relative to date ranges. They require a properly marked Date table (no gaps, one row per day, marked via Table Tools → Mark as date table). TOTALYTD accumulates from year start. SAMEPERIODLASTYEAR shifts the context back exactly one year. DATEADD lets you shift by any number of days/months/quarters/years.",
        tip: "Your Date table must cover the entire range of dates in your fact table plus any future dates needed for forecasts. A gap in the Date table breaks TOTALYTD silently.",
        code: `// Year-to-date revenue (resets on Jan 1 each year)
Revenue YTD = TOTALYTD([Total Revenue], DimDate[Date])

// Same period last year
Revenue LY  = CALCULATE([Total Revenue],
              SAMEPERIODLASTYEAR(DimDate[Date]))

// Year-on-year growth %
YoY Growth % =
VAR Current = [Total Revenue]
VAR LastYear = [Revenue LY]
RETURN DIVIDE(Current - LastYear, LastYear)

// Prior month (DATEADD is more flexible than SAMEPERIODLASTYEAR)
Revenue PM = CALCULATE([Total Revenue],
             DATEADD(DimDate[Date], -1, MONTH))

// Rolling 12-month total
Revenue R12M = CALCULATE([Total Revenue],
               DATESINPERIOD(DimDate[Date], LASTDATE(DimDate[Date]), -12, MONTH))`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "Matrix: rows = Month (Jan–Jun 2024). Slicer: Year = 2024.", lines: [{ label: "Revenue (Jan 2024)",     value: "£480,000" },{ label: "Revenue YTD (Jun)",  value: "£3,120,000 (Jan–Jun sum)", highlight: true },{ label: "Revenue LY (Jun 23)", value: "£2,900,000" },{ label: "YoY Growth %",        value: "+7.6%",                    highlight: true },{ label: "Revenue R12M",       value: "£5,840,000 (Jul 23–Jun 24)" }] },
        quiz: { q: "For Time Intelligence functions to work, your Date table must be:", options: ["Connected with a bidirectional relationship","Marked as a date table with no date gaps","Sorted by Year descending","Named exactly 'DimDate'"], correct: 1, explanation: "The Date table must be marked via Table Tools → Mark as date table AND have continuous dates with no gaps. The name can be anything. Relationship direction does not need to be bidirectional." },
      },
      {
        id: "mod-related",
        title: "RELATED & RELATEDTABLE",
        concept: "RELATED retrieves a single value from a related table, navigating from the Many side to the 1 side of a relationship. RELATEDTABLE returns a table of rows from the 1 side to the Many side. Both are used in Calculated Columns (they need row context) — use LOOKUPVALUE as an alternative when there's no direct relationship.",
        tip: "In measures, use CALCULATE with filter arguments instead of RELATED — RELATED needs row context which measures don't have unless inside an iterator like SUMX.",
        code: `// In FactSales (Many side): bring in Category from DimProduct (1 side)
Product Category = RELATED(DimProduct[Category])
Product Brand    = RELATED(DimProduct[Brand])
Region Name      = RELATED(DimRegion[RegionName])

// In DimProduct (1 side): aggregate fact rows for this product
Product Revenue   = SUMX(RELATEDTABLE(FactSales), [Revenue])
Product Orders    = COUNTROWS(RELATEDTABLE(FactSales))
Product Customers = DISTINCTCOUNT(RELATEDTABLE(FactSales)[CustomerID])

// LOOKUPVALUE — works without a direct relationship
Budget Region = LOOKUPVALUE(
    BudgetTable[Region],
    BudgetTable[RegionCode], FactSales[RegionCode]
)`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "FactSales has OrderID = O001, ProductKey = P005. DimProduct row P005: Name='Widget A', Category='SaaS'.", lines: [{ label: "RELATED(DimProduct[Category]) on row O001", value: "'SaaS' ← fetched from DimProduct via relationship", highlight: true },{ label: "RELATEDTABLE(FactSales) on DimProduct row P005", value: "Returns all FactSales rows where ProductKey = P005", highlight: true },{ label: "Product Revenue in DimProduct", value: "SUMX of that sub-table = £48,200" }] },
        quiz: { q: "RELATED navigates from which side of a relationship?", options: ["From the 1 side to the Many side","From the Many side to the 1 side","Either direction","It requires a bidirectional relationship"], correct: 1, explanation: "RELATED navigates from the Many side (fact table) to the 1 side (dimension table). To go the other direction (1 → Many), use RELATEDTABLE which returns all matching rows." },
      },
      {
        id: "mod-variables",
        title: "Variables in DAX (VAR…RETURN)",
        concept: "Variables store intermediate results inside a DAX expression. They make formulas readable, avoid repeating expensive sub-expressions, and simplify debugging. A variable is evaluated once in the filter context at the point it's declared — not when it's used in RETURN. This is important for time intelligence variables.",
        tip: "Debug by temporarily using RETURN varName to inspect intermediate values in a card visual. Restore the full RETURN after debugging.",
        code: `// ❌ Without VAR — repeated expression, hard to read
Old YoY % =
    DIVIDE(
        SUM(FactSales[Revenue]) -
            CALCULATE(SUM(FactSales[Revenue]), SAMEPERIODLASTYEAR(DimDate[Date])),
        CALCULATE(SUM(FactSales[Revenue]), SAMEPERIODLASTYEAR(DimDate[Date]))
    )

// ✅ With VAR — clean, each value computed once
YoY Growth % =
VAR CurrentRevenue  = [Total Revenue]
VAR LastYearRevenue = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(DimDate[Date]))
VAR Variance        = CurrentRevenue - LastYearRevenue
RETURN
    DIVIDE(Variance, LastYearRevenue)`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "Month context = Jun 2024. Evaluating YoY Growth %.", lines: [{ label: "VAR CurrentRevenue",  value: "£480,000 (Jun 2024 filter context)" },{ label: "VAR LastYearRevenue", value: "£420,000 (SAMEPERIODLASTYEAR applied at declaration)", highlight: true },{ label: "VAR Variance",        value: "£60,000" },{ label: "RETURN DIVIDE(...)",  value: "+14.3%",                                          highlight: true }] },
        quiz: { q: "When is a DAX variable evaluated?", options: ["Each time it's referenced in RETURN","Once, when the RETURN statement is reached","Once, at the point of declaration in the filter context","Only if RETURN references it"], correct: 2, explanation: "Variables are evaluated once at the point of declaration in the current filter context. This is especially important for time intelligence: CALCULATE inside VAR captures the shifted context at declaration time." },
      },
      {
        id: "mod-all-allexcept",
        title: "ALL & ALLEXCEPT",
        concept: "ALL removes all filters from a table or column. ALLEXCEPT removes all filters EXCEPT the specified columns. Both are used inside CALCULATE. They are essential for computing proportions (% of total), benchmarks (vs. all-time average) and metrics that should be immune to certain slicers.",
        tip: "ALLSELECTED is a safer alternative to ALL when you want to respect user-visible filters (from slicers) but remove internal visual filters. Use it for % of slicer selection metrics.",
        code: `// % of total revenue across all regions
Region % of Total =
    DIVIDE([Total Revenue],
           CALCULATE([Total Revenue], ALL(DimRegion)))

// % of total within the current category (keep Category, remove rest)
Category Share % =
    DIVIDE([Total Revenue],
           CALCULATE([Total Revenue], ALLEXCEPT(DimProduct, DimProduct[Category])))

// % of user's current slicer selection (not grand total)
% of Selected =
    DIVIDE([Total Revenue],
           CALCULATE([Total Revenue], ALLSELECTED(DimProduct[Category])))

// Running total (remove date filter, keep everything up to current date)
Running Total =
    CALCULATE([Total Revenue],
              ALL(DimDate),
              DimDate[Date] <= MAX(DimDate[Date]))`,
        codeLabel: "DAX",
        sim: { type: "dax", scenario: "Matrix: rows = Region (UK, US, EU). Category slicer = 'SaaS'.", lines: [{ label: "Total Revenue [UK]",          value: "£1,200,000" },{ label: "ALL(DimRegion) total",        value: "£4,820,000 (all regions, still SaaS slicer)", highlight: true },{ label: "Region % of Total [UK]",    value: "24.9%" },{ label: "ALLEXCEPT product/category", value: "Removes brand/segment filters but keeps Category", highlight: true }] },
        quiz: { q: "You want a measure that shows % of total, but still respects the user's date slicer. Which function removes ONLY the Region filter?", options: ["ALL(FactSales)","ALLEXCEPT(DimRegion, DimDate[Date])","CALCULATE([Rev], ALL(DimRegion))","REMOVEFILTER(DimRegion)"], correct: 2, explanation: "CALCULATE([Rev], ALL(DimRegion)) removes all filters from DimRegion while leaving DimDate and all other filters intact. REMOVEFILTER is an alias for ALL when used inside CALCULATE." },
      },
      {
        id: "mod-context",
        title: "Row Context vs Filter Context",
        concept: "Filter Context is created by slicers, visual axes, page filters and CALCULATE. It determines which rows of data are visible when a measure evaluates. Row Context is created by calculated columns and iterator functions (SUMX, FILTER, MAXX) — it processes one row at a time. Understanding the difference is the foundation of mastering DAX.",
        tip: "Context transition: when you reference a measure inside a calculated column or iterator, DAX automatically converts the current row context into an equivalent filter context. This is powerful but expensive — avoid calling measures inside SUMX iterators over millions of rows.",
        code: `// FILTER CONTEXT — created by slicers and visual headers
// A card showing "Total Revenue" when Region slicer = UK:
Total Revenue = SUM(FactSales[Revenue])
// → Only sums rows where Region = UK (from filter context)

// ROW CONTEXT — inside a calculated column, one row at a time
// In FactSales: [Gross Margin] calculated column
Gross Margin = FactSales[Revenue] - FactSales[COGS]
// → [Revenue] and [COGS] refer to the CURRENT ROW's values

// ITERATOR — creates row context inside a measure
Revenue After Tax = SUMX(
    FactSales,                              // iterate each row
    FactSales[Revenue] * (1 - FactSales[TaxRate])  // row-level calc
)
// → Row context: [Revenue] and [TaxRate] are current row values
// → Filter context: only rows visible per current slicer`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Filter context: set by the report page (slicers, axes, page/visual filters)","Row context: set by iterators (SUMX, FILTER) or calculated columns","CALCULATE converts row context → filter context (context transition)","Measure inside SUMX triggers a context transition per row — can be slow at scale","Test filter context: use a card visual, apply a slicer, watch the measure change"] },
        quiz: { q: "SUMX(FactSales, FactSales[Revenue] * FactSales[TaxRate]) operates in what context for the multiplication?", options: ["Filter context only","Row context for each FactSales row","No context — it uses global values","Page-level context"], correct: 1, explanation: "SUMX is an iterator — it creates a row context for each row in FactSales. [Revenue] and [TaxRate] inside the expression refer to the current row's values, then SUMX aggregates the per-row results." },
      },
    ],
  },

  {
    id: "visuals",
    label: "Visuals",
    icon: "📊",
    lessons: [
      {
        id: "vis-bar-chart",
        title: "Bar & Column Charts",
        concept: "Column charts (vertical) compare values across categories. Bar charts (horizontal) are better when labels are long. Both are the most readable comparison chart type. Sort by value descending unless temporal or alphabetical order matters. Limit to 7–10 bars for readability — use a Top N filter for the rest.",
        tip: "Use a clustered bar only for 2–3 series. Beyond that, use small multiples or separate charts. Stacked bars hide individual values — use them only for part-to-whole relationships with 2–3 segments.",
        code: `// Top 10 products by revenue — measure for sorting
Top 10 Revenue =
VAR Ranked = RANKX(ALL(DimProduct[Name]), [Total Revenue],, DESC, Dense)
RETURN IF(Ranked <= 10, [Total Revenue])

// Dynamic Top N with parameter
Top N Revenue =
VAR N = SELECTEDVALUE('Top N'[Value], 10)
VAR Ranked = RANKX(ALL(DimProduct[Name]), [Total Revenue],, DESC, Dense)
RETURN IF(Ranked <= N, [Total Revenue])`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Sort descending by value (right-click axis → Sort by → [Measure] descending)","Use consistent colour per category across ALL visuals on the report","Add data labels only when there are ≤ 6 bars — crowded labels are worse than none","Remove axis titles if the chart title makes them redundant","Use 'Show items with no data' only when zero is meaningful in context","Never use 3D effects — they distort the length comparison"] },
        quiz: { q: "When should you choose a Bar chart (horizontal) over a Column chart (vertical)?", options: ["When you have time series data","When category labels are long and would overlap vertically","When you have more than 3 series","When showing proportions"], correct: 1, explanation: "Bar charts (horizontal) give category labels more space. Column charts work when labels are short. Long category names on column charts require angled labels which reduce readability." },
      },
      {
        id: "vis-line-chart",
        title: "Line Charts — Trends Over Time",
        concept: "Line charts show how a value changes over a continuous axis — almost always time. The slope of the line encodes the rate of change. Use markers only for sparse data (< 10 points). Multiple lines should differ by colour AND line style (dashes) — never rely on colour alone for accessibility.",
        tip: "Add a forecast shaded area with a dotted line for projected periods. Use a constant line (Analytics pane → Constant Line) to show targets, budget or prior year averages for instant comparison.",
        code: `// Measures for a dual-line revenue vs target chart
Revenue Actual = [Total Revenue]

Revenue Budget =
    CALCULATE([Budget Revenue], ALLSELECTED(DimDate[Month]))

Revenue LY =
    CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(DimDate[Date]))

// Analytics panel → Trend Line: adds statistical trend
// Analytics panel → Forecast: auto-projects using exponential smoothing`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Time always on X-axis — never use a category axis for a line chart","Start Y-axis at zero for absolute values (revenue, cost) — never truncate","Truncated Y-axis is acceptable only for relative changes (%, growth rate)","Add a legend label directly on the last data point (reduces need for legend box)","Use a secondary Y-axis only when scales differ by 10× or more","Smooth lines hide volatility — use straight lines for financial data"] },
        quiz: { q: "A line chart Y-axis should start at zero when displaying:", options: ["Year-on-year growth rates (%)","Absolute values like revenue or headcount","Index values relative to a base period","Temperature changes"], correct: 1, explanation: "Absolute values (revenue, costs, headcount) must start at zero — truncating the Y-axis exaggerates small differences. Relative measures (%, index, change) can use a truncated axis since zero has no meaning." },
      },
      {
        id: "vis-matrix",
        title: "Matrix Visual — Cross-Tab Reporting",
        concept: "The Matrix is Power BI's PivotTable. Define rows (hierarchy), columns (categories) and values (measures). Use row/column subtotals for hierarchical groupings. Conditional formatting transforms a raw number grid into a pattern-recognition tool. Stepped layout groups indent — ideal for P&L or budget vs actual reports.",
        tip: "Combine a Matrix with bookmarks to let users switch between 'Summary View' and 'Detail View' — show only top-level rows in summary, all rows in detail. Much cleaner than one overwhelming table.",
        code: `// P&L matrix structure
// Rows:    DimAccount[Section] (Revenue/COGS/Gross Profit...)
//          DimAccount[Category] (e.g. Product Revenue / Service Revenue)
// Columns: DimDate[Year], DimDate[Quarter]
// Values:  [Total Revenue], [Budget Revenue], [Variance £], [Variance %]

// Conditional format Variance % (background colour rules):
// < -5%   → Red   (#ff4d4d)
// -5%–0%  → Amber (#ff9f00)
// 0%–5%   → Light green (#b7eb8f)
// > 5%    → Green (#52c41a)`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Enable 'Stepped layout' for P&L hierarchies — indents sub-rows clearly","Turn off row subtotals for leaf-level rows to reduce clutter","Use 'Show on rows' for values when you have many measures and few date columns","Conditional format values (not headers) — highlight insights, not decoration","Freeze column headers: Format → Grid → Word wrap → Off for clean reading","Export to Excel: right-click → Export data — users love this for ad-hoc analysis"] },
        quiz: { q: "In a Matrix visual, 'Stepped layout' is used for:", options: ["Adding colour steps to values","Indenting hierarchical row levels","Stepping through filter selections","Adding step lines to bar charts"], correct: 1, explanation: "Stepped layout indents child rows under their parent, making P&L hierarchies and category/subcategory groupings visually clear without needing merged cell tricks." },
      },
      {
        id: "vis-cards",
        title: "Card & KPI Visuals",
        concept: "Cards display a single measure prominently. Use them for headline KPIs at the top of every report page. KPI visuals add a target comparison and trend indicator. New Card visual (2024) supports multiple values and reference labels. Arrange 3–4 metrics in st.columns to create an executive summary row.",
        tip: "Format large numbers for cards: £4.8M not £4,820,000. Use a display unit measure: = DIVIDE([Total Revenue], 1000000) & \" M\" — but then lose numeric formatting. Better: set the Card's Display units to 'Millions' in the Format pane.",
        code: `// KPI header measures (for card visuals)
Revenue KPI      = [Total Revenue]
Revenue vs Budget % =
    DIVIDE([Total Revenue] - [Budget Revenue], [Budget Revenue])
Revenue vs LY %  = [YoY Growth %]
Gross Margin     = DIVIDE([Total Revenue] - [Total COGS], [Total Revenue])

// Dynamic title for context
Report Subtitle  =
    "Period: " & FORMAT(MIN(DimDate[Date]), "MMM YYYY") &
    " — "       & FORMAT(MAX(DimDate[Date]), "MMM YYYY")`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Lead every report page with 3–5 KPI cards in a horizontal row","Format with £/% sign in the measure or via Format pane — never show raw numbers","Use conditional formatting on card background for instant RAG status","KPI visual: set 'Direction' correctly — higher is not always better (e.g. costs)","New Card (2024): add 'Reference label' to show comparison value below the main KPI","Group cards visually with a rectangle shape behind them — subtle section separator"] },
        quiz: { q: "For a 'Costs' KPI card, if costs are BELOW budget (a good thing), the 'Direction' setting should be:", options: ["High is good","Low is good","Neutral","It doesn't matter for costs"], correct: 1, explanation: "Setting Direction = 'Low is good' inverts the colour coding so that costs below target show green (positive) and costs above target show red (negative). This matches business intuition." },
      },
      {
        id: "vis-slicers",
        title: "Slicer Design",
        concept: "Slicers let users filter the entire report page (or synced pages). Choose the right slicer type: List (clear for ≤8 options), Dropdown (saves space for long lists), Between (for date or numeric ranges), Tile (for visual category buttons). Position slicers consistently across all pages — users expect filters in the same location.",
        tip: "Use slicer sync (View → Sync Slicers) to apply date and region slicers across all pages automatically. Add a 'Clear all filters' button using a Bookmark that has no selections applied.",
        code: `// Sync slicers across pages:
// View → Sync Slicers panel
// Select each slicer → check all pages where it should apply

// Date slicer: use DimDate[Date] with "Between" style
// Show: Relative date slicer for "Last 30 days", "Last 3 months" etc.

// Multi-select default: hold Ctrl to select multiple (enabled by default)
// Single-select: Format → Slicer settings → Selection → Single select

// Slicer search (for long lists):
// Format → Slicer header → Search → On`,
        codeLabel: "Power BI UI",
        sim: { type: "tips", items: ["Place date slicer top-right on every page — finance users always filter by period first","Use 'Dropdown' style for region/product slicers to save canvas space","Add a 'Clear filters' bookmark button — finance users regularly need a reset","Disable multi-select on critical slicers to prevent accidental double-selections","Title slicers clearly: 'Filter by Region' not just 'Region'","Group slicers with a background rectangle to signal 'these are filters'"] },
        quiz: { q: "To apply a Date slicer selection to all pages of a report, use:", options: ["Copy and paste the slicer to each page","View → Sync Slicers → check all pages","Format → Apply to all pages","Edit interactions → Broadcast to pages"], correct: 1, explanation: "Sync Slicers (View menu) lets you specify which pages each slicer applies to without duplicating it. Changes propagate to all checked pages automatically." },
      },
      {
        id: "vis-conditional-formatting",
        title: "Conditional Formatting",
        concept: "Conditional formatting applies background colour, font colour, data bars or icons to table/matrix values based on rules or a colour scale. It enables instant pattern recognition in grids of numbers. Use it on Variance % columns for instant RAG (Red/Amber/Green) status. Less is more — format only 1–2 columns, not the entire matrix.",
        tip: "Format by field value using a measure that returns a hex colour string. This gives you full control: = IF([Variance%]>0, \"#52c41a\", \"#ff4d4d\"). Apply this measure as the background colour source.",
        code: `// Dynamic colour measure (returns hex colour string)
Variance Colour =
VAR Pct = [Variance %]
RETURN
    SWITCH(TRUE(),
        Pct >= 0.05,  "#52c41a",  // >5% → green
        Pct >= 0,     "#b7eb8f",  // 0–5% → light green
        Pct >= -0.05, "#ff9f00",  // -5%–0% → amber
                      "#ff4d4d"   // < -5% → red
    )

// Apply: Format visual → Cell elements → Background colour
// → Format style = Field value → Based on field = [Variance Colour]`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Use a 3-colour scale (red/white/green) for KPI grids — the default diverging scale is intuitive","Apply data bars to the largest absolute values column — Revenue, not tiny %","Icons (traffic lights, arrows) work for 3-state status — don't use them for continuous values","Avoid formatting headers — it looks unprofessional and wastes visual weight","Test conditional formatting in dark mode — some pale colours disappear on dark backgrounds","Format the measure label column in a matrix differently to the value columns"] },
        quiz: { q: "Which conditional formatting approach gives you the most colour control?", options: ["Gradient colour scale","Rules-based formatting","Format by field value (measure returning hex colour)","Icon sets"], correct: 2, explanation: "Formatting by field value uses a DAX measure that returns a hex colour string. You have unlimited control over the exact colours and conditions — more flexible than the rules UI." },
      },
      {
        id: "vis-drill",
        title: "Drill-through & Drill-down",
        concept: "Drill-down navigates within a hierarchy on the same visual (Year → Quarter → Month → Day). Enable with the fork arrow icon in the visual header. Drill-through jumps to a detail report page, pre-filtered to the item clicked — set it up by dragging fields into the 'Drill through' well on the destination page.",
        tip: "Drill-through is more user-friendly than drill-down for financial reporting — executives click a region and see the full regional P&L, not just a deeper chart level. Add a 'Back' button to every drill-through page.",
        code: `// Drill-through setup (no DAX needed):
// 1. Create a new page named "Customer Detail"
// 2. On that page: Visualizations → Drill through → drag [CustomerID]
// 3. Add visuals showing customer-level data
// 4. Insert → Buttons → Back (auto-wired to return)

// Drill-down hierarchy: add multiple fields to the axis well
// Year > Quarter > Month > Week > Day
// Enable drill: visual header → fork arrows icon

// Pass drill-through filter to a measure:
Selected Customer =
    SELECTEDVALUE(DimCustomer[Name], "All Customers")`,
        codeLabel: "Power BI UI",
        sim: { type: "steps", items: ["Create destination page (e.g. 'Product Detail')", "On destination page: Visualizations pane → Drill through → drag the filter field (e.g. ProductKey)", "Add relevant visuals on the detail page (transactions table, trend chart, etc.)", "Insert → Buttons → Back — Power BI auto-wires it to return to origin page", "On source page: right-click a visual data point → Drill through → Product Detail", "Test: verify the destination page filters to the clicked product only"] },
        quiz: { q: "What is the difference between drill-down and drill-through?", options: ["They are the same feature","Drill-down navigates within a hierarchy on the same visual; drill-through jumps to another page","Drill-through navigates within a hierarchy; drill-down jumps to another page","Drill-down requires DAX; drill-through doesn't"], correct: 1, explanation: "Drill-down goes deeper within the same visual's hierarchy. Drill-through is a cross-page navigation filtered to the clicked item — it shows a completely different page of details." },
      },
      {
        id: "vis-bookmarks",
        title: "Bookmarks & Report Navigation",
        concept: "Bookmarks capture the state of a report page: visible visuals, filter selections and scroll position. Use them to build toggle buttons (show/hide a chart), report section navigation (tab-style pages), and guided tours for executive presentations. Combine with the Selection pane to control which visuals are visible.",
        tip: "Create two bookmarks for a 'Show/Hide detail table' toggle: one with the table visible, one with it hidden. Wire both to the same button — Power BI automatically toggles between them on each click.",
        code: `// Bookmark navigation setup:
// 1. View → Selection pane: see all visuals on page
// 2. View → Bookmarks pane: Add bookmark → name it
// 3. Toggle visual visibility in Selection pane
// 4. Add another bookmark for the other state
// 5. Insert → Buttons → assign Action → Bookmark

// Page navigation buttons (tab-style):
// Insert → Buttons → Navigator → Page navigator
// Auto-creates buttons linking to all pages

// Bookmark button: Insert → Buttons → Blank
// Format → Action → Type: Bookmark → [Your bookmark]`,
        codeLabel: "Power BI UI",
        sim: { type: "steps", items: ["View → Bookmarks pane → Add → name 'Chart View'", "View → Selection pane → hide the detail table (click eye icon)", "View → Bookmarks pane → Add → name 'Table View'", "Restore table visibility in Selection pane", "Insert → Buttons → Blank → label 'Show Table'", "Format → Action → Type: Bookmark → Table View (then reverse for the other button)"] },
        quiz: { q: "Bookmarks capture which of the following?", options: ["DAX measure values","Current filter state and visual visibility","Report theme colours","Data source connection settings"], correct: 1, explanation: "Bookmarks save the filter context (slicer selections, page/visual filters) and visual visibility state (from the Selection pane). They don't store DAX results, themes or data sources." },
      },
      {
        id: "vis-tooltips",
        title: "Custom Tooltips",
        concept: "Custom Tooltips replace the default hover box with a full report page — you can show sparklines, context measures, related metrics and even small charts on hover. Create a tooltip page (set page size to Tooltip type), add your visuals, then assign it to target visuals in the Format pane.",
        tip: "Keep tooltip pages simple — 2–3 key metrics and a single small chart. The tooltip appears in a fixed small window. Use small font sizes (9–10pt) and compact card visuals rather than full-size charts.",
        code: `// Tooltip page setup:
// 1. Add new page → Format page pane
//    → Page information → Allow use as tooltip = On
//    → Canvas settings → Type = Tooltip

// 2. Add measures relevant to hover context:
Tooltip Revenue LY = [Revenue LY]
Tooltip YoY %      = [YoY Growth %]
Tooltip Top Product =
    CALCULATE(
        FIRSTNONBLANK(DimProduct[Name], 1),
        TOPN(1, VALUES(DimProduct[Name]), [Total Revenue])
    )

// 3. Assign: Target visual → Format → Tooltip → Type: Report page
//    → Page = [Your tooltip page name]`,
        codeLabel: "DAX",
        sim: { type: "tips", items: ["Tooltip page canvas: Format → Canvas settings → Type = Tooltip (300×300 px default)","Add a small line sparkline showing the last 12 months of the hovered metric","Include vs LY and vs Budget in the tooltip — context without leaving the chart","Use card visuals with small font (9pt) — full-size chart visuals will look huge","Don't use slicers on tooltip pages — they add clutter and confusion","Test by hovering over data points in the source visual in report view"] },
        quiz: { q: "To assign a custom tooltip page to a visual, you go to:", options: ["Insert → Tooltip","View → Tooltip settings","Format visual pane → Tooltip → Type = Report page","Analytics pane → Tooltip"], correct: 2, explanation: "Format visual pane → Tooltip → change Type from 'Default' or 'None' to 'Report page', then select the tooltip page name from the dropdown." },
      },
      {
        id: "vis-design",
        title: "Report Layout & Design Principles",
        concept: "Professional reports follow a visual hierarchy: KPI cards top, supporting charts middle, detail tables bottom. Use a maximum of 3 colours plus neutral grays. Align all elements to an 8px grid. Add 12–16px padding inside cards. Remove chart borders, background boxes and gridlines — whitespace does the work instead.",
        tip: "Use the 'Canvas background' (Format page → Canvas background → colour #0d1426 for dark theme) instead of placing coloured rectangles everywhere. It's one step and keeps the layer hierarchy clean.",
        code: `// Design checklist (no DAX — this is layout discipline):

// ✅ Colour palette: 1 primary (#4299e1) + 1 positive (#48bb78) + 1 negative (#fc8181)
// ✅ All cards aligned: same height, same left edge
// ✅ Font: one typeface (Segoe UI or DIN) at max 3 sizes (24/14/11pt)
// ✅ Chart titles: sentence case, descriptive ("Revenue by Region, Q1 2024")
// ✅ No chart borders — use whitespace to separate visuals
// ✅ Remove axis titles when chart title makes them redundant
// ✅ Consistent padding: 8px between visuals, 12px inside cards
// ✅ Report title: top-left, 24pt bold — includes date range from dynamic measure`,
        codeLabel: "Design System",
        sim: { type: "tips", items: ["Use Format → Align → Align left/top to align groups of visuals precisely","Lock aspect ratio: Format → Size and position → lock for consistent card sizes","Theme JSON: export & import your colour palette across all reports","Place the company logo in the top-left using Insert → Image — max 48px height","Date range in report title: = 'Period: ' & [Date Range Label] (dynamic measure)","Add a 'Last refreshed' card: = 'Last refreshed: ' & FORMAT(NOW(), 'DD MMM YYYY HH:MM')"] },
        quiz: { q: "What is the recommended maximum number of primary colours in a professional Power BI report?", options: ["1","2–3 plus neutral grays","5–6 for visual richness","As many as there are data series"], correct: 1, explanation: "2–3 primary colours plus neutral grays (white, light gray, dark gray) is the professional standard. More colours create visual noise and make it harder to spot which colour encodes meaningful data." },
      },
    ],
  },

  {
    id: "other",
    label: "Other",
    icon: "⚙️",
    lessons: [
      {
        id: "oth-rls",
        title: "Row-Level Security (RLS)",
        concept: "RLS restricts which rows a user can see when they open the report. Static RLS uses hard-coded filter rules per role. Dynamic RLS uses USERPRINCIPALNAME() to match the logged-in user's email to a security table — one role handles all users automatically. Always test with 'View as role' before publishing.",
        tip: "Dynamic RLS is almost always better than static — you manage user access by editing a data table, not by re-publishing the report. Add a security table (User, Region, Segment) and join it to your dimension.",
        code: `// Dynamic RLS: single role that uses the logged-in user's email
// In Modeling tab → Manage Roles → Create role 'UserRole'

// DAX filter on DimEmployee table:
[UserEmail] = USERPRINCIPALNAME()

// The relationship from DimEmployee → FactSales (via ManagerID or RegionKey)
// propagates the filter — each user sees only their region's data

// Security table pattern:
// UserSecurity: UserEmail | Region | Segment
// Relationship: UserSecurity[Region] → DimRegion[Region] (1:Many, Bidirectional)
// RLS filter on UserSecurity: [UserEmail] = USERPRINCIPALNAME()`,
        codeLabel: "DAX",
        sim: { type: "steps", items: ["Modeling tab → Manage Roles → New Role → name 'UserRole'", "Select DimEmployee table → add DAX filter: [UserEmail] = USERPRINCIPALNAME()", "Define relationships: UserSecurity → DimRegion (1:Many, Bidirectional cross-filter)", "Test: Modeling → View as → Role: UserRole → enter a test email", "Verify report shows only rows matching that email's regions", "Publish: Power BI Service → Dataset → Security → assign users/groups to role"] },
        quiz: { q: "USERPRINCIPALNAME() in a RLS filter returns:", options: ["The report developer's email","The email of the user currently viewing the published report","The workspace admin's email","A random user from the security table"], correct: 1, explanation: "USERPRINCIPALNAME() returns the Azure AD email (UPN) of the user authenticated to the Power BI Service who is viewing the report. In Desktop, it returns your own email for testing." },
      },
      {
        id: "oth-incremental",
        title: "Incremental Refresh",
        concept: "Incremental refresh loads only new and recently changed rows instead of the entire table on each scheduled refresh. This reduces refresh time from hours to minutes for large tables. You define a retention window (e.g. 3 years of data stored) and a refresh window (e.g. last 3 days re-loaded each refresh). It requires Power BI Premium or PPU.",
        tip: "The Power Query filter on RangeStart and RangeEnd must fold to the data source — if the query doesn't fold, incremental refresh falls back to full refresh. Check by right-clicking the source step and selecting 'View native query'.",
        code: `// Step 1: Create RangeStart and RangeEnd parameters in Power Query
// Type: Date/Time | Required: Yes | No current value needed

// Step 2: Add a filter step USING these parameters
let
    Source = Sql.Database("server", "db"),
    Filtered = Table.SelectRows(Source, each
        [TransactionDate] >= RangeStart and
        [TransactionDate] < RangeEnd
    )
in
    Filtered

// Step 3: In Power BI Desktop:
// Right-click table in Fields → Incremental refresh
// Store: 3 years | Refresh: last 3 days
// ✅ Detect data changes: optional (requires a Max(LastModified) column)`,
        codeLabel: "Power Query M",
        sim: { type: "steps", items: ["Add RangeStart and RangeEnd parameters: Home → Manage Parameters → New (Date/Time type)", "Filter source table: Table.SelectRows(Source, each [Date] >= RangeStart and [Date] < RangeEnd)", "Close & Apply — verify query folds (right-click Source step → View native query)", "Right-click table in Desktop Fields pane → Incremental refresh policy", "Set archive = 3 years, refresh = 3 days (only last 3 days re-queries on each refresh)", "Publish to Premium/PPU workspace — incremental refresh activates in the Service"] },
        quiz: { q: "Incremental refresh requires which Power BI licence type?", options: ["Power BI Free","Power BI Pro","Power BI Premium or PPU","Any licence"], correct: 2, explanation: "Incremental refresh requires a Premium or PPU (Premium Per User) capacity. Pro licences don't support it. You can design the policy in Desktop but it only activates when published to a Premium workspace." },
      },
      {
        id: "oth-pipelines",
        title: "Deployment Pipelines",
        concept: "Deployment Pipelines provide a Dev → Test → Prod workflow for Power BI content. Developers build in Development, stakeholders validate in Test, then changes are promoted to Production. Deployment Rules let you switch data sources between stages automatically — Dev uses a sandbox database; Prod connects to the live database.",
        tip: "Never develop directly in Production. Use deployment rules to point each stage at the correct database. Service accounts (not personal emails) should own pipelines — personal accounts leave when people do.",
        code: `// Deployment pipeline stages:
//
// [Development] → [Test] → [Production]
//   ↓ promote       ↓ promote
//
// Deployment Rules (set per stage):
// Data source rule: override connection string
//   Dev  → sandbox-db.company.com/FinanceDev
//   Test → test-db.company.com/FinanceTest
//   Prod → prod-db.company.com/Finance
//
// Parameter rule: override Power Query parameters
//   Prod: FiscalYearStart = "April"
//
// Deploy: Pipeline → Compare stages → Deploy selected items`,
        codeLabel: "Power BI Service",
        sim: { type: "steps", items: ["Power BI Service → Workspaces → Create 3 workspaces: FinanceDev, FinanceTest, FinanceProd", "Deployment pipelines (left nav) → Create pipeline → assign workspaces to stages", "Set deployment rules: click ⚙️ on Test/Prod → Data source rules → override connection string", "Develop in Dev workspace → pipeline → Deploy to Test", "Stakeholders validate in Test → pipeline → Deploy to Prod", "Schedule refresh on Prod only — Dev/Test refresh on-demand"] },
        quiz: { q: "Deployment Rules in a pipeline are used to:", options: ["Restrict who can promote to Production","Override data source connections per pipeline stage","Enforce report naming conventions","Schedule automatic promotions"], correct: 1, explanation: "Deployment Rules let you override data source connection strings, parameters and other settings per stage — so Dev points to sandbox, Prod points to live database, automatically on each deploy." },
      },
      {
        id: "oth-dataflows",
        title: "Dataflows",
        concept: "Dataflows are cloud-based Power Query transformations stored in a Power BI workspace. Multiple datasets can connect to one dataflow, ensuring a single source of truth for shared dimensions. A central Dataflow containing the Date table, Customer dimension and Product hierarchy ensures all reports use the same definitions.",
        tip: "Linked dataflows let downstream dataflows reference an upstream one. Change the upstream logic and all downstream datasets inherit it automatically — no need to update 20 separate Power Query queries.",
        code: `// Creating a Dataflow:
// Workspace → New → Dataflow → Define new tables

// Shared Date table dataflow (example M):
let
    StartDate = #date(2020, 1, 1),
    EndDate   = Date.From(DateTime.LocalNow()),
    DayCount  = Duration.Days(EndDate - StartDate) + 1,
    Dates     = List.Dates(StartDate, DayCount, #duration(1,0,0,0)),
    DateTable = Table.FromList(Dates, Splitter.SplitByNothing()),
    DateCol   = Table.TransformColumnTypes(DateTable, {{"Column1", type date}}),
    Named     = Table.RenameColumns(DateCol, {{"Column1","Date"}}),
    // Add Year, Quarter, Month, WeekDay columns...
in
    Named

// Connect from Power BI Desktop:
// Get Data → Power Platform → Power BI dataflows`,
        codeLabel: "Power Query M",
        sim: { type: "tips", items: ["Create one central Dataflow for shared dimensions: Date, Customer, Product, Region","Use Linked Dataflows to let teams build on a shared base without duplicating logic","Dataflows refresh independently of datasets — schedule them before datasets","Computed tables (premium): use dataflow output as a staging table for further transformation","Document each dataflow table with a description — it shows in the Connect UI","Dataflows use the same M language as Power Query Desktop — copy queries directly"] },
        quiz: { q: "The main benefit of using a Dataflow for a shared Date table is:", options: ["Faster DAX calculations","All reports use the same Date table definition from one place","The Date table loads faster from the cloud","It removes the need to mark the table as a Date table"], correct: 1, explanation: "A Dataflow ensures every report that connects to it gets the exact same Date table, with consistent field names, fiscal year definitions and hierarchy levels. One update in the Dataflow propagates everywhere." },
      },
      {
        id: "oth-refresh",
        title: "Scheduled Refresh & Gateway",
        concept: "Scheduled Refresh keeps published reports current by re-querying data sources on a schedule (up to 8×/day on Pro, 48×/day on Premium). The On-premises Data Gateway is required for local data sources (SQL Server, network file shares, Oracle). The gateway runs as a Windows service on an always-on machine and must be registered in the Power BI Service.",
        tip: "Run the gateway on a dedicated server or VM, not a laptop. If the gateway machine is powered off, all scheduled refreshes fail silently — you get an email, but users get stale data without knowing.",
        code: `// Gateway setup checklist:
// 1. Download: Microsoft On-premises Data Gateway installer
// 2. Install on a Windows server (always-on, corporate network)
// 3. Sign in with the service account Power BI email
// 4. Register: name the gateway (e.g. "Finance-Gateway-Prod")
// 5. Service → Manage gateways → add data source:
//    Type: SQL Server | Server: proddb | Database: Finance
//    Auth: Windows/Service Account credentials

// Schedule refresh: Service → Dataset → Settings
// → Scheduled refresh → On
// → Frequency: Daily | Times: 06:00, 12:00, 18:00
// → Send refresh failure notifications → On`,
        codeLabel: "Power BI Service",
        sim: { type: "steps", items: ["Download On-premises Data Gateway from Microsoft (search 'Power BI gateway download')", "Install on a Windows server that is always powered on and network-connected", "Register gateway in Power BI Service: Settings → Manage gateways", "Add your data sources (SQL Server, Excel paths) with credentials to the gateway", "Map the dataset: Dataset → Settings → Gateway connection → select your gateway + data source", "Set schedule: Dataset → Scheduled refresh → On → choose frequency and times"] },
        quiz: { q: "The On-premises Data Gateway is required when:", options: ["Your dataset is larger than 1 GB","Your data source is on a local network or on-premises server","You use more than 8 scheduled refreshes per day","You have more than 10 users viewing the report"], correct: 1, explanation: "The gateway bridges the Power BI cloud service with on-premises or network data sources (SQL Server, Oracle, file shares). Cloud sources like Azure SQL or SharePoint Online don't need a gateway." },
      },
      {
        id: "oth-performance",
        title: "Performance Analyser & DAX Studio",
        concept: "Performance Analyser (View → Performance Analyser) logs the time each visual takes to render — broken into DAX query time and visual rendering time. DAX Studio (free external tool) connects to a running Power BI Desktop file and lets you run and profile individual DAX queries, inspect the storage engine and identify bottlenecks.",
        tip: "Most slow reports are caused by: (1) too many visuals per page (>10 slows rendering), (2) bidirectional relationships creating ambiguous filter paths, or (3) a calculated column used in a SUMX iterator. Fix these before optimising DAX formulas.",
        code: `// Performance Analyser in Power BI Desktop:
// View → Performance Analyser → Start recording → Refresh visuals
// Each visual shows: DAX query time | Visual display time | Other

// DAX Studio (daxstudio.org — free download):
// Connect: External Tool → DAX Studio (Power BI Desktop)
// Paste slow measure → Run → All Queries tab shows:
//   SE (Storage Engine) time: data scanning — fix with better model
//   FE (Formula Engine) time: DAX complexity — fix with simpler DAX
//   Cache hits: high = good (measure already computed recently)

// Common fixes:
// Slow visual → replace SUMX with SUM where possible
// Slow matrix → reduce columns, add Top N filter
// Slow slicer → convert to dropdown style`,
        codeLabel: "Tools",
        sim: { type: "tips", items: ["Target: DAX query time < 200ms per visual for a snappy report","> 500ms per visual: investigate with DAX Studio (check SE vs FE time)","High FE time → simplify DAX: replace iterators with aggregations where possible","High SE time → model issue: check for missing relationships, Many:Many, bidirectional filters","Vertipaq Analyzer (in DAX Studio) shows table/column sizes — find what's eating RAM","Reduce column cardinality: don't import text columns with thousands of unique values"] },
        quiz: { q: "In DAX Studio, 'Storage Engine' (SE) time that is very high indicates:", options: ["Complex DAX formula logic","A data model issue — missing index, large table, or poor relationship","Slow internet connection","Too many visuals on the page"], correct: 1, explanation: "High Storage Engine time means Power BI is scanning large amounts of data — typically caused by a missing relationship, Many:Many, or a very large table with no effective filter. High Formula Engine time points to complex DAX." },
      },
      {
        id: "oth-qa-ai",
        title: "Q&A, Smart Narrative & Key Influencers",
        concept: "Q&A lets users type natural language questions (\"What were total sales last month by region?\") and Power BI generates a visual automatically. Smart Narrative creates auto-generated text summaries of your data with dynamic values. Key Influencers analyses what factors statistically drive a metric up or down.",
        tip: "Improve Q&A accuracy by adding synonyms in the Q&A tooling (Home → Q&A Setup → Synonyms) — teach it that 'revenue' = 'sales' = 'income'. Also define Featured Tables to make entities like Customer and Product more discoverable.",
        code: `// Enable Q&A:
// Dataset → Settings → Featured tables (define Q&A entities)
// Home → Q&A Setup → add synonyms for column/measure names

// Smart Narrative (Insert → AI visuals → Smart Narrative):
// Right-click any value in the narrative → Add dynamic value
// → choose a measure and format: "Revenue grew by +[YoY%]"

// Key Influencers (Insert → AI visuals → Key Influencers):
// Analyse field: Gross Margin %
// Explain by: Region, Category, Segment, Sales Rep
// → Power BI uses ML to rank factors by correlation strength

// Anomaly Detection (on line charts):
// Analytics pane → Find anomalies → sensitivity slider`,
        codeLabel: "Power BI UI",
        sim: { type: "tips", items: ["Q&A works best with simple, clean measure names — 'Total Revenue' not 'Rev_Sum_v2'","Smart Narrative: update text dynamically — click 'Update' after data or filter changes","Key Influencers requires at least 100 rows and a numeric or categorical target field","Anomaly Detection: use medium sensitivity — too high flags normal variation as anomalies","Add Q&A visual to the report canvas for self-service exploration by less technical users","These AI features are compute-intensive — place them on dedicated pages, not alongside 10 other visuals"] },
        quiz: { q: "To improve Q&A results for a column named 'cust_rev', you should:", options: ["Rename the column to 'Revenue' in Power Query","Add synonyms: 'revenue', 'sales', 'income' via Q&A Setup","Use CALCULATE to rename the measure","Enable Smart Narrative first"], correct: 0, explanation: "The best fix is renaming the column to a human-readable name in Power Query. As a secondary improvement, add synonyms in Q&A Setup. Fixing the source name beats patching it with synonyms." },
      },
      {
        id: "oth-mobile",
        title: "Mobile Layout Design",
        concept: "Power BI Mobile displays reports in portrait mode on phones. Desktop canvas designs (16:9 landscape) are squeezed and unreadable on a phone unless you create a dedicated Mobile Layout. View → Mobile Layout lets you drag only the visuals you want mobile users to see into a phone-shaped canvas.",
        tip: "Finance mobile users mostly check KPIs on the go — they rarely need full P&L tables. Design mobile layouts with 3–4 KPI cards, one trend line and one filter. Add a 'Full Report' link button for when they need more.",
        code: `// Mobile layout: View → Mobile Layout
// Drag visuals from the right-side palette onto the phone canvas
// Resize by dragging handles — visuals stack top to bottom

// Mobile design decisions:
// ✅ KPI cards → always include (large, readable at 13pt minimum)
// ✅ 1 trend line chart → shows direction at a glance
// ✅ 1 dropdown slicer → for period or region filter
// ❌ Matrix tables → too wide, avoid or use a narrow 3-column version
// ❌ Clustered bar with >5 categories → labels overlap
// ❌ Custom tooltip pages → don't work on mobile touch

// Test in Power BI Mobile app (iOS/Android) before publishing`,
        codeLabel: "Power BI UI",
        sim: { type: "tips", items: ["Phone canvas is 320px wide — design for this constraint, not a widescreen","Use font size 13pt minimum for card values — 9pt labels are invisible on a phone","KPI cards: stack 2 per row on mobile (the new Card visual supports this natively)","Test slicers: touch targets need to be at least 44px — small dropdown arrows fail on mobile","Add a bookmark button 'Open Full Report' linking to the desktop/web version","Enable Auto-scale in Format → Visual → General to let visuals adapt to the canvas size"] },
        quiz: { q: "To design a mobile layout, you go to:", options: ["Format → Mobile → Enable","View → Mobile Layout","File → Options → Mobile","Insert → Mobile canvas"], correct: 1, explanation: "View menu → Mobile Layout switches the canvas to a phone-shaped editor where you drag in only the visuals intended for mobile. The desktop layout remains unchanged." },
      },
      {
        id: "oth-sharing",
        title: "Sharing, Workspaces & Permissions",
        concept: "Workspaces are containers for reports, datasets, dashboards and dataflows. Workspace roles control what members can do: Admin (full control), Member (publish + share), Contributor (publish + edit), Viewer (read only). Distribute reports to large audiences via Power BI Apps — not by sharing individual reports.",
        tip: "Always use Azure AD security groups, never individual email addresses, for workspace membership. When someone leaves the company, removing them from the AAD group removes their Power BI access automatically.",
        code: `// Workspace roles (what each can do):
// Admin       → manage all settings, add/remove members, delete workspace
// Member      → create + publish + share + read
// Contributor → create + publish (cannot share)
// Viewer      → read-only access to published content

// Best practices:
// One workspace per project team (not per person)
// Production workspace: most users get Viewer via an App
// App: Workspace → Create app → select reports to include → publish
// App audience: specific users, security groups, or entire org

// Individual share: report → Share → enter email
// Use only for one-off ad hoc sharing, not ongoing access management`,
        codeLabel: "Power BI Service",
        sim: { type: "tips", items: ["Create 3 workspaces per project: Dev, Test, Prod — use Deployment Pipelines to promote","Assign security groups (not individuals) to workspace roles — scales with team changes","Power BI Apps: package a workspace into a read-only app for large stakeholder audiences","Report sharing (individual link): limited to Pro users — use Apps for Free/Viewer licences","Set workspace contact list: workspace settings → contact list → choose who to email on issues","Audit logs: Admin Portal → Audit logs — track who viewed which report, when"] },
        quiz: { q: "For distributing reports to 200 read-only stakeholders, the best approach is:", options: ["Share each report individually with each email","Add all 200 as Viewers in the workspace","Create a Power BI App and assign it to a security group","Export to PDF and email monthly"], correct: 2, explanation: "Power BI Apps package workspace content into a clean read-only experience. Assign via security groups — you manage 1 group, not 200 individual email addresses. Much more scalable than individual sharing." },
      },
      {
        id: "oth-embedded",
        title: "Power BI Embedded & REST API",
        concept: "Power BI Embedded lets you integrate reports into your own web application without users needing a Power BI licence — billing is via Azure capacity (A-SKU). The REST API enables programmatic report management: trigger dataset refreshes, generate embed tokens with row-level security, clone reports and export to PDF. Authentication uses Service Principal (preferred over user credentials).",
        tip: "Use Service Principal authentication for all production integrations — it doesn't expire when a person's password changes, survives staff turnover and can be managed through Azure AD app roles.",
        code: `// Service Principal setup:
// 1. Azure Portal → App registrations → New app → copy AppID + TenantID
// 2. Generate a client secret → copy SecretValue
// 3. Power BI Admin Portal → Developer settings → Allow service principals
// 4. Add service principal to workspace as Member role

// Generate embed token (Node.js example):
const { PowerBIClient } = require("@azure/arm-powerbiembedded");

const tokenRequest = {
    reports: [{ id: reportId }],
    datasets: [{ id: datasetId }],
    // RLS: pass effective identity to filter per user
    identities: [{ username: userEmail, roles: ["UserRole"], datasets: [datasetId] }],
};
// POST https://api.powerbi.com/v1.0/myorg/GenerateToken
// Response: { token: "eyJ...", expiration: "2024-...", tokenId: "..." }`,
        codeLabel: "REST API",
        sim: { type: "steps", items: ["Azure Portal: create App Registration → copy Application (client) ID and Tenant ID", "Generate client secret → copy value immediately (shown only once)", "Power BI Admin Portal → Tenant settings → Developer → Allow service principals for Power BI APIs", "Add service principal to your workspace: workspace Settings → Access → paste AppID as Member", "Backend: authenticate via MSAL → call /GenerateToken → return token to frontend", "Frontend: embed using powerbi-client JS library → pass embed token + report URL"] },
        quiz: { q: "Power BI Embedded with A-SKU capacity requires end users to have:", options: ["Power BI Pro licence","Power BI Premium licence","No Power BI licence — capacity covers access","Azure subscription"], correct: 2, explanation: "A-SKU Azure capacity covers the cost of embedded access. End users consuming embedded reports in your application don't need individual Power BI licences — your app pays for capacity instead." },
      },
    ],
  },
];

// ── Simulation Widgets ─────────────────────────────────────────────────────────

function TableSim({ sim }: { sim: TableSim }) {
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3 items-start">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Before</p>
          <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="text-xs w-full">
              <thead><tr>{sim.before.headers.map(h => <th key={h} className="px-3 py-2 bg-[#0d1426] text-gray-400 text-left font-semibold border-b border-gray-700 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{sim.before.rows.map((row, i) => <tr key={i} className="border-b border-gray-800 last:border-0">{row.map((cell, j) => <td key={j} className="px-3 py-2 text-gray-300 whitespace-nowrap">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">After</p>
          <div className="overflow-x-auto rounded-xl border border-blue-500/30">
            <table className="text-xs w-full">
              <thead><tr>{sim.after.headers.map(h => <th key={h} className="px-3 py-2 bg-blue-600/10 text-blue-300 text-left font-semibold border-b border-blue-500/20 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>{sim.after.rows.map((row, i) => <tr key={i} className="border-b border-gray-800 last:border-0">{row.map((cell, j) => <td key={j} className="px-3 py-2 text-gray-300 whitespace-nowrap">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
      <p className="text-xs text-blue-300 bg-blue-600/10 border border-blue-500/20 rounded-lg px-4 py-2">{sim.note}</p>
    </div>
  );
}

function DaxSim({ sim }: { sim: DaxSim }) {
  return (
    <div className="bg-[#0d1426] border border-gray-700 rounded-xl p-4 space-y-2">
      <p className="text-xs text-gray-400 mb-3 font-mono">{sim.scenario}</p>
      {sim.lines.map((line, i) => (
        <div key={i} className={`flex items-center justify-between gap-4 py-2 border-b border-gray-800 last:border-0 ${line.highlight ? "text-white" : "text-gray-400"}`}>
          <span className="text-xs font-mono">{line.label}</span>
          <span className={`text-xs font-bold font-mono ${line.highlight ? "text-blue-300" : "text-gray-300"}`}>{line.value}</span>
        </div>
      ))}
    </div>
  );
}

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
          <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center">{i + 1}</span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function SimWidget({ sim }: { sim: Sim }) {
  if (sim.type === "table")    return <TableSim sim={sim} />;
  if (sim.type === "dax")      return <DaxSim sim={sim} />;
  if (sim.type === "tips")     return <TipsSim sim={sim} />;
  if (sim.type === "steps")    return <StepsSim sim={sim} />;
  return null;
}

// ── Quiz Widget ────────────────────────────────────────────────────────────────

function QuizWidget({ quiz, onCorrect }: { quiz: Lesson["quiz"]; onCorrect: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === quiz.correct;

  function pick(i: number) {
    if (answered) return;
    setSelected(i);
    if (i === quiz.correct) onCorrect();
  }

  return (
    <div className="bg-[#0d1426] border border-gray-700 rounded-2xl p-5">
      <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-3">Quick Check</p>
      <p className="text-sm text-white font-semibold mb-4">{quiz.q}</p>
      <div className="grid sm:grid-cols-2 gap-2 mb-4">
        {quiz.options.map((opt, i) => {
          let cls = "text-left text-sm px-4 py-3 rounded-xl border transition ";
          if (!answered) cls += "border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white hover:bg-blue-600/5 cursor-pointer";
          else if (i === quiz.correct) cls += "border-green-500 bg-green-500/10 text-green-300";
          else if (i === selected) cls += "border-red-500 bg-red-500/10 text-red-300";
          else cls += "border-gray-800 text-gray-600 opacity-50";
          return <button key={i} className={cls} onClick={() => pick(i)}>{opt}</button>;
        })}
      </div>
      {answered && (
        <div className={`text-xs rounded-xl px-4 py-3 border ${isCorrect ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
          {isCorrect ? "✓ Correct! " : "✗ Not quite. "}
          <span className="text-gray-300">{quiz.explanation}</span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function PowerBIClient() {
  const [moduleIdx, setModuleIdx]   = useState(0);
  const [lessonIdx, setLessonIdx]   = useState(0);
  const [completed, setCompleted]   = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pbi-completed");
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  function markComplete(id: string) {
    setCompleted(prev => {
      const next = new Set(prev).add(id);
      localStorage.setItem("pbi-completed", JSON.stringify([...next]));
      return next;
    });
  }

  function goLesson(mIdx: number, lIdx: number) {
    setModuleIdx(mIdx);
    setLessonIdx(lIdx);
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const mod     = MODULES[moduleIdx];
  const lesson  = mod.lessons[lessonIdx];
  const totalDone = completed.size;
  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0);

  function nextLesson() {
    if (lessonIdx < mod.lessons.length - 1) goLesson(moduleIdx, lessonIdx + 1);
    else if (moduleIdx < MODULES.length - 1) goLesson(moduleIdx + 1, 0);
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-24 pb-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/learn" className="text-gray-500 hover:text-gray-300 text-sm transition">← Learn</Link>
          <span className="text-gray-700">/</span>
          <span className="text-yellow-400 text-sm font-semibold">Power BI</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Learn Power BI</h1>
            <p className="text-gray-400 text-sm mt-1">40 lessons · Power Query · Modelling · Visuals · Advanced</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">{totalDone}/{totalLessons} completed</div>
            <div className="w-40 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${(totalDone/totalLessons)*100}%` }} />
            </div>
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {MODULES.map((m, i) => {
            const done = m.lessons.filter(l => completed.has(l.id)).length;
            return (
              <button
                key={m.id}
                onClick={() => { setModuleIdx(i); setLessonIdx(0); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${moduleIdx === i ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300" : "bg-white/[0.03] border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"}`}
              >
                <span>{m.icon}</span>
                {m.label}
                <span className="text-xs opacity-60">{done}/{m.lessons.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[280px_1fr] gap-6">

        {/* Lesson list sidebar */}
        <aside className="space-y-1">
          {mod.lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => goLesson(moduleIdx, i)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${lessonIdx === i ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-200" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <span className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center shrink-0 ${completed.has(l.id) ? "bg-green-500 border-green-400 text-white" : lessonIdx === i ? "border-yellow-400 text-yellow-400" : "border-gray-600 text-gray-600"}`}>
                {completed.has(l.id) ? "✓" : i + 1}
              </span>
              <span className="leading-tight">{l.title}</span>
            </button>
          ))}
        </aside>

        {/* Lesson content */}
        <div ref={contentRef} className="space-y-6">

          {/* Title */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-600 font-mono">Lesson {lessonIdx + 1} of {mod.lessons.length}</span>
            {completed.has(lesson.id) && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Completed</span>}
          </div>
          <h2 className="text-2xl font-extrabold text-white">{lesson.title}</h2>

          {/* Concept */}
          <div className="bg-white/[0.03] border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-300 leading-relaxed">{lesson.concept}</p>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">💡</span>
              <p className="text-yellow-200/80 text-sm">{lesson.tip}</p>
            </div>
          </div>

          {/* Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Code Example</span>
              <span className="text-xs text-gray-600 bg-white/5 border border-gray-700 px-2 py-0.5 rounded-md font-mono">{lesson.codeLabel}</span>
            </div>
            <pre className="bg-[#050810] border border-gray-800 rounded-2xl p-5 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed whitespace-pre">{lesson.code}</pre>
          </div>

          {/* Simulator */}
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Simulator</p>
            <div className="bg-white/[0.02] border border-gray-800 rounded-2xl p-5">
              <SimWidget sim={lesson.sim} />
            </div>
          </div>

          {/* Quiz */}
          <QuizWidget
            key={lesson.id}
            quiz={lesson.quiz}
            onCorrect={() => markComplete(lesson.id)}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => lessonIdx > 0 ? goLesson(moduleIdx, lessonIdx - 1) : moduleIdx > 0 && goLesson(moduleIdx - 1, MODULES[moduleIdx - 1].lessons.length - 1)}
              disabled={moduleIdx === 0 && lessonIdx === 0}
              className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white hover:border-gray-500 transition disabled:opacity-30"
            >
              ← Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={moduleIdx === MODULES.length - 1 && lessonIdx === mod.lessons.length - 1}
              className="px-6 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm font-semibold hover:bg-yellow-500/20 transition disabled:opacity-30"
            >
              Next →
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
