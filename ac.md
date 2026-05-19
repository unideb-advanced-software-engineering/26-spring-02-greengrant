# Architectural Characteristics

This document identifies the most important architectural characteristics of the **GreenGrant** system. These characteristics are derived from the GreenGrant case study and the Software Requirements Specification. They represent the quality attributes that have the strongest influence on the architecture, technology choices, deployment model, and major design decisions.

GreenGrant is a government subsidy platform used by citizens, businesses, administrators, and system operators. Since the system handles sensitive application data, official decisions, uploaded documents, and notification workflows, its architecture must prioritize reliability, security, transparency, scalability, and data sovereignty.

---

## Summary of Architectural Characteristics

| Characteristic | Priority | Reason |
|---|---:|---|
| Scalability | High | The platform must handle traffic spikes when new grant programs open. |
| Availability | High | Applicants must be able to submit applications before deadlines. |
| Security and Privacy | High | The system handles personal, business, financial, and document data. |
| Auditability | High | Government decisions must be traceable and explainable. |
| Data Residency | High | All processed data must be stored and operated inside Zamunda. |
| Usability | Medium | Applicants may use mobile devices and low-bandwidth connections. |
| Interoperability | Medium | The system must integrate with MundaMail and future government services. |
| Maintainability | Medium | Grant rules and government processes may change over time. |
| Cost Efficiency | Medium | The system should avoid unnecessary over-provisioning outside peak periods. |

---

## 1. Scalability

**Priority:** High

GreenGrant must support a large number of citizens and businesses, especially when a new subsidy program opens. Application traffic is expected to be uneven: normal usage may be moderate, but demand can increase sharply during grant opening periods and close to deadlines.

The architecture should therefore support horizontal scaling of applicant-facing services. Long-running operations, such as document processing, notification sending, and AI-assisted analysis, should be handled asynchronously so that they do not block the user interface.

**Architectural impact:**

- applicant-facing components should be stateless where possible;
- backend services should support horizontal scaling;
- document uploads and notifications should use asynchronous processing;
- the system should use queues or events for heavy background tasks;
- the database and object storage must be able to handle increased load during peak periods.

---

## 2. Availability

**Priority:** High

The system must remain available during active application periods. If GreenGrant is unavailable during a deadline or grant opening period, applicants may lose the opportunity to submit their applications, which could cause financial and administrative harm.

The architecture should reduce single points of failure and support recovery from technical problems. Non-critical features, such as AI assistance or reporting, should not prevent core application submission from working.

**Architectural impact:**

- core services should be monitored and health-checked;
- backups and recovery mechanisms are required;
- the system should degrade gracefully if non-critical services fail;
- MundaMail failures should not block application review or decision recording;
- maintenance should be avoided during active application periods.

---

## 3. Security and Privacy

**Priority:** High

GreenGrant processes sensitive information, including personal data, business data, financial information, uploaded documents, application decisions, and administrator actions. Unauthorized access or data leakage would damage public trust and may violate government data protection rules.

The architecture must enforce authentication, authorization, secure communication, and protection of stored data. Administrator functions require stricter access control than normal applicant functions.

**Architectural impact:**

- all users must authenticate before accessing protected data;
- role-based access control is required for applicants, administrators, senior administrators, and operators;
- all external communication must use HTTPS;
- sensitive stored data and documents must be protected;
- uploaded files must be validated before storage;
- administrator actions must be logged;
- applicants must only access their own applications.

---

## 4. Auditability and Traceability

**Priority:** High

GreenGrant supports public funding decisions, so application handling must be transparent and reconstructable. It must be possible to understand who submitted an application, who reviewed it, what decision was made, when it happened, and why.

Auditability is especially important because administrators can approve, reject, or request correction for applications. AI assistance may support review, but final responsibility must remain with human administrators.

**Architectural impact:**

