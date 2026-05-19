---
title: "Software Requirements Specification for GreenGrant"
---

**Version:** 1.0  
**Prepared by:** `Chedy Salmouna, Mehdi Shili, and Huaqian lin`  
**Organization:** University of Debrecen  
**Date:** `18-05-2026`

---

## Revision History

| Name    |         Date | Reason for Changes | Version |
| ------- | -----------: | ------------------ | ------: |
| `first` | `16-04-2026` | Initial SRS draft  |     1.0 |

---

# 1. Introduction

## 1.1 Purpose

This document specifies the software requirements for **GreenGrant**, an online government platform for managing green subsidy applications in Zamunda. The system allows citizens and businesses to apply for environmental grants, upload required documents, track application status, and receive final decisions. Government administrators use the system to create grant programs, review applications, make decisions, and notify applicants through MundaMail.

## 1.2 Document Conventions

Functional requirements are marked with `FR`.  
Non-functional requirements are marked with `NFR`.  
Business rules are marked with `BR`.  
Priorities are defined as **High**, **Medium**, or **Low**.

## 1.3 Intended Audience and Reading Suggestions

This SRS is intended for project stakeholders, software architects, developers, testers, administrators, and evaluators.  
Sections 1–2 describe the system at a high level.  
Sections 3–5 define interfaces, functional requirements, non-functional requirements, and business rules.

## 1.4 Product Scope

GreenGrant supports Zamunda’s digital transformation by replacing manual or fragmented grant application processes with a centralized digital platform. The system improves accessibility for citizens and businesses, supports mobile usage, handles high traffic during grant openings, protects sensitive data, and helps administrators evaluate applications efficiently.

## 1.5 References

| Reference           | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| GreenGrant Scenario | Official project scenario from the Advanced Software Engineering course |
| MundaMail Scenario  | External government email service used for notifications                |
| IEEE SRS Template   | Software Requirements Specification template used for this document     |

---

# 2. Overall Description

## 2.1 Product Perspective

GreenGrant is a new government web application. It consists of an applicant portal, an administrator portal, backend services, a database, document storage, audit logging, and integration with MundaMail. The system must be hosted and operated inside Zamunda because of data sovereignty requirements.

## 2.2 Product Functions

The system shall provide the following main functions:

- user registration and authentication;
- applicant profile management;
- grant program browsing;
- application submission;
- document upload;
- application status tracking;
- grant program management by administrators;
- application review and decision-making;
- AI-assisted review support;
- notification through MundaMail;
- audit logging and reporting.

## 2.3 User Classes and Characteristics

| User Class           | Description                          | Main Needs                                           |
| -------------------- | ------------------------------------ | ---------------------------------------------------- |
| Citizen Applicant    | Individual applying for a subsidy    | Simple mobile-friendly application process           |
| Business Applicant   | Company applying for a subsidy       | Business data, document upload, application tracking |
| Administrator        | Government employee reviewing grants | Manage grants, review documents, make decisions      |
| Senior Administrator | Supervisor or decision authority     | Reports, oversight, audit access                     |
| System Operator      | Technical maintainer                 | Monitoring, backups, security, availability          |

## 2.4 Operating Environment

GreenGrant shall run in a government-approved hosting environment inside Zamunda. Users access the system through modern web browsers on desktop and mobile devices. The system communicates with MundaMail through a secure API.

## 2.5 Design and Implementation Constraints

- All processed data must be stored and operated inside Zamunda.
- The system must integrate with MundaMail.
- The applicant interface must be mobile-friendly.
- The system must handle high traffic during grant opening periods.
- Sensitive personal, business, and financial data must be protected.
- Important actions and decisions must be auditable.
- AI may assist administrators but must not make final decisions.
- The architecture should avoid unnecessary complexity and cost.

## 2.6 User Documentation

The project shall provide:

- applicant usage guide;
- administrator usage guide;
- document upload instructions;
- status explanation guide;
- technical deployment/maintenance notes.

## 2.7 Assumptions and Dependencies

Assumptions:

- Applicants have access to a browser and internet connection.
- Administrators are trained to use the system.
- Grant rules are provided by the responsible government authority.

Dependencies:

- MundaMail API availability.
- Government hosting infrastructure.
- Authentication service.
- Secure database and document storage.

---

# 3. External Interface Requirements

## 3.1 User Interfaces

GreenGrant shall provide two main interfaces:

### Applicant Interface

The applicant interface shall allow users to:

- register and log in;
- manage profile data;
- browse available grants;
- view eligibility rules, deadlines, and required documents;
- submit applications;
- upload documents;
- track application status;
- receive clear validation messages.

The applicant interface shall be responsive and usable on mobile devices.

### Administrator Interface

The administrator interface shall allow authorized staff to:

- create and publish grant programs;
- define deadlines, required documents, eligibility rules, and scoring rules;
- view and filter submitted applications;
- review uploaded documents;
- use AI assistance during evaluation;
- approve, reject, or request correction;
- view audit history and reports.

## 3.2 Hardware Interfaces

No special hardware interface is required. The system shall be accessible from common desktops, laptops, tablets, and smartphones.

## 3.3 Software Interfaces

| Interface              | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| MundaMail API          | Sends official decision notifications                             |
| Database               | Stores users, grants, applications, decisions, and audit metadata |
| Object Storage         | Stores uploaded documents                                         |
| Authentication Service | Handles secure login and user roles                               |
| AI Assistant Service   | Supports document/application review                              |
| Monitoring System      | Tracks system health and performance                              |

## 3.4 Communications Interfaces

- All external communication shall use HTTPS.
- Communication with MundaMail shall use secure API calls.
- Document uploads shall be transferred securely.
- Internal services may communicate synchronously through APIs and asynchronously through events.
- Failed notification delivery shall be retried.

---

# 4. System Features

## 4.1 User Registration and Authentication

**Priority:** High

The system shall allow applicants and administrators to authenticate securely and access only the functions allowed for their role.

Functional requirements:

- `FR-1.1`: The system shall allow applicants to create an account.
- `FR-1.2`: The system shall allow users to log in and log out securely.
- `FR-1.3`: The system shall support role-based access for applicants, administrators, senior administrators, and operators.
- `FR-1.4`: The system shall prevent unauthorized access to administrator functions.
- `FR-1.5`: The system shall log important authentication and access events.

---

## 4.2 Grant Program Management

**Priority:** High

Administrators shall be able to create and manage grant programs.

Functional requirements:

- `FR-2.1`: The system shall allow authorized administrators to create, edit, publish, close, and archive grant programs.
- `FR-2.2`: Each grant program shall include title, description, opening date, deadline, required documents, eligibility rules, scoring rules, and maximum requested amount.
- `FR-2.3`: The system shall prevent applicants from submitting applications outside the active submission period.
- `FR-2.4`: The system shall record important changes to grant programs for audit purposes.

---

## 4.3 Application Submission and Document Upload

**Priority:** High

Applicants shall be able to submit grant applications and upload required documents.

Functional requirements:

- `FR-3.1`: The system shall display available grant programs to applicants.
- `FR-3.2`: The system shall allow applicants to create, save, edit, and submit applications before the deadline.
- `FR-3.3`: The system shall validate required fields before final submission.
- `FR-3.4`: The system shall allow applicants to upload required documents.
- `FR-3.5`: The system shall validate uploaded files by type and size.
- `FR-3.6`: The system shall assign a unique identifier to every submitted application.
- `FR-3.7`: The system shall prevent applicants from viewing or modifying applications belonging to other users.

---

## 4.4 Application Review and Evaluation

**Priority:** High

Administrators shall review submitted applications and make final decisions.

Functional requirements:

- `FR-4.1`: The system shall allow administrators to view and filter submitted applications.
- `FR-4.2`: The system shall display applicant information, uploaded documents, and scoring information.
- `FR-4.3`: The system shall allow administrators to approve, reject, or request correction for an application.
- `FR-4.4`: The system shall require a justification when rejecting an application or requesting correction.
- `FR-4.5`: The system shall record all review actions in the audit log.
- `FR-4.6`: The system may provide AI-assisted summaries, missing-document detection, and inconsistency warnings.
- `FR-4.7`: AI-generated output shall be advisory only and shall not make final decisions.

---

## 4.5 MundaMail Notification

**Priority:** High

The system shall notify applicants about final decisions through MundaMail.

Functional requirements:

- `FR-5.1`: The system shall send final outcome notifications through the MundaMail API.
- `FR-5.2`: Notifications shall include application ID, decision result, and relevant explanation.
- `FR-5.3`: The system shall record notification delivery status.
- `FR-5.4`: The system shall retry failed notification delivery.
- `FR-5.5`: Administrators shall be able to see whether notification delivery succeeded or failed.

---

## 4.6 Audit Logging and Reporting

**Priority:** High

The system shall record important actions for transparency and accountability.

Functional requirements:

- `FR-6.1`: The system shall record application submissions.
- `FR-6.2`: The system shall record document uploads and replacements.
- `FR-6.3`: The system shall record administrator review actions.
- `FR-6.4`: The system shall record final decisions.
- `FR-6.5`: The system shall record MundaMail notification attempts.
- `FR-6.6`: The system shall record AI assistance usage.
- `FR-6.7`: Authorized administrators shall be able to search and filter audit logs.
- `FR-6.8`: Audit records shall not be editable or removable by normal users.

---

# 5. Other Nonfunctional Requirements

## 5.1 Performance Requirements

