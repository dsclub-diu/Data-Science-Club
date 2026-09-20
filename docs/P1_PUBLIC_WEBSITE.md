# Phase 1 — Public Website & Landing Pages

## 1. Phase Goal

Build the complete public-facing website and foundational frontend structure for the Data Science Club Full Membership Enrollment System.

Phase 1 includes only:
- Public website
- Landing pages
- Navigation
- Reusable UI components
- Responsive design
- SEO/accessibility foundations
- Membership introduction page

Do NOT implement the membership backend, OTP, payment verification, admin dashboard, member ID generation, alumni automation, or bulk email system in this phase.

---

## 2. Product Definition

This is a **Full Membership Enrollment System**.

There is **NO Membership Type** field or membership-type selection.

Do not create Basic/Premium/General/Executive membership options.

Every applicant follows the same Full Membership application flow.

---

## 3. Public Routes

Create:

```text
/
├── /about
├── /workshops
├── /partners
├── /join-us
└── /contact
```

Navigation:

```text
Logo | Home | About Us | Workshops | Partners | Join Us
```

Join Us should be visually emphasized.

---

# 4. Home Page

## Hero

Content direction:

**DATA SCIENCE CLUB**

# Learn. Build. Grow Together.

Student-driven community exploring data science, artificial intelligence, software engineering, research, innovation, and technology.

Buttons:
- **Join Us** → `/join-us`
- **Explore Workshops** → `/workshops`

Use existing project assets if available. Do not invent a logo.

## What We Do

Four cards:

### Learn
Workshops, technical sessions, knowledge sharing, and peer learning.

### Build
Projects, competitions, hackathons, and practical experimentation.

### Research
Explore emerging technologies and research opportunities.

### Connect
Meet students, mentors, professionals, researchers, and industry communities.

## Areas of Interest

Show:

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

## Workshops Preview

Create reusable event cards containing:
- Title
- Description
- Date
- Time
- Location
- Event type
- CTA

Use placeholder data only if real data is unavailable.

CTA:
**View All Workshops** → `/workshops`

No event registration in Phase 1.

## Why Join

Explain benefits such as:
- Learn technical skills
- Build projects
- Participate in competitions
- Explore research
- Develop technical and creative skills
- Network
- Explore career opportunities
- Contribute to the community

Do not promise guaranteed jobs/internships.

## Community / Impact

Create a statistics-style section, but do not invent factual statistics.

If real numbers are unavailable, use labels such as:
- Growing Community
- Regular Workshops
- Student Projects
- Academic & Industry Connections

Make this easy to replace with real data later.

## Final CTA

**Ready to be part of the community?**

Join the Data Science Club and learn, build, research, and grow with a community of students passionate about technology.

Button:
**Apply for Full Membership** → `/join-us`

---

# 5. About Page

Sections:

## Hero
**About Data Science Club**

Short introduction to the club as a student-driven technology community.

## Mission

Create opportunities for students to:
- Learn
- Build
- Research
- Collaborate
- Contribute

## Vision

A technology community where students turn curiosity into practical skills, projects, research, and innovation.

## What We Do

- Workshops
- Technical sessions
- Projects
- Competitions
- Research activities
- Community events
- Industry/academic collaboration

## Values

Cards:
- Curiosity
- Collaboration
- Innovation
- Learning
- Responsibility
- Community

Finish with Full Membership CTA.

---

# 6. Workshops Page

Structure:

```text
Hero
↓
Upcoming Workshops
↓
Past Workshops
↓
CTA
```

Event card:

```text
Date
Event Type
Title
Description
Location
Time
[View Details]
```

Use static/local data in Phase 1.

Structure the data so it can later be replaced by an API/database.

Optional event detail route:

```text
/workshops/[slug]
```

No event registration backend.

---

# 7. Partners Page

Hero:

**Our Partners & Collaborators**

Partner grid.

Each partner card:
- Logo
- Organization name
- Short description
- Optional website

Do not invent official partnerships. Use placeholders only when necessary.

Make partner data easy to replace later with real data.

Add collaboration CTA → `/contact`.

---

# 8. Join Us Page

This page introduces Full Membership.

Do NOT build the actual membership form in Phase 1.

## Hero

**Become a Full Member**

Explain that membership is for students who want to learn, build, participate, research, and contribute.

## What Members Can Explore

