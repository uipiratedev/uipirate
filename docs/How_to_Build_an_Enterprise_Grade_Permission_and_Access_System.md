# How to Build an Enterprise-Grade Permission & Access System

> A practical guide for designers, developers, product leaders, and enterprise founders building permission systems that remain secure, understandable, scalable, and operationally usable.

---

# 00 — The Core Idea

Enterprise permission systems are not simply:

> **Role → Permission → Screen**

A mature system needs to answer:

> **Who can do what, to which resource, at what scope, under which conditions, and how should that decision appear in the product?**

A useful model is:

```text
Identity
    ↓
Role / Attributes / Relationships
    ↓
Access
    ↓
Resource
    ↓
Action
    ↓
Scope / Context / Conditions
    ↓
Authorization Decision
    ↓
UI + API Enforcement
    ↓
Audit
    ↓
Review / Revoke
```

The system should be designed as one architecture shared by design and engineering.

---

# 01 — Why Enterprise Permission Systems Need Special Focus

A consumer application might have:

```text
Admin
User
```

An enterprise product can have:

```text
Organization Admin
Site Admin
Security Admin
Department Admin
Manager
Receptionist
Security Guard
Employee
Contractor
Auditor
External Partner
Service Account
API Client
```

And role alone is not enough.

Access may depend on:

```text
User
+
Role
+
Resource
+
Action
+
Organization
+
Location
+
Ownership
+
Record State
+
Time
+
Device
+
Data Sensitivity
```

That is why permission architecture must be treated as a **system**, not as a collection of checkboxes.

## The most important distinction

### Authentication

> Who are you?

### Authorization

> What are you allowed to do?

A user can be successfully authenticated and still be unauthorized to:

- open a resource
- edit a resource
- delete a resource
- see a particular field
- export data
- approve a workflow
- manage users
- change permissions

Therefore:

```text
Authentication ≠ Authorization
```

---

# 02 — The Enterprise Security Mindset

Before designing screens, establish these principles.

## 02.1 — Deny by default

If access has not been explicitly granted:

```text
DENY
```

Do not start with:

```text
Everyone can access everything
+
exceptions
```

Start with:

```text
Nothing is accessible
+
explicit policy grants access
```

---

## 02.2 — Least privilege

Give a user the minimum access required to perform their job.

Bad:

```text
Manager
→ Everything
```

Better:

```text
Manager

✓ View team records
✓ Edit team records
✓ Approve team requests

✕ Manage security
✕ Manage billing
✕ Change permissions
```

---

## 02.3 — Server-side enforcement

This is one of the most important rules for designers to understand.

Hiding this:

```text
Delete
```

does **not** make the system secure.

The backend must independently check:

```text
Identity
+
Permission
+
Resource
+
Action
+
Scope
```

Therefore:

> **The UI communicates authorization. The backend enforces authorization.**

---

## 02.4 — Never trust the client

Do not assume:

```text
Button hidden
=
User cannot perform action
```

A malicious or modified client can still send a request.

Every protected API operation must independently evaluate authorization.

---

## 02.5 — Protect objects, not just pages

Access to a page does not automatically mean access to every record on that page.

For example:

```text
Patient page
```

does not necessarily mean:

```text
All patients
```

A user might have:

```text
Patient:
View

Scope:
Assigned clinic
```

while another user has:

```text
Patient:
View

Scope:
All clinics
```

---

# 03 — The Permission Model

Use this as the base architecture:

```text
                    USER
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
         ROLE      ATTRIBUTES   RELATIONSHIP
          │           │           │
          └───────────┼───────────┘
                      ▼
                    ACCESS
                      │
             ┌────────┼────────┐
             ▼        ▼        ▼
          RESOURCE   ACTION    SCOPE
             │        │        │
             └────────┼────────┘
                      ▼
                   POLICY
                      │
                ┌─────┴─────┐
                ▼           ▼
              ALLOW        DENY
```

A more complete decision can be:

```text
Subject
+
Resource
+
Action
+
Scope
+
Context
+
Policy
=
Authorization Decision
```

---

# 04 — Access Is Not the Same as Role

A role is a grouping mechanism.

A permission is a capability.

An access rule is the actual decision about whether that capability applies.

For example:

```text
Role
Security Manager
```

may contain:

```text
Permissions

Visitor:
    View
    Create
    Edit
    Check In
    Check Out
    Approve

User:
    View

Site:
    View
```

But the role still needs scope.

```text
Security Manager

Visitor:
    View
    Scope = Building A
```

Another manager:

```text
Security Manager

Visitor:
    View
    Scope = Region North
```

Same role.

Different access.

---

# 05 — The Four Dimensions of Access

