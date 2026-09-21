# Phase 2 — Full Membership Enrollment, OTP & Admin Application Management

## 1. Phase Goal

Implement Phase 2 of the Data Science Club Membership Management System.

Phase 2 extends the public website from Phase 1 into a functional membership enrollment system.

This phase includes:

- Full Membership application
- Server-side validation
- University email OTP verification
- Resend transactional email integration
- Application persistence
- Duplicate application checks
- Payment information storage
- Pending admin review workflow
- Admin authentication foundation
- Admin application dashboard
- Application detail/review screen
- Approve/reject workflow
- Member ID generation
- Active member record creation
- Approval/member confirmation email
- Rejection email
- Basic active member management

Do NOT implement the full bulk campaign system, graduation automation, alumni automation, or multi-provider campaign infrastructure in this phase. Those belong to Phase 3.

---

# 2. Critical Business Rules

These rules are mandatory.

## No Membership Type

There is only:

**Full Membership**

Do NOT create:
- Membership Type
- Basic Membership
- Premium Membership
- General Membership
- Executive Membership

---

## Email Architecture

### Resend

Use Resend exclusively for transactional membership emails:

1. Email OTP
2. Admin approval / Member Confirmation email
3. Admin rejection email

There is NO separate email verification confirmation email.

When the user enters the correct OTP:

```text
OTP correct
    ↓
Show on-screen congratulations message
    ↓
Application becomes PENDING_REVIEW
```

Do not send an additional "email verified" email.

---

# 3. Application Workflow

Implement this exact workflow:

```text
Student opens Join Us
        ↓
Full Membership Application
        ↓
Fill form
        ↓
Client validation
        ↓
Server validation
        ↓
Duplicate application check
        ↓
Create temporary/application record
        ↓
Generate 6-digit OTP
        ↓
Hash OTP
        ↓
Store OTP + expiry + attempts
        ↓
Send OTP through Resend
        ↓
OTP Verification Screen
        ↓
Correct OTP?
   ┌────┴────┐
   NO        YES
   ↓          ↓
Error      Mark email verified
             ↓
      Show Congratulations
             ↓
       PENDING_REVIEW
             ↓
       Admin Dashboard
             ↓
       Admin reviews
          ┌──┴──┐
          ↓     ↓
       APPROVE REJECT
          ↓     ↓
    Generate ID  Save reason
          ↓     ↓
     ACTIVE     REJECTED
          ↓     ↓
 Member Confirmation  Rejection Email
 Email via Resend
```

---

# 4. Application Statuses

Use clear server-side statuses.

Minimum:

```text
DRAFT
PENDING_EMAIL_VERIFICATION
PENDING_REVIEW
APPROVED
REJECTED
```

After approval, the member record becomes:

```text
ACTIVE
```

The application and member should be separate concepts.

Example:

```text
Application
status = APPROVED

Member
status = ACTIVE
member_id = generated ID
```

Do not use the application ID as the permanent member ID.

---

# 5. Membership Application Form

Implement the complete form.

Use the visual design generated in Stitch as the UI source of truth.

The form should be multi-step.

Recommended steps:

```text
1. Personal Information
2. Academic Information
3. Academic Interests
4. Technical Skills
5. Creative & Media Skills
6. Goals & Experience
7. Club Contribution
8. Membership Payment
9. Review & Submit
```

The user must be able to:

- Move forward
- Move backward
- See progress
- Correct previous information
- See validation errors
- Preserve entered data while moving between steps

Do not lose form data when navigating between steps.

---

# 6. Step 1 — Personal Information

Fields:

### Full Name
Required.

### Student ID
Required.

### University Email
Required.

This is the email that receives the OTP.

### Personal Email
Optional.

### Phone Number
Required.

Validate according to reasonable Bangladesh phone-number formats.

Do not hardcode a specific phone number.

---

# 7. Step 2 — Academic Information

Fields:

### Department
Required.

### Batch / Admission Year
Required.

### Current Semester
Required.

### Expected Graduation Year
Required.

### Current CGPA
Optional.

### Desired CGPA
Optional.

The UI may group Current CGPA and Desired CGPA under:

**Current / Desired CGPA**

---

