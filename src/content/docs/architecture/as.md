---
title: "Architecture Style"
description: "Selected architecture style for the GreenGrant system."
---

## Overview

GreenGrant adopts a **Hybrid Service-Based Architecture with Event-Driven Communication**.

This means that the system is divided into clear business-oriented services, while asynchronous events are used for workflows that should not block the user experience. The goal is to keep the architecture scalable, secure, auditable, and maintainable without making the project unnecessarily complex.

This decision is closely related to the main GreenGrant requirements: high traffic during grant openings, secure document handling, auditability of public funding decisions, local data operation inside Zamunda, MundaMail integration, and human-controlled AI assistance.

---

## Primary Style: Service-Based Architecture

GreenGrant is structured around services that represent major business responsibilities. Each service owns a clear part of the system logic.

Main services/components include:

- **Applicant Web Portal** – used by citizens and businesses to browse grants, submit applications, upload documents, and track status.
- **Administrator Web Portal** – used by government employees to manage grants, review applications, make decisions, and view reports.
- **API Gateway** – provides a controlled entry point to backend services.
- **Identity and Access Service** – handles authentication, user roles, and role-based access control.
- **Grant Management Service** – manages grant programs, deadlines, eligibility rules, scoring rules, and required documents.
- **Application Service** – handles draft applications, submissions, statuses, and applicant ownership rules.
- **Document Service** – manages document validation, metadata, secure upload, and retrieval.
- **Review and Evaluation Service** – supports administrative review, correction requests, approvals, and rejections.
- **Notification Service** – sends final outcome notifications through MundaMail.
- **Audit Logging Service** – records important actions and decisions.
- **AI Assistant Service** – provides advisory support for administrators without making final decisions.

This style fits GreenGrant because the system has multiple responsibilities that should not be mixed together. Separating these responsibilities improves maintainability, security, and scalability.

---

## Supporting Style: Event-Driven Architecture

Event-driven communication is used for workflows that can happen in the background.

Examples include:

- sending MundaMail notifications;
- recording audit events;
- processing uploaded documents;
- triggering AI-assisted review;
- retrying failed notification delivery;
- updating reports.

Example events:

- `ApplicationSubmitted`
- `DocumentUploaded`
- `DecisionFinalized`
- `NotificationRequested`
- `NotificationDelivered`
- `NotificationFailed`
- `AIReviewRequested`

This prevents slow or failing background tasks from blocking important user actions. For example, when an administrator finalizes a decision, the decision is saved first. Then a notification event is created, and the Notification Service sends the MundaMail message asynchronously. If MundaMail is unavailable, the decision is still stored and notification delivery can be retried later.

---

## Why This Style Fits GreenGrant

The hybrid approach supports the most important architectural characteristics of GreenGrant:

| Characteristic   | Architectural Support                                                                 |
| ---------------- | ------------------------------------------------------------------------------------- |
| Scalability      | Applicant-facing services can be scaled during grant openings.                        |
| Availability     | Core workflows are separated from non-critical services like AI and notifications.    |
| Security         | Authentication, RBAC, and service boundaries protect sensitive functions.             |
| Auditability     | Important actions generate audit events and traceable records.                        |
| Data Residency   | Services, databases, documents, logs, and AI processing can be hosted inside Zamunda. |
| Interoperability | MundaMail integration is isolated in the Notification Service.                        |
| Maintainability  | Grant, application, document, review, notification, and audit logic are separated.    |

---

## Rejected Alternatives

## Monolithic Architecture

A monolithic architecture would be simpler to build at the beginning, but it would mix too many responsibilities in one application. GreenGrant needs separate handling for applications, documents, reviews, notifications, audit logs, and AI assistance. A monolith would also make it harder to scale only the applicant-facing parts during grant openings.

For a small prototype, a monolith could work. For GreenGrant as a national government platform, it is less suitable.

## Full Microservices Architecture

A full microservices architecture would provide strong independent deployment and scalability, but it would also introduce unnecessary complexity for this project. It would require more advanced deployment automation, service discovery, distributed tracing, and complex data consistency management.

GreenGrant needs modularity, but not the full operational burden of microservices. A service-based architecture gives most of the useful separation while staying more realistic.

## Pure Event-Driven Architecture

A pure event-driven system would make most communication asynchronous. This is useful for background workflows, but not ideal for user-facing actions. Applicants and administrators need immediate responses when logging in, browsing grants, submitting applications, or reviewing records.

Therefore, GreenGrant uses event-driven communication only where it adds value.

---

## Main Trade-Offs

## Benefits

- clearer separation of responsibilities;
- better scalability than a monolith;
- less complexity than full microservices;
- reliable background processing;
- easier isolation of MundaMail failures;
- stronger support for audit logging;
- easier future changes to grant rules and workflows.

## Costs

- more complex than a simple monolith;
- requires clear service boundaries;
- requires monitoring of services and event processing;
- asynchronous workflows may introduce eventual consistency;
- retry handling must be designed carefully.

---

## Final Decision

GreenGrant will use a **Hybrid Service-Based Architecture with Event-Driven Communication**.

This style is selected because it balances scalability, security, auditability, maintainability, and implementation complexity. It allows GreenGrant to support high-traffic application periods, secure handling of sensitive data, reliable MundaMail integration, traceable decisions, and human-controlled AI assistance while remaining realistic for the project scope.