A strong enterprise system separates at least these dimensions:

```text
RESOURCE
What can the user access?

ACTION
What can the user do?

SCOPE
Where does the permission apply?

CONDITION
Under what circumstances does it apply?
```

Example:

```text
Resource:
Patient

Action:
View

Scope:
Clinic A

Condition:
Only assigned patients
```

This is much more expressive than:

```text
Role = Nurse
```

---

# 06 — Resource Access vs Action Access

This is one of the most important patterns in the system.

A user may have access to a resource without having every action on that resource.

```text
Resource:
Patients

Access:
✓ View
✓ Create
✓ Edit
✕ Delete
✕ Export
✕ Manage permissions
```

Think of it as:

```text
RESOURCE
   ↓
┌────────────────────────────┐
│ View                       │
│ Create                     │
│ Edit                       │
│ Delete                     │
│ Approve                    │
│ Export                     │
│ Assign                     │
│ Manage                     │
└────────────────────────────┘
```

Never assume:

```text
Can View
=
Can Edit
=
Can Export
=
Can Delete
```

---

# 07 — Page Access vs List Access vs Record Access

This is a critical enterprise distinction.

A user can have access to:

```text
Patient Page
```

but not necessarily:

```text
Patient List
```

or:

```text
All Patient Records
```

You should explicitly model these.

```text
Page Access
    ↓
Can enter the product area

List Access
    ↓
Can retrieve / see a collection

Record Access
    ↓
Can access an individual object

Field Access
    ↓
Can see or edit specific information
```

Example:

```text
User

✓ Access Patient page
✓ View assigned patients
✕ View global patient directory
✓ View assigned patient record
✕ View restricted clinical fields
```

This is especially important in systems containing sensitive data.

---

# 08 — The Same User Can Need Different Access to the Same Data

Consider:

```text
User: Sarah
```

Sarah may need:

```text
Patient Page
✓ Access

Patient List
✓ View assigned patients

User List
✕ View all users
```

But the same user may need user data in another context:

```text
Assign Doctor
    ↓
Doctor dropdown
    ↓
Needs a restricted list of eligible users
```

This creates an important architectural principle:

> **Access to a dataset should be evaluated according to the resource and context in which the data is being used.**

Do not assume that:

```text
No access to User List
=
Cannot see any User data anywhere
```

Nor:

```text
Access to User List
=
Access to every User everywhere
```

---

# 09 — Page-Level Access and Data-Level Access Must Be Separate

A common mistake is:

```text
Permission:
View Users
```

and then using that single permission everywhere.

Instead, consider separate concepts:

```text
Users
├── Access Users Page
├── View User List
├── View User Profile
├── Search Users
├── Select User
├── Assign User
├── Create User
├── Edit User
└── Manage User Permissions
```

These may share the same underlying data source while exposing different authorization capabilities.

---

# 10 — The Shared API Problem

This is one of the most important engineering/design problems.

Imagine:

```text
User API
    ↓
Users
```

The same user data is needed by:

### User management page

```text
Full User List
```

### Assignment dropdown

```text
Eligible Users
```

### Record owner field

```text
Allowed Owners
```

### Approval workflow

```text
Eligible Approvers
```

The mistake is creating:

```text
One API
+
One permission
+
Every consumer gets everything
```

Instead, the API/data layer should support **authorized query contexts**.

Conceptually:

```text
User Data
   │
   ├── User Management Query
   │       ↓
   │    User List Access
   │
   ├── Assignment Query
   │       ↓
   │    Assign User Access
   │
   ├── Owner Query
   │       ↓
   │    Owner Selection Access
   │
   └── Approval Query
           ↓
        Approver Access
```

The underlying data can come from the same service/API while the **authorization policy and query scope differ**.

This is preferable to creating duplicate datasets simply because the UI contexts differ.

---

# 11 — One API Does Not Mean One Permission

This distinction should be explicit.

```text
Same API
≠
Same authorization
```

And:

```text
Same database table
≠
Same UI access
```

And:

```text
Same user object
≠
Same visibility in every context
```

A backend can expose different authorized projections or query capabilities while still using the same underlying source of truth.

---

# 12 — Labels and Actions Should Be Independent

A user can have access to a resource without having access to every action.

Therefore avoid a model where:

```text
Label Access
=
All Actions
```

Instead:

```text
ACCESS
    ↓
Can see/use the resource

ACTION
    ↓
Can perform a specific operation
```

For example:

```text
Patient

Access:
✓ Patient page
✓ Patient record
✓ Patient list

Actions:
✓ View
✓ Create
✓ Edit
✕ Delete
✕ Export
```

---

# 13 — Labels Are Not Permissions

