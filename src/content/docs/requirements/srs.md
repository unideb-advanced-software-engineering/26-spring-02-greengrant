---
title: Software Requirements Specification for GreenGrant
description: srs doc
---
 
# Table of Contents
1.	[Introduction](#1introduction)  
  1.1	Purpose  
  1.2	Document Conventions  
  1.3	Intended Audience and Reading Suggestions  	
  1.4	Product Scope	  
  1.5	References	  
2.	[Overall Description](#2overall-description)	  
  2.1	Product Perspective	  
  2.2	Product Functions	  
  2.3	User Classes and Characteristics	 
  2.4	Operating Environment	  
  2.5	Design and Implementation Constraints	  
  2.6	User Documentation	  
  2.7	Assumptions and Dependencies	  
3.	[External Interface Requirements](#3external-interface-requirements)	 
  3.1	User Interfaces	  
  3.2	Hardware Interfaces	  
  3.3	Software Interfaces	  
  3.4	Communications Interfaces	  
4.	[System Features](#4system-features)  
  4.1 Listing/Searching currently available  
  4.2	Applying to currently available grants  
  4.3 Notification by MundaMail  
  4.4 Creating new grants  
  4.5 Review and evaluate grant applications  
  4.6 AI (GF) helper tool  
  4.7 Manage users  
  4.8 Manage other UIs  
5.	[Other Nonfunctional Requirements](#5other-nonfunctional-requirements)	  
  5.1	Performance Requirements	  
  5.2	Safety Requirements	  
  5.3	Security Requirements	  
  5.4	Software Quality Attributes	  
  5.5	Business Rules	  

<br/><br/><br/>


 
# 1.	Introduction
  ## 1.1	Purpose 

  This Software Requirements Specification (SRS) document describes the requirements for the GreenGrant system, an online grant management platform developed as part of the Zamunda Digital Renaissance (ZDR) program. The purpose of this document is to define the functional and non-functional requirements of the system that enables citizens and businesses of Zamunda to apply for government subsidies supporting environmentally friendly and sustainable investments.
  This document provides a detailed description of the system’s features, constraints, and interactions between users and the system. It serves as a reference for developers, system architects, project managers, and stakeholders involved in the design, implementation, and maintenance of the GreenGrant platform.


  ## 1.2	Document Conventions

  \-

  ## 1.3	Intended Audience and Reading Suggestions

  This document is intended for multiple stakeholders involved in the GreenGrant system:
- Software developers – to understand system functionality and implementation requirements.
- System architects and engineers – to design the system infrastructure and architecture.
- Project managers – to track development progress and ensure project requirements are met.
- Government administrators – to understand how the system supports grant management processes.
- Testers and quality assurance teams – to verify that the implemented system satisfies the specified requirements.


  ## 1.4	Product Scope

  The GreenGrant system is an online government portal that enables citizens and businesses in Zamunda to apply for financial support for environmentally sustainable investments.
  The platform will allow administrators to publish funding opportunities with defined conditions, required documentation, application deadlines, and evaluation criteria. Citizens and businesses will be able to submit applications through a web-based interface accessible from both desktop and mobile devices.
  The system will support the digital management of grant applications, including submission, document handling, evaluation support, and notification of results. Integration with the MundaMail API will allow automated notifications to applicants regarding the outcome of their submissions.
  The GreenGrant platform contributes to the broader Zamunda Digital Renaissance (ZDR) initiative by supporting digital governance, promoting renewable energy adoption, and encouraging climate-friendly investments within the country.


  ## 1.5	References

  The following resources are referenced in the development of this SRS document:
•	GreenGrant project scenario – Advanced Software Engineering course materials
https://unideb-advanced-software-engineering.github.io/site/en/scenarios/02-greengrant/
•	MundaMail API – internal messaging API used for sending system notifications


# 2.	Overall Description
  ## 2.1	Product Perspective
  GreenGrant is a new greenfield project with no history whatsoever.

  ## 2.2	Product Functions

  GThe GreenGrant platform provides a set of core functions that allow users to interact with the grant management system efficiently. These functions support both applicants and administrators in managing the grant application process.
The main functions of the system include:
- Grant Program Management – administrators can create, publish, and manage grant programs with specific requirements, deadlines, and evaluation criteria.
- Grant Opportunity Browsing – citizens and businesses can view available grants and read detailed information about eligibility and application requirements.
- Application Submission – applicants can submit grant applications through an online form.
- Document Upload – applicants can upload required documents as part of their application.
- Application Evaluation – administrators can review applications and evaluate them according to predefined scoring systems.
- AI-Assisted Document Review – administrators can use AI-based tools to assist in reviewing large amounts of submitted documentation.
- Notification System – the platform sends automatic notifications to applicants regarding the results of their applications through the MundaMail API.
- Mobile-Friendly Access – the system provides a responsive web interface that works on both desktop and mobile devices.


  ## 2.3	User Classes and Characteristics

  -	All citizens of Zamunda (approximately 10 million people)
  -	Businesses operating in Zamunda (approximately 1 million businesses)
  -	Administrators in the Zamunda public administration
  -	System administrators

  ## 2.4	Operating Environment

The GreenGrant system will operate in a web-based environment and will be accessible through modern web browsers.
The expected operating environment includes:
- Client devices
  Desktop computers
  Laptops
  Smartphones and tablets
- Supported browsers
  Google Chrome
  Mozilla Firefox
  Microsoft Edge
  Safari
- Server environment
  Secure server infrastructure located within Zamunda
  Web server and backend application server
  Database server for storing application data and documents

The system must be optimized to function under limited bandwidth and higher network latency, as internet connectivity in certain regions of Zamunda may be unreliable.


  ## 2.5	Design and Implementation Constraints

Several constraints influence the design and implementation of the GreenGrant system:
- Data residency requirement: All data must be stored and processed within Zamunda’s territory.
-	Security and privacy regulations: Personal and business data must be protected according to government data protection policies.
-	External API integration: The system must integrate with the MundaMail API for sending notifications.
-	Scalability requirements: The system must handle a large number of simultaneous users when grant applications open.
-	Network limitations: The platform must function efficiently in areas with slower internet connections.
-	Mobile compatibility: The user interface must be responsive and usable on mobile devices


  ## 2.6	User Documentation

The GreenGrant system will provide several types of user documentation to assist users:
•	User guide for applicants, explaining how to browse grant opportunities and submit applications.
•	Administrator manual, describing how to create grant programs, manage submissions, and evaluate applications.
•	Online help documentation, accessible through the web interface.
•	FAQ section, providing answers to common user questions.
Documentation will be provided in digital format and accessible through the system’s interface.


  ## 2.7	Assumptions and Dependencies

The following assumptions and dependencies apply to the GreenGrant system:
•	The system will rely on the MundaMail API for sending notification messages to applicants.
•	It is assumed that applicants have access to internet-enabled devices capable of using modern web browsers.
•	The system assumes the availability of secure government infrastructure within Zamunda for hosting the platform and storing data.
•	Administrators will have the necessary training to operate the administrative interface and evaluate grant applications.
•	AI-based tools used to assist in document review will depend on the availability and reliability of supporting technologies.
Any changes to these assumptions or external dependencies may affect system requirements and implementation.


# 3.	External Interface Requirements
  ## 3.1	User Interfaces

  The system provides the following user interfaces:
  -	Web interface
  o	compatible with mobile and desktop usage 
  o	contains different views for each different  role
  o	integrated AI tool

  ## 3.2	Hardware Interfaces

  \-

  ## 3.3	Software Interfaces

  The supported operating system, data storage solutions, technologies, libraries and frameworks are currently unspecified.

  Other software interfaces:
  -	the notifications system implements and is dependent on MundaMail™ API.

  ## 3.4	Communications Interfaces

  -	for the web interface HTTPS
  -	SFTP for document uploads
  -	Notifications email through MundaMail

# 4.	System Features

  ## 4.1	Listing/Searching currently available grants 
  ### 4.1.1	Description and Priority
  High Priority
  Provides a search and filter function to easily navifgate among published grants.
  ### 4.1.2	Stimulus/Response Sequences
  As a response to the "Search" button pressed by the user, the system shows the list of published grants, based on the search and filter options provided by the user. 
  ### 4.1.3	Functional Requirements
  ##### F-LG-01
  The system search implements a fuzzy finder opn grants names and description.    
  
  ##### F-LG-02
  The system provides a filtration option, based on the following parameters: 
  -   start date
  -   end date
  -   end of evaluation date
  -   category
  -   target audience
  -   ammount of money

  ## 4.2	Applying to currently available grants
  ### 4.2.1	Description and Priority
  High Priority

  Provides the option to apply to a selected grant.

  ### 4.2.2	Stimulus\/Response Sequences
  The user provides the required documentation and information for the application, and the system validates and in case of validity records the application, by storing all of its info. and doc..

  ### 4.2.3	Functional Requirements
  ##### F-AG-01
  The system is able to accept text and file input through a form.
  ##### F-AG-02
  The system is able validate all forms of input, based on size, content, metadata and others.
  ##### F-AG-03
  The system is able to securely store all provided and validated input and user data.


  ## 4.3 Notification by MundaMail

  ### 4.3.1	Description and Priority
  Medium Priority

  Provides a notification featutre, about the status of applications through the use of MundaMail.

  ### 4.3.2	Stimulus/Response Sequences
  Any change in the status of a given application will trigger an automatic notification via the MundaMail system.

  ### 4.3.3	Functional Requirements
  ##### F-MM-01
  The system is able to detect changes in application status automatically.
  ##### F-MM-02
  The system is able to send a templated message through M.M. triggered by a detected change, with the correct values.

  ## 4.4 Creating new grants

  ### 4.4.1	Description and Priority
  High Priority

  Provides the ability co publicate grants in the system.
  ### 4.4.2	Stimulus/Response Sequences
  A User with the role of Public Administrator provides the required information for the creation of a new grant, and the system creates and stores the new grant publication.

  ### 4.4.3	Functional Requirements
  ##### F-CG-01
  The system is able to accept the format of the information. 
  ##### F-CG-02
  The system is able to validate the format of the given inputs. 
  ##### F-CG-03
  The system is able to create a new grant based on the provided information.
  ##### F-CG-04
  The system is able to upload and store the created grant publication.

  ## 4.5 Review and evaluate grant applications

  ### 4.5.1	Description and Priority
  High Priority

  Provides the ability for Public Administrators to review submitted applications, score them based on grant-specific criteria, and record a final decision.

  ### 4.5.2	Stimulus/Response Sequences
  A Public Administrator opens an application, verifies attached documentation, optionally uses the AI helper outputs, assigns scores per criterion, and submits a decision. The system stores the evaluation, records an audit trail entry, and triggers applicant notification.

  ### 4.5.3	Functional Requirements
  ##### F-RE-01
  The system shall display complete application data and all uploaded documents for authorized reviewers.

  ##### F-RE-02
  The system shall support grant-specific scoring models defined during grant creation.

  ##### F-RE-03
  The system shall require a decision status (approved/rejected/needs clarification) and an optional textual justification before finalization.

  ##### F-RE-04
  The system shall persist each evaluation change with timestamp, actor identity, and previous/new state values.

  ##### F-RE-05
  The system shall prevent final approval when mandatory documents are missing according to the selected grant definition.

  ## 4.6 AI (GF) helper tool
  ### 4.6.1	Description and Priority
  Medium Priority

  Provides AI-assisted analysis to reduce manual document review effort for Public Administrators.

  ### 4.6.2	Stimulus/Response Sequences
  A reviewer requests AI assistance for an application. The system processes submitted documentation and returns a structured summary with detected issues and references to source sections.

  ### 4.6.3	Functional Requirements
  ##### F-AI-01
  The system shall generate an application summary containing key applicant attributes, requested amount, and mandatory document checklist status.

  ##### F-AI-02
  The system shall flag potential inconsistencies or missing information and mark them as recommendations only.

  ##### F-AI-03
  The system shall not allow AI output to finalize a decision without explicit human reviewer confirmation.

  ##### F-AI-04
  The system shall present traceable references from each AI finding to the original source document section when available.

  ##### F-AI-05
  The system shall log every AI assistance request for audit purposes.

  ## 4.7 Manage users
  ### 4.7.1	Description and Priority
  High Priority

  Provides user and role lifecycle management for System Administrators.

  ### 4.7.2	Stimulus/Response Sequences
  A System Administrator creates, updates, disables, or re-enables a user account and assigns roles. The system validates authorization, applies changes, and records an audit entry.

  ### 4.7.3	Functional Requirements
  ##### F-MU-01
  The system shall support creating and disabling accounts for applicant, public administrator, and system administrator roles.

  ##### F-MU-02
  The system shall enforce role-based access control for all protected operations.

  ##### F-MU-03
  The system shall provide secure password reset and account recovery workflow.

  ##### F-MU-04
  The system shall record all role and status changes in an immutable audit log.

  ## 4.8 Manage other UIs
  ### 4.8.1	Description and Priority
  Medium Priority

  Provides centralized configuration management for applicant-facing and administration-facing web interfaces.

  ### 4.8.2	Stimulus/Response Sequences
  A System Administrator updates UI-related configuration (for example banners, form labels, announcement content, and feature visibility). The system validates the change, applies it, and distributes it to the target UI.

  ### 4.8.3	Functional Requirements
  ##### F-MO-01
  The system shall allow authorized administrators to manage localized static content used by multiple user interfaces.

  ##### F-MO-02
  The system shall support enabling or disabling selected UI features without redeploying the whole platform.

  ##### F-MO-03
  The system shall keep versioned history of UI configuration changes with rollback capability.

# 5.	Other Nonfunctional Requirements
  ## 5.1	Performance Requirements
  ##### NF-AG-01
  The processing time of applications must be p99 500ms from submission to storage of crucial data in the GreenGrant database.

  The processing process consits of client side input validation, and crucial data transfer to the server. The files and other forms of high volume data, are to be transferred and stored in an asynchronous way.

  ##### NF-AH-01
  The AI helper tool should ensure the p90 response time is under 20 seconds, measured from the moment a user submits a prompt to the moment the complete response is rendered to the user's client.


## 5.2	Safety Requirements
  ##### NF-SA-01
  The system shall prevent loss of submitted applications by storing a durable server-side draft snapshot at least every 30 seconds while a user edits an application form.

  ##### NF-SA-02
  The system shall provide explicit confirmation dialogs for destructive actions (for example withdrawing an application or deleting a grant draft).

  ##### NF-SA-03
  The system shall preserve all finalized application and evaluation records for at least 10 years to support legal and administrative review.
## 5.3	Security Requirements
  ##### NF-SE-01
  All personal and application data shall be stored and processed only on infrastructure physically located in Zamunda.

  ##### NF-SE-02
  The system shall enforce multi-factor authentication for Public Administrator and System Administrator accounts.

  ##### NF-SE-03
  The system shall encrypt data in transit using HTTPS/TLS 1.2+ and encrypt sensitive data at rest.

  ##### NF-SE-04
  The system shall produce tamper-evident security and audit logs for authentication, authorization, and data-modification events.
## 5.4	Software Quality Attributes
  ##### NF-QA-01 (Availability)
  The public applicant web interface shall provide at least 99.9% monthly availability, excluding planned maintenance windows.

  ##### NF-QA-02 (Scalability)
  At grant opening time, the platform shall support at least 20,000 concurrent applicant sessions while preserving p95 page response time under 2 seconds for read operations.

  ##### NF-QA-03 (Auditability)
  The system shall allow authorized auditors to reconstruct the full lifecycle of a grant application (submission, updates, evaluation actions, decision, notification) from system logs.

  ##### NF-QA-04 (Usability)
  Applicant-facing pages shall be usable on mobile devices with viewport widths from 360px and above without horizontal scrolling in core workflows.

  ##### NF-QA-05 (Maintainability)
  The system shall expose machine-readable API documentation for all internal service interfaces and keep it versioned with each production release.
## 5.5	Business Rules
  ##### BR-01
  A grant application is accepted only if submitted within the defined opening and deadline interval of the selected grant.

  ##### BR-02
  A grant may only receive applications while remaining budget is greater than zero.

  ##### BR-03
  Only Public Administrators can create grants and evaluate applications.

  ##### BR-04
  Only System Administrators can create or modify privileged user accounts and role assignments.