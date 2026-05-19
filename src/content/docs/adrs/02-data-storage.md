---
title: "ADR-002: Use PostgreSQL with Object Storage for Applications and Documents"
---

## Context

GreenGrant handles several different types of data:

- user accounts and roles;
- applicant profiles;
- business applicant information;
- grant programs;
- eligibility rules;
- required document definitions;
- draft and submitted applications;
- uploaded applicant documents;
- review actions;
- correction requests;
- approval and rejection decisions;
- notification status;
- audit records.

Some of this data is highly structured and relational, such as users, grants, applications, reviews, and decisions. Other data consists of larger uploaded files, such as certificates, invoices, declarations, and supporting documents.

The system must also satisfy important architectural requirements:

- all processed data must remain inside Zamunda;
- sensitive personal, business, and document data must be protected;
- application and decision history must be traceable;
- the system must support backups and recovery;
- the system must support changing grant rules and required documents;
- the system must handle high traffic during grant openings.

---

## Decision

We will use **PostgreSQL** as the main relational database for structured GreenGrant data, and **object storage** for uploaded documents.

PostgreSQL will store:

- users and roles;
- applicant profiles;
- grant programs;
- eligibility and scoring configuration;
- application records;
- application status;
- review records;
- correction requests;
- final decisions;
- notification metadata;
- audit metadata.

Object storage will store:

- uploaded applicant documents;
- supporting files;
- document versions or replacements;
- files linked to application records.

The database will store metadata about each uploaded document, while the actual file content will be stored in object storage. Audit records will be protected from normal modification and linked to relevant users, applications, documents, and decisions.

All storage systems, backups, logs, and related infrastructure must be hosted inside Zamunda-approved infrastructure.

---

## Y-Statement

In the context of **storing GreenGrant applications, grant definitions, decisions, uploaded documents, and audit data**,  
facing **structured relational data, large uploaded files, security requirements, auditability, and Zamunda data residency constraints**,  
we decided on **PostgreSQL for structured data and object storage for uploaded documents**,  
and rejected **storing everything in one relational database, using only NoSQL document storage, or storing documents directly in the application server filesystem**,  
to achieve **data consistency, traceability, secure document handling, maintainability, and scalable file storage**,  
accepting **the need to manage two storage mechanisms and keep database records synchronized with document objects**,  
because **GreenGrant has both relational government workflow data and large document files that require different storage approaches**.

---

## Considered Options

## Option 1: Store Everything in PostgreSQL

This option stores both structured data and uploaded documents directly in PostgreSQL.

### Advantages

- Simple backup model.
- Strong transactional consistency.
- All data is managed in one system.
- Easier to enforce relational integrity.

### Disadvantages

- Large uploaded documents can make the database heavy.
- Backups may become larger and slower.
- Database performance may suffer during heavy document upload periods.
- File retrieval and streaming are less efficient than object storage.
- Scaling document storage separately becomes difficult.

### Evaluation

PostgreSQL is excellent for structured GreenGrant data, but storing all uploaded documents directly inside it is not ideal. GreenGrant may receive many large files during grant periods, so object storage is a better fit for document content.

---

## Option 2: Use PostgreSQL with Object Storage

This option stores structured data in PostgreSQL and stores uploaded file content in object storage.

### Advantages

- Strong relational model for grants, applications, users, reviews, and decisions.
- Efficient storage and retrieval of uploaded documents.
- Database remains smaller and easier to manage.
- Document storage can scale independently.
- Supports secure access control through metadata and service-layer authorization.
- Fits backup and recovery requirements.
- Keeps structured data and file content in the storage systems best suited to each type.

### Disadvantages

- Requires coordination between database records and stored objects.
- File deletion or replacement must be handled carefully.
- Backup strategy must include both database and object storage.
- Access control must be enforced consistently by the application services.

### Evaluation

This is the best fit for GreenGrant. The system has structured government workflow data and large uploaded documents. Using PostgreSQL with object storage provides a balanced and maintainable storage design.

---

## Option 3: Use Only NoSQL Document Storage

This option stores most GreenGrant data in a NoSQL document database.

### Advantages

- Flexible schema.
- Useful for variable document structures.
- Can support fast development when the data model changes often.
- May scale horizontally depending on the selected technology.

### Disadvantages

- Weaker fit for relational workflows such as users, applications, reviews, decisions, and audit records.
- More difficult to enforce consistency between related entities.
- Harder to query complex administrative reports.
- Not necessary for the main GreenGrant data model.
- May complicate auditability and traceability.

