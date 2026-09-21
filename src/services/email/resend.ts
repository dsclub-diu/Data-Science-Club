import { Resend } from 'resend';
import 'dotenv/config';

// Initialize Resend. Local development may use the explicit mock mode.
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = 'Data Science Club <noreply@datascienceclub.com>';

export async function sendOtpEmail(to: string, otp: string) {
  if (!resend) {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: new Error('RESEND_API_KEY is not configured') };
    }
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Your Data Science Club Verification Code',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This code will expire in 5 minutes.</p>
        <p>Do not share this code with anyone.</p>
      `,
    });
    
    if (error) {
      console.error('Failed to send OTP email', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send OTP email', err);
    return { success: false, error: err };
  }
}

export async function sendApprovalEmail(to: string, memberDetails: { name: string, memberId: string, studentId: string, department: string, batch: string, joinedAt: string }) {
  if (!resend) {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: new Error('RESEND_API_KEY is not configured') };
    }
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Welcome to the Data Science Club!',
      html: `
        <h2>Congratulations ${memberDetails.name}!</h2>
        <p>Your membership application has been approved.</p>
        <ul>
          <li><strong>Member ID:</strong> ${memberDetails.memberId}</li>
          <li><strong>Student ID:</strong> ${memberDetails.studentId}</li>
          <li><strong>Department:</strong> ${memberDetails.department}</li>
          <li><strong>Batch:</strong> ${memberDetails.batch}</li>
          <li><strong>Status:</strong> ACTIVE</li>
          <li><strong>Joined:</strong> ${memberDetails.joinedAt}</li>
        </ul>
        <p>Welcome to the community!</p>
      `,
    });
    
    if (error) {
      console.error('Failed to send Approval email', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send Approval email', err);
    return { success: false, error: err };
  }
}

export async function sendRejectionEmail(to: string, applicantName: string, reason: string, applicationReference?: string) {
  if (!resend) {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: new Error('RESEND_API_KEY is not configured') };
    }
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: 'Update on Your Data Science Club Application',
      html: `
        <h2>Hello ${applicantName},</h2>
        <p>Thank you for your interest in joining the Data Science Club.</p>
        <p>Unfortunately, we are unable to approve your application at this time.</p>
        ${applicationReference ? `<p>Application reference: <strong>${applicationReference}</strong></p>` : ''}
        <p><strong>Reason:</strong> ${reason}</p>
        <p>If you have any questions, feel free to reply to this email.</p>
      `,
    });
    
    if (error) {
      console.error('Failed to send Rejection email', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send Rejection email', err);
    return { success: false, error: err };
  }
}