- important events must be recorded in an audit log;
- audit records should be append-only or protected from normal modification;
- application status changes must be traceable;
- final decisions must include justification where necessary;
- AI assistance usage must be logged;
- notification attempts and delivery results must be recorded.

Important auditable events include:

- user login and access attempts;
- application submission;
- document upload or replacement;
- review actions;
- correction requests;
- approval or rejection decisions;
- MundaMail notification attempts;
- AI assistance usage.

---

## 5. Data Residency and Sovereignty

**Priority:** High

The GreenGrant scenario requires that all processed data is stored and operated inside Zamunda. This affects hosting, storage, backups, AI processing, monitoring, and external integrations.

The system must not depend on foreign infrastructure for sensitive data processing unless it is explicitly approved. This requirement is especially important for uploaded documents, applicant data, decision records, and audit logs.

**Architectural impact:**

- databases must be hosted inside Zamunda;
- document storage must be located inside Zamunda;
- backups must remain inside Zamunda;
- logs and monitoring data containing sensitive information must remain inside Zamunda;
- AI processing must follow the same data residency constraints;
- external integrations must avoid sending unnecessary sensitive data outside the approved environment.

---

## 6. Usability and Accessibility

**Priority:** Medium

GreenGrant is used by citizens and businesses with different levels of technical experience. The applicant portal must be easy to use, especially on mobile devices. Some applicants may use the system from areas with limited bandwidth or unstable connections.

The architecture and user interface should support a simple, clear, and forgiving application process. Applicants should be able to save drafts, see missing information, upload documents, and track application status.

**Architectural impact:**

- the applicant interface should be responsive and mobile-friendly;
- pages should avoid unnecessary large downloads;
- validation messages should be clear;
- draft saving should be supported;
- the system should tolerate temporary network problems where possible;
- core applicant workflows should remain simple and easy to understand.

---

## 7. Interoperability

**Priority:** Medium

GreenGrant must integrate with MundaMail to send official decision notifications to applicants. The system may also need future integration with other government services.

The architecture should keep external integrations isolated from the core application logic so that changes in external APIs do not require major changes across the whole system.

**Architectural impact:**

- MundaMail communication should be handled by a dedicated integration component or notification service;
- failed notifications should be retried;
- notification delivery status should be stored;
- external APIs should be accessed through well-defined interfaces;
- future government integrations should be possible without redesigning the full system.

---

## 8. Maintainability and Evolvability

**Priority:** Medium

Grant programs, eligibility rules, required documents, scoring models, and administrative processes may change over time. The system should be maintainable enough to support new grant types and rule changes without rewriting the whole platform.

The architecture should separate major responsibilities such as user management, grant management, application handling, document storage, review, notification, and audit logging.

**Architectural impact:**

- responsibilities should be separated into clear components or services;
- grant rules and required documents should be configurable;
- APIs between major components should be documented;
- business logic should not be duplicated across the applicant and administrator interfaces;
- changes to one feature should have limited impact on unrelated features.

---

## 9. Cost Efficiency

**Priority:** Medium

GreenGrant must support high load during specific periods, but it should not waste resources during normal periods. A government platform should be reliable and scalable while still avoiding unnecessary infrastructure cost.

The architecture should allow capacity to increase during peak demand and decrease during normal operation.

**Architectural impact:**

- scalable infrastructure should be preferred over permanent over-provisioning;
- background jobs should be processed efficiently;
- non-critical workloads can be scheduled outside peak periods;
- monitoring should help identify resource waste;
- technology choices should balance operational cost with reliability and maintainability.

---

## Conclusion

The most architecturally significant characteristics for GreenGrant are **scalability, availability, security, auditability, and data residency**. These qualities directly influence the chosen architecture style, deployment model, data storage strategy, integration approach, and ADRs.

Supporting characteristics such as usability, interoperability, maintainability, and cost efficiency are also important, but they should not weaken the core government requirements of secure, traceable, scalable, and locally operated grant processing.
