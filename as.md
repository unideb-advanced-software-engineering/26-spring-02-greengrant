# Architecture Style

This document describes the selected architecture style for the **GreenGrant** system and explains why it fits the project requirements. The architecture style is derived from the Software Requirements Specification, the architectural characteristics, and the architecturally significant requirements.

---

## Selected Architecture Style

GreenGrant uses a **Hybrid Service-Based Architecture with Event-Driven Communication**.

The system is divided into several clearly separated services or components, each responsible for a specific business capability. Synchronous communication is used for user-facing operations that need immediate responses, while asynchronous event-driven communication is used for background workflows such as notifications, audit logging, document processing, and AI-assisted review.

This approach gives GreenGrant the modularity and scalability needed for a national government platform without the unnecessary complexity of a fully distributed microservices system.

---

## Why This Style Fits GreenGrant

GreenGrant has several requirements that strongly influence the architecture:

- the platform must handle traffic spikes when new grants open;
- citizens and businesses must be able to submit applications reliably;
- sensitive personal, business, and document data must be protected;
- application review and final decisions must be auditable;
- all processed data must remain inside Zamunda;
- MundaMail integration must be reliable;
- AI assistance must support administrators without replacing human decisions;
- different grant programs must support different rules and required documents.

A hybrid service-based architecture fits these needs because it separates the system into understandable business components while still allowing the team to manage deployment and communication complexity.

Event-driven communication is added for workflows where immediate user response is not required. For example, after an administrator finalizes a decision, the system can store the decision immediately and then send a MundaMail notification asynchronously. This prevents external service delays from blocking the core application workflow.

---

## Architectural Overview

The GreenGrant system is organized around the following major components.

| Component | Responsibility |
|---|---|
| Applicant Web Portal | Allows citizens and businesses to browse grants, submit applications, upload documents, and track status. |
| Administrator Web Portal | Allows government employees to create grants, review applications, make decisions, and view reports. |
| API Gateway | Provides a controlled entry point to backend services and supports routing, authentication checks, and API security. |
| Identity and Access Service | Handles authentication, user roles, and access control. |
| Grant Management Service | Manages grant programs, deadlines, eligibility rules, scoring rules, and required documents. |
| Application Service | Handles draft applications, submitted applications, application status, and ownership rules. |
| Document Service | Handles secure upload, validation, storage, and retrieval of applicant documents. |
| Review and Evaluation Service | Supports administrator review, scoring, correction requests, approvals, and rejections. |
| Notification Service | Sends final outcome notifications through MundaMail and handles retries. |
| Audit Logging Service | Records important actions such as submissions, reviews, decisions, document changes, and notifications. |
| AI Assistant Service | Provides advisory summaries and inconsistency checks for administrators. |
| Relational Database | Stores structured data such as users, grants, applications, reviews, decisions, and notification status. |
| Object Storage | Stores uploaded documents securely inside Zamunda. |
| Event Broker / Message Queue | Supports asynchronous workflows between services. |
| MundaMail API | External government email system used for official notifications. |

---

## Communication Style

GreenGrant uses two communication styles:

## 1. Synchronous Communication

Synchronous communication is used when the user needs an immediate response.

Examples:

- applicant login;
- viewing available grants;
- saving an application draft;
- submitting an application;
- administrator opening an application;
- viewing application status.

These operations are handled through secure API calls between the web portals, API gateway, and backend services.

## 2. Asynchronous Event-Driven Communication

Asynchronous communication is used for background or non-blocking workflows.

Examples:

- sending MundaMail notifications;
- recording audit events;
- processing uploaded documents;
- triggering AI assistance;
- retrying failed notification delivery;
- updating reporting data.

Important events may include:

- `ApplicationSubmitted`;
- `DocumentUploaded`;
- `ApplicationStatusChanged`;
- `ReviewCompleted`;
- `DecisionFinalized`;
- `NotificationRequested`;
- `NotificationFailed`;
- `NotificationDelivered`;
- `AuditLogEntryCreated`;
- `AIReviewRequested`.

This event-based approach improves scalability, reliability, and fault isolation. If MundaMail or AI assistance is temporarily unavailable, the main application workflow can still continue.

---

## Relationship to Architectural Characteristics

