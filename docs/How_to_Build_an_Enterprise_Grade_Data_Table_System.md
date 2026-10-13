# How to Build an Enterprise-Grade Data Table System

> A design-system, UX, and engineering framework for building scalable data-heavy interfaces across enterprise applications.

## Abstract

Enterprise applications are rarely short on data. The difficult part is not displaying data; it is helping people **scan, compare, understand, filter, act on, and investigate records at scale**.

A robust enterprise data system should therefore not be treated as a collection of individually designed tables. It should be treated as a **data-display framework**:

**Data → Schema → Field Types → Priority → View Configuration → Renderer**

The same underlying records can then be rendered as:

- **Sheet View** — dense, comparison-oriented, structured data.
- **Card View** — recognition-oriented, hierarchical, richer presentation.
- **Expanded View** — progressive disclosure of secondary and extended information.
- **Detail View** — complete record investigation when the card is no longer sufficient.

This guide defines the architecture, UX rules, component system, action strategy, nested-data patterns, Figma architecture, development model, and configuration approach required to make that system scalable.

---

# 01 — Why Enterprise Tables Fail

## 1.1 The real problem

A basic table assumes:

```text
Record
→
Row
→
Columns
```

An enterprise record is more like:

```text
Record
├── Identity
├── Organization
├── Status
├── Relationships
├── Dates
├── Location
├── Metadata
├── Permissions
├── Actions
├── Attachments
├── Nested records
└── Audit information
```

The failure happens when all of this information is given equal visual weight.

The result is:

- excessive horizontal scrolling
- unreadable rows
- inconsistent actions
- too many icons
- unclear hierarchy
- duplicated information
- difficult mobile behavior
- inconsistent card designs
- poor handling of missing data
- tables that cannot scale to new record types

## 1.2 The goal

The goal is not:

> Fit all data into the UI.

The goal is:

> **Expose the right information at the right level of detail for the user's current task.**

---

# 02 — Table vs List vs Card

Different representations solve different problems.

| Pattern | Optimized for | Typical use |
|---|---|---|
| Table / Sheet | Comparison | Admin, operations, bulk review |
| List | Sequential scanning | Activity, messages, search results |
| Card | Recognition | People, companies, resources |
| Expanded Card | Context | Secondary information |
| Detail Page | Investigation | Complete record management |

## 2.1 Sheet View

Use Sheet View when users need to compare multiple records across the same fields.

Characteristics:

- high density
- predictable columns
- minimal decoration
- strong alignment
- sorting
- filtering
- selection
- bulk actions

## 2.2 Card View

Use Card View when users need to understand records individually.

Characteristics:

- strong identity
- richer field rendering
- semantic icons
- avatars
- flags
- chips
- grouped metadata
- progressive disclosure

## 2.3 Card is not Detail View

A card should answer:

> What is this record and what matters right now?

A detail page should answer:

> Tell me everything about this record.

Do not turn cards into miniature pages.

---

# 03 — The Data Display Architecture

The central architecture is:

```text
DATA
  ↓
SCHEMA
  ↓
FIELD TYPES
  ↓
FIELD PRIORITY
  ↓
VIEW CONFIGURATION
  ↓
RENDERER
  ├── Sheet Renderer
  └── Card Renderer
```

The data is shared.

The presentation changes.

## 3.1 Shared state

Search, filters, sorting, selection and pagination should belong to the data workspace, not to an individual renderer.

```text
Dataset
  ↓
Search
  ↓
Filters
  ↓
Sort
  ↓
Selection
  ↓
Pagination
  ↓
Renderer
    ├── Sheet
    └── Card
```

Switching views should therefore preserve:

- search
- filters
- sort
- selection
- page context where practical

## 3.2 Renderer independence

Avoid:

```text
VisitorTable
EmployeeTable
DeviceTable
CompanyTable
```

as completely separate UI systems.

Prefer:

```text
EnterpriseDataView
    +
Schema
    +
ViewConfiguration
```

---

# 04 — Data Tokens

Use a three-layer token model.

## 4.1 Primitive tokens

Examples:

```text
color.blue.500
color.gray.100
spacing.100
spacing.200
spacing.300
radius.sm
radius.md
font.size.sm
font.size.md
```

## 4.2 Semantic tokens

