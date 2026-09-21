# Phase 3 — Multi-Provider Campaigns, Graduation & Alumni

## Goal

Implement the final phase of the Data Science Club Membership Management System on top of the existing Astro + Phase 1 + Phase 2 project.

The main campaign requirement is:

**One campaign must be able to target approximately 1,500–2,000 members in the same campaign window by distributing recipients across multiple legitimate email providers in parallel, subject to the actual capacity configured for each provider.**

Providers:

1. Brevo — bulk campaigns
2. Mailjet — bulk campaigns
3. SMTP2GO — bulk campaigns
4. MailerSend — bulk campaigns
5. Resend — transactional only

Resend remains reserved for:
- OTP
- Approval/member confirmation
- Rejection

Do NOT use Resend for bulk campaigns.

---

# 1. Important Campaign Architecture

The system must NOT simply send 300 per day over many days.

It should work like:

```text
ONE CAMPAIGN
     |
1,800 eligible members
     |
     +------ Brevo queue
     |
     +------ Mailjet queue
     |
     +------ SMTP2GO queue
     |
     +------ MailerSend queue
     |
     +------ Additional legitimately configured provider(s), if needed
     |
Parallel dispatch
     |
Per-recipient tracking
```

The actual provider capacity must be configurable.

Do NOT hardcode assumptions such as:
- Brevo = 300
- Mailjet = 200
- SMTP2GO = 200
- MailerSend = 100

Those are only examples.

Before sending, calculate:

```text
total eligible recipients
total usable provider capacity
```

If capacity is insufficient, DO NOT silently send only part of the audience.

Show the administrator the shortfall.

---

# 2. Provider Abstraction

Create a provider interface so the campaign engine is provider-independent.

Conceptually:

```text
EmailProvider
├── BrevoProvider
├── MailjetProvider
├── SMTP2GOProvider
└── MailerSendProvider
```

The campaign engine must communicate with the interface, not directly with provider-specific APIs.

This allows future providers to be added without rewriting the campaign system.

---

# 3. API Credentials

All provider API credentials are server-side secrets.

Never expose them in browser/client code.

Never commit real credentials.

Use `.env` / secure server-side configuration.

Create/update:

```text
.env.example
```

with:

```env
# Transactional
RESEND_API_KEY=

# Bulk
BREVO_API_KEY=

MAILJET_API_KEY=
MAILJET_SECRET_KEY=

SMTP2GO_API_KEY=

MAILERSEND_API_TOKEN=

# Application
DATABASE_URL=
AUTH_SECRET=

# If credentials are encrypted in the database
EMAIL_CREDENTIAL_ENCRYPTION_KEY=
```

Ensure `.gitignore` excludes:

```text
.env
.env.*
!.env.example
```

---

# 4. Where to Get the APIs

## Resend

Use for transactional mail only.

Create an API key from the Resend dashboard under API Keys.

Prefer a sending-only permission when available.

Environment variable:

```env
RESEND_API_KEY=
```

Official documentation:

https://resend.com/changelog/new-api-key-permissions

---

## Brevo

Go to:

**Brevo → Account → SMTP & API → API Keys**

Choose:

**Generate a new API key**

Copy the key immediately and store it securely.

Environment variable:

```env
BREVO_API_KEY=
```

Brevo authenticates API calls using the `api-key` header.

Official documentation:

https://developers.brevo.com/docs/api-key-authentication

---

## Mailjet

Go to Mailjet's API key management.

Mailjet requires:

```text
API Key
Secret Key
```

Environment variables:

```env
MAILJET_API_KEY=
MAILJET_SECRET_KEY=
```

The Secret Key is shown only once when created, so save it securely.

Official documentation:

https://documentation.mailjet.com/hc/en-us/articles/360043225693-What-is-an-API-key

---

## SMTP2GO

Go to:

**SMTP2GO → Sending → API Keys → Add API Key**

Create an API key with only the permissions needed for sending.

Environment variable:

```env
SMTP2GO_API_KEY=
```

SMTP2GO supports API-key permissions and rate limits.

Official documentation:

https://developers.smtp2go.com/docs/getting-started

---

## MailerSend

Create a sending-domain API token in the MailerSend dashboard.