# 8. Step 3 — Academic Interests

Question:

**What areas are you interested in?**

Helper:

**Select all that apply.**

Options:

- Artificial Intelligence & Data Science
- Software Engineering & Programming
- Web & App Development
- Cybersecurity
- Cloud Computing & DevOps
- Robotics & Automation
- Game Development
- UI/UX & Product Design
- Research
- Entrepreneurship & Startups
- Other
- None

### None behavior

`None` must be mutually exclusive.

If `None` is selected:
- Clear other selected interests
- Disable or prevent other selections

If another interest is selected:
- Automatically remove `None`

At least one option must be selected.

If Other is selected, provide an Other text field.

---

# 9. Step 4 — Technical Skills

Question:

**Which technical skills do you have?**

Options:

- Programming
- Data & AI
- Web & App Development
- Cloud & DevOps
- Robotics & Automation
- Cybersecurity
- UI/UX Design
- Git & Version Control
- Other
- None

`None` is mutually exclusive.

If Other is selected, show an Other text field.

## Overall Technical Skill Level

Options:

- Beginner
- Intermediate
- Advanced
- None

## Strongest Technical Skill

The available options must be based on the technical skills selected above.

Example:

If selected:

```text
Programming
Data & AI
Git & Version Control
```

then strongest skill options should be:

```text
Programming
Data & AI
Git & Version Control
None
```

Do not allow the user to select a strongest skill they did not select.

---

# 10. Step 5 — Creative & Media Skills

Question:

**Which creative/media skills do you have?**

Options:

- Graphic Design — Canva / Photoshop / Illustrator
- Video Editing
- Content Writing
- Motion Graphics
- Photography & Videography
- Social Media Content
- Presentation Design
- Other
- None

`None` is mutually exclusive.

Other should provide an Other text field.

---

# 11. Step 6 — Goals & Experience

## Goals

Question:

**What do you want to achieve through the club?**

Options:

- Learn Technical Skills
- Build Projects
- Participate in Hackathons / Competitions
- Research
- Career Preparation
- Internship / Job Preparation
- Entrepreneurship / Startup
- Networking
- Leadership
- Freelancing
- Higher Studies
- Teaching / Mentoring
- Other
- None

`None` is mutually exclusive.

---

## Previous Experience

Question:

**Previous Experience**

Helper:

**Select all that apply.**

Options:

- Hackathon
- Programming Contest
- Research Project
- Personal Project
- Open-source Project
- Workshop / Conference
- Club / Organizational Activity
- Startup / Business Project
- Other
- None

`None` is mutually exclusive.

Other should provide an Other text field.

---

# 12. Step 7 — Club Contribution

Question:

**How would you like to contribute to the club?**

Options:

- Technical Team
- Event Management
- Research
- Content Writing
- Video Editing
- Graphic Design
- Social Media
- Marketing
- Sponsorship / Business Development
- Volunteer
- Mentoring
- Leadership
- Other
- Not Sure Yet
- None

`None` should be mutually exclusive.

`Not Sure Yet` is a valid selection and is not mutually exclusive with other contribution choices unless the UI design makes that relationship explicit. Prefer allowing it as a normal selectable option.

Other should provide an Other text field.

---

## Additional Information

Optional short text:

**Anything else you'd like us to know?**

---

# 13. Step 8 — Membership Payment

Required fields:

### bKash Number Used for Payment

Placeholder:

```text
01XXXXXXXXX
```

### Transaction ID

Placeholder:

```text
XXXXXXXXXX
```

### Transaction Number / Reference

Placeholder:

```text
XXXXXXXXXX
```

All three are required.

Do not implement live bKash API verification in Phase 2.

The admin manually checks the submitted payment information.

---

# 14. Step 9 — Review & Submit

Before submission, display all entered information grouped by section.

Sections:

```text
Personal Information
Academic Information
Academic Interests
Technical Skills
Creative & Media Skills
Goals
Previous Experience
Club Contribution
Additional Information
Payment
```

Each section should have an Edit action.

Before submitting, require an appropriate confirmation checkbox such as:

```text
I confirm that the information provided is accurate.
```

Primary button:

**Submit Application**

---

# 15. Form Validation

