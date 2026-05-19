---
title: "ADR-001: Use Hybrid Service-Based Architecture with Event-Driven Communication"
---

## Context

GreenGrant is a government subsidy platform used by citizens, businesses, administrators, senior administrators, and system operators. The system must support grant browsing, application submission, document uploads, administrative review, final decisions, MundaMail notifications, audit logging, and optional AI-assisted review.

The system has several architecturally significant requirements:

- it must handle high traffic during grant openings and deadlines;
- it must remain available during active application periods;
- it must protect sensitive personal, business, financial, and document data;
- it must keep important decisions and actions auditable;
- it must store and operate processed data inside Zamunda;
- it must integrate reliably with MundaMail;
- it must allow AI assistance without replacing human decision-making;
- it must support different grant programs with different rules and required documents.

A single architectural style must therefore balance scalability, maintainability, reliability, security, auditability, and implementation complexity.

---

## Decision

We will use a **Hybrid Service-Based Architecture with Event-Driven Communication**.

The system will be divided into clear services or components based on business capabilities. User-facing workflows will use synchronous API communication when an immediate response is required. Background workflows will use asynchronous event-driven communication.

Main system components include:

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
- Relational Database;
- Object Storage;
- Event Broker / Message Queue;
- MundaMail API integration.

Synchronous communication will be used for actions such as login, viewing grants, saving drafts, submitting applications, and reviewing applications.

Asynchronous communication will be used for actions such as audit logging, document processing, AI review assistance, notification sending, and retrying failed MundaMail deliveries.

---

## Y-Statement

In the context of **building GreenGrant as a national green subsidy application platform**,  
facing **traffic spikes, sensitive data handling, auditability requirements, MundaMail integration, and changing grant rules**,  
we decided on **a Hybrid Service-Based Architecture with Event-Driven Communication**,  
and rejected **a simple monolithic architecture, a full microservices architecture, and a pure event-driven architecture**,  
to achieve **scalability, maintainability, availability, security, auditability, and reliable background processing**,  
accepting **higher complexity than a monolith and the need to manage asynchronous workflows**,  
because **GreenGrant needs clear separation of responsibilities and scalable workflows without the full operational burden of complete microservices**.

---

## Considered Options

## Option 1: Monolithic Architecture

A monolithic architecture would place most system functionality into one deployable application.

### Advantages

- Simple initial development.
- Easier local testing.
- Fewer network calls.
- Lower operational complexity.
- Easier deployment for a small prototype.

### Disadvantages

- Difficult to scale only applicant-facing functions during grant openings.
- MundaMail failures and AI failures could become tightly coupled to the core application.
- Audit logging, document handling, and notification workflows would be less isolated.
- Changes in one part of the system could affect unrelated parts.
- Less suitable for long-term government platform evolution.

### Evaluation

A monolith could work for a small demonstration, but it is not the best fit for GreenGrant because the platform has multiple distinct responsibilities and strong scalability, auditability, and reliability concerns.

---

## Option 2: Full Microservices Architecture

A full microservices architecture would split each business capability into an independently deployable service, often with its own database.

### Advantages

- Strong independent scalability.
- Independent deployment of services.
- Clear ownership of each business capability.
- Good fit for large engineering teams and complex systems.

### Disadvantages

- High operational complexity.
- Requires advanced deployment automation, monitoring, service discovery, and distributed tracing.
- More complex data consistency management.
- More network communication failure points.
- Over-engineered for the project scope.

### Evaluation

Full microservices provide strong modularity but introduce more complexity than needed for this project. GreenGrant needs service separation, but not necessarily the full operational cost of independently deployed microservices with separate databases for every capability.

---

## Option 3: Pure Event-Driven Architecture

A pure event-driven architecture would make most communication between components asynchronous.

### Advantages

- Strong decoupling.
- Good scalability for background work.
- Useful for audit trails and workflow history.
- Services can continue working independently during temporary failures.