This is another important distinction.

A label might be:

```text
Patient
User
Visitor
Doctor
Location
Organization
```

But the access model should operate on:

```text
Resource
Action
Scope
Condition
```

Labels are the language presented to users.

Permissions are the underlying system model.

---

# 14 — Designing Access for Dropdowns

Dropdowns are a surprisingly important access-control surface.

Consider:

```text
Assign Owner
```

The user might not have:

```text
View Users
```

but they may have:

```text
Assign Owner
```

Therefore the dropdown should load:

```text
Eligible Owners
```

not:

```text
All Users
```

Example:

```text
Assign Doctor

Allowed:
✓ Doctors
✓ Active
✓ Same organization
✓ Same clinic

Excluded:
✕ Deactivated users
✕ Users outside scope
✕ Users without required role
```

This should be controlled by the authorization/data policy.

---

# 15 — Don't Solve Permission Problems With UI Filtering

Avoid:

```text
Load all users
↓
Hide unauthorized users in frontend
```

Prefer:

```text
Authorized query
↓
Only return eligible users
```

The frontend should never receive sensitive data simply because it plans to hide it.

---

# 16 — Organization-Level Access

Organization access is often the foundation of enterprise permission systems.

Model:

```text
Platform
   ↓
Organization
   ↓
Region
   ↓
Country
   ↓
Site
   ↓
Building
   ↓
Department
   ↓
Team
   ↓
User
```

A user's permission may be scoped at any level.

Example:

```text
Global Admin
→ All organizations

Organization Admin
→ One organization

Regional Admin
→ Region

Site Admin
→ Site

Department Manager
→ Department
```

---

# 17 — Organization Context Should Be Explicit

If a user belongs to multiple organizations:

```text
Sarah

Organization A
Organization B
Organization C
```

the system must know:

```text
Current Organization
```

and authorization should evaluate the current organization context.

Do not silently mix resources from different tenants.

---

# 18 — Multi-Tenant Isolation

For SaaS enterprise products:

```text
Organization A
    │
    └── Data A

Organization B
    │
    └── Data B

Organization C
    │
    └── Data C
```

A fundamental security requirement is:

```text
Organization A user
≠
Organization B data
```

unless explicitly authorized.

Tenant boundaries should be enforced server-side.

---

# 19 — Hierarchical Access

Enterprise access often follows organizational hierarchy.

```text
Organization
    ↓
Region
    ↓
Site
    ↓
Department
    ↓
Team
```

A permission can be:

```text
Edit Visitors
Scope = Site A
```

or:

```text
Edit Visitors
Scope = Region North
```

or:

```text
Edit Visitors
Scope = Organization
```

Define inheritance explicitly.

Do not let inheritance emerge accidentally from database relationships.

---

# 20 — Permission Inheritance

Ask:

> If a user can manage a region, do they automatically manage every site inside that region?

If yes:

```text
Inherited Access
```

If no:

```text
Explicit Access
```

Document the rule.

Example:

```text
Region Admin
    ↓
Site A
Site B
Site C
```

But perhaps:

```text
Region Admin
    ↓
Can View Sites

Cannot automatically:
    Delete Site
    Manage Site Billing
    Change Site Security
```

Inheritance should apply only to the permissions explicitly designed to inherit.

---

# 21 — Role Hierarchies

Do not automatically assume:

```text
Admin > Manager > User
```

A role hierarchy can become dangerous if it implies too much.

Prefer:

```text
Role
+
Permission Set
+
Scope
```

Example:

```text
Site Administrator

Permissions:
Users:
    View
    Create
    Edit

Visitors:
    View
    Create
    Edit
    Approve

Scope:
Site A
```

---

# 22 — Role Defaults

Enterprise administrators need good defaults.

When creating a user:

```text
Create User
```

the system should make sensible decisions about:

```text
Organization
Role
Scope
Status
Default permissions
```

Do not force an administrator to manually configure dozens of permissions for every employee.

Prefer:

```text
Select Role
↓
System applies role defaults
↓
Select scope
↓
Review exceptions
↓
Create user
```

This reduces configuration errors.

---

# 23 — Role Templates

Use role templates for common jobs.

Example:

```text
Receptionist
Security Officer
Site Manager
Organization Admin
Auditor
```

Each template can define:

```text
Default permissions
Default scope
Default restrictions
```

Then allow controlled customization.

---

# 24 — Role Creation Should Be Easy

This is an important product-design principle.

Administrators should not need to become security engineers to create a normal role.

A good role creation experience might be:

```text
Create Role

1. Name
2. Purpose
3. Scope
4. Permissions
5. Review
6. Create
```

Use progressive disclosure.