Cards:
- Technical Skills
- Projects
- Research
- Competitions
- Events
- Networking
- Leadership
- Creative & Media Activities

## Membership Process Preview

Show:

```text
1. Submit Application
        ↓
2. Verify Email
        ↓
3. Admin Review
        ↓
4. Membership Approval
        ↓
5. Receive Member ID
```

This is visual information only in Phase 1.

No OTP implementation yet.

CTA:
**Start Full Membership Application**

Prepare the future route:

```text
/join-us/apply
```

Do not create fake submission functionality.

---

# 9. Contact Page

Create a simple contact page containing:
- Club email placeholder
- Social links placeholders
- Organization/institution information placeholder
- Contact CTA

Do not invent real contact details.

---

# 10. Header

Desktop:

```text
[Logo]    Home   About Us   Workshops   Partners    [Join Us]
```

Requirements:
- Responsive
- Sticky/fixed if appropriate
- Transparent/overlay on hero may be used
- Solid/frosted state when appropriate
- Mobile menu
- Keyboard accessible
- Visible focus state

Logo links to `/`.

---

# 11. Footer

Include:
- Logo
- Short description
- Navigation links
- Social placeholders
- Privacy Policy placeholder
- Terms placeholder

Bottom:

```text
© [Current Year] Data Science Club. All rights reserved.
```

Use the current year dynamically where possible.

---

# 12. Design Direction

The visual style should be:

- Modern
- Clean
- Professional
- Technical
- Student-driven
- Welcoming
- Trustworthy

Avoid:
- Excessive gradients
- Excessive glassmorphism
- Overly corporate SaaS styling
- Excessive animations
- Too many colors
- Generic AI stock imagery everywhere
- Unnecessary 3D effects

Prioritize typography, spacing, hierarchy, and strong layout.

---

# 13. Responsive Design

Test at:

```text
360px
390px
768px
1024px
1440px
1920px
```

Ensure:
- No horizontal overflow
- Touch-friendly buttons
- Readable typography
- Proper spacing
- Cards stack naturally
- Hero adapts correctly
- Mobile navigation works

---

# 14. Accessibility

Use:
- Semantic HTML
- Correct heading hierarchy
- Proper labels
- Keyboard navigation
- Visible focus states
- Accessible contrast
- Alt text
- Buttons for actions
- Links for navigation
- `prefers-reduced-motion`

Do not rely only on color for meaning.

---

# 15. SEO

Each public page should have:
- Unique title
- Meta description
- Canonical URL where appropriate
- Open Graph metadata
- Social preview metadata
- Semantic headings

Prepare:
- `robots.txt`
- Sitemap
- Favicon
- Social preview image

Do not invent organization facts.

---

# 16. Performance

Prioritize:
- Optimized images
- Lazy loading below-the-fold images
- Minimal JavaScript
- Reusable components
- No unnecessary dependencies
- No heavy animation libraries unless already present

---

# 17. Animation

Use subtle motion:
- Section entrance
- Button hover
- Card hover
- Navigation transitions
- Mobile menu transitions

Avoid excessive movement.

Respect reduced-motion preferences.

---

# 18. Component Architecture

Adapt to the existing framework, but aim for reusable components such as:

```text
components/
├── layout/
│   ├── Header
│   ├── Footer
│   └── MobileMenu
│
├── ui/
│   ├── Button
│   ├── SectionHeading
│   ├── Card
│   └── Badge
│
├── home/
│   ├── Hero
│   ├── WhatWeDo
│   ├── InterestAreas
│   ├── EventPreview
│   ├── WhyJoin
│   ├── CommunityStats
│   └── JoinCTA
│
├── workshops/
│   └── EventCard
│
├── partners/
│   └── PartnerCard
│
└── membership/
    └── MembershipProcess
```

Do not duplicate components unnecessarily.

---

# 19. Data Preparation

Static local data is acceptable in Phase 1.

Prepare structures such as:

```ts
Event {
  id
  title
  slug
  description
  date
  time
  location
  type
  image
  status
}
```

```ts
Partner {
  id
  name
  logo
  description
  website
}
```

Do not implement database operations yet.

---

# 20. Future Membership System — Reference Only

The eventual workflow is:

```text
Public Website
      ↓
Full Membership Application
      ↓
Backend Validation
      ↓
Email OTP — Resend
      ↓
Congratulations message on successful OTP
      ↓
Pending Admin Review
      ↓
Approve / Reject
      ↓
If Approved:
Generate Member ID
      ↓
Create Active Member
      ↓
Member Confirmation Email — Resend
```