```text
data.text.primary
data.text.secondary
data.text.muted
data.text.link

data.surface.default
data.surface.hover
data.surface.selected

data.border.default
data.border.subtle

data.status.success
data.status.warning
data.status.error
data.status.info
```

## 4.3 Component tokens

```text
table.header.height
table.row.height
table.cell.padding.x
table.cell.padding.y

card.padding
card.gap
card.radius

record.summary.gap
record.details.gap
record.action.size
```

This allows a global density, branding or accessibility change without manually redesigning every table.

---

# 05 — Data Primitives

Build the data vocabulary before building tables.

## 5.1 Primitive field types

```text
Text
Number
Currency
Percentage
Boolean
Date
Time
DateTime
```

## 5.2 Identity

```text
Person
Company
Organization
Team
Avatar
```

## 5.3 Location

```text
Country
City
Address
Building
Floor
Room
```

## 5.4 Classification

```text
Status
Tag
Category
Priority
Type
```

## 5.5 Interactive

```text
Link
Email
Phone
URL
Action
Menu
```

## 5.6 Rich content

```text
Image
Document
Attachment
Icon
Progress
Rating
```

## 5.7 Composite fields

```text
Avatar + Name
Person + Company
Flag + Country
Status + Timestamp
Icon + Label
```

---

# 06 — Field Types

## 6.1 Data type vs presentation

A field's data type should not dictate one visual treatment.

For example:

```text
Country
```

in Sheet View:

```text
India
```

in Card View:

```text
🇮🇳 India
```

The data is identical.

The renderer changes.

## 6.2 Field definition

Every field should ideally have:

```text
key
label
type
priority
sortable
filterable
searchable
interactive
sheetVisibility
cardVisibility
renderer
```

Example:

```json
{
  "key": "host",
  "label": "Host",
  "type": "person",
  "priority": "P2",
  "sortable": true,
  "filterable": true,
  "searchable": true,
  "interactive": true
}
```

---

# 07 — Table Anatomy

A complete enterprise data workspace contains more than rows and columns.

```text
Data Workspace
├── Page Header
├── Search
├── Filters
├── Active Filters
├── View Switcher
├── Density Control
├── Column Configuration
├── Selection / Bulk Actions
├── Data Surface
│   ├── Header
│   ├── Rows / Cards
│   └── Expansion
└── Footer
    ├── Result Count
    ├── Page Size
    └── Pagination
```

## 7.1 Toolbar hierarchy

Do not put every possible control in the primary toolbar.

Prioritize:

1. Search
2. Most common filters
3. View switcher
4. Primary action
5. Secondary controls
6. Configuration

Less frequently used controls can live in an overflow menu.

---

# 08 — Sheet View

Sheet View is the **comparison mode**.

Its visual language should intentionally be restrained.

## 8.1 Principles

Prefer:

- normal text
- clear alignment
- consistent number formatting
- restrained status indicators
- links using the interactive color
- predictable column widths
- compact density

Avoid:

- decorative icons everywhere
- unnecessary chips
- oversized avatars
- excessive color
- inconsistent cell layouts

## 8.2 Cell alignment

Typical defaults:

| Data | Alignment |
|---|---|
| Text | Left |
| Person | Left |
| Date | Left or right depending on system |
| Number | Right |
| Currency | Right |
| Status | Left |
| Actions | Right |

The important rule is consistency.

## 8.3 Column width

Columns should have:

- minimum width
- preferred width
- maximum width where appropriate

Long content should not be allowed to destroy the entire table.

---

# 09 — Card View

Card View is the **recognition mode**.

The card should communicate:

1. What is this record?
2. What is its current state?
3. What is the most important context?
4. What can I do with it?

Example:

```text
┌──────────────────────────────────────────────┐
│ [Avatar] John Smith            ● Checked In │
│          Acme Corporation                  │
│                                            │
│ Host       Sarah Williams                  │
│ Visit      Client Meeting                  │
│ Date       02 Oct · 10:30 AM               │
│                                            │
│ View details                         ⋯     │
└──────────────────────────────────────────────┘
```

## 9.1 Richness should be semantic

Use visual richness when it communicates meaning.

Good:

```text
🇮🇳 India
```

because the flag reinforces the country.

Good:

```text
[Avatar] Sarah Williams
```

because the image reinforces identity.

Good:

```text
● Checked In
```

because the indicator communicates state.

Avoid adding icons simply to make a card look richer.

---

# 10 — Information Priority

