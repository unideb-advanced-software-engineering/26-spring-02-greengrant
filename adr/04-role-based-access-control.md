# ADR-004: Use Role-Based Access Control for Security

## Status

Accepted

## Context

GreenGrant is a government subsidy platform that handles sensitive information, including:

- citizen applicant data;
- business applicant data;
- uploaded documents;
- financial and eligibility information;
- application review notes;
- correction requests;
- approval and rejection decisions;
- notification records;
- audit logs.

The system is used by different user groups with different permissions:

- citizen applicants;
- business applicants;
- administrators;
- senior administrators;
- system operators.

Applicants should only access their own applications and documents. Administrators should only access functions needed for grant management and review. Senior administrators may need broader oversight and reporting access. System operators may manage technical operations but should not unnecessarily access sensitive business or applicant content.

Because GreenGrant supports public funding decisions, unauthorized access or modification could cause legal, financial, and reputational damage.

---

## Decision

We will use **Role-Based Access Control (RBAC)** as the main authorization model for GreenGrant.

Each user will have one or more roles, and each role will define which actions the user is allowed to perform. Access control will be enforced by backend services, not only by the user interface.

Main roles include:

| Role | Main Permissions |
|---|---|
| Applicant | Manage own profile, create drafts, submit own applications, upload own documents, view own status. |
| Business Applicant | Manage business-related application data, submit business applications, upload business documents. |
| Administrator | Create and manage grant programs, review applications, request corrections, record decisions. |
| Senior Administrator | View reports, supervise decisions, access audit information, manage higher-level oversight. |
| System Operator | Monitor system health, manage technical operations, backups, and deployment. |

The system will also use authentication, HTTPS, file validation, secure document access, and audit logging to support the RBAC model.

---

## Y-Statement

In the context of **protecting GreenGrant applicant data, uploaded documents, administrative functions, decisions, and audit logs**,  
facing **multiple user groups with different privileges and sensitive government data**,  
we decided on **Role-Based Access Control enforced by backend services**,  
and rejected **UI-only access control, single shared administrator permissions, and unrestricted service-level access**,  
to achieve **security, privacy, accountability, and separation of duties**,  
accepting **the need to maintain role definitions, permission checks, and access-control tests**,  
because **GreenGrant requires clear permission boundaries between applicants, administrators, senior administrators, and operators**.

---

## Considered Options

## Option 1: UI-Only Access Control

In this option, the user interface hides buttons, pages, and menus based on user type, but backend services do not strongly enforce permissions.

### Advantages

- Simple to implement at the beginning.
- Improves user experience by hiding irrelevant functions.
- Useful as an additional layer of protection.

### Disadvantages

- Not secure by itself.
- Users could still call backend APIs directly.
- Does not protect sensitive data if API endpoints are exposed.
- Fails to enforce real authorization.
- Not acceptable for government data handling.

### Evaluation

UI-based restrictions can improve usability, but they cannot be the main security mechanism. GreenGrant must enforce authorization in backend services.

---

## Option 2: Single Administrator Role

In this option, all administrators have the same permissions.

### Advantages

- Simple permission model.
- Easier to implement and manage.
- Lower initial configuration effort.

### Disadvantages

- Does not support separation of duties.
- Gives too many permissions to normal administrators.
- Makes oversight and accountability weaker.
- Increases risk if an administrator account is compromised.
- Does not distinguish review work from senior oversight or technical operations.

### Evaluation

A single administrator role is too broad for GreenGrant. Public funding workflows require better separation between normal review, senior oversight, and technical operations.

---

## Option 3: Role-Based Access Control

In this option, users receive roles, and roles determine which actions and data they can access.

### Advantages

- Clear and understandable permission model.
- Fits the known GreenGrant user classes.
- Supports separation between applicants, administrators, senior administrators, and operators.
- Easier to audit and explain.
- Suitable for government administrative workflows.
- Can be extended with more roles later.

### Disadvantages

- Requires role and permission management.
- Requires consistent backend authorization checks.
- Incorrect role assignment can create security risks.
- May become too coarse if future workflows require more detailed permissions.

### Evaluation

RBAC is the selected option because it fits GreenGrant’s user groups and is understandable for both developers and administrators. It provides a good balance between security and implementation complexity.

---

## Option 4: Attribute-Based Access Control

In this option, access decisions are based on attributes such as department, grant program, region, application status, risk level, or user clearance.

### Advantages

- More flexible than RBAC.
- Useful for complex government organizations.
- Can support detailed access policies.
- Can restrict access by grant program or department.

### Disadvantages

- More complex to implement.
- Harder to test and explain.
- Requires careful policy design.
- May be unnecessary for the first GreenGrant version.

### Evaluation

Attribute-based access control may be useful in a future version if GreenGrant needs more detailed organizational rules. For the current architecture, RBAC is sufficient and easier to defend.

---

## Consequences

## Positive Consequences

- Applicants can only access their own applications and documents.
- Administrator functions are protected from unauthorized users.
- Senior administrator and operator responsibilities can be separated.
- Security rules are easier to explain and audit.
- Backend services enforce authorization, not only the UI.
- Sensitive data access can be logged and monitored.
- The architecture supports future role expansion.

## Negative Consequences

- The system must maintain role definitions and permissions.
- Authorization checks must be implemented consistently across services.
- Testing must include access-control scenarios.
- Incorrect role assignment could still cause security problems.
- Some future permission needs may require more detailed policies.

## Risk Mitigation

- Enforce access control in backend services.
- Use secure authentication before authorization checks.
- Apply least privilege when assigning roles.
- Log security-relevant actions.
- Test unauthorized access attempts.
- Keep administrator and operator permissions separate.
- Review role assignments regularly.
- Validate document access using ownership and role checks.

---

## Impact on Architecture

This decision affects the following components:

| Component | Impact |
|---|---|
| Applicant Web Portal | Shows only applicant functions and personal applications. |
| Administrator Web Portal | Shows only administrator-authorized functions. |
| API Gateway | Can perform basic authentication and route protection. |
| Identity and Access Service | Manages users, roles, and access tokens. |
| Application Service | Enforces ownership rules for applications. |
| Document Service | Enforces secure access to uploaded documents. |
| Grant Management Service | Allows grant management only for authorized administrators. |
| Review and Evaluation Service | Allows review and decisions only for authorized roles. |
| Audit Logging Service | Records important access and decision events. |
| System Operations | Separates technical maintenance from unnecessary data access. |

---

## Access Control Examples

| Action | Applicant | Administrator | Senior Administrator | System Operator |
|---|---:|---:|---:|---:|
| Create own application | Yes | No | No | No |
| View own application status | Yes | No | No | No |
| View all submitted applications for review | No | Yes | Yes | No |
| Create grant program | No | Yes | Yes | No |
| Approve or reject application | No | Yes | Yes | No |
| View audit logs | No | Limited | Yes | Technical logs only |
| Manage infrastructure | No | No | No | Yes |
| Access another applicant's documents | No | Only if needed for review | Yes | No by default |

---

## Related Requirements

- `ASR-004`: Security and Role-Based Access Control
- `ASR-005`: Auditability and Traceability of Decisions
- `ASR-001`: Data Residency and Local Operation

---

## Related Architectural Characteristics

- Security and Privacy
- Auditability
- Maintainability
- Data Residency

---

## Final Decision

GreenGrant will use **Role-Based Access Control enforced by backend services**.

This decision supports secure separation between applicants, administrators, senior administrators, and system operators. It protects sensitive data, prevents unauthorized access to administrative functions, and provides a clear foundation for auditability and accountability.