Do not expose every advanced policy option immediately.

---

# 25 — Role Creation Is Not Permission Engineering

An administrator should be able to create:

```text
Receptionist
```

without understanding:

```text
ABAC
RBAC
Policy Evaluation
Authorization Graphs
```

The system should translate business language into policy configuration.

For example:

```text
Role:
Receptionist

Can:
✓ View visitors
✓ Create visitors
✓ Edit visitors

Cannot:
✕ Approve visitors
✕ Export visitor data
✕ Manage users
```

Advanced configuration can remain available for security administrators.

---

# 26 — Progressive Disclosure for Admins

A permission management interface should have layers.

### Basic

```text
Role
Scope
Common permissions
```

### Advanced

```text
Resource
Action
Conditions
Exceptions
Inheritance
Approval
Expiration
```

### Security / Expert

```text
Policy rules
Risk
Audit requirements
Session behavior
Advanced conditions
```

This keeps everyday administration understandable without removing enterprise power.

---

# 27 — Access Levels

A useful system can expose understandable access levels:

```text
No Access
View
Create
Edit
Manage
Admin
```

But these should map to explicit underlying permissions.

For example:

```text
Edit
=
View
+
Create
+
Update
```

only if that relationship is actually valid for the product.

Do not assume that every resource follows the same hierarchy.

---

# 28 — CRUD Is Not Enough

Enterprise applications frequently need actions beyond:

```text
Create
Read
Update
Delete
```

Examples:

```text
Approve
Reject
Assign
Check In
Check Out
Publish
Archive
Restore
Export
Import
Share
Transfer
Escalate
Impersonate
Manage Permissions
```

The permission model must represent meaningful business actions.

---

# 29 — Direct Actions vs Sensitive Actions

Not every action should have the same protection.

### Low risk

```text
View
Search
Filter
```

### Medium risk

```text
Edit
Assign
Archive
```

### High risk

```text
Delete
Export
Approve
Change Permissions
Transfer Ownership
```

### Critical

```text
Disable MFA
Change Security Policy
Delete Organization
```

The action system can then determine whether additional controls are required.

---

# 30 — High-Risk Action Controls

Depending on the action:

```text
Confirmation
+
Reason
+
Re-authentication
+
MFA
+
Approval
+
Audit
```

Example:

```text
Delete Organization

→ Confirmation
→ Type organization name
→ Re-authenticate
→ Audit event
```

Not every action needs all controls.

Use risk-based design.

---

# 31 — Separation of Duties

Some permissions should not be held or used together.

Example:

```text
User A
Creates payment

User B
Approves payment
```

rather than:

```text
User A
Creates
+
Approves
own payment
```

This is especially important for:

- finance
- healthcare
- security
- compliance
- procurement
- administration

---

# 32 — Temporary Access

Enterprise users may need temporary privileges.

Model:

```text
Permission
+
Start
+
End
+
Scope
+
Reason
+
Approver
```

Example:

```text
Emergency Site Admin

Start:
09:00

End:
18:00

Scope:
Site A

Reason:
Security incident

Approved by:
Security Director
```

The access should expire automatically.

---

# 33 — Access Requests

Instead of requiring an administrator to manually configure everything:

```text
User needs access
↓
Request
↓
Approval
↓
Provision
↓
Expiration / Review
```

Example:

```text
Request:
Export Visitor Data

Reason:
Quarterly compliance report

Approver:
Security Manager

Duration:
7 days
```

---

# 34 — Joiner / Mover / Leaver

Permission systems must support the employee lifecycle.

## Joiner

```text
Employee joins
↓
Identity created
↓
Organization assigned
↓
Role assigned
↓
Default access provisioned
```

## Mover

```text
Employee changes team
↓
Old access reviewed
↓
Old access removed
↓
New role assigned
↓
New access provisioned
```

## Leaver

```text
Employee leaves
↓
Sessions revoked
↓
Access removed
↓
Ownership transferred
↓
Audit preserved
```

---

# 35 — Access Reviews

Permissions become dangerous when nobody reviews them.

A review system can show:

```text
User
Role
Scope
Permissions
Last Used
Granted By
Granted Date
Expiration
```

Then:

```text
Keep
Modify
Revoke
```

Prioritize:

```text
Admins
High-risk permissions
External users
Temporary users
Inactive users
Service accounts
```

---

# 36 — Audit

Permission changes should be traceable.

Record:

```text
Who
What
When
Before
After
Reason
Source
```

Example:

```text
Sarah changed John's role

Before:
Receptionist

After:
Site Administrator

Scope:
Building A

Reason:
Promotion

Changed:
02 Oct 2026 · 14:32
```

---