This is the key mechanism for supporting tables with radically different numbers of fields.

Use four levels.

## P0 — Identity

What is the record?

Examples:

- name
- title
- company
- primary identifier

Always visible.

## P1 — Primary

What does the user need immediately?

Examples:

- status
- date
- owner
- visit type
- location

Normally visible.

## P2 — Secondary

Useful supporting information.

Examples:

- country
- phone
- email
- department
- host

Visible when space and context justify it.

## P3 — Extended

Useful for investigation.

Examples:

- internal ID
- created by
- modified by
- audit metadata
- secondary timestamps

Normally inside expansion.

---

# 11 — The Card Layout Algorithm

Do not use:

> Always show the first four columns.

Instead:

```text
1. Always show P0.
2. Fill available summary space with P1.
3. Add P2 only when it improves recognition.
4. Put remaining fields in Details.
5. Do not create an expansion control if there are no hidden fields.
```

## 11.1 Four-field dataset

If the table has only:

```text
Name
Company
Status
Date
```

show all four.

Do not create an artificial "Show more".

## 11.2 Twenty-field dataset

Show:

```text
P0
+
2–4 high-value P1/P2 fields
```

Then:

```text
+ 12 more details
```

## 11.3 Why this works

The card is driven by **information priority**, not by arbitrary field count.

---

# 12 — Expandable Records

Expansion is progressive disclosure.

```text
Collapsed
  ↓
Important information
  ↓
Expand
  ↓
Supporting / extended information
```

## 12.1 One expansion level

Prefer:

```text
Card
└── Details
```

Avoid deeply nested expandable records.

## 12.2 Expansion behavior

When expanded:

- preserve the card header
- preserve identity
- preserve status
- reveal additional fields
- maintain field order
- allow collapse
- avoid moving the user to another context unless necessary

## 12.3 "Show more" label

Use meaningful counts when useful:

```text
Show 8 more
```

or:

```text
View all details
```

If the number of hidden fields is dynamic, the count can help communicate scale.

---

# 13 — Nested Data and Nested Tables

Enterprise applications often contain relationships such as:

```text
Company
└── Employees

Visit
└── Visitors

Visitor
└── Visits

Device
└── Activity

Building
└── Rooms
```

Do not automatically put nested datasets inside every card.

## 13.1 Distinguish nested fields from nested collections

### Nested field

A single related value:

```text
Host
└── Person
```

Render inline:

```text
[Avatar] Sarah Williams
```

### Nested collection

Multiple related records:

```text
Visitor
└── Visits
    ├── Visit 1
    ├── Visit 2
    └── Visit 3
```

This requires a different pattern.

## 13.2 Nested collection pattern

Prefer:

```text
Visitor Card
────────────────────────────
John Smith
Acme Corporation
Checked In

Visits (3)                  +
────────────────────────────
Latest visit
02 Oct · Client Meeting

View all visits →
```

rather than rendering a full secondary table immediately.

## 13.3 Nested table inside expansion

Use a nested table when:

- the child records are important to the task
- users need comparison between child records
- there are enough child fields to justify columns
- the relationship is central to the workflow

Example:

```text
Expanded Visitor
────────────────────────────────

John Smith
Acme Corporation

Visit history (4)

Date       Host          Status
02 Oct     Sarah         Complete
18 Sep     David         Complete
02 Sep     Sarah         Cancelled
```

## 13.4 Never create infinite nesting

Avoid:

```text
Card
 → Expanded
   → Nested table
      → Expanded row
         → Nested table
```

After one nested level, move to a dedicated detail surface, drawer or page.

---

# 14 — Actions

Actions deserve their own system.

Every record may have actions, but **not every action deserves a visible button**.

## 14.1 Three action levels

### Level 1 — Direct Action

Use when the action is:

- frequent
- important
- low-risk
- immediately understandable
- strongly associated with the record

Examples:

```text
View
Check in
Approve
Open
```

Display directly.

### Level 2 — Secondary Action

Use when the action is useful but not primary.

Examples:

```text
Edit
Duplicate
Assign
Resend
```

Depending on the workflow, show as a secondary button or place in an overflow menu.

### Level 3 — Destructive / Rare Action

Examples:

```text
Delete
Archive
Revoke
Remove
```

Usually place in the overflow menu.

Require confirmation when the consequence is significant.

## 14.2 Decision framework

Ask:

```text
How often is this action used?
How important is it?
How risky is it?
How obvious is its meaning?
How much visual competition already exists?
```

A useful matrix:

| Action | Frequency | Risk | Recommendation |
|---|---:|---:|---|
| View | High | Low | Direct |
| Check in | High | Low | Direct |
| Edit | Medium | Low | Secondary / direct depending on workflow |
| Assign | Medium | Medium | Secondary |
| Duplicate | Low | Low | Overflow |
| Archive | Low | Medium | Overflow |
| Delete | Low | High | Overflow + confirmation |

## 14.3 Direct action vs click target

Do not make the entire card clickable if it contains many interactive controls.

If the primary action is opening the record, make the identity/title the primary link and keep other controls separate.

This avoids accidental activation.

---

# 15 — Action Placement

## Sheet View

Typical pattern:

```text
| Name | Company | Status | Date | Actions |
```

Actions live in a dedicated trailing column.

Use:

```text
[⋯]
```

when there are multiple secondary actions.

## Card View

Use:

```text
Header
   ├── Status
   └── Overflow

Body
   └── Primary information

Footer
   └── Primary action
```

Do not duplicate the same action in three places.

---

# 16 — Bulk Actions

Bulk actions are different from record actions.

When nothing is selected:

```text
Search | Filter | Add visitor
```

When records are selected:

```text
12 selected
[Check in] [Assign] [Export] [⋯]
```

The toolbar should transform contextually.

## 16.1 Bulk action rules

Only expose actions that are valid for **all selected records**.

If records have mixed states, either:

- disable invalid actions with explanation
- apply the action only to eligible records with explicit feedback
- provide a clear mixed-state workflow

Never silently fail.

---

# 17 — Selection

Selection should persist between Sheet and Card View.

```text
Sheet
Select 5 records
   ↓
Switch to Card
   ↓
Same 5 records remain selected
```

Selection belongs to workspace state, not the renderer.

---

# 18 — Sorting

Sorting is part of the shared dataset.

Example:

```json
{
  "field": "checkIn",
  "direction": "descending"
}
```

Both renderers consume the same sorted result.

## 18.1 Sort indicators

The active sort should be obvious.

Do not show unnecessary sort affordances everywhere if the system is already visually dense.

---

# 19 — Filtering

Filtering should be independent of Sheet/Card rendering.

Recommended hierarchy:

```text
Search
Primary filters
Advanced filters
Active filter chips
Clear filters
```

## 19.1 Filter types

```text
Text
Select
Multi-select
Date
Date range
Number range
Status
Person
Company
Location
Boolean
```

## 19.2 Filter state

Show active filters clearly.

Example:

```text
Status: Checked In
Country: India
Date: Today
```

---

# 20 — Empty, Loading and Error States

## Empty

No records exist.

```text
No visitors yet
Add your first visitor to get started.
[Add visitor]
```

## No Results

Records exist, but current filters return none.

```text
No visitors match your filters.
[Clear filters]
```

## Loading

Prefer structural loading/skeletons where appropriate.

## Error

Explain:

1. What happened
2. What the user can do

Example:

```text
We couldn't load visitors.
Try again or check your connection.

[Try again]
```

---

# 21 — Missing Data

Enterprise datasets contain incomplete information.

Different states may mean:

```text
Unknown
Not provided
Not applicable
Unavailable
Private
Pending
```

Do not collapse all of them into the same symbol if they carry different meaning.

If they are semantically equivalent, establish one system-wide representation.

---

# 22 — Long Content

Every field needs a truncation rule.

Possible strategies:

```text
Single line
Two lines
Ellipsis
Tooltip
Expandable
Wrap
```

Examples:

- Names: usually one or two lines
- IDs: often truncated but copyable
- Notes: expandable
- URLs: human-readable label instead of raw URL
- Long company names: ellipsis + accessible full value

Never let one field destroy the entire layout.

---

# 23 — Density

Define system-level density:

```text
Compact
Default
Comfortable
```

Density affects:

- row height
- card padding
- field gaps
- cell padding
- control sizes
- vertical rhythm

Do not create unrelated padding values for each component.

---

# 24 — Responsive Behaviour

Do not simply shrink a desktop table.

Define intentional transformations.

```text
Desktop
→ Sheet + Card available

Tablet
→ Sheet with fewer visible columns / Card

Mobile
→ Card-first
```

