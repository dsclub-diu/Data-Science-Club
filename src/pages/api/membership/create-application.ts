import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications, otps } from '../../../db/schema';
import { eq, or } from 'drizzle-orm';
import { sendOtpEmail } from '../../../services/email/resend';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { student_id, university_email } = data;

    // Duplicate check
    const existing = db.select().from(applications).where(
      or(
        eq(applications.student_id, student_id),
        eq(applications.university_email, university_email)
      )
    ).all();

    // Ensure we don't allow duplicate pending/approved apps
    const duplicate = existing.find(a => 
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
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
    await sendOtpEmail(data.university_email, otp);

    return new Response(JSON.stringify({ success: true, applicationId }), { status: 200 });

  } catch (error) {
    console.error('Create Application Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