# 37 — UI States for Access

Every design system should support:

```text
Allowed
Read Only
Disabled
Restricted
Hidden
Pending
Expired
Denied
```

These are not merely visual variants.

They represent different authorization or product states.

---

# 38 — Hidden vs Disabled vs Read Only

## Hide

Use when:

- The action is irrelevant
- The user will never be able to use it
- Showing it creates unnecessary complexity

## Disable

Use when:

- The action is relevant
- Current state prevents it
- The user may become eligible

Example:

```text
Export
Disabled

Reason:
Select at least one record
```

## Read-only

Use when:

```text
User can inspect
but cannot modify
```

Example:

```text
Patient Profile
```

with:

```text
View ✓
Edit ✕
```

---

# 39 — Permission Denied Is a Designed State

Do not expose only:

```text
403
```

Design understandable states.

### No access

```text
You don't have permission to view this resource.
```

### Read-only

```text
You can view this record but don't have permission to edit it.
```

### Restricted action

```text
You don't have permission to export this data.
```

### Request access

```text
Request access
```

Only expose information that the user is themselves authorized to know.

---

# 40 — Avoid Information Leakage

Be careful with:

```text
Search
Autocomplete
Counts
Notifications
Breadcrumbs
Related records
URLs
Error messages
Exports
```

A user who cannot access a resource should not automatically learn:

```text
It exists
Who owns it
How many records exist
Its status
Sensitive metadata
```

Permission design therefore includes **information disclosure design**.

---

# 41 — Search Permissions

Search is not automatically global.

A user may have:

```text
Access to Patient page
```

but search should return:

```text
Only patients they are authorized to view
```

not:

```text
All patients
```

The same applies to:

```text
Global search
Autocomplete
Recent items
Command menus
Reports
Exports
```

---

# 42 — Dropdown Permissions

A dropdown should return only eligible options.

Example:

```text
Assign Approver
```

The API should return:

```text
Eligible Approvers
```

based on:

```text
Role
Organization
Scope
Status
Workflow
Permission
```

not:

```text
Every User
```

---

# 43 — Same Data, Different Authorized Projections

The same underlying user resource can support multiple authorized views.

```text
USER SERVICE
     │
     ├── User Management
     │      → Full permitted user attributes
     │
     ├── Assignment
     │      → Eligible users
     │
     ├── Dropdown
     │      → Name + avatar
     │
     └── Approval
            → Eligible approvers
```

This means:

```text
Same source of truth
+
Different authorization context
+
Different data projection
```

This is a powerful pattern for enterprise systems.

---

# 44 — Field-Level Access

Sometimes users can access a record but not every field.

Example:

```text
Patient

✓ Name
✓ Age
✓ Appointment
✕ Medical Notes
✕ Insurance Number
✕ Sensitive Diagnosis
```

Therefore:

```text
Record Access
≠
Complete Field Access
```

Field-level restrictions should be used carefully because they increase complexity.

---

# 45 — Organization Access + Resource Access + Action Access

A mature model can look like:

```text
ORGANIZATION
     ↓
RESOURCE ACCESS
     ↓
ACTION ACCESS
     ↓
SCOPE
     ↓
FIELD ACCESS
     ↓
CONDITION
```

Example:

```text
Organization:
Hospital A

Resource:
Patients

Action:
View

Scope:
Cardiology

Fields:
Name
Age
Appointment

Restricted:
Medical Notes
```

---

# 46 — Service Accounts and Integrations

Not every identity is a person.

Consider:

```text
User
Service Account
API Client
Integration
Automation
Background Job
```

Each should have:

```text
Identity
Permissions
Scope
Lifecycle
Audit
Revocation
```

Do not give integrations a human administrator's permissions by default.

---

# 47 — Sessions and Revocation

Access can change while a user is logged in.

Example:

```text
09:00
User = Admin

10:00
Admin permission revoked

10:01
User still has active session
```

Define what happens.

Possible controls:

```text
Immediate revocation
Token invalidation
Session expiration
Re-authentication
```

High-risk permission changes may require stronger session invalidation.

---

# 48 — Permission Testing

Do not test only:

```text
Admin works
User works
```

Test boundaries.

Use:

```text
Role
×
Resource
×
Action
×
Scope
×
State
×
Context
```

Test:

```text
Allowed
Denied
Expired
Revoked
Wrong organization
Wrong scope
Wrong owner
Wrong record ID
Direct URL
API request
Bulk action
Dropdown query
Search query
Export
```

The goal is to discover authorization gaps, not simply confirm happy paths.

---

# 49 — Permission Matrix

Create a matrix for every major resource.