### Evaluation

GreenGrant has many relationships between users, grants, applications, documents, reviews, decisions, and notifications. A relational database is easier to justify and maintain for this domain. NoSQL may be useful for a specific future feature, but it should not be the main storage model.

---

## Option 4: Store Documents on the Application Server Filesystem

This option stores uploaded files directly on the server filesystem.

### Advantages

- Simple for a small prototype.
- No separate object storage system required.
- Easy local development.

### Disadvantages

- Does not scale well across multiple application instances.
- Difficult to manage backups and recovery.
- Risky for high availability deployments.
- Harder to enforce consistent access control.
- Not suitable for national-scale document handling.
- Makes horizontal scaling of application services harder.

### Evaluation

This approach is not suitable for GreenGrant. The system must support horizontal scaling, reliable storage, and recovery. Application servers should not be responsible for permanent document storage.

---

## Consequences

## Positive Consequences

- Structured GreenGrant data can be modeled clearly using relational tables.
- Application, decision, and review data can remain consistent.
- Uploaded documents can be stored efficiently and scaled separately.
- Database backups remain more manageable.
- Audit records can be linked to users, applications, documents, and decisions.
- Storage can be deployed inside Zamunda to satisfy data residency requirements.

## Negative Consequences

- The system must manage both PostgreSQL and object storage.
- The application must keep document metadata synchronized with stored files.
- Backup and recovery must cover two storage systems.
- Access control for documents must be enforced through the backend services.
- Failed document uploads or interrupted operations require careful error handling.

## Risk Mitigation

- Store document metadata in PostgreSQL, including document owner, application ID, file type, upload time, status, and object storage reference.
- Never expose raw object storage access directly to unauthorized users.
- Validate file type and size before accepting uploads.
- Use secure storage configuration and encryption where applicable.
- Keep database and object storage backups inside Zamunda.
- Record document upload, replacement, and access events in the audit log.
- Use transactions or compensating actions where possible when saving document metadata and file content.

---

## Impact on Architecture

This decision affects the following components:

| Component                     | Impact                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------- |
| Application Service           | Stores and retrieves application data from PostgreSQL.                            |
| Grant Management Service      | Stores grant definitions, deadlines, required documents, and rules in PostgreSQL. |
| Document Service              | Stores uploaded files in object storage and metadata in PostgreSQL.               |
| Review and Evaluation Service | Reads application, document metadata, scoring, and decision data.                 |
| Audit Logging Service         | Stores protected audit records linked to domain actions.                          |
| Notification Service          | Reads decision and applicant notification metadata.                               |
| Backup System                 | Must back up both PostgreSQL and object storage.                                  |

---

## Data Ownership

| Data Type                      | Storage                                 |
| ------------------------------ | --------------------------------------- |
| Users and roles                | PostgreSQL                              |
| Applicant profiles             | PostgreSQL                              |
| Business profiles              | PostgreSQL                              |
| Grant programs                 | PostgreSQL                              |
| Eligibility rules              | PostgreSQL                              |
| Scoring rules                  | PostgreSQL                              |
| Application records            | PostgreSQL                              |
| Application statuses           | PostgreSQL                              |
| Uploaded document metadata     | PostgreSQL                              |
| Uploaded document file content | Object Storage                          |
| Review records                 | PostgreSQL                              |
| Correction requests            | PostgreSQL                              |
| Final decisions                | PostgreSQL                              |
| Notification status            | PostgreSQL                              |
| Audit records                  | PostgreSQL or append-only audit storage |

---

## Related Requirements

- `ASR-001`: Data Residency and Local Operation
- `ASR-004`: Security and Role-Based Access Control
- `ASR-005`: Auditability and Traceability of Decisions
- `ASR-007`: Mobile and Low-Bandwidth Applicant Access
- `ASR-009`: Configurable Grant Rules and Required Documents

---

## Related Architectural Characteristics

- Security and Privacy
- Auditability
- Data Residency
- Maintainability
- Scalability
- Availability

---

## Final Decision

GreenGrant will use **PostgreSQL** for structured application, grant, user, review, decision, notification, and audit metadata. Uploaded documents will be stored in **object storage**, with metadata and access control information stored in PostgreSQL.

This storage approach is appropriate because it supports relational government workflows, secure document handling, auditability, backup and recovery, and Zamunda data residency requirements.