Environment variable:

```env
MAILERSEND_API_TOKEN=
```

MailerSend uses:

```text
Authorization: Bearer <token>
```

Official documentation:

https://developers.mailersend.com/api/v1/account/tokens

---

# 5. Admin Provider Settings

Create an admin-only page:

```text
/admin/settings/email-providers
```

It must contain a provider management area.

Cards:

```text
Resend
Transactional Email
[Connected] [Edit] [Test]

Brevo
Bulk Email
[Connected] [Edit] [Test]

Mailjet
Bulk Email
[Connected] [Edit] [Test]

SMTP2GO
Bulk Email
[Connected] [Edit] [Test]

MailerSend
Bulk Email
[Connected] [Edit] [Test]
```

---

# 6. API Key Input UI

Create a secure UI where the administrator can enter each provider credential.

Example:

```text
Brevo

API Key
[••••••••••••••••••••] [Replace]

Daily Capacity
[300]

Monthly Capacity
[6000]

Enabled
[ON]

Priority
[1]

[Save & Test Connection]
```

For Mailjet:

```text
API Key
[••••••••••••]

Secret Key
[••••••••••••]
```

After saving, never display the complete secret again.

Use masked values.

Provide:

```text
Replace Credential
```

rather than exposing the existing secret.

---

# 7. Credential Storage

Preferred:

```text
Admin enters credential
        ↓
Server validates it
        ↓
Encrypt credential
        ↓
Store encrypted value
        ↓
UI displays only masked value
```

Use:

```env
EMAIL_CREDENTIAL_ENCRYPTION_KEY=
```

for application-level encryption if credentials are stored in the database.

If the deployment platform provides a secure secret manager, prefer it.

Never expose this encryption key to the frontend.

---

# 8. Provider Connection Test

Each provider must have:

**Test Connection**

The server performs a safe authenticated API request.

Return:

```text
✓ Connected
```

or:

```text
Connection failed
```

Never return the credential.

Never log the credential.

---

# 9. Provider Capacity

Each provider configuration must contain:

```text
enabled
priority
daily_capacity
monthly_capacity
```

The admin controls the values.

Example:

```text
Brevo
Daily capacity: 300
Monthly capacity: 6000
Enabled: Yes
Priority: 1
```

These are configuration values, NOT claims about the provider's permanent free tier.

Provider limits can change.

---

# 10. Capacity Calculation

Before sending:

```text
daily_remaining =
configured_daily_capacity - provider_usage_today

monthly_remaining =
configured_monthly_capacity - provider_usage_this_month

usable_capacity =
minimum(daily_remaining, monthly_remaining)
```

Only enabled providers with usable capacity participate.

---

# 11. Campaign Creation

Create:

```text
/admin/campaigns
/admin/campaigns/new
```

Campaign fields:

- Campaign name
- Subject
- HTML content
- Plain text content
- Sender
- Reply-to
- Audience

Audience options:

- All Active Members
- Department
- Batch
- Graduation Year
- Custom selection

Do not include rejected applications.

Do not include unverified applications.

Do not include alumni unless the administrator explicitly has an audience option for alumni.

---

# 12. Audience Preview

Before sending:

```text
Eligible recipients: 1,800
```

Show filtering breakdown and invalid/duplicate counts where useful.

Resolve the audience from the database.

Do not use a manually uploaded recipient spreadsheet as the source of truth.

---

# 13. Campaign Deduplication

This is mandatory.

Create one campaign-recipient record per:

```text
campaign_id + member_id
```

Enforce a database unique constraint.

If:

```text
Campaign 45
Member 1023
```

was already assigned to Brevo, the same member cannot be assigned to Mailjet for Campaign 45.

Never send the same campaign to the same member through multiple providers.

---

# 14. Campaign Tables

Create a campaign entity with fields similar to:

```text
id
name
subject
html_content
text_content
audience_definition
total_recipients
total_sent
total_delivered
total_failed
total_pending
status
created_by
created_at
started_at
completed_at
updated_at
```

Create a campaign recipient entity:

```text
id
campaign_id
member_id
email
provider
status
provider_message_id
attempt_count
last_error
queued_at
sent_at
delivered_at
failed_at
created_at
updated_at
```

