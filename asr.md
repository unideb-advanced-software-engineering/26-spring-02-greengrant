# Architecturally Significant Requirements

This document identifies the **Architecturally Significant Requirements (ASRs)** of the **GreenGrant** system. These requirements are selected because they strongly influence the system architecture, including service boundaries, deployment model, data storage, integration design, security mechanisms, and reliability strategy.

The ASRs are derived from the GreenGrant case study, the Software Requirements Specification, and the architectural characteristics identified in `ac.md`.

---

## Selection Criteria

A requirement is considered architecturally significant if it:

- affects the overall structure of the system;
- introduces important quality attribute concerns;
- requires specific technology or infrastructure choices;
- affects communication between components;
- creates security, scalability, availability, or data residency constraints;
- influences the C4 diagrams or ADRs.

---

## ASR Summary

| ASR ID | Requirement | Main Architectural Concern | Priority |
|---|---|---|---|
| ASR-001 | Store and operate all processed data inside Zamunda | Data residency, deployment, compliance | High |
| ASR-002 | Handle high traffic during grant openings | Scalability, performance | High |
| ASR-003 | Keep the system available during application periods | Availability, resilience | High |
| ASR-004 | Protect sensitive applicant, business, and document data | Security, privacy | High |
| ASR-005 | Keep decisions and important actions auditable | Auditability, traceability | High |
| ASR-006 | Send final outcomes through MundaMail reliably | Interoperability, reliability | High |
| ASR-007 | Support mobile and low-bandwidth applicants | Usability, performance | Medium |
| ASR-008 | Keep AI assistance human-controlled and privacy-aware | AI governance, security | Medium |
| ASR-009 | Support changing grant rules and documents | Maintainability, configurability | Medium |

---

# ASR-001: Data Residency and Local Operation

## Requirement

All processed data must be stored and operated inside Zamunda.

## Source Requirements

- `NFR-3.8`: All processed data shall be stored and operated inside Zamunda.
- `BR-10`: All processed data must remain inside Zamunda.
- Section `2.5`: All processed data must be stored and operated inside Zamunda.
- Section `6.2`: The system shall store and operate processed data within Zamunda.

## Architectural Significance

This requirement strongly affects the deployment model, hosting provider, database location, document storage, backup strategy, logging, monitoring, and AI integration. The system cannot freely depend on external cloud services if they process or store sensitive data outside Zamunda.

## Architectural Implications

- The production environment must be hosted in Zamunda-approved infrastructure.
- Databases, object storage, backups, audit logs, and monitoring data must remain inside Zamunda.
- AI processing must not send sensitive applicant data outside the approved environment.
- External integrations should exchange only the minimum required data.
- Deployment and infrastructure choices must be justified by data sovereignty constraints.

---

# ASR-002: Scalability During Grant Openings

## Requirement

The system must handle high traffic during grant opening periods and deadlines.

## Source Requirements

- `NFR-1.1`: The system shall handle high traffic during grant opening periods.
- `NFR-1.2`: The applicant-facing parts of the system shall support horizontal scaling.
- `NFR-1.4`: Application submission and notification processing shall not block each other.
- `NFR-4.2`: The system shall support increased traffic during grant openings.

## Architectural Significance

GreenGrant traffic is expected to be uneven. During normal periods, usage may be moderate, but when a new grant opens, many applicants may try to access the system at the same time. This affects the architecture of the applicant portal, backend services, database, document upload flow, and background processing.

## Architectural Implications

- Applicant-facing services should be stateless where possible.
- Core services should support horizontal scaling.
- Heavy work such as notification sending, document processing, and AI assistance should be asynchronous.
- The system should use queues or an event broker for background tasks.
- The database and document storage must be protected from sudden overload.
- Caching can be used for public grant information.

---

# ASR-003: Availability During Application Periods

## Requirement

The system must remain available during active application periods and deadlines.

## Source Requirements

- `NFR-4.1`: The system shall be highly available during active application periods.
- `NFR-2.3`: The system shall provide backup and recovery mechanisms.
- Section `2.5`: The system must handle high traffic during grant opening periods.
- `BR-3`: Applicants may submit applications only during the active submission period.

## Architectural Significance

If the platform is unavailable during a grant deadline, applicants may lose the opportunity to apply. Availability therefore directly affects infrastructure, monitoring, backup, recovery, and failure-handling design.

## Architectural Implications