| Role | Resource | View | Create | Edit | Delete | Approve | Export | Manage | Scope |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Receptionist | Visitors | ✓ | ✓ | ✓ | — | — | — | — | Site |
| Security | Visitors | ✓ | ✓ | ✓ | — | ✓ | — | — | Site |
| Site Admin | Visitors | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Site |
| Auditor | Visitors | ✓ | — | — | — | — | ✓ | — | Organization |

This is a design artifact, engineering artifact, and security artifact at the same time.

---

# 50 — Permission Configuration UX

A good enterprise permission editor should answer:

```text
WHO?
WHAT?
WHERE?
WHEN?
UNDER WHAT CONDITIONS?
```

Example:

```text
Role:
Site Manager

Resource:
Visitors

Actions:
✓ View
✓ Create
✓ Edit
✓ Approve
✕ Delete
✓ Export

Scope:
Building A

Expiration:
Never
```

Advanced:

```text
Conditions:
Only active visitors
Only during assigned shift
```

---

# 51 — Don't Make Administrators Learn the Security Architecture

This is a major product principle.

An administrator should not need to understand:

```text
RBAC
ABAC
ReBAC
Policy Engines
Authorization Graphs
```

to create a normal user.

Instead:

```text
Create User
    ↓
Name
    ↓
Organization
    ↓
Role
    ↓
Scope
    ↓
Review Access
    ↓
Create
```

The system should apply safe defaults.

---

# 52 — Admin User Creation Flow

Recommended default:

```text
Create User

1. Identity
   Name
   Email

2. Organization
   Organization / Site

3. Role
   Receptionist / Manager / Security / etc.

4. Scope
   Site / Department / Team

5. Access Summary
   What this role can do

6. Review
   Exceptions / expiry / sensitive access

7. Create
```

Do not force administrators to open a separate permission-management section for every normal user.

---

# 53 — Access Summary

After selecting a role, show:

```text
This user will be able to:

✓ View visitors
✓ Create visitors
✓ Edit visitors
✓ Check in visitors

They will not be able to:

✕ Delete visitors
✕ Export visitor data
✕ Manage users
```

This improves administrator confidence.

---

# 54 — Role Defaults + Exceptions

Use:

```text
Role Defaults
+
Controlled Exceptions
```

Example:

```text
Role:
Receptionist

Default:
Visitor View
Visitor Create
Visitor Edit

Exception:
Allow Export

Reason:
Compliance reporting

Expiration:
30 days
```

Exceptions should be visible and auditable.

---

# 55 — Permission UX Should Be Progressive

### Level 1 — Everyday admin

```text
Role
Scope
Access summary
```

### Level 2 — Advanced admin

```text
Resource
Action
Scope
Exceptions
Expiration
```

### Level 3 — Security admin

```text
Policies
Conditions
Risk
Approval
Audit
Inheritance
```

This gives enterprise power without overwhelming normal administrators.

---

# 56 — The Enterprise Permission Component System

For Figma, think in reusable primitives.

```text
Permission System
│
├── Role
│   ├── Role Badge
│   ├── Role Selector
│   └── Role Editor
│
├── Access
│   ├── Access Badge
│   ├── Access Summary
│   ├── Access Scope
│   └── Access Matrix
│
├── Actions
│   ├── Action Permission
│   ├── Action Group
│   └── Risk Level
│
├── States
│   ├── Allowed
│   ├── Read Only
│   ├── Restricted
│   ├── Disabled
│   ├── Pending
│   ├── Expired
│   └── Denied
│
├── Administration
│   ├── Create User
│   ├── Create Role
│   ├── Permission Editor
│   ├── Access Request
│   └── Approval
│
└── Audit
    ├── Audit Entry
    ├── Change History
    └── Access Review
```

---

# 57 — Design Tokens for Permission States

Permission states should be semantic.

```text
permission.allowed
permission.readOnly
permission.restricted
permission.denied
permission.pending
permission.expired
```

Do not hard-code visual meaning into individual screens.

---

# 58 — Engineering Architecture

A conceptual architecture:

```text
                    IDENTITY
                       ↓
                 AUTHENTICATION
                       ↓
                 ACCESS CONTEXT
                       ↓
              AUTHORIZATION POLICY
                       ↓
              POLICY DECISION
                       ↓
             POLICY ENFORCEMENT
                       ↓
              RESOURCE / ACTION
                       ↓
                     AUDIT
```

The authorization decision should be reusable by:

```text
UI
API
Search
Dropdowns
Exports
Reports
Background jobs
Integrations
```

---

# 59 — One Authorization Model Across the Product

Avoid:

```text
Table permission logic
≠
Dropdown permission logic
≠
API permission logic
≠
Export permission logic
```