Unique:

```text
campaign_id + member_id
```

Optional provider summary table:

```text
campaign_id
provider
allocated_count
sent_count
delivered_count
failed_count
pending_count
capacity_at_start
started_at
completed_at
```

---

# 15. Campaign Statuses

Use:

```text
DRAFT
READY
QUEUED
SENDING
PAUSED
COMPLETED
PARTIALLY_COMPLETED
FAILED
CANCELLED
```

---

# 16. Provider Allocation

Example:

```text
Recipients = 1,800

Brevo capacity = 300
Mailjet capacity = 200
SMTP2GO capacity = 200
MailerSend capacity = 100
Other configured provider = 1,000
```

Then:

```text
Total capacity = 1,800
```

The system can proceed.

This is only an example. Actual capacity comes from configuration and current usage.

If:

```text
Recipients = 1,800
Available capacity = 800
```

show:

```text
Campaign cannot currently send to all selected recipients.

Required: 1,800
Available: 800
Shortfall: 1,000
```

Do not silently send 800.

---

# 17. Parallel Sending

When enough capacity exists:

```text
Campaign
   |
   +-- Brevo queue
   |
   +-- Mailjet queue
   |
   +-- SMTP2GO queue
   |
   +-- MailerSend queue
   |
   +-- Additional provider queues
```

Start provider queues in parallel.

Do not wait for Provider A to finish before Provider B starts.

---

# 18. Background Processing

Do NOT send 2,000 messages inside one synchronous HTTP request.

Use a background job/queue architecture compatible with the deployment environment.

Flow:

```text
Admin clicks Send
        ↓
Validate campaign
        ↓
Create provider queues
        ↓
Return success to admin
        ↓
Background workers send emails
```

---

# 19. Recipient Status

Use:

```text
PENDING
QUEUED
SENDING
SENT
DELIVERED
FAILED
CANCELLED
```

Distinguish:

```text
SENT
```

from:

```text
DELIVERED
```

where provider delivery events are available.

---

# 20. Retry Logic

Use bounded retries.

Example:

```text
Attempt 1
 ↓ temporary failure
Wait
 ↓
Attempt 2
 ↓ temporary failure
Wait
 ↓
Attempt 3
 ↓
FAILED
```

Use exponential backoff where appropriate.

Do not retry indefinitely.

Do not automatically switch providers after an ambiguous timeout unless the provider's final delivery state is known.

A timeout may mean the provider accepted the email even if the HTTP response was lost.

---

# 21. No Duplicate Sending

The combination of:

- database unique constraint
- atomic recipient status changes
- queue locking
- idempotent campaign start
- provider message IDs

must prevent duplicate sends.

If two workers try to process the same recipient, only one may transition it to `SENDING`.

---

# 22. Campaign Send Confirmation

Before sending show:

```text
Campaign:
[Name]

Recipients:
1,800

Provider allocation:
Brevo: X
Mailjet: X
SMTP2GO: X
MailerSend: X

Every member will be assigned to exactly one provider.

[Cancel]
[Send Campaign]
```

Require explicit confirmation.

---

# 23. Test Email

Add:

**Send Test Email**

Admin enters a test address.

The system sends only the test message.

Do not create normal campaign recipient records for test messages.

---

# 24. Campaign Preview

Show:

- Desktop preview
- Mobile preview
- Subject
- Sender
- Reply-to

Provide:

**Send Test**

before actual campaign sending.

---

# 25. Campaign Dashboard

Show:

```text
Campaign
Subject
Recipients
Sent
Delivered
Failed
Pending
Status
Created
Completed
```

Actions:

- View
- Duplicate
- Retry failed recipients where safe
- Pause
- Resume
- Cancel

---

# 26. Campaign Details

Show:

```text
Total recipients
Queued
Sent
Delivered
Failed
Pending
Cancelled
```

Provider breakdown:

```text
Brevo
Allocated
Sent
Delivered
Failed

Mailjet
Allocated
Sent
Delivered
Failed

SMTP2GO
Allocated
Sent
Delivered
Failed

MailerSend
Allocated
Sent
Delivered
Failed
```

---

# 27. Recipient Delivery Log

