---
title: "ADR-003: Use an Event Broker for Asynchronous Workflows"
---

## Context

GreenGrant has several workflows that should not block the main user experience. Applicants and administrators need quick responses when submitting applications, reviewing decisions, or using the portal. However, some related work can happen in the background.

Examples of background workflows include:

- recording audit events;
- sending final outcome notifications through MundaMail;
- retrying failed notification delivery;
- processing uploaded documents;
- starting AI-assisted review;
- updating reporting data;
- handling non-critical integration tasks.

The system must also handle high traffic during grant openings. If every operation is handled synchronously, user-facing workflows may become slow or unreliable. External services such as MundaMail may also be temporarily unavailable, and such failures should not block core GreenGrant functions.

---

## Decision

We will use an **Event Broker / Message Queue** to support asynchronous workflows in GreenGrant.

The event broker will allow services to publish events when important actions happen. Other services can consume those events and perform background work independently.

Example events include:

- `ApplicationSubmitted`;
- `DocumentUploaded`;
- `ApplicationStatusChanged`;
- `ReviewStarted`;
- `ReviewCompleted`;
- `DecisionFinalized`;
- `NotificationRequested`;
- `NotificationDelivered`;
- `NotificationFailed`;
- `AIReviewRequested`;
- `AuditLogEntryCreated`.

The event broker will mainly support:

- notification delivery;
- audit logging;
- document processing;
- AI assistance;
- retry handling;
- reporting updates.

Core user-facing actions will still use synchronous APIs when users require immediate confirmation.

---

## Y-Statement

In the context of **handling GreenGrant workflows such as application submission, decision finalization, MundaMail notification, audit logging, document processing, and AI assistance**,  
facing **traffic spikes, external API failures, long-running background tasks, and the need to keep user-facing workflows responsive**,  
we decided on **using an Event Broker / Message Queue for asynchronous workflows**,  
and rejected **pure synchronous REST communication, direct point-to-point background calls, and a fully event-sourced architecture**,  
to achieve **scalability, reliability, fault isolation, retry support, and non-blocking user workflows**,  
accepting **additional operational complexity and eventual consistency in some background processes**,  
because **GreenGrant needs reliable background processing without making applicants and administrators wait for every secondary task to finish**.

---

## Considered Options

## Option 1: Pure Synchronous REST Communication

In this option, services call each other directly through synchronous APIs for every workflow step.

### Advantages

- Simple to understand.
- Immediate response from called services.
- Easier debugging for small systems.
- No separate event broker infrastructure required.

### Disadvantages

- User-facing actions may become slow if many services must respond.
- External failures, such as MundaMail unavailability, can block core workflows.
- Retry logic becomes harder to centralize.
- Services become more tightly coupled.
- Less suitable for high traffic and background processing.

### Evaluation

Synchronous communication is still useful for direct user actions, but it is not ideal for all GreenGrant workflows. Notification delivery, audit logging, document processing, and AI assistance should not block application submission or decision recording.

---

## Option 2: Direct Background Calls Without Event Broker

In this option, the backend starts background tasks directly without a proper event broker.

### Advantages

- Simpler than introducing event broker infrastructure.
- May be enough for a small prototype.
- Less initial setup.

### Disadvantages

- Harder to retry failed operations reliably.
- Background jobs can be lost if the application instance crashes.
- Scaling background work across multiple instances becomes difficult.
- Monitoring task status is harder.
- Creates hidden coupling between components.

### Evaluation

This option is not reliable enough for GreenGrant. Important workflows such as notification delivery and audit logging must be durable and observable. A proper event broker is more suitable.

---

## Option 3: Event Broker / Message Queue

This option uses a queue or broker to send events between services and process background tasks asynchronously.

### Advantages

- Keeps user-facing workflows responsive.
- Supports reliable background processing.
- Enables retry handling for failed tasks.
- Decouples services from each other.
- Helps isolate failures in MundaMail, AI assistance, or reporting.
- Supports scaling consumers independently.
- Fits audit logging and notification workflows well.

### Disadvantages

- Adds infrastructure complexity.
- Requires monitoring of queues and consumers.
- Requires careful event design.
- Some workflows become eventually consistent.
- Duplicate event handling must be considered.

### Evaluation