Fields should have responsive priority.

For example:

```text
P0 → always
P1 → usually
P2 → conditional
P3 → expansion
```

---

# 25 — Accessibility

## Sheet View

Support:

- semantic table structure
- keyboard navigation
- visible focus
- accessible sort controls
- accessible selection
- accessible status communication

## Card View

Support:

- logical reading order
- keyboard-accessible expansion
- accessible action labels
- focus management
- no color-only information

Bad:

```text
Green = checked in
```

Better:

```text
● Checked In
```

where color reinforces text rather than carrying the meaning alone.

---

# 26 — Figma Architecture

Recommended page structure:

```text
00 — Documentation
01 — Foundations
02 — Tokens
03 — Data Primitives
04 — Field Components
05 — Table Components
06 — Card Components
07 — Actions
08 — View Controls
09 — States
10 — Patterns
11 — Real Tables
12 — Playground
```

## 26.1 Data components

```text
Data/Text
Data/Number
Data/Date
Data/DateTime
Data/Person
Data/Company
Data/Country
Data/Status
Data/Tag
Data/Link
Data/Actions
```

## 26.2 Table components

```text
Table/Container
Table/Toolbar
Table/Header
Table/HeaderCell
Table/Row
Table/Cell
Table/Expansion
Table/Footer
```

## 26.3 Card components

```text
Card/Record
Card/Header
Card/Identity
Card/Summary
Card/Field
Card/Details
Card/Actions
Card/Expansion
```

---

# 27 — Figma Component Properties

Example:

```text
Record Card

State:
Default
Hover
Focused
Selected
Expanded
Disabled
Loading

Density:
Compact
Default
Comfortable

Status:
None
Success
Warning
Error
Info
Neutral

Show Avatar:
True / False

Show Status:
True / False

Expanded:
True / False
```

Do not create properties for every possible field.

Fields should ideally be composable through nested components.

---

# 28 — Development Architecture

Conceptual architecture:

```text
DataView
│
├── DataSource
│
├── QueryState
│   ├── Search
│   ├── Filters
│   ├── Sort
│   ├── Pagination
│   └── Selection
│
└── Renderer
    ├── SheetRenderer
    └── CardRenderer
```

Field rendering:

```text
FieldDefinition
      ↓
FieldType
      ↓
FieldRenderer
```

This allows one enterprise data system to support many resources.

---

# 29 — Configuration Schema

A table should be configurable.

Example:

```json
{
  "resource": "visitors",
  "view": {
    "default": "sheet",
    "available": ["sheet", "card"]
  },
  "fields": [
    {
      "key": "name",
      "type": "person",
      "priority": "P0",
      "sortable": true,
      "filterable": true,
      "searchable": true
    },
    {
      "key": "company",
      "type": "company",
      "priority": "P1"
    },
    {
      "key": "status",
      "type": "status",
      "priority": "P1",
      "filterable": true
    },
    {
      "key": "country",
      "type": "country",
      "priority": "P2"
    }
  ]
}
```

The same schema can drive both views.

---

# 30 — Table Data Contract

Every table should document:

| Property | Definition |
|---|---|
| Resource | Record type |
| Primary identifier | Main identity |
| Fields | Complete dataset |
| Field type | Rendering type |
| Priority | P0/P1/P2/P3 |
| Sheet visibility | Visible in Sheet |
| Card summary | Visible collapsed |
| Card details | Visible expanded |
| Sortable | Supports sorting |
| Filterable | Supports filtering |
| Searchable | Supports search |
| Interactive | Can be interacted with |
| Renderer | Visual treatment |

This contract becomes the bridge between Product, Design, Engineering and QA.

---

# 31 — Nested Data Model

Nested data should be explicitly classified.

## Relationship types

```text
One-to-one
One-to-many
Many-to-one
Many-to-many
```

Examples:

```text
Visitor
→ Host
```

one-to-one / many-to-one relationship.

```text
Visitor
→ Visits
```

one-to-many.

```text
Company
→ Employees
```

one-to-many.

## Rendering rule

### Single related entity

Render inline.

### Small related collection

Render a summary.

### Large related collection

Use a nested table or dedicated detail surface.

### Complex related entity

Use a link to its detail view.

---

# 32 — Nested Table Rules

Use a nested table when the user needs to compare child records.

Example:

```text
Visitor
────────────────────────────
John Smith
Acme Corporation

Visits (4)

Date       Host       Status
02 Oct     Sarah      Complete
18 Sep     David      Complete
02 Sep     Sarah      Cancelled
```

Do not use nested tables simply because the data happens to be relational.

A relationship does not automatically justify a nested grid.

---

# 33 — Performance

Enterprise datasets may contain thousands or millions of records.

The architecture should support:

```text
Server-side filtering
Server-side sorting
Pagination
Virtualization
Lazy loading
Debounced search
Incremental loading
```

Do not assume the entire dataset exists in the browser.

## 33.1 Card performance

Cards can be more expensive than simple table rows because they contain richer components.

Avoid rendering unnecessary off-screen records.

---

# 34 — Real-World Example: Visitor Management

A visitor record might contain:

```text
Name
Company
Country
Email
Phone
Host
Visit Type
Purpose
Location
Date
Check-in
Check-out
Status
Created
Created By
Updated
Visitor ID
Approval
Notes
```

## Sheet View

Optimize for:

```text
Name | Company | Host | Date | Status | ...
```

## Card View

Collapsed:

```text
┌──────────────────────────────────────────────┐
│ [Avatar] John Smith             ● Checked In│
│          Acme Corporation                  │
│                                            │
│ Host       Sarah Williams                  │
│ Visit      Client Meeting                  │
│ Date       02 Oct · 10:30 AM               │
│                                            │
│ + 12 more details                    ↓     │
└──────────────────────────────────────────────┘
```

Expanded:

```text
┌──────────────────────────────────────────────┐
│ Identity and summary remain visible          │
│                                              │
│ Country       🇮🇳 India                      │
│ Email         john@acme.com                 │
│ Phone         +91 XXXXX XXXXX               │
│ Purpose       Client Meeting                │
│ Location      Building A                    │
│ Check-in      09:42 AM                      │
│ Check-out     —                              │
│ Created by    Sarah Williams                │
│ Visitor ID    VIS-10482                     │
│ Approval      Approved                       │
│ Notes         ...                            │
│                                              │
│                              Show less ↑     │
└──────────────────────────────────────────────┘
```

---

# 35 — Real-World Example: Four-Field Dataset

Suppose another table only has:

```text
Device
Location
Status
Last Seen
```

Do not force the same visual density as the visitor card.

Use:

```text
┌──────────────────────────────────────────────┐
│ Device 01                         ● Online  │
│ Building A · Floor 2                      │
│ Last seen 10:42 AM                         │
└──────────────────────────────────────────────┘
```

No unnecessary expansion.

---

# 36 — Real-World Example: Company With Nested Employees

```text
┌──────────────────────────────────────────────┐
│ Acme Corporation                            │
│ 128 employees                    ● Active   │
│                                              │
│ Primary contact: Sarah Williams              │
│ Location: London                            │
│                                              │
│ Employees (128)                     View →  │
└──────────────────────────────────────────────┘
```

Clicking `Employees` should usually lead to a dedicated collection view rather than rendering 128 employees inside the card.

---

# 37 — Real-World Example: Record Actions

For a visitor:

Primary:

```text
View
```

Contextual:

```text
Check in
```

Secondary:

```text
Edit
Assign host
Resend invite
```

Rare/destructive:

```text
Cancel visit
Delete
```

Possible Card:

```text
[View details]                         [⋯]
```

Overflow:

```text
Edit
Assign host
Resend invitation
Cancel visit
Delete
```

The exact actions depend on permissions and record state.

---

# 38 — Permissions and Actions

Actions are not purely visual.

An action can depend on:

```text
Role
Permission
Record state
Ownership
Workflow state
```

For example:

```text
Status = Checked In
```

should not show:

```text
Check in
```

again.

Instead:

```text
Check out
```

may become available.

The action system should therefore evaluate:

```text
User permissions
+
Record state
+
Action availability
```

before rendering.

---

# 39 — Action State Matrix

For important workflows, define:

| Record State | View | Edit | Check In | Check Out | Delete |
|---|---|---|---|---|---|
| Invited | ✓ | ✓ | ✓ | — | ✓ |
| Checked In | ✓ | ✓ | — | ✓ | depends |
| Checked Out | ✓ | ✓ | — | — | depends |
| Cancelled | ✓ | limited | — | — | ✓ |

This prevents inconsistent action availability across views.

---

