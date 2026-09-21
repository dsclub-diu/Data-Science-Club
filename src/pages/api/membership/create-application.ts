import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications, otps } from '../../../db/schema';
import { eq, or } from 'drizzle-orm';
import { sendOtpEmail } from '../../../services/email/resend';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { randomInt, randomUUID } from 'node:crypto';

const universityEmailDomain = process.env.UNIVERSITY_EMAIL_DOMAIN?.toLowerCase();
const allowed = {
  academic_interests: ['Artificial Intelligence & Data Science', 'Software Engineering & Programming', 'Web & App Development', 'Cybersecurity', 'Cloud Computing & DevOps', 'Robotics & Automation', 'Game Development', 'UI/UX & Product Design', 'Research', 'Entrepreneurship & Startups', 'Other', 'None'],
  technical_skills: ['Programming', 'Data & AI', 'Web & App Development', 'Cloud & DevOps', 'Robotics & Automation', 'Cybersecurity', 'UI/UX Design', 'Git & Version Control', 'Other', 'None'],
  creative_media_skills: ['Graphic Design — Canva / Photoshop / Illustrator', 'Video Editing', 'Content Writing', 'Motion Graphics', 'Photography & Videography', 'Social Media Content', 'Presentation Design', 'Other', 'None'],
  goals: ['Learn Technical Skills', 'Build Projects', 'Participate in Hackathons / Competitions', 'Research', 'Career Preparation', 'Internship / Job Preparation', 'Entrepreneurship / Startup', 'Networking', 'Leadership', 'Freelancing', 'Higher Studies', 'Teaching / Mentoring', 'Other', 'None'],
  previous_experience: ['Hackathon', 'Programming Contest', 'Research Project', 'Personal Project', 'Open-source Project', 'Workshop / Conference', 'Club / Organizational Activity', 'Startup / Business Project', 'Other', 'None'],
  club_contributions: ['Technical Team', 'Event Management', 'Research', 'Content Writing', 'Video Editing', 'Graphic Design', 'Social Media', 'Marketing', 'Sponsorship / Business Development', 'Volunteer', 'Mentoring', 'Leadership', 'Other', 'Not Sure Yet', 'None'],
} as const;

function invalidSelection(values: unknown, options: readonly string[]) {
  return !Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== 'string' || !options.includes(value));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { student_id, university_email } = data;
    if (typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 120 ||
      typeof student_id !== 'string' || student_id.trim().length < 2 || student_id.length > 40 ||
      typeof university_email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(university_email) ||
      (universityEmailDomain && university_email.toLowerCase().split('@')[1] !== universityEmailDomain) ||
      typeof data.phone !== 'string' || !/^(\+?880|0)1[3-9]\d{8}$/.test(data.phone.replace(/[\s-]/g, '')) ||
      typeof data.department !== 'string' || !data.department.trim() ||
      typeof data.batch !== 'string' || !data.batch.trim() ||
      typeof data.current_semester !== 'string' || !data.current_semester.trim() ||
      !Number.isInteger(Number(data.expected_graduation_year)) ||
      !data.bkash_number || !/^(\+?880|0)1[3-9]\d{8}$/.test(String(data.bkash_number).replace(/[\s-]/g, '')) ||
      typeof data.transaction_id !== 'string' || !/^[A-Za-z0-9_-]{4,40}$/.test(data.transaction_id) ||
      typeof data.transaction_reference !== 'string' || !/^[A-Za-z0-9_-]{4,40}$/.test(data.transaction_reference) ||
      Object.entries(allowed).some(([key, options]) => invalidSelection(data[key], options))) {
      return new Response(JSON.stringify({ error: 'Please provide valid application details.' }), { status: 400 });
    }
    for (const key of Object.keys(allowed)) {
      const values = data[key] as string[];
      if (values.includes('None') && values.length !== 1) {
        return new Response(JSON.stringify({ error: 'None cannot be combined with other selections.' }), { status: 400 });
      }
    }
    if (!['Beginner', 'Intermediate', 'Advanced', 'None'].includes(data.technical_skill_level) ||
      !['None', ...(data.technical_skills as string[])].includes(data.strongest_technical_skill)) {
      return new Response(JSON.stringify({ error: 'Invalid technical skill selection.' }), { status: 400 });
    }

    // Duplicate check
    const existing = db.select().from(applications).where(
      or(
        eq(applications.student_id, student_id),
        eq(applications.university_email, university_email)
      )
    ).all();

    // Ensure we don't allow duplicate pending/approved apps
    const duplicate = existing.find(a => 
      a.status === 'PENDING_EMAIL_VERIFICATION' ||
      a.status === 'PENDING_REVIEW' || 
      a.status === 'APPROVED' ||
      a.status === 'ACTIVE'
    );
    if (duplicate) {
      return new Response(JSON.stringify({ error: 'An application with this Student ID or Email already exists and is pending or approved.' }), { status: 400 });
    }

    // Generate Application ID
    const applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create Application
    db.insert(applications).values({
      id: applicationId,
      application_reference: `DSC-APP-${randomUUID().slice(0, 8).toUpperCase()}`,
      name: data.name,
      student_id: data.student_id,
      university_email: data.university_email,
      personal_email: data.personal_email,
      phone: data.phone,
      department: data.department,
      batch: data.batch,
      current_semester: data.current_semester,
      expected_graduation_year: parseInt(data.expected_graduation_year, 10),
      cgpa_current: data.cgpa_current,
      cgpa_desired: data.cgpa_desired,
      academic_interests: data.academic_interests || [],
      technical_skills: data.technical_skills || [],
      technical_skill_level: data.technical_skill_level,
      strongest_technical_skill: data.strongest_technical_skill,
      creative_media_skills: data.creative_media_skills || [],
      goals: data.goals || [],
      previous_experience: data.previous_experience || [],
      club_contributions: data.club_contributions || [],
      additional_information: data.additional_information,
      bkash_number: data.bkash_number,
      transaction_id: data.transaction_id,
      transaction_reference: data.transaction_reference,
      status: 'PENDING_EMAIL_VERIFICATION'
    }).run();

    // Generate 6-digit OTP
    const otp = randomInt(100000, 1000000).toString();
    const salt = await bcrypt.genSalt(10);
    const otp_hash = await bcrypt.hash(otp, salt);
    
    // Expires in 5 minutes
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    db.insert(otps).values({
      application_id: applicationId,
      otp_hash,
      expires_at
    }).run();

    // Send email
    const emailResult = await sendOtpEmail(data.university_email, otp);
    if (!emailResult.success) {
      db.delete(otps).where(eq(otps.application_id, applicationId)).run();
      db.delete(applications).where(eq(applications.id, applicationId)).run();
      return new Response(JSON.stringify({ error: 'Unable to send verification email. Please try again.' }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true, applicationId }), { status: 200 });

  } catch (error) {
    console.error('Create Application Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