- `NFR-1.1`: The system shall handle high traffic during grant opening periods.
- `NFR-1.2`: The applicant-facing parts of the system shall support horizontal scaling.
- `NFR-1.3`: The system shall keep common page responses under 2 seconds for most users under normal load.
- `NFR-1.4`: Application submission and notification processing shall not block each other.
- `NFR-1.5`: The system shall remain usable in areas with limited bandwidth or higher latency.

## 5.2 Safety Requirements

- `NFR-2.1`: The system shall protect submitted applications from accidental data loss.
- `NFR-2.2`: The system shall require confirmation before final administrative decisions.
- `NFR-2.3`: The system shall provide backup and recovery mechanisms.
- `NFR-2.4`: AI assistance shall not be able to finalize decisions without human approval.

## 5.3 Security Requirements

- `NFR-3.1`: The system shall authenticate users before allowing access to protected data.
- `NFR-3.2`: The system shall enforce role-based access control.
- `NFR-3.3`: The system shall encrypt data in transit using HTTPS.
- `NFR-3.4`: Sensitive stored data and uploaded documents shall be protected.
- `NFR-3.5`: Applicants shall only access their own applications.
- `NFR-3.6`: Uploaded documents shall be validated to reduce security risks.
- `NFR-3.7`: The system shall log security-relevant actions.
- `NFR-3.8`: All processed data shall be stored and operated inside Zamunda.

## 5.4 Software Quality Attributes

- `NFR-4.1 Availability`: The system shall be highly available during active application periods.
- `NFR-4.2 Scalability`: The system shall support increased traffic during grant openings.
- `NFR-4.3 Usability`: The applicant portal shall be simple and mobile-friendly.
- `NFR-4.4 Auditability`: Important actions and decisions shall be traceable.
- `NFR-4.5 Maintainability`: The system shall separate applicant, grant, application, document, notification, and audit responsibilities.
- `NFR-4.6 Interoperability`: The system shall integrate reliably with MundaMail.
- `NFR-4.7 Cost Efficiency`: The system should avoid unnecessary over-provisioning outside peak periods.

## 5.5 Business Rules

- `BR-1`: Only authorized administrators may create or publish grant programs.
- `BR-2`: Every grant program must have an opening date and a deadline.
- `BR-3`: Applicants may submit applications only during the active submission period.
- `BR-4`: Every grant program must define required documents and eligibility rules.
- `BR-5`: Final decisions must be made by human administrators.
- `BR-6`: AI may support evaluation but may not make final decisions.
- `BR-7`: Final outcomes must be sent through MundaMail.
- `BR-8`: All important administrative actions must be auditable.
- `BR-9`: Applicants may only access their own applications.
- `BR-10`: All processed data must remain inside Zamunda.

---

# 6. Other Requirements

## 6.1 Data Requirements

The system shall store:

- user account data;
- applicant profile data;
- grant program data;
- application data;
- uploaded documents;
- review results;
- decisions;
- notification statuses;
- audit logs.

## 6.2 Legal and Regulatory Requirements

- The system shall follow Zamunda government data protection rules.
- The system shall store and operate processed data within Zamunda.
- The system shall support traceability of grant decisions.

## 6.3 Backup and Recovery Requirements

- The system shall regularly back up structured data and uploaded documents.
- Backups shall remain inside Zamunda.
- The system shall support recovery after infrastructure or database failure.

---

# Appendix A: Glossary

| Term           | Definition                                                             |
| -------------- | ---------------------------------------------------------------------- |
| Applicant      | Citizen or business submitting a grant application                     |
| Administrator  | Government employee managing and reviewing grant applications          |
| Grant Program  | Subsidy opportunity with rules, deadline, documents, and budget        |
| Application    | Submitted request for financial support                                |
| MundaMail      | Government email system used for official notifications                |
| Audit Log      | Record of important system actions                                     |
| AI Assistant   | Tool that supports but does not replace human review                   |
| Data Residency | Requirement that data must stay inside a specific country or territory |

---

# Appendix B: Analysis Models

The following analysis models should be included or referenced in the architecture documentation:

- C4 System Context Diagram;
- C4 Container Diagram;
- application lifecycle model: Draft → Submitted → Under Review → Correction Requested → Approved/Rejected → Closed;
- high-level data model: User, GrantProgram, Application, Document, Review, Decision, Notification, AuditLog.

---

# Appendix C: To Be Determined List

| ID    | Item                                    |
| ----- | --------------------------------------- |
| TBD-1 | Exact maximum document upload size      |
| TBD-2 | Exact accepted file formats             |
| TBD-3 | Exact MundaMail API contract            |
| TBD-4 | Exact authentication provider           |
| TBD-5 | Exact expected maximum concurrent users |
| TBD-6 | Exact data retention period             |
| TBD-7 | Exact AI model or AI hosting method     |
