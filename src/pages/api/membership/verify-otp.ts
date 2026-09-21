import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications, otps } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { applicationId, otp } = await request.json();

    if (!applicationId || !otp) {
      return new Response(JSON.stringify({ error: 'Application ID and OTP are required' }), { status: 400 });
    }

    const application = db.select().from(applications).where(eq(applications.id, applicationId)).get();
    if (!application || application.status !== 'PENDING_EMAIL_VERIFICATION') {
      return new Response(JSON.stringify({ error: 'Invalid application status' }), { status: 400 });
    }

    const latestOtpRecord = db.select().from(otps)
      .where(eq(otps.application_id, applicationId))
      .orderBy(desc(otps.created_at))
      .get();

    if (!latestOtpRecord) {
      return new Response(JSON.stringify({ error: 'No OTP found for this application' }), { status: 404 });
    }

    if (latestOtpRecord.attempt_count >= 5) {
      return new Response(JSON.stringify({ error: 'Too many attempts. Please request a new OTP.' }), { status: 403 });
    }

    if (new Date() > latestOtpRecord.expires_at) {
      return new Response(JSON.stringify({ error: 'OTP has expired. Please request a new one.' }), { status: 400 });
    }

    const isValid = await bcrypt.compare(otp.toString(), latestOtpRecord.otp_hash);

    if (!isValid) {
      // Increment attempt count
      db.update(otps)
        .set({ attempt_count: latestOtpRecord.attempt_count + 1 })
        .where(eq(otps.id, latestOtpRecord.id))
        .run();
      return new Response(JSON.stringify({ error: 'Invalid OTP' }), { status: 400 });
    }

    // Mark as verified and update app status
    db.update(otps)
      .set({ verified_at: new Date() })
      .where(eq(otps.id, latestOtpRecord.id))
      .run();

    db.update(applications)
      .set({ status: 'PENDING_REVIEW', email_verified_at: new Date(), submitted_at: new Date(), updated_at: new Date() })
      .where(eq(applications.id, applicationId))
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
