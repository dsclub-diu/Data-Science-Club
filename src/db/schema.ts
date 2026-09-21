import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  student_id: text('student_id').notNull(),
  university_email: text('university_email').notNull(),
  personal_email: text('personal_email'),
  phone: text('phone').notNull(),
  department: text('department').notNull(),
  batch: text('batch').notNull(),
  current_semester: text('current_semester').notNull(),
  expected_graduation_year: integer('expected_graduation_year').notNull(),
  cgpa_current: text('cgpa_current'),
  cgpa_desired: text('cgpa_desired'),
  academic_interests: text('academic_interests', { mode: 'json' }).$type<string[]>(),
  technical_skills: text('technical_skills', { mode: 'json' }).$type<string[]>(),
  technical_skill_level: text('technical_skill_level'),
  strongest_technical_skill: text('strongest_technical_skill'),
  creative_media_skills: text('creative_media_skills', { mode: 'json' }).$type<string[]>(),
  goals: text('goals', { mode: 'json' }).$type<string[]>(),
  previous_experience: text('previous_experience', { mode: 'json' }).$type<string[]>(),
  club_contributions: text('club_contributions', { mode: 'json' }).$type<string[]>(),
  additional_information: text('additional_information'),
  bkash_number: text('bkash_number'),
  transaction_id: text('transaction_id'),
  transaction_reference: text('transaction_reference'),
  
  status: text('status').notNull().default('DRAFT'), // DRAFT, PENDING_EMAIL_VERIFICATION, PENDING_REVIEW, APPROVED, REJECTED
  
  submitted_at: integer('submitted_at', { mode: 'timestamp' }),
  reviewed_at: integer('reviewed_at', { mode: 'timestamp' }),
  reviewed_by: text('reviewed_by'),
  rejection_reason: text('rejection_reason'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const otps = sqliteTable('otps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  application_id: text('application_id').notNull().references(() => applications.id),
  otp_hash: text('otp_hash').notNull(),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
  attempt_count: integer('attempt_count').notNull().default(0),
  verified_at: integer('verified_at', { mode: 'timestamp' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const members = sqliteTable('members', {
  id: text('id').primaryKey(), // DSC-2026-0001
  application_id: text('application_id').notNull().references(() => applications.id),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE
  joined_at: integer('joined_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: text('role').notNull().default('ADMIN'),
});
