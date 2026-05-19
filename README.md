# GreenGrant

GreenGrant is a government subsidy application platform designed for Zamunda. The system allows citizens and businesses to apply for green investment grants, upload required documents, track application status, and receive official decisions. Government administrators use the system to create grant programs, review applications, request corrections, make final decisions, and notify applicants through MundaMail.

This repository contains the software requirements and architecture documentation for the GreenGrant project.

---

## Project Context

GreenGrant is part of Zamunda's digital transformation initiative. Its goal is to replace manual or fragmented grant application processes with a centralized digital platform.

The system must support:

- citizen and business applicants;
- mobile-friendly application submission;
- document upload and validation;
- administrative review and decision-making;
- MundaMail notification integration;
- audit logging and traceability;
- secure handling of sensitive data;
- local data storage and operation inside Zamunda;
- traffic spikes during grant opening periods;
- optional human-controlled AI assistance for administrators.

---

## Main Architectural Goal

The main architectural goal is to design GreenGrant as a secure, scalable, auditable, and maintainable government platform.

The selected architecture style is:

**Hybrid Service-Based Architecture with Event-Driven Communication**

This means that GreenGrant is divided into clear business-oriented components, while asynchronous events are used for background workflows such as notification sending, audit logging, document processing, and AI assistance.

---

## Main Quality Attributes

The most important architectural characteristics are:

| Characteristic | Reason |
|---|---|
| Scalability | The system must handle high traffic when new grants open. |
| Availability | Applicants must be able to submit applications before deadlines. |
| Security and Privacy | The system handles personal, business, financial, and document data. |
| Auditability | Government decisions must be traceable and explainable. |
| Data Residency | All processed data must remain inside Zamunda. |
| Interoperability | The system must integrate with MundaMail. |
| Maintainability | Grant rules and processes may change over time. |

---

## Documentation Structure

| File / Folder | Description |
|---|---|
| `case-study.md` | GreenGrant case study and project scenario. |
| `srs.md` or `srs.doc` | Software Requirements Specification. |
| `ac.md` | Architectural Characteristics. |
| `asr.md` | Architecturally Significant Requirements. |
| `as.md` | Selected Architecture Style. |
| `adr/` | Architecture Decision Records. |
| `diagram.likec4` | LikeC4 architecture model containing C4 views. |
| `System Context Diagram.mdx` | Page rendering the C4 System Context Diagram. |
| `Container Diagram.mdx` | Page rendering the C4 Container Diagram. |

---

## Architecture Decision Records

The project includes the following ADRs:

| ADR | Decision |
|---|---|
| `01-architecture-style.md` | Use Hybrid Service-Based Architecture with Event-Driven Communication. |
| `02-data-storage.md` | Use PostgreSQL with Object Storage for applications and documents. |
| `03-event-broker.md` | Use an Event Broker / Message Queue for asynchronous workflows. |
| `04-role-based-access-control.md` | Use Role-Based Access Control for security. |
| `05-mundamail-notification-service.md` | Use a dedicated Notification Service for MundaMail integration. |
| `06-human-in-the-loop-ai-assistance.md` | Use Human-in-the-Loop AI Assistance for application review. |

---

## Main Components

The proposed GreenGrant architecture contains the following main components:

- Applicant Web Portal;
- Administrator Web Portal;
- API Gateway;
- Identity and Access Service;
- Grant Management Service;
- Application Service;
- Document Service;
- Review and Evaluation Service;
- Notification Service;
- Audit Logging Service;
- AI Assistant Service;
- PostgreSQL Database;
- Object Storage;
- Event Broker / Message Queue;
- MundaMail API.

---

## C4 Diagrams

The architecture is documented using LikeC4.

The project contains two main views:

1. **System Context Diagram**  
   Shows GreenGrant, its main users, MundaMail, and Zamunda hosting.

2. **Container Diagram**  
   Shows the internal GreenGrant components and their relationships.

The LikeC4 source file is:

```text
diagram.likec4
```

The expected view IDs are:

```text
l1_context
l2_containers
```

---

## Important Design Decisions

GreenGrant separates user-facing workflows from background workflows.

Examples of synchronous user-facing workflows:

- login;
- browsing grants;
- saving application drafts;
- submitting applications;
- viewing application status;
- reviewing applications.

Examples of asynchronous workflows:

- sending MundaMail notifications;
- recording audit events;
- processing documents;
- triggering AI assistance;
- retrying failed notification deliveries;
- updating reports.

This design improves scalability, availability, and fault isolation.

---

## Data Storage Strategy

GreenGrant uses:

- **PostgreSQL** for structured data such as users, grants, applications, reviews, decisions, and notification metadata;
- **Object Storage** for uploaded applicant documents;
- protected audit records for traceability.

All processed data, backups, logs, and AI processing must remain inside Zamunda-approved infrastructure.

---

## AI Assistance

AI is used only as an advisory tool for administrators.

The AI Assistant may:

- summarize uploaded documents;
- detect missing information;
- highlight inconsistencies;
- suggest review points.

The AI Assistant must not:

- approve applications;
- reject applications;
- make final decisions;
- send final notifications;
- replace human review.

Final decisions remain the responsibility of authorized human administrators.

---

## External Integration

GreenGrant integrates with **MundaMail** to send official outcome notifications.

The Notification Service handles:

- message formatting;
- MundaMail API calls;
- delivery status storage;
- retries after failure;
- failed notification reporting;
- audit logging of notification attempts.

---

## Status

This repository contains architecture and requirements documentation for the GreenGrant design project.
