# ADR-006: Use Human-in-the-Loop AI Assistance for Application Review

## Status

Accepted

## Context

GreenGrant may use AI assistance to support administrators during application review. The AI assistant can help with tasks such as:

- summarizing uploaded documents;
- identifying missing information;
- highlighting possible inconsistencies;
- comparing application content with grant requirements;
- helping administrators focus on risky or incomplete applications.

However, GreenGrant is a government subsidy platform. Final decisions affect citizens, businesses, and public funding. Therefore, AI must not automatically approve or reject applications. Human administrators must remain responsible for final decisions.

The system must also respect security, privacy, auditability, and data residency requirements. Sensitive applicant data and uploaded documents must not be processed in a way that violates Zamunda’s local data operation requirement.

---

## Decision

We will implement AI as a **Human-in-the-Loop AI Assistant**.

The AI Assistant Service will provide advisory support only. It may analyze application data and uploaded documents, but it cannot finalize decisions, change application status to approved or rejected, or send final notifications.

Administrators will see AI-generated suggestions in the review interface, but they must make and confirm the final decision themselves.

The AI Assistant Service will be separated from the Review and Evaluation Service. AI usage will be logged for auditability.

---

## Y-Statement

In the context of **using AI to support GreenGrant application review**,  
facing **sensitive applicant data, public funding decisions, auditability requirements, possible AI errors, and data residency constraints**,  
we decided on **a Human-in-the-Loop AI Assistant implemented as a separate advisory service**,  
and rejected **fully automated AI decision-making, no AI support, and embedding AI logic directly into the review service**,  
to achieve **faster administrative review while preserving accountability, human control, privacy, and traceability**,  
accepting **additional integration complexity and the need to clearly communicate AI limitations**,  
because **GreenGrant decisions must remain legally and administratively controlled by human administrators**.

---

## Considered Options

## Option 1: No AI Assistance

In this option, administrators review every application manually without AI support.

### Advantages

- Simplest to implement.
- Avoids AI-related risks.
- Easier to explain legally.
- No AI model hosting or data processing concerns.

### Disadvantages

- Slower review process.
- Administrators may spend more time on repetitive checks.
- Harder to handle a high volume of applications.
- Missing or inconsistent documents may be harder to detect quickly.
- Does not use the optional AI support mentioned in the GreenGrant scenario.

### Evaluation

No AI support is the safest and simplest option, but it misses an opportunity to improve review efficiency. GreenGrant can benefit from AI if it is limited to advisory support and does not replace human judgment.

---

## Option 2: Fully Automated AI Decision-Making

In this option, AI automatically approves, rejects, or ranks applications and makes final decisions.

### Advantages

- Could speed up the review process significantly.
- Could reduce manual workload.
- Could provide consistent scoring if designed well.

### Disadvantages

- High risk for unfair or incorrect decisions.
- Difficult to explain and defend in public funding cases.
- Creates legal and ethical accountability problems.
- May violate the requirement that final decisions are made by human administrators.
- AI errors could directly affect applicants.
- Harder to audit and justify individual decisions.

### Evaluation

This option is rejected. GreenGrant is a government subsidy platform, so final decisions must remain under human administrator control. AI may assist but must not decide.

---

## Option 3: AI Logic Embedded Directly in Review Service

In this option, AI functions are implemented directly inside the Review and Evaluation Service.

### Advantages

- Fewer components.
- Simple integration with the administrator review workflow.
- Easier access to application data.

### Disadvantages

- Tightly couples AI logic to core review logic.
- Harder to disable AI if it fails.
- Harder to replace or update the AI model later.
- More difficult to monitor AI-specific performance and errors.
- AI failure could affect the core review workflow.
- Makes privacy and data handling boundaries less clear.

### Evaluation

This option is not ideal because AI should be isolated from the core decision-making workflow. GreenGrant must continue to work even if the AI assistant is unavailable.

---

## Option 4: Separate Human-in-the-Loop AI Assistant Service

In this option, AI is implemented as a separate service that provides recommendations, summaries, and warnings to administrators.

### Advantages

- Keeps AI separate from final decision logic.
- Allows the system to work if AI is unavailable.
- Makes AI usage easier to monitor and audit.
- Supports privacy and data residency controls.
- Allows future AI improvements without rewriting the review service.
- Clearly communicates that AI is advisory only.
- Preserves human accountability.

### Disadvantages

