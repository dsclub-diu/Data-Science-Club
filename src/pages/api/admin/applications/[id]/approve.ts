import type { APIRoute } from 'astro';
import { db } from '../../../../../db';
import { applications, members } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { sendApprovalEmail } from '../../../../../services/email/resend';
import { verifyAdminSession } from '../../../../../services/auth/admin';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  try {
    const token = cookies.get('admin_session')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });
    
    const admin = await verifyAdminSession(token);
    if (!admin) return new Response('Unauthorized', { status: 401 });

    const { id } = params;
    if (!id) return new Response('Application ID missing', { status: 400 });

    const application = db.select().from(applications).where(eq(applications.id, id)).get();
    
    if (!application) {
      return new Response(JSON.stringify({ error: 'Application not found' }), { status: 404 });
    }
    
    if (application.status !== 'PENDING_REVIEW') {
      return new Response(JSON.stringify({ error: 'Application is not pending review' }), { status: 400 });
    }

    // Generate unique Member ID
    // Simple format: DSC-YYYY-XXXX (where XXXX is a random or sequential number, sequential would require a counter table, let's use a random 4-digit number for simplicity in this phase)
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const memberId = `DSC-${currentYear}-${randomSuffix}`;

    // Transaction to ensure atomicity
    db.transaction((tx) => {
      // 1. Create Member
      tx.insert(members).values({
        id: memberId,
        application_id: id,
        status: 'ACTIVE'
      }).run();

      // 2. Update Application Status
      tx.update(applications).set({
        status: 'APPROVED',
        reviewed_at: new Date(),
        reviewed_by: admin.email as string
      }).where(eq(applications.id, id)).run();
    });

    // 3. Send Email
    await sendApprovalEmail(application.university_email, {
      name: application.name,
      memberId,
      studentId: application.student_id,
      department: application.department,
      batch: application.batch,
      joinedAt: new Date().toLocaleDateString()
    });

    return new Response(JSON.stringify({ success: true, memberId }), { status: 200 });

  } catch (error) {
    console.error('Approve Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