# 40 — Design QA Checklist

Before shipping a table:

### Data

- Are all fields classified?
- Are field types correct?
- Are priorities defined?
- Are missing states defined?

### Sheet

- Can users compare records?
- Are columns aligned?
- Are actions predictable?
- Is density appropriate?

### Card

- Is identity immediately recognizable?
- Are primary fields visible?
- Is expansion meaningful?
- Is rich formatting semantic?

### Actions

- Are primary actions obvious?
- Are rare actions hidden?
- Are destructive actions protected?
- Are permissions respected?

### Nested Data

- Are relationships understandable?
- Is nested data necessary?
- Is nesting limited?

### States

- Loading?
- Empty?
- No results?
- Error?
- Disabled?
- Selected?
- Expanded?

### Accessibility

- Keyboard?
- Focus?
- Screen reader?
- Color-independent status?

### Performance

- Pagination?
- Virtualization?
- Server-side operations?
- Lazy rendering?

---

# 41 — Engineering QA Checklist

Before development considers the component complete:

```text
□ Same schema supports Sheet + Card
□ Search state is shared
□ Filter state is shared
□ Sort state is shared
□ Selection is shared
□ Pagination is shared
□ Field renderers are reusable
□ Permissions affect actions
□ Record state affects actions
□ Nested data has explicit rules
□ Loading states exist
□ Error states exist
□ Empty states exist
□ Accessibility is implemented
□ Long values are handled
□ Missing values are handled
□ Large datasets are supported
□ View switching preserves context
```

---

# 42 — The Enterprise Data Display Model

The complete system can be represented as:

```text
                       ENTERPRISE DATA
                              │
                              ▼
                         DATA MODEL
                              │
                              ▼
                            SCHEMA
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
          FIELD TYPE       PRIORITY        BEHAVIOR
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                       VIEW CONFIGURATION
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
           SHEET RENDERER             CARD RENDERER
                 │                         │
           Comparison                 Recognition
           Dense                      Rich
           Structured                 Hierarchical
                 │                         │
                 └────────────┬────────────┘
                              ▼
                         USER ACTIONS
```

---

# 43 — The Core Philosophy

> **Enterprise-grade table design is not about fitting more information into less space.**

It is about creating a system that understands:

- which information matters
- when it matters
- how much information should be visible
- how users compare records
- how users recognize records
- when information should be progressively disclosed
- which actions deserve attention
- which actions should remain hidden
- how relationships should be represented
- how the system should behave as data volume grows

A table optimizes for **comparison**.

A card optimizes for **recognition**.

Expansion optimizes for **progressive disclosure**.

A detail surface optimizes for **investigation**.

Tokens optimize for **consistency**.

Configuration optimizes for **scale**.

A shared data model makes all of them work together.

---

# 44 — Recommended Build Sequence

Do not start by designing every real table.

Build in this order:

## Phase 1 — Foundations

```text
Colors
Typography
Spacing
Radius
Borders
Icons
Elevation
```

## Phase 2 — Data primitives

```text
Text
Number
Date
Person
Company
Country
Status
Tag
Link
Actions
```

## Phase 3 — Field system

```text
Field type
Field priority
Field renderer
Field states
```

## Phase 4 — Sheet system

```text
Table
Header
Cell
Row
Selection
Expansion
Toolbar
Filters
Pagination
```

## Phase 5 — Card system

```text
Record Card
Identity
Summary
Metadata
Details
Actions
Expansion
```

## Phase 6 — View system

```text
Sheet
Card
View switcher
Density
Configuration
```

## Phase 7 — Complex data

```text
Nested records
Nested collections
Related entities
Attachments
Audit information
```

## Phase 8 — Real tables

Only now implement:

```text
Visitors
Visits
Employees
Hosts
Companies
Devices
...
```

The real tables become **configurations and demonstrations of the system**, rather than separate inventions.

---

# 45 — Final Principle

The strongest enterprise data systems are not collections of beautiful components.

They are **rules for turning complex data into understandable interfaces**.

The ultimate system should allow a designer or developer to take:

```text
Any enterprise record
```

and answer:

```text
What is it?
What matters?
What should be visible?
What should be hidden?
How should it render?
What can the user do?
What happens when it expands?
What happens when data is missing?
What happens when there are 100,000 records?
```

If the design system can answer those questions consistently, it is an enterprise-grade data system.

