---
title: "ADR-005: Use a Dedicated Notification Service for MundaMail Integration"
---

## Context

GreenGrant must notify applicants about final application outcomes through the **MundaMail API**. These notifications are important because they represent official communication between the government and citizens or businesses.

Final decisions may include:

- approval;
- rejection;
- request for correction;
- information about next steps;
- application identifier;
- relevant explanation or justification.

MundaMail is an external system. It may be temporarily unavailable, slow, or return errors. GreenGrant must therefore avoid making core application review and decision recording depend directly on immediate MundaMail availability.

The system must also record notification delivery status for traceability and administrative follow-up.

---

## Decision

We will use a dedicated **Notification Service** to handle all MundaMail communication.

The Review and Evaluation Service will save final decisions and publish a notification event. The Notification Service will consume that event, prepare the message, call the MundaMail API, record delivery status, and retry failed delivery attempts.

The Notification Service will be responsible for:

- receiving notification requests;
- formatting official decision messages;
- calling the MundaMail API;
- storing delivery status;
- retrying failed deliveries;
- exposing notification status to administrators;
- producing audit events for notification attempts.

This keeps external email integration separate from the core application review workflow.

---

## Y-Statement

In the context of **sending official GreenGrant decision notifications to applicants through MundaMail**,  
facing **external API failures, delivery tracking needs, retry requirements, and auditability concerns**,  
we decided on **a dedicated Notification Service with asynchronous MundaMail integration**,  
and rejected **direct synchronous MundaMail calls from the Review and Evaluation Service, manual notification handling, and embedding notification logic in multiple services**,  
to achieve **reliable delivery, fault isolation, retry support, traceability, and maintainability**,  
accepting **additional component complexity and eventual consistency between decision finalization and notification delivery**,  
because **GreenGrant must save official decisions reliably even if MundaMail is temporarily unavailable**.

---

## Considered Options

## Option 1: Direct Synchronous MundaMail Calls from Review Service

In this option, the Review and Evaluation Service calls MundaMail immediately when an administrator finalizes a decision.

### Advantages

- Simple workflow.
- Immediate notification attempt.
- Fewer components.
- Easier to understand for a small prototype.

### Disadvantages

- If MundaMail is slow, the administrator workflow becomes slow.
- If MundaMail is unavailable, decision finalization may fail or become complicated.
- Retry logic would be mixed with review logic.
- Notification delivery status would be harder to manage cleanly.
- External integration becomes tightly coupled to core decision-making.

### Evaluation

This option is too fragile for GreenGrant. Decision recording is a core government workflow and should not depend directly on the immediate availability of an external email API.

---

## Option 2: Manual Notification by Administrators

In this option, the system records the decision, but administrators manually send outcome notifications outside GreenGrant.

### Advantages

- No technical integration required.
- Avoids dependency on MundaMail API availability.
- Simple implementation.

### Disadvantages

- Slow and error-prone.
- Does not scale for many applicants.
- Harder to audit.
- Risk of missed notifications.
- Inconsistent message format.
- Does not satisfy the requirement for system-based MundaMail notification.

### Evaluation

Manual notification is not suitable for GreenGrant. A national subsidy system requires consistent, traceable, and automated official notifications.

---

## Option 3: Notification Logic Embedded in Multiple Services

In this option, different services send their own MundaMail messages directly.

### Advantages

- Each service controls its own notifications.
- No central notification component needed.
- Can be quick to implement initially.

### Disadvantages

- Duplicated notification logic.
- Inconsistent message formatting.
- Harder to manage retries.
- Harder to monitor delivery status.
- More services depend directly on MundaMail.
- More difficult to change if the MundaMail API changes.

### Evaluation

This option would reduce maintainability. MundaMail integration should be centralized in one component to avoid duplicated external API logic.

---

## Option 4: Dedicated Notification Service

In this option, a dedicated service handles notification requests and all communication with MundaMail.

### Advantages