Show:

```text
Member
Email
Provider
Status
Attempts
Sent At
Error
```

Allow searching by:

- Member ID
- Name
- Email

---

# 28. Campaign Audit Log

Track:

```text
Campaign created
Campaign edited
Campaign queued
Campaign started
Campaign paused
Campaign resumed
Campaign cancelled
Campaign completed
Retry initiated
```

Store:

```text
admin_id
action
timestamp
campaign_id
```

Never store API secrets or OTPs.

---

# 29. Pause / Resume / Cancel

Pause:

- Stop new sends
- Already sent messages remain sent

Resume:

- Continue pending recipients
- Never resend sent recipients

Cancel:

- Stop pending/queued recipients
- Mark them CANCELLED
- Already sent messages remain sent

---

# 30. Webhooks

Where supported, implement provider webhooks for:

- Delivered
- Bounced
- Complained
- Opened
- Clicked

Verify webhook authenticity.

Never trust arbitrary incoming webhook requests.

---

# 31. Sender Settings

Create:

```text
/admin/settings/email
```

Fields:

```text
Sender Name
Sender Email
Reply-To
```

Do not hardcode real club email addresses.

Provider/domain sender verification must be completed before production campaigns.

---

# 32. Bulk Email Compliance

The system must use legitimate member data and configured providers.

Do NOT:

- create fake accounts to bypass limits
- rotate accounts to evade provider restrictions
- spoof senders
- bypass anti-spam systems
- use purchased lists
- hide campaign traffic
- intentionally circumvent provider terms

Use legitimate provider accounts and their actual permitted capacity.

Include unsubscribe functionality where required.

---

# 33. Active Member Export

Create:

```text
/admin/members/export
```

Support CSV and XLSX where the existing stack permits.

Fields:

- Member ID
- Full Name
- Student ID
- University Email
- Personal Email
- Phone
- Department
- Batch
- Semester
- Expected Graduation
- CGPA
- Technical Skills
- Interests
- Joined Date
- Status

Sorting:

- Department
- Batch
- Expected Graduation
- Joined Date
- Member ID
- Name

---

# 34. Graduation Review

Create:

```text
/admin/graduation-review
```

Sections:

### Upcoming

Members approaching expected graduation.

### Due

Members reaching expected graduation.

### Outpassed

Expected graduation has passed.

Do NOT automatically assume that the student has actually graduated merely because the expected date passed.

Use:

```text
ACTIVE
GRADUATION_REVIEW
ALUMNI
```

---

# 35. Mark as Alumni

Admin action:

**Mark as Alumni**

Confirmation:

```text
Mark this member as Alumni?

The member status will change from
GRADUATION_REVIEW to ALUMNI.
```

Store:

```text
alumni_since
reviewed_by
status
```

Never delete member history.

---

# 36. Alumni Page

Route:

```text
/admin/alumni
```

Show:

- Member ID
- Name
- Student ID
- Department
- Batch
- Graduation Year
- Joined Date
- Alumni Since
- Email
- Status

Support search, filtering, and export.

---

# 37. Final Admin Navigation

```text
Dashboard

Membership
├── Applications
├── Active Members
├── Graduation Review
└── Alumni

Campaigns
├── All Campaigns
└── Create Campaign

Settings
├── Email Providers
├── Email/Sender Settings
└── System Settings
```

---

# 38. API / Server Structure

Adapt to the existing Astro architecture.

Conceptually:

```text
server/
├── email/
│   ├── provider-interface
│   ├── resend-provider
│   ├── brevo-provider
│   ├── mailjet-provider
│   ├── smtp2go-provider
│   └── mailersend-provider
│
├── campaigns/
│   ├── audience-service
│   ├── allocation-service
│   ├── dispatch-service
│   ├── retry-service
│   └── tracking-service
│
├── members/
│   ├── graduation-service
│   └── export-service
│
└── settings/
    └── provider-credentials
```

Do not blindly create this exact structure if the current project uses another appropriate structure.

Reuse Phase 2 patterns.

---

# 39. Admin API Routes

Adapt to the project's routing architecture.

Conceptually:

```text
/api/admin/email-providers
/api/admin/email-providers/test
/api/admin/campaigns
/api/admin/campaigns/[id]
/api/admin/campaigns/[id]/send
/api/admin/campaigns/[id]/pause
/api/admin/campaigns/[id]/resume
/api/admin/campaigns/[id]/cancel
/api/admin/campaigns/[id]/retry
/api/admin/campaigns/[id]/recipients
/api/admin/members/export
/api/admin/graduation-review
/api/admin/members/[id]/mark-alumni
```

All must be server-protected.

---

# 40. Security

Mandatory:

- Provider secrets server-side only
- Credentials encrypted at rest if stored in DB
- `.env` excluded from Git
- Admin-only provider settings
- Server-side admin authorization
- Webhook verification
- Campaign recipient uniqueness
- Idempotent campaign start
- Atomic queue processing
- Capacity enforcement
- Bounded retries
- No secret logging
- No OTP logging
- Input validation
- Safe error messages
- No provider-limit bypass

---

# 41. Phase 3 Completion Checklist

## Providers

- [ ] Resend remains transactional-only
- [ ] Brevo integrated
- [ ] Mailjet integrated
- [ ] SMTP2GO integrated
- [ ] MailerSend integrated
- [ ] Provider abstraction
- [ ] Provider connection testing
- [ ] Provider enable/disable
- [ ] Provider priority
- [ ] Provider capacity

## Credentials

- [ ] Admin provider settings UI
- [ ] Masked secrets
- [ ] Secure storage
- [ ] Encryption where required
- [ ] API setup instructions
- [ ] `.env.example`
- [ ] Secrets excluded from Git

## Campaigns

- [ ] Campaign creation
- [ ] Audience selection
- [ ] Audience preview
- [ ] Deduplication
- [ ] Capacity calculation
- [ ] Multi-provider allocation
- [ ] Parallel queues
- [ ] Background processing
- [ ] Recipient tracking
- [ ] Retry
- [ ] Pause
- [ ] Resume
- [ ] Cancel
- [ ] Test email
- [ ] Preview
- [ ] History
- [ ] Provider statistics
- [ ] Audit log

## Members

- [ ] CSV/XLSX export
- [ ] Sorting
- [ ] Graduation review
- [ ] Alumni conversion
- [ ] Alumni page
- [ ] Alumni export

## Quality

- [ ] npm run build
- [ ] npx astro check
- [ ] No secrets committed
- [ ] Mobile responsive
- [ ] Admin authorization tested
- [ ] Provider tests completed
- [ ] Duplicate-send tests pass
- [ ] Capacity tests pass
- [ ] Retry tests pass

---

# 42. Agent Execution Instructions

This is Phase 3 of an existing project.

Before changing anything:

1. Inspect the complete repository.
2. Read the existing Phase 1 documentation.
3. Inspect the Phase 1 implementation.
4. Inspect the Phase 2 implementation.
5. Confirm the current database/auth architecture.
6. Confirm the existing Resend integration.
7. Reuse existing UI components and design tokens.
8. Do not replace Astro.
9. Do not recreate existing functionality.

Implement incrementally:

```text
1. Inspect architecture
2. Database migrations
3. Provider abstraction
4. Credential storage
5. Provider settings UI
6. Provider connection tests
7. Brevo
8. Mailjet
9. SMTP2GO
10. MailerSend
11. Capacity engine
12. Campaign database
13. Audience service
14. Deduplication
15. Allocation engine
16. Background queue
17. Campaign UI
18. Tracking
19. Webhooks
20. Retry/pause/resume/cancel
21. Reporting
22. Member exports
23. Graduation review
24. Alumni
25. Security hardening
26. Responsive/accessibility testing
27. Build verification
```

Before declaring complete:

```text
npm run build
npx astro check
```

Fix all errors.

Do not implement unrelated features.

Do not modify Git remotes.

Do not push directly to main.

Keep work on the existing development branch unless instructed otherwise.

Final report must include:

1. Architecture summary
2. Providers integrated
3. Required environment variables
4. Where each API key is obtained
5. Database migrations
6. Routes added
7. Security measures
8. Campaign capacity/deduplication behavior
9. Graduation/alumni behavior
10. Tests performed
11. Any provider setup still required from the administrator