- Adds another component to the architecture.
- Requires integration between the review interface and AI service.
- Requires careful data minimization and access control.
- AI output must be explained clearly to administrators.
- Requires audit logging of AI usage.

### Evaluation

This is the selected option. It provides useful review support while preserving accountability, privacy, and human control.

---

## AI Assistant Responsibilities

The AI Assistant Service may provide:

- document summaries;
- missing-document warnings;
- inconsistency warnings;
- comparison between application data and grant requirements;
- suggested review points;
- risk indicators for administrator attention.

The AI Assistant Service must not:

- approve applications;
- reject applications;
- submit final decisions;
- change final application status;
- send final notifications;
- hide information from administrators;
- replace human review.

---

## Human-in-the-Loop Workflow

1. Applicant submits an application and uploads documents.
2. Application enters the review workflow.
3. Administrator opens the application.
4. Administrator may request AI assistance or view generated advisory results.
5. AI Assistant Service analyzes permitted application data and documents.
6. AI returns summary, missing information warnings, or possible inconsistencies.
7. Administrator reviews the AI output.
8. Administrator accepts, ignores, or overrides AI suggestions.
9. Administrator makes the final decision.
10. The system logs AI usage and the final human decision.

---

## Consequences

## Positive Consequences

- Administrators receive support during review.
- Repetitive review work can be reduced.
- Missing or inconsistent information can be detected earlier.
- AI does not replace human responsibility.
- Final decisions remain explainable and controlled by administrators.
- The AI component can be changed or disabled without breaking core review.
- AI usage can be audited.

## Negative Consequences

- Additional service integration is required.
- AI output may be incorrect or incomplete.
- Administrators may over-trust AI suggestions if the UI is not clear.
- Sensitive data handling becomes more complex.
- The system needs monitoring and logging for AI usage.
- AI processing must comply with Zamunda data residency constraints.

## Risk Mitigation

- Clearly label AI output as advisory.
- Require human confirmation for all final decisions.
- Log AI assistance usage.
- Keep AI separate from final decision status changes.
- Do not allow AI to directly trigger MundaMail final outcome notifications.
- Apply role-based access control to AI-assisted review.
- Use only the minimum necessary data for AI processing.
- Ensure AI processing follows Zamunda data residency requirements.
- Allow the review workflow to continue if AI is unavailable.

---

## Impact on Architecture

This decision affects the following components:

| Component | Impact |
|---|---|
| AI Assistant Service | Provides advisory analysis, summaries, and warnings. |
| Review and Evaluation Service | Requests or retrieves AI assistance but keeps final decision authority. |
| Administrator Web Portal | Displays AI suggestions clearly as advisory information. |
| Document Service | Provides permitted document access for AI processing. |
| Audit Logging Service | Records AI usage and related review events. |
| Identity and Access Service | Ensures only authorized administrators can use AI assistance. |
| Event Broker / Message Queue | May trigger asynchronous AI review tasks. |
| Data Storage | Stores AI results or metadata only when necessary and allowed. |

---

## Privacy and Data Residency Considerations

AI assistance must follow the same data residency and security rules as the rest of GreenGrant.

This means:

- sensitive applicant data must remain inside Zamunda-approved infrastructure;
- uploaded documents must not be sent to unapproved external AI providers;
- AI logs must not expose unnecessary personal or business information;
- access to AI results must follow administrator permissions;
- AI-generated outputs must be treated as sensitive review data.

---

## Related Requirements

- `ASR-001`: Data Residency and Local Operation
- `ASR-004`: Security and Role-Based Access Control
- `ASR-005`: Auditability and Traceability of Decisions
- `ASR-008`: Human-Controlled AI Assistance
- `FR-4.6`: The system may provide AI-assisted summaries, missing-document detection, and inconsistency warnings.
- `FR-4.7`: AI-generated output shall be advisory only and shall not make final decisions.
- `NFR-2.4`: AI assistance shall not be able to finalize decisions without human approval.
- `BR-5`: Final decisions must be made by human administrators.
- `BR-6`: AI may support evaluation but may not make final decisions.

---

## Related Architectural Characteristics

- Security and Privacy
- Auditability
- Data Residency
- Maintainability
- Availability

---

## Final Decision

GreenGrant will use a **separate Human-in-the-Loop AI Assistant Service**.

The AI assistant may support administrators by summarizing documents, detecting missing information, and highlighting possible inconsistencies, but it will not make final decisions. Final approval, rejection, or correction requests remain the responsibility of authorized human administrators.