Validation must exist on BOTH:

## Client

For immediate user feedback.

## Server

For security and data integrity.

Never trust client-side validation alone.

Validate:

- Required fields
- Email format
- University email format
- Phone format
- Numeric/valid academic values
- Expected graduation year
- Valid option values
- Multi-select values
- Payment fields
- Maximum text lengths

Reject unexpected enum values on the server.

---

# 16. University Email Validation

The University Email is the OTP destination.

The backend should validate the expected university email format/domain according to the project's configured allowed university domain.

Do not hardcode sensitive configuration directly into source code.

Use environment/configuration values.

Example conceptual setting:

```text
UNIVERSITY_EMAIL_DOMAIN
```

The exact domain must be configured for the actual institution before production.

---

# 17. Duplicate Application Protection

Before creating a new application, check for existing records using appropriate identifiers.

At minimum consider:

- Student ID
- University Email

The backend must prevent duplicate active/pending applications.

Example:

```text
Student ID already has PENDING_REVIEW application
        ↓
Do not create another application
        ↓
Show appropriate message
```

Do not expose unnecessary information about another person's application.

---

# 18. OTP System

Use Resend.

## OTP generation

Generate a cryptographically secure 6-digit OTP.

Do not use predictable values.

## Storage

Never store the plain OTP.

Store:

```text
otp_hash
expires_at
attempt_count
verified_at
```

The OTP should be tied to the specific application/verification attempt.

---

# 19. OTP Expiration

Use a short expiration window.

Recommended:

**5 minutes**

When expired:

```text
OTP expired
    ↓
User can request a new OTP
```

Generating a new OTP must invalidate the previous OTP.

---

# 20. OTP Attempts

Implement a reasonable attempt limit.

Recommended:

**5 incorrect attempts**

After the limit:

```text
OTP verification locked
        ↓
User must request a new OTP
```

Do not allow unlimited guessing.

---

# 21. OTP Resend

Add:

- Resend cooldown
- New OTP on resend
- Old OTP invalidated
- Rate limiting

Recommended cooldown:

**60 seconds**

Show a countdown in the UI.

---

# 22. OTP Verification Endpoint

Create a secure server-side verification flow.

Conceptually:

```text
POST /api/membership/verify-otp
```

Input:

```text
applicationId
otp
```

Server:

1. Find application/OTP record
2. Check OTP exists
3. Check expiration
4. Check attempt count
5. Hash/compare OTP
6. Increment failed attempts when incorrect
7. Mark verified when correct
8. Change application status to PENDING_REVIEW
9. Return success

Do not put the OTP verification decision entirely in frontend JavaScript.

---

# 23. OTP Success UI

After correct OTP:

Display:

# 🎉 Congratulations!

Your university email has been successfully verified.

Your membership application has been submitted and is now pending admin review.

Show:

**Status: Pending Review**

Do NOT send a verification confirmation email.

Do NOT redirect directly to the admin system.

---

# 24. Resend Integration

Create a server-side Resend email service abstraction.

Do not call Resend directly from frontend code.

Conceptually:

```text
services/
└── email/
    └── resend
```

Keep API keys in environment variables.

Example:

```text
RESEND_API_KEY
```

Never commit `.env` files containing secrets.

---

# 25. OTP Email

Create a clean transactional email template.

Subject example:

```text
Your Data Science Club verification code
```

Content should include:

- Club branding
- 6-digit OTP
- Expiry information
- Security reminder
- No unnecessary marketing content

---

# 26. Application Persistence

Create the database structure required for membership applications.

Use the project's existing database choice if already established.

The database should be the source of truth.

Do not use Excel as the primary database.

---

# 27. Application Data Model

The application record should support:

```text
id
application_reference
full_name
student_id
university_email
personal_email
phone
department
batch_year
current_semester
expected_graduation_year
current_cgpa
desired_cgpa

academic_interests
technical_skills
technical_skill_level
strongest_technical_skill
creative_media_skills

goals
previous_experience

club_contributions
additional_information

bkash_number
transaction_id
transaction_reference

email_verified_at
status

submitted_at
reviewed_at
reviewed_by
rejection_reason
created_at
updated_at
```

