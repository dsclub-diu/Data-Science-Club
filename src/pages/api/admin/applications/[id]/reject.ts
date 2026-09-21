import type { APIRoute } from 'astro';
import { db } from '../../../../../db';
import { applications } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { sendRejectionEmail } from '../../../../../services/email/resend';
import { verifyAdminSession } from '../../../../../services/auth/admin';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  try {
    const token = cookies.get('admin_session')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });
    
    const admin = await verifyAdminSession(token);
    if (!admin) return new Response('Unauthorized', { status: 401 });

    const { id } = params;
    if (!id) return new Response('Application ID missing', { status: 400 });

    const { reason } = await request.json();
    if (!reason) return new Response(JSON.stringify({ error: 'Rejection reason is required' }), { status: 400 });

    const application = db.select().from(applications).where(eq(applications.id, id)).get();
    
    if (!application) {
      return new Response(JSON.stringify({ error: 'Application not found' }), { status: 404 });
    }
    
    if (application.status !== 'PENDING_REVIEW') {
      return new Response(JSON.stringify({ error: 'Application is not pending review' }), { status: 400 });
    }

    // Update Application Status
    db.update(applications).set({
      status: 'REJECTED',
      rejection_reason: reason,
      reviewed_at: new Date(),
      reviewed_by: admin.email as string
    }).where(eq(applications.id, id)).run();

    // Send Rejection Email
    await sendRejectionEmail(application.university_email, application.name, reason, application.application_reference);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Reject Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