- Core application submission must be prioritized over non-critical functions.
- The system should degrade gracefully if AI assistance or reporting is unavailable.
- Health checks and monitoring are required.
- Backups and recovery procedures must be defined.
- Notification failures should not stop application decisions from being saved.
- Planned maintenance should be avoided during active grant periods.

---

# ASR-004: Security and Role-Based Access Control

## Requirement

The system must protect sensitive applicant, business, financial, and document data.

## Source Requirements

- `FR-1.2`: The system shall allow users to log in and log out securely.
- `FR-1.3`: The system shall support role-based access for applicants, administrators, senior administrators, and operators.
- `FR-1.4`: The system shall prevent unauthorized access to administrator functions.
- `FR-3.7`: The system shall prevent applicants from viewing or modifying applications belonging to other users.
- `NFR-3.1`: The system shall authenticate users before allowing access to protected data.
- `NFR-3.2`: The system shall enforce role-based access control.
- `NFR-3.3`: The system shall encrypt data in transit using HTTPS.
- `NFR-3.4`: Sensitive stored data and uploaded documents shall be protected.
- `NFR-3.6`: Uploaded documents shall be validated to reduce security risks.

## Architectural Significance

Security is central to GreenGrant because the system handles personal data, business data, uploaded documents, decisions, and government workflows. This requirement affects authentication, authorization, API design, storage design, logging, and frontend/backend separation.

## Architectural Implications

- A dedicated authentication and authorization mechanism is required.
- Role-based access control must be enforced in backend services, not only in the UI.
- Applicant and administrator functions should be clearly separated.
- All communication must use HTTPS.
- Uploaded files must be validated and stored securely.
- Sensitive data should be protected at rest.
- Security-relevant events must be logged.

---

# ASR-005: Auditability and Traceability of Decisions

## Requirement

The system must keep a traceable record of application submissions, document changes, reviews, decisions, notifications, and AI assistance usage.

## Source Requirements

- `FR-2.4`: The system shall record important changes to grant programs for audit purposes.
- `FR-4.5`: The system shall record all review actions in the audit log.
- `FR-6.1`: The system shall record application submissions.
- `FR-6.2`: The system shall record document uploads and replacements.
- `FR-6.3`: The system shall record administrator review actions.
- `FR-6.4`: The system shall record final decisions.
- `FR-6.5`: The system shall record MundaMail notification attempts.
- `FR-6.6`: The system shall record AI assistance usage.
- `FR-6.8`: Audit records shall not be editable or removable by normal users.
- `NFR-4.4`: Important actions and decisions shall be traceable.
- `BR-8`: All important administrative actions must be auditable.

## Architectural Significance

GreenGrant supports public funding decisions. The government must be able to reconstruct how an application was handled and why a decision was made. This requires an audit logging strategy that is designed into the architecture, not added as a small feature later.

## Architectural Implications

- Audit logging should be a separate concern or dedicated component.
- Important domain events should produce audit records.
- Audit logs should be append-only or protected from normal modification.
- Audit records should contain actor, timestamp, action, affected resource, and result.
- Decision justifications must be stored with the decision.
- AI assistance usage must be traceable.

---

# ASR-006: Reliable MundaMail Notification Integration

## Requirement

The system must send final application outcomes through the MundaMail API and record notification status.

## Source Requirements

- `FR-5.1`: The system shall send final outcome notifications through the MundaMail API.
- `FR-5.2`: Notifications shall include application ID, decision result, and relevant explanation.
- `FR-5.3`: The system shall record notification delivery status.
- `FR-5.4`: The system shall retry failed notification delivery.
- `FR-5.5`: Administrators shall be able to see whether notification delivery succeeded or failed.
- `NFR-4.6`: The system shall integrate reliably with MundaMail.
- `BR-7`: Final outcomes must be sent through MundaMail.

## Architectural Significance

MundaMail is an external dependency. External services can be slow, unavailable, or return errors. The architecture must isolate this dependency so that a MundaMail failure does not break the core application workflow.

## Architectural Implications

- Notification sending should be handled by a dedicated notification component or service.
- Final decisions should be saved before notification sending is attempted.
- Notifications should be processed asynchronously.
- Failed notifications should be retried.
- Notification delivery status should be stored.
- Administrators should be able to identify failed notification attempts.
- The MundaMail API should be accessed through a well-defined integration interface.

---

# ASR-007: Mobile and Low-Bandwidth Applicant Access

## Requirement

The applicant interface must be mobile-friendly and usable in areas with limited bandwidth or higher latency.