This is the selected option. It provides the best balance between reliability, scalability, and implementation complexity for GreenGrant.

---

## Option 4: Full Event Sourcing

In this option, the entire application state is derived from a sequence of stored domain events.

### Advantages

- Strong historical traceability.
- Excellent reconstruction of past state.
- Useful for audit-heavy domains.
- All changes are naturally represented as events.

### Disadvantages

- Much more complex to design and implement.
- Requires careful event versioning.
- Querying current state often requires projections.
- Overkill for the project scope.
- Harder for a small team to maintain correctly.

### Evaluation

Event sourcing has strong audit benefits, but it is too complex for GreenGrant’s project scope. GreenGrant needs audit logs and asynchronous events, but not a full event-sourced architecture.

---

## Broker Choice

The architecture may use a message broker such as **RabbitMQ** or **Apache Kafka**.

For this project, the generic architectural decision is to use an **Event Broker / Message Queue**. The exact technology can be selected based on implementation constraints.

A reasonable default is:

- **RabbitMQ** if the priority is simpler queue-based background processing and easier setup.
- **Kafka** if the priority is high-throughput event streaming, replayability, and long event history.

For GreenGrant, either can be defended. The most important architectural decision is not the exact product name, but the use of durable asynchronous communication for background workflows.

---

## Consequences

## Positive Consequences

- Application submission can complete without waiting for all background processing.
- Final decisions can be recorded before MundaMail delivery is attempted.
- Failed notifications can be retried.
- Audit events can be processed consistently.
- AI assistance can run in the background.
- Background consumers can be scaled independently.
- External service failures are isolated from core workflows.

## Negative Consequences

- The system requires event broker infrastructure.
- Events must be designed and documented.
- Developers must handle duplicate events and retry behavior.
- Some data may become eventually consistent.
- Monitoring is required for queues, consumers, and failed messages.

## Risk Mitigation

- Use clear event names and event schemas.
- Store important workflow state in the database.
- Use idempotent consumers where possible.
- Use retry policies for temporary failures.
- Use dead-letter queues or failed-event storage for repeated failures.
- Monitor queue length, failed events, and consumer health.
- Do not use asynchronous communication where immediate user response is required.

---

## Impact on Architecture

This decision affects several components.

| Component                     | Impact                                                                   |
| ----------------------------- | ------------------------------------------------------------------------ |
| Application Service           | Publishes events such as `ApplicationSubmitted`.                         |
| Document Service              | Publishes `DocumentUploaded` and may consume document processing events. |
| Review and Evaluation Service | Publishes review and decision events.                                    |
| Notification Service          | Consumes `NotificationRequested` events and communicates with MundaMail. |
| Audit Logging Service         | Consumes important domain events and writes audit records.               |
| AI Assistant Service          | Consumes `AIReviewRequested` events and produces advisory results.       |
| Reporting Component           | Can consume domain events to update administrative reports.              |
| Event Broker                  | Stores and routes events between services.                               |

---

## Example Workflow: Decision Notification

1. Administrator finalizes an application decision.
2. Review and Evaluation Service saves the decision in the database.
3. Review and Evaluation Service publishes `DecisionFinalized`.
4. Audit Logging Service records the decision event.
5. Notification Service receives the event or a derived `NotificationRequested` event.
6. Notification Service calls the MundaMail API.
7. Notification Service records delivery status.
8. If MundaMail fails, the notification is retried.
9. Repeated failures are marked for administrator attention.

This workflow ensures that a MundaMail outage does not prevent the decision from being saved.

---

## Related Requirements

- `ASR-002`: Scalability During Grant Openings
- `ASR-003`: Availability During Application Periods
- `ASR-005`: Auditability and Traceability of Decisions
- `ASR-006`: Reliable MundaMail Notification Integration
- `ASR-008`: Human-Controlled AI Assistance

---

## Related Architectural Characteristics

- Scalability
- Availability
- Auditability
- Interoperability
- Maintainability
- Cost Efficiency

---

## Final Decision

GreenGrant will use an **Event Broker / Message Queue** for asynchronous workflows.

This decision supports scalable, reliable, and non-blocking processing for notifications, audit logs, document processing, AI assistance, and reporting updates. Core user-facing actions will continue to use synchronous APIs when immediate responses are required.