- Separates notification logic from decision logic.
- Isolates MundaMail failures from core application workflows.
- Supports retry handling.
- Stores delivery status consistently.
- Provides one place to change MundaMail integration.
- Easier to monitor notification failures.
- Easier to audit notification attempts.
- Supports future notification channels if needed.

### Disadvantages

- Adds one more component to the architecture.
- Requires event or queue-based communication.
- Notification delivery may happen shortly after decision finalization, not instantly.
- Requires monitoring of notification queues and failures.

### Evaluation

This is the selected option. It provides the best reliability and maintainability for GreenGrant’s official notification workflow.

---

## Notification Workflow

1. Administrator finalizes an application decision.
2. Review and Evaluation Service saves the decision.
3. Review and Evaluation Service publishes a `DecisionFinalized` or `NotificationRequested` event.
4. Audit Logging Service records the decision event.
5. Notification Service consumes the notification event.
6. Notification Service creates the official MundaMail message.
7. Notification Service sends the message through the MundaMail API.
8. Notification Service records delivery status.
9. If delivery fails, the Notification Service retries.
10. If repeated retries fail, the notification is marked for administrator attention.

---

## Notification Statuses

The system should support notification states such as:

| Status                    | Meaning                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| Pending                   | Notification request has been created but not sent yet.              |
| Sending                   | Notification delivery is currently being attempted.                  |
| Delivered                 | MundaMail confirmed successful delivery or acceptance.               |
| Failed                    | Delivery failed and retry may be attempted.                          |
| Retry Scheduled           | The system will attempt delivery again later.                        |
| Manual Attention Required | Automatic retries failed and an administrator should check the case. |

---

## Consequences

## Positive Consequences

- Final decisions can be saved even if MundaMail is unavailable.
- Notification delivery can be retried automatically.
- Notification status is visible to administrators.
- MundaMail integration is isolated in one component.
- Changes to the MundaMail API affect only the Notification Service.
- Notification attempts can be audited.
- The system becomes more reliable during external service failures.

## Negative Consequences

- Notification delivery becomes eventually consistent.
- The system needs an event broker or message queue.
- The Notification Service must be monitored.
- Failed messages require retry and failure-handling logic.
- Administrators may need a view for failed notification attempts.

## Risk Mitigation

- Store notification status in the database.
- Use asynchronous events for notification requests.
- Use retry policies for temporary failures.
- Use a failed-notification state after repeated failures.
- Log all notification attempts.
- Show notification status in the administrator interface.
- Avoid storing unnecessary sensitive data in notification payloads.
- Keep MundaMail API credentials secure.

---

## Impact on Architecture

This decision affects the following components:

| Component                     | Impact                                                   |
| ----------------------------- | -------------------------------------------------------- |
| Review and Evaluation Service | Saves decisions and publishes notification events.       |
| Notification Service          | Handles all MundaMail API communication and retry logic. |
| Event Broker / Message Queue  | Transfers notification events asynchronously.            |
| Audit Logging Service         | Records notification attempts and results.               |
| Administrator Web Portal      | Displays notification status and failures.               |
| Database                      | Stores notification metadata and delivery status.        |
| MundaMail API                 | Receives official decision notifications.                |

---

## Related Requirements

- `ASR-003`: Availability During Application Periods
- `ASR-005`: Auditability and Traceability of Decisions
- `ASR-006`: Reliable MundaMail Notification Integration
- `FR-5.1`: The system shall send final outcome notifications through the MundaMail API.
- `FR-5.3`: The system shall record notification delivery status.
- `FR-5.4`: The system shall retry failed notification delivery.

---

## Related Architectural Characteristics

- Interoperability
- Availability
- Auditability
- Maintainability
- Scalability

---

## Final Decision

GreenGrant will use a dedicated **Notification Service** for MundaMail integration.

This decision ensures that official applicant notifications are reliable, traceable, and isolated from the core application review workflow. It also supports retry handling and allows GreenGrant to continue recording decisions even when MundaMail is temporarily unavailable.