### Disadvantages

- Not ideal for user-facing workflows requiring immediate responses.
- Harder to understand and debug.
- More difficult to guarantee immediate consistency.
- Can create unnecessary complexity for simple request-response operations.

### Evaluation

GreenGrant benefits from event-driven workflows, but not every operation should be asynchronous. Applicants and administrators need immediate responses for login, browsing grants, submitting applications, and reviewing data. Therefore, pure event-driven architecture is not selected.

---

## Option 4: Hybrid Service-Based Architecture with Event-Driven Communication

This option separates GreenGrant into clear business-oriented services or components while using event-driven communication only where it provides clear value.

### Advantages

- Clear separation of responsibilities.
- Better scalability than a monolith.
- Less operational complexity than full microservices.
- Supports asynchronous workflows for notifications, auditing, document processing, and AI assistance.
- Allows applicant-facing services to scale during traffic spikes.
- Isolates external dependencies such as MundaMail.
- Supports maintainability as grant rules change.

### Disadvantages

- More complex than a simple monolith.
- Requires clear service boundaries.
- Requires event handling and retry logic.
- Some workflows may become eventually consistent.
- Requires monitoring across several components.

### Evaluation

This option provides the best balance for GreenGrant. It supports scalability, auditability, maintainability, and reliability without overcomplicating the project.

---

## Consequences

## Positive Consequences

- Applicant-facing workflows can be scaled independently during high traffic periods.
- Notification sending can continue asynchronously without blocking decision recording.
- Audit logging can be consistently triggered by important system events.
- MundaMail integration is isolated from the core application workflow.
- AI assistance can be added as a separate advisory component.
- Grant rules and required documents can evolve inside the Grant Management Service.
- Security boundaries are clearer because applicant, administrator, and operator responsibilities are separated.

## Negative Consequences

- The system is more complex than a monolithic application.
- Developers must define clear service boundaries.
- The team must design event handling, retries, and failure recovery carefully.
- Asynchronous workflows may introduce eventual consistency.
- Monitoring and logging become more important.

## Risk Mitigation

- Keep the number of services/components reasonable.
- Use clear API contracts between components.
- Use asynchronous events only where they add value.
- Centralize cross-cutting concerns such as authentication, authorization, and audit logging.
- Monitor critical workflows such as application submission and notification delivery.
- Ensure all services, storage, logs, and backups remain inside Zamunda-approved infrastructure.

---

## Impact on Architecture

This decision affects the C4 container diagram and the major system decomposition. The architecture should include separate containers or services for:

- applicant user interface;
- administrator user interface;
- API gateway;
- identity and access management;
- grant management;
- application submission;
- document handling;
- review and evaluation;
- notification;
- audit logging;
- AI assistance;
- database;
- object storage;
- event broker.

This decision also influences later ADRs about storage, event broker selection, MundaMail integration, access control, and AI assistance.

---

## Related Requirements

- `ASR-001`: Data Residency and Local Operation
- `ASR-002`: Scalability During Grant Openings
- `ASR-003`: Availability During Application Periods
- `ASR-004`: Security and Role-Based Access Control
- `ASR-005`: Auditability and Traceability of Decisions
- `ASR-006`: Reliable MundaMail Notification Integration
- `ASR-008`: Human-Controlled AI Assistance
- `ASR-009`: Configurable Grant Rules and Required Documents

---

## Related Architectural Characteristics

- Scalability
- Availability
- Security and Privacy
- Auditability
- Data Residency
- Maintainability
- Interoperability
- Cost Efficiency

---

## Final Decision

The selected architecture style is **Hybrid Service-Based Architecture with Event-Driven Communication**.

This architecture is appropriate for GreenGrant because it supports the main needs of a national government subsidy platform: scalable applicant access, reliable application submission, secure data handling, traceable decisions, isolated MundaMail integration, and future evolution of grant programs.