If rejected:

```text
Admin Rejects
      ↓
Rejection Email — Resend
```

No separate application/email-verification confirmation email is required.

---

# 21. Future Bulk Email Architecture

Bulk campaigns are separate from transactional emails.

### Resend

Reserved for:
- OTP
- Approval/member confirmation
- Rejection

### Brevo + other platforms

Used for:
- Workshop announcements
- Newsletters
- Club announcements
- Campaigns

For a campaign targeting approximately 1,500 members, the final system should be able to distribute recipients across multiple providers to meet a two-day delivery target while respecting free-tier daily limits.

CRITICAL:

The system must maintain a central campaign-recipient table.

Example:

```text
campaign_id
member_id
email
provider
status
sent_at
delivered_at
failed_at
```

There must be a uniqueness rule:

```text
UNIQUE(campaign_id, member_id)
```

If Brevo successfully sends a campaign email to a member, another provider must never send that same campaign to that member.

Failed sends can be reassigned to another provider.

This is future functionality. Do not implement it in Phase 1.

---

# 22. Future Membership Form — Reference Only

The eventual form will contain:

## Personal Information
- Full Name *
- Student ID *
- University Email *
- Personal Email — Optional
- Phone Number *

## Academic Information
- Department *
- Batch / Admission Year *
- Current Semester *
- Expected Graduation Year *
- Current CGPA — Optional
- Desired CGPA — Optional

## Academic Interests
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

## Technical Skills
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

Skill Level:
- Beginner
- Intermediate
- Advanced
- None

Strongest Technical Skill:
- Dynamically limited to selected technical skills
- None

## Creative & Media Skills
- Graphic Design
- Video Editing
- Content Writing
- Motion Graphics
- Photography & Videography
- Social Media Content
- Presentation Design
- Other
- None

## Goals
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

## Previous Experience
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

## Club Contribution
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

## Additional Information
Optional short text.

## Payment
- bKash Number Used for Payment *
- Transaction ID *
- Transaction Number / Reference *

This belongs to Phase 2.

---

# 23. Critical Phase 1 Rules

1. Inspect the existing repository before changing anything.
2. Preserve the existing framework and conventions.
3. Reuse existing assets where available.
4. Do not create Membership Type.
5. Do not implement fake backend behavior.
6. Do not implement OTP.
7. Do not implement payment verification.
8. Do not implement admin functionality.
9. Do not generate fake member IDs.
10. Do not invent partner organizations.
11. Do not invent statistics.
12. Do not commit secrets/API keys.
13. Keep Phase 2 and Phase 3 integration points clean.
14. Avoid unnecessary dependencies.
15. Preserve existing working functionality unless changes are required for Phase 1.

---

# 24. Completion Checklist

Before finishing Phase 1:

- [ ] Inspect repository
- [ ] Preserve existing framework
- [ ] Header implemented
- [ ] Mobile menu implemented
- [ ] Home implemented
- [ ] About implemented
- [ ] Workshops implemented
- [ ] Partners implemented
- [ ] Join Us implemented
- [ ] Contact implemented
- [ ] Footer implemented
- [ ] Reusable components created
- [ ] Responsive layouts tested
- [ ] Accessibility checked
- [ ] SEO metadata added
- [ ] No fake backend behavior
- [ ] No secrets committed
- [ ] Build succeeds
- [ ] Lint/type checks pass if available
- [ ] No obvious console errors
- [ ] No mobile horizontal overflow
- [ ] Phase 2 integration points are clear

---

# 25. Agent Instructions

You are implementing Phase 1 of an existing web project.

First inspect the repository.

Determine:
- Framework
- Package manager
- Existing routes
- Existing components
- Existing styles
- Existing assets
- Existing logo
- Existing configuration
- Build/lint/type-check commands

Then implement this phase using the project's established conventions.

Do NOT replace the framework just because another stack is preferred.

After implementation:

1. Run the build command.
2. Run lint/type checks if available.
3. Fix errors.
4. Inspect the resulting file structure.
5. Check every public route.
6. Check responsive behavior.
7. Check accessibility basics.
8. Report what was implemented.
9. Report assumptions/placeholders.
10. Stop after Phase 1.

Do not start Phase 2 automatically.
