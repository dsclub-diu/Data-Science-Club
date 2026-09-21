import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications, otps } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { sendOtpEmail } from '../../../services/email/resend';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return new Response(JSON.stringify({ error: 'Application ID is required' }), { status: 400 });
    }

    const application = db.select().from(applications).where(eq(applications.id, applicationId)).get();
    if (!application || application.status !== 'PENDING_EMAIL_VERIFICATION') {
      return new Response(JSON.stringify({ error: 'Invalid application status' }), { status: 400 });
    }

    const latestOtpRecord = db.select().from(otps)
      .where(eq(otps.application_id, applicationId))
      .orderBy(desc(otps.created_at))
      .get();

    if (latestOtpRecord) {
      const timeSinceLastOtp = new Date().getTime() - new Date(latestOtpRecord.created_at).getTime();
      if (timeSinceLastOtp < 60000) {
        return new Response(JSON.stringify({ error: 'Please wait 60 seconds before requesting a new OTP.' }), { status: 429 });
      }
    }

    // Generate new OTP
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
    await sendOtpEmail(application.university_email, otp);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