Instead:

```text
Central Policy
      ↓
┌─────┼─────┬─────┬─────┐
UI   API  Search Dropdown Export
```

Different surfaces can present different experiences while relying on the same authorization principles.

---

# 60 — Security Checklist

## Identity

- [ ] Every identity is uniquely represented
- [ ] Human and machine identities are distinguished
- [ ] Authentication is separate from authorization
- [ ] Sessions can be revoked
- [ ] Disabled users lose access
- [ ] MFA is used where appropriate

## Authorization

- [ ] Default deny
- [ ] Least privilege
- [ ] Server-side enforcement
- [ ] Resource-level authorization
- [ ] Action-level authorization
- [ ] Scope-level authorization
- [ ] Sensitive operations have additional controls

## Roles

- [ ] Roles represent business responsibilities
- [ ] Role defaults are safe
- [ ] Permissions can be reviewed
- [ ] Exceptions are visible
- [ ] Role inheritance is explicit
- [ ] Privilege escalation is tested

## Organization

- [ ] Tenant boundaries are enforced
- [ ] Organization context is explicit
- [ ] Scope hierarchy is defined
- [ ] Cross-organization access is explicit
- [ ] Resource inheritance is documented

## Data

- [ ] Search respects permissions
- [ ] Dropdowns return only eligible records
- [ ] Exports respect authorization
- [ ] Reports respect authorization
- [ ] Field-level restrictions exist where required
- [ ] Sensitive data is not leaked through errors

## Lifecycle

- [ ] Joiner process exists
- [ ] Mover process exists
- [ ] Leaver process exists
- [ ] Temporary access expires
- [ ] Access reviews exist
- [ ] Stale permissions are removed

## Administration

- [ ] User creation is simple
- [ ] Safe defaults exist
- [ ] Role templates exist
- [ ] Access summary is understandable
- [ ] Advanced controls use progressive disclosure
- [ ] Permission changes are auditable

## Audit

- [ ] Role changes are logged
- [ ] Permission changes are logged
- [ ] High-risk actions are logged
- [ ] Actor is recorded
- [ ] Timestamp is recorded
- [ ] Before/after values are available
- [ ] Audit history is protected

## Testing

- [ ] Direct URL access tested
- [ ] API access tested
- [ ] Object-level access tested
- [ ] Wrong-organization access tested
- [ ] Wrong-scope access tested
- [ ] Expired access tested
- [ ] Revoked access tested
- [ ] Bulk operations tested
- [ ] Search tested
- [ ] Dropdowns tested
- [ ] Exports tested

---

# 61 — The Enterprise Access Decision Framework

For every protected capability, ask:

```text
1. WHO is requesting access?
2. WHAT resource are they requesting?
3. WHAT action are they trying to perform?
4. WHERE does the access apply?
5. WHICH organization does it belong to?
6. WHO owns the resource?
7. WHAT is the current resource state?
8. WHAT conditions apply?
9. HOW risky is the action?
10. DOES the action require approval?
11. SHOULD the event be audited?
12. WHEN should access expire?
```

If the system cannot answer these questions, the permission model probably needs more definition.

---

# 62 — The Enterprise Access Model

```text
                         ENTERPRISE ACCESS SYSTEM
                                  │
                                  ▼
                              IDENTITY
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                   ROLE       ATTRIBUTES    RELATIONSHIP
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                                ACCESS
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                RESOURCE        ACTION        SCOPE
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                              CONDITIONS
                                  │
                                  ▼
                                POLICY
                                  │
                           ┌──────┴──────┐
                           ▼             ▼
                         ALLOW          DENY
                           │
                           ▼
                    UI / API / DATA
                           │
                           ▼
                         AUDIT
                           │
                           ▼
                    REVIEW / REVOKE
```

---

# 63 — The Most Important Rules

If the entire tutorial has to be reduced to a few principles:

### 1.

> **Authentication answers who you are. Authorization answers what you can do.**

### 2.

> **Access to a page does not automatically mean access to every resource on that page.**

### 3.

> **Access to a resource does not automatically grant every action on that resource.**

### 4.

> **The same underlying data can be exposed through different authorized contexts and projections.**

### 5.

> **A shared API does not require a shared permission.**

### 6.

> **Dropdowns, search, exports, and autocomplete are all authorization surfaces.**

### 7.

> **The UI reflects authorization; the backend enforces it.**

### 8.

> **Default access should be safe and least-privileged.**

### 9.

> **Administrators should not need to understand the underlying security architecture to perform normal user administration.**

### 10.

> **Advanced permission systems should expose complexity progressively.**

### 11.

> **Every important permission decision should be explainable and auditable.**

### 12.