## Source Requirements

- Section `2.5`: The applicant interface must be mobile-friendly.
- `NFR-1.5`: The system shall remain usable in areas with limited bandwidth or higher latency.
- `NFR-4.3`: The applicant portal shall be simple and mobile-friendly.
- Section `3.1`: The applicant interface shall be responsive and usable on mobile devices.

## Architectural Significance

GreenGrant is a public government service. Applicants may access the portal using smartphones, unstable connections, or slower networks. This influences frontend design, API design, file upload handling, caching, and validation.

## Architectural Implications

- The applicant frontend should be responsive.
- Pages should avoid unnecessary large downloads.
- Public grant information can be cached.
- Application drafts should be supported.
- File upload errors should be handled clearly.
- Backend APIs should support efficient request/response patterns.
- The system should avoid making applicant workflows depend on slow background tasks.

---

# ASR-008: Human-Controlled AI Assistance

## Requirement

AI may assist administrators during review, but it must not make final decisions automatically.

## Source Requirements

- `FR-4.6`: The system may provide AI-assisted summaries, missing-document detection, and inconsistency warnings.
- `FR-4.7`: AI-generated output shall be advisory only and shall not make final decisions.
- `NFR-2.4`: AI assistance shall not be able to finalize decisions without human approval.
- `BR-5`: Final decisions must be made by human administrators.
- `BR-6`: AI may support evaluation but may not make final decisions.

## Architectural Significance

AI assistance introduces privacy, accountability, explainability, and operational risks. Since the system handles public funding decisions, the AI component must be separated from final decision-making and must be auditable.

## Architectural Implications

- AI should be implemented as a separate assistant component or service.
- AI output must be clearly marked as advisory.
- The administrator interface must require human confirmation for decisions.
- AI usage must be logged.
- Sensitive data sent to AI processing must respect Zamunda data residency requirements.
- The system must still work if the AI assistant is unavailable.

---

# ASR-009: Configurable Grant Rules and Required Documents

## Requirement

The system must support different grant programs with different deadlines, eligibility rules, required documents, scoring rules, and maximum requested amounts.

## Source Requirements

- `FR-2.1`: The system shall allow authorized administrators to create, edit, publish, close, and archive grant programs.
- `FR-2.2`: Each grant program shall include title, description, opening date, deadline, required documents, eligibility rules, scoring rules, and maximum requested amount.
- `BR-2`: Every grant program must have an opening date and a deadline.
- `BR-4`: Every grant program must define required documents and eligibility rules.
- `NFR-4.5`: The system shall separate applicant, grant, application, document, notification, and audit responsibilities.

## Architectural Significance

GreenGrant is not a single fixed form. Different programs may require different documents and rules. Hard-coding each grant type would make the system difficult to maintain. This requirement affects the domain model, database schema, validation logic, and administrator interface.

## Architectural Implications

- Grant definitions should be configurable by administrators.
- Required documents should be linked to each grant program.
- Validation rules should be based on grant configuration.
- Scoring rules should be stored as configurable data where possible.
- The architecture should separate grant management from application submission.
- Future grant types should be supported without rewriting the whole system.

---

# Relationship Between ASRs and Architecture

| ASR | Architecture Decision Influenced |
|---|---|
| ASR-001 Data Residency | Local hosting, database, object storage, backup location, AI hosting |
| ASR-002 Scalability | Stateless services, horizontal scaling, asynchronous processing |
| ASR-003 Availability | Monitoring, recovery, graceful degradation, fault isolation |
| ASR-004 Security | Authentication, RBAC, HTTPS, secure storage, file validation |
| ASR-005 Auditability | Append-only audit log, event logging, traceable decision history |
| ASR-006 MundaMail | Notification service, retry mechanism, external API isolation |
| ASR-007 Mobile Access | Responsive frontend, lightweight APIs, draft saving |
| ASR-008 AI Assistance | Separate AI service, human-in-the-loop, AI usage logging |
| ASR-009 Configurability | Modular grant management, configurable rules, maintainable domain model |

---

# Conclusion

The most important ASRs for GreenGrant are data residency, scalability, availability, security, auditability, and reliable MundaMail integration. These requirements directly justify the main architectural choices: a modular service-based architecture, asynchronous event processing, secure storage, role-based access control, local deployment inside Zamunda, and dedicated audit and notification components.

The remaining ASRs, such as mobile usability, human-controlled AI assistance, and configurable grant rules, further influence the system structure and support long-term maintainability.