| Architectural Characteristic | How the Architecture Supports It |
|---|---|
| Scalability | Applicant-facing services can be scaled horizontally, while background tasks are processed asynchronously. |
| Availability | Core application submission is separated from non-critical services such as AI assistance and reporting. |
| Security | Authentication, authorization, API gateway controls, and service boundaries protect sensitive functions. |
| Auditability | Important actions create audit events and are stored by a dedicated audit logging component. |
| Data Residency | Databases, object storage, logs, backups, and AI processing can be deployed inside Zamunda. |
| Usability | Applicant workflows remain fast because heavy operations are moved to background processing. |
| Interoperability | MundaMail integration is isolated in the Notification Service. |
| Maintainability | Business capabilities are separated into clear services/components. |
| Cost Efficiency | Services can scale according to demand instead of permanently over-provisioning the whole platform. |

---

## Relationship to Architecturally Significant Requirements

| ASR | Architecture Support |
|---|---|
| ASR-001 Data Residency | All services, storage, logs, and backups are deployed in Zamunda-controlled infrastructure. |
| ASR-002 Scalability | Stateless applicant services and asynchronous processing support traffic spikes. |
| ASR-003 Availability | Core workflows are isolated from non-critical and external-service failures. |
| ASR-004 Security | Identity service, RBAC, HTTPS, and backend authorization protect sensitive data. |
| ASR-005 Auditability | Audit logging service records important domain events and administrator actions. |
| ASR-006 MundaMail Integration | Notification service isolates external API communication and supports retries. |
| ASR-007 Mobile Access | Lightweight applicant APIs and separated frontend support responsive user experience. |
| ASR-008 AI Assistance | AI is separated into an advisory service and cannot finalize decisions. |
| ASR-009 Configurable Grants | Grant management service stores grant-specific rules and required documents. |

---

## Rejected Architecture Alternatives

## Alternative 1: Monolithic Architecture

A monolithic architecture would place most functionality into a single deployable application.

### Advantages

- simpler to develop initially;
- easier local testing;
- fewer network calls between components;
- lower operational complexity at the beginning.

### Reasons for Rejection

GreenGrant has several responsibilities that should be separated, including applicant workflows, administrator workflows, document storage, notification handling, audit logging, and AI assistance. A monolith would make it harder to scale only the applicant-facing parts during grant openings. It would also tightly couple MundaMail integration and AI assistance to the core application workflow.

A monolith could work for a small prototype, but it is less suitable for a national government grant platform with high availability, auditability, and scalability requirements.

---

## Alternative 2: Full Microservices Architecture

A full microservices architecture would make every business capability an independently deployable service with its own database and independent lifecycle.

### Advantages

- strong independent scalability;
- independent deployment of each service;
- clear ownership of service boundaries;
- high flexibility for large teams.

### Reasons for Rejection

Full microservices would introduce unnecessary complexity for this project. It would require advanced service discovery, distributed tracing, complex deployment automation, network failure handling, and more difficult data consistency management. For GreenGrant, a service-based modular design provides most of the needed separation without the full operational cost of microservices.

Therefore, the chosen architecture borrows useful microservice ideas, such as service boundaries and independent components, but avoids over-engineering.

---

## Alternative 3: Pure Event-Driven Architecture

A pure event-driven architecture would make most system communication asynchronous through events.

### Advantages

- strong decoupling between components;
- good scalability for background processing;
- useful for audit trails and workflow history;
- resilient to temporary service failures.

### Reasons for Rejection

GreenGrant still needs many immediate user-facing interactions. Applicants and administrators expect direct responses when logging in, viewing grants, submitting applications, or opening review pages. Making everything event-driven would make the system harder to understand and could create unnecessary complexity.

Instead, GreenGrant uses event-driven communication only where it is useful: background jobs, notifications, audit logging, AI assistance, and other non-blocking workflows.

---

## Main Trade-Offs

The chosen architecture has several trade-offs.

## Benefits

- clear separation of responsibilities;
- better scalability than a monolith;
- less complexity than full microservices;
- reliable handling of background workflows;
- easier isolation of MundaMail and AI failures;
- better support for audit logging and traceability;
- easier future extension of grant rules and services.

## Costs and Risks

- more complex than a simple monolith;
- requires careful definition of service boundaries;
- asynchronous workflows may introduce eventual consistency;
- monitoring and logging are more important;
- event failure and retry handling must be designed carefully;
- developers must avoid duplicating business logic across services.

---

## Final Decision

GreenGrant will use a **Hybrid Service-Based Architecture with Event-Driven Communication**.

This decision balances scalability, maintainability, auditability, security, and implementation complexity. The architecture separates the most important business capabilities into clear components while using asynchronous events for workflows that should not block users, such as notifications, audit logging, document processing, and AI assistance.

This style is suitable for GreenGrant because it supports the needs of a national government subsidy platform while remaining realistic and defendable for the project scope.