> **Permissions are lifecycle data: they are granted, used, reviewed, changed, and revoked.**

---

# 64 — Final Architecture

The ultimate system is not:

```text
Role
↓
Permissions
↓
UI
```

It is:

```text
                         IDENTITY
                            ↓
                    ORGANIZATION CONTEXT
                            ↓
                ROLE / ATTRIBUTE / RELATIONSHIP
                            ↓
                         ACCESS
                            ↓
                 ┌──────────┼──────────┐
                 ↓          ↓          ↓
             RESOURCE     ACTION     SCOPE
                 ↓          ↓          ↓
                 └──────────┼──────────┘
                            ↓
                       CONDITIONS
                            ↓
                         POLICY
                            ↓
                    AUTHORIZATION
                            ↓
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
         PAGE              DATA             ACTION
          ↓                 ↓                 ↓
        ACCESS           ACCESS           ACCESS
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ↓
                 UI / API / SEARCH / DROPDOWN
                            ↓
                          AUDIT
                            ↓
                     REVIEW / REVOKE
```

This is the **Enterprise Permission & Access System**.

The goal is not to create the most complicated permission model.

The goal is to create the **simplest model that can accurately and safely express the organization's real access rules**.

---

# 65 — Practical Implementation Sequence

Do not attempt to build the entire permission system at once.

Use this sequence:

```text
01
Inventory Resources

02
Inventory Actions

03
Define Organizations / Tenants

04
Define Scope Hierarchy

05
Define Roles

06
Define Role Defaults

07
Define Resource Access

08
Define Action Access

09
Define Contextual / Conditional Access

10
Define UI States

11
Define API Enforcement

12
Define Search / Dropdown / Export Authorization

13
Define Audit

14
Define Access Reviews

15
Define Temporary / Expiring Access

16
Test Permission Boundaries

17
Document Governance
```

---

# 66 — Designer's Deliverables

A designer working on an enterprise permission system should produce more than screens.

### Information architecture

```text
Users
Roles
Permissions
Organizations
Scopes
Access Requests
Audit
```

### Permission model

```text
Resource
Action
Scope
Condition
```

### Permission matrix

```text
Role × Resource × Action × Scope
```

### State model

```text
Allowed
Read Only
Restricted
Disabled
Pending
Expired
Denied
```

### Figma architecture

```text
Components
Variants
Variables
Semantic states
Permission patterns
```

### Workflow diagrams

```text
Create User
Create Role
Request Access
Approve Access
Revoke Access
Review Access
```

### Engineering handoff

```text
Authorization rules
API expectations
Data projections
Error states
Audit requirements
```

---

# 67 — Developer Deliverables

Engineering should turn the model into:

```text
Identity model
Role model
Permission model
Scope model
Policy model
Authorization service
API enforcement
Data filtering
Audit system
Access lifecycle
Testing matrix
```

The most important relationship is:

```text
Figma Model
      ↕
Product Model
      ↕
Backend Authorization Model
```

They should describe the same system using the vocabulary appropriate to each discipline.

---

# 68 — Enterprise Permission System: Final Checklist

Before shipping, ask:

```text
□ Can we clearly define who the user is?

□ Can we identify their organization?

□ Can we identify their role?

□ Can we identify the resource?

□ Can we identify the action?

□ Can we identify the scope?

□ Can we evaluate conditions?

□ Is access denied by default?

□ Is least privilege applied?

□ Is authorization enforced server-side?

□ Can a user bypass the UI through an API?

□ Can a user access another user's record by changing an ID?

□ Does search respect authorization?

□ Do dropdowns return only eligible records?

□ Do exports respect authorization?

□ Do reports respect authorization?

□ Can field-level restrictions be represented where necessary?

□ Are high-risk actions protected?

□ Are permission changes audited?

□ Can temporary access expire?

□ Can access be revoked?

□ Can administrators understand what they are granting?

□ Are safe defaults applied during user creation?

□ Can normal admins create users without becoming security experts?

□ Are advanced permissions progressively disclosed?

□ Are organization boundaries explicit?

□ Is permission inheritance explicit?

□ Are joiner/mover/leaver workflows defined?

□ Are access reviews defined?

□ Have permission boundaries been tested?
```

---

# Closing Principle

Enterprise access control is ultimately a **product architecture problem and a security architecture problem at the same time**.

The strongest systems do not force administrators to think like security engineers.

They do the opposite:

> **The system encodes the security model once, provides safe defaults, makes ordinary administration simple, exposes advanced controls progressively, and enforces the same rules consistently across pages, records, fields, APIs, searches, dropdowns, exports, workflows, and integrations.**

That is what makes an enterprise permission system scalable.