Use normalized relational tables where appropriate rather than forcing every list into a single string.

Do not store sensitive information unnecessarily.

---

# 28. Admin Authentication

Create the foundation for a protected admin area.

Admin accounts must NOT be publicly registered.

Use the project's appropriate authentication mechanism.

Admin routes must be protected server-side.

Do not rely only on hiding frontend links.

Minimum role:

```text
ADMIN
```

Prepare the architecture so additional roles can be added later if needed.

---

# 29. Admin Login UI

Implement the Stitch-designed admin login.

Fields:

- Email
- Password

Actions:

- Sign In
- Forgot Password if supported by the chosen auth architecture

After login:

```text
/admin
```

Unauthenticated users attempting to access admin routes must be redirected to login.

---

# 30. Admin Dashboard — Phase 2 Scope

Create the initial dashboard.

Show:

- Pending Applications
- Approved Applications
- Rejected Applications
- Active Members

Do not implement graduation analytics or campaign analytics yet.

Use real database counts where available.

Do not use fabricated statistics.

---

# 31. Admin Applications List

Route:

```text
/admin/applications
```

Show:

- Application reference
- Name
- Student ID
- Department
- Batch
- University Email
- Expected Graduation Year
- Payment information status
- Application status
- Submitted date
- Actions

Default sorting:

Newest pending applications first.

---

# 32. Application Filters

Provide:

- Search
- Department
- Batch
- Application status
- Expected graduation year

Do not make the filtering unnecessarily complex.

Filtering should happen server-side when the dataset becomes large.

---

# 33. Application Detail

Route conceptually:

```text
/admin/applications/[id]
```

Display:

## Personal Information

Full Name
Student ID
University Email
Personal Email
Phone

## Academic Information

Department
Batch
Current Semester
Expected Graduation
Current CGPA
Desired CGPA

## Academic Interests

Selected values.

## Technical Skills

Selected values
Skill level
Strongest skill

## Creative & Media Skills

Selected values.

## Goals

Selected values.

## Previous Experience

Selected values.

## Club Contribution

Selected values.

## Additional Information

Text.

## Payment

bKash number
Transaction ID
Transaction reference

Clearly show that payment is:

**Pending Manual Verification**

unless the admin marks the application approved/rejected.

---

# 34. Admin Review Actions

For a `PENDING_REVIEW` application:

Show:

**Approve**

**Reject**

Do not show these actions for already approved/rejected applications.

---

# 35. Approval Workflow

When admin selects Approve:

Show confirmation modal:

# Approve Membership?

Explain:

- A unique Member ID will be generated.
- The applicant will become an Active Member.
- A Member Confirmation email will be sent through Resend.

Button:

**Approve & Create Member**

---

# 36. Member ID Generation

When approval succeeds:

Generate a unique Member ID.

The format should be configurable.

Example only:

```text
DSC-2026-0001
```

Do not hardcode a specific sequence.

Member IDs must be unique.

The database must enforce uniqueness.

Do not generate a new ID if the same approval operation is retried.

Approval must be idempotent.

---

# 37. Active Member Creation

When approved:

```text
Application
status = APPROVED

Member
status = ACTIVE
```

Create the member record from the approved application.

Store:

```text
member_id
application_id
name
student_id
university_email
personal_email
phone
department
batch
current_semester
expected_graduation_year
academic_interests
technical_skills
technical_skill_level
strongest_technical_skill
creative_media_skills
goals
previous_experience
club_contributions
additional_information
joined_at
status
```

Do not duplicate unnecessary data if the database architecture can reference application information safely.

---

# 38. Approval Email

After successful approval and member creation, send ONE email through Resend.

This is the:

**Member Confirmation / Welcome Email**

It should include:

- Congratulations
- Member name
- Unique Member ID
- Student ID
- Department
- Batch
- Membership status: ACTIVE
- Joining date
- Club name
- Basic next-step information

There is no separate welcome email.

There is no separate approval email.

This single email serves as the approval + member confirmation + welcome email.

---

# 39. Rejection Workflow

When admin selects Reject:

Open modal.

Required field:

**Reason for rejection**

Buttons:

**Reject Application**

**Cancel**

Save:

```text
status = REJECTED
rejection_reason
reviewed_at
reviewed_by
```

---

# 40. Rejection Email

After rejection, send one transactional email through Resend.

The email should include:

- Applicant name
- Application reference
- Rejection decision
- Reason
- Appropriate club contact information

Do not expose internal admin notes.

---

# 41. Transaction Safety

Approval should be treated as a critical transaction.

Conceptually:

```text
BEGIN
    Lock/check application
    Verify status = PENDING_REVIEW
    Create unique Member ID
    Create Member
    Set application = APPROVED
COMMIT

Then send confirmation email
```

If the admin clicks Approve twice, the system must not create two members or two different Member IDs.

The backend must protect against duplicate approval.

---

# 42. Email Failure Handling

If the member is successfully approved but the email fails:

Do NOT roll back the membership.

Instead:

```text
Member = ACTIVE
Email = FAILED
```

Store enough information to retry the email later.

The admin should see an indication that the member confirmation email failed.

Do not create a second member when retrying the email.

---

# 43. Admin Application Status UI

Use clear badges:

```text
Pending Review
Approved
Rejected
```

Use accessible status colors and text.

Do not rely on color alone.

---

# 44. Active Members — Initial Phase 2 Scope

Create:

```text
/admin/members
```

Display:

- Member ID
- Name
- Student ID
- Department
- Batch
- University Email
- Expected Graduation
- Joined Date
- Status

Status:

**ACTIVE**

Provide:

- Search
- Basic filtering
- View member

Do not implement graduation automation yet.

---

# 45. Member Detail — Initial Scope

Route:

```text
/admin/members/[id]
```

Show the approved member's information.

Header:

```text
Member Name
DSC-2026-XXXX
ACTIVE
```

Sections:

- Personal
- Academic
- Interests
- Technical Skills
- Creative Skills
- Goals
- Experience
- Contribution
- Membership Information

---

# 46. Security Requirements

Mandatory:

- Server-side authentication
- Server-side authorization
- Passwords must never be stored in plaintext
- API keys only in environment variables
- OTP stored hashed
- Rate limiting on OTP endpoints
- Validate all server input
- Sanitize/validate user-generated text
- Protect admin routes
- Prevent unauthorized application access
- Prevent ID enumeration where practical
- Do not expose sensitive payment data unnecessarily
- Do not log OTPs
- Do not log API keys
- Do not expose database credentials

---

# 47. Privacy

The application contains personal and academic information.

Only authorized admins should access submitted applications.

Do not expose application details through public routes.

Do not include student information in public pages.

---

# 48. API / Backend Structure

Adapt to the project's framework.

Keep business logic separated from UI.

Conceptually:

```text
API
├── membership
│   ├── create-application
│   ├── send-otp
│   ├── verify-otp
│   └── status
│
├── admin
│   ├── applications
│   ├── application-detail
│   ├── approve
│   ├── reject
│   └── members
│
└── email
    └── resend-service
```

Do not expose internal service credentials.

---

# 49. Frontend State

The multi-step form should handle:

- Current step
- Form values
- Validation errors
- Submission state
- OTP state
- Resend cooldown
- API errors
- Success state

Avoid storing sensitive application data in unnecessary persistent browser storage.

If temporary client persistence is used, understand its privacy implications.

---

# 50. Error Handling

Create user-friendly states for:

- Invalid form
- Network error
- Server error
- Duplicate application
- Invalid OTP
- Expired OTP
- Too many OTP attempts
- OTP resend cooldown
- Unauthorized admin
- Application not found
- Already reviewed application
- Approval failure
- Rejection failure
- Email failure

Never expose stack traces or database errors to users.

---

# 51. Responsive Implementation

Use the Stitch designs as the visual reference.

Must work at:

```text
360px
390px
768px
1024px
1440px
1920px
```

Membership form mobile:

- One-column layout
- Large touch targets
- Sticky or clearly visible navigation controls
- Clear progress indicator
- Easy checkbox selection
- No horizontal overflow

Admin mobile:

- Responsive navigation
- Cards instead of overly wide tables where appropriate
- Filter drawer/sheet
- Responsive application details
- Responsive approval/rejection modals

---

# 52. Accessibility

Maintain:

- Semantic HTML
- Keyboard navigation
- Focus management
- Accessible labels
- Accessible error messages
- Screen-reader-friendly form controls
- Visible focus states
- Sufficient contrast
- Proper modal focus trapping
- Accessible status messages

OTP success and form errors should be announced appropriately.

---

# 53. Database Source of Truth

The database is the primary source of truth.

Do NOT use Excel as the primary membership database.

Excel/CSV export can be implemented in a later phase.

The final system may later generate sorted exports for active members and alumni.

---

# 54. Do NOT Implement in Phase 2

Do not implement:

- Bulk campaign system
- Brevo integration
- Multiple campaign email providers
- Campaign recipient deduplication
- Campaign scheduling
- Graduation automation
- Automatic alumni conversion
- Alumni management
- Advanced member analytics
- Advanced event management
- Public member directory
- Public application status portal unless already necessary for the Phase 2 design

These belong to Phase 3.

---

# 55. Phase 2 Completion Checklist

## Public Membership

- [ ] Full Membership page connected to application
- [ ] Complete multi-step form
- [ ] All required fields implemented
- [ ] Optional fields implemented
- [ ] Multi-select behavior implemented
- [ ] None options mutually exclusive
- [ ] Strongest skill limited to selected technical skills
- [ ] Review step implemented
- [ ] Client validation
- [ ] Server validation
- [ ] Responsive mobile design

## OTP

- [ ] Secure 6-digit OTP
- [ ] OTP hashing
- [ ] OTP expiry
- [ ] Attempt limit
- [ ] Resend cooldown
- [ ] Old OTP invalidation
- [ ] Resend integration
- [ ] OTP verification endpoint
- [ ] Congratulations screen
- [ ] No verification confirmation email

## Application

- [ ] Database persistence
- [ ] Duplicate detection
- [ ] Application statuses
- [ ] Payment data stored
- [ ] Pending review workflow

## Admin

- [ ] Admin authentication
- [ ] Protected routes
- [ ] Dashboard
- [ ] Application list
- [ ] Search/filter
- [ ] Application detail
- [ ] Approve flow
- [ ] Reject flow

## Members

- [ ] Unique Member ID
- [ ] Active member creation
- [ ] Active member list
- [ ] Member detail

## Emails

- [ ] OTP email
- [ ] Approval/member confirmation email
- [ ] Rejection email
- [ ] Email failure handling

## Quality

- [ ] Build passes
- [ ] Type checks pass if configured
- [ ] Lint passes if configured
- [ ] No obvious console errors
- [ ] No secrets committed
- [ ] No unauthorized admin routes
- [ ] No duplicate member creation
- [ ] No duplicate approval
- [ ] No OTP logging

---

# 56. Agent Execution Instructions

You are implementing Phase 2 of an existing project.

Before changing anything:

1. Inspect the current repository.
2. Inspect Phase 1 implementation.
3. Inspect the Stitch UI reference if available in the project.
4. Identify the existing framework.
5. Identify the database/authentication architecture already present.
6. Reuse existing components and design tokens.
7. Do not replace the framework unnecessarily.

Implement Phase 2 incrementally.

Recommended order:

```text
1. Database schema
2. Environment configuration
3. Server-side validation
4. Application API
5. OTP service
6. Resend integration
7. Multi-step membership form
8. OTP UI
9. Admin authentication
10. Admin application list
11. Application detail
12. Approval/rejection
13. Member ID generation
14. Active member creation
15. Transactional emails
16. Active member management
17. Error/security hardening
18. Responsive/accessibility testing
```

After implementation:

1. Run database migrations.
2. Run build.
3. Run lint/type checks if available.
4. Test application submission.
5. Test duplicate application protection.
6. Test OTP success.
7. Test incorrect OTP.
8. Test expired OTP.
9. Test OTP resend.
10. Test admin login.
11. Test pending application review.
12. Test approval.
13. Confirm only one Member ID is generated.
14. Confirm Active Member is created.
15. Test rejection.
16. Test email failure behavior.
17. Test mobile layouts.
18. Check for console/server errors.
19. Verify no secrets are committed.
20. Stop after Phase 2.

Do not automatically implement Phase 3.
