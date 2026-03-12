import nodemailer from 'nodemailer';
import { COMPANY } from '@/utils/constants';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_ADDRESS = process.env.SMTP_FROM || `${COMPANY.fullName} <noreply@armelgroup.com>`;

function buildHtml(subject: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#e9ecef;font-family:'Inter',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e9ecef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 15px -3px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#162a66 50%,#122254 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">${COMPANY.fullName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:1px;text-transform:uppercase;">Newsletter</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px;color:#212529;font-size:22px;font-weight:700;line-height:1.3;">${subject}</h2>
              <div style="color:#495057;font-size:15px;line-height:1.7;">
                ${body}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:24px 40px;border-top:1px solid #e9ecef;">
              <p style="margin:0 0 4px;color:#868e96;font-size:12px;text-align:center;">
                ${COMPANY.address}
              </p>
              <p style="margin:0;color:#adb5bd;font-size:11px;text-align:center;">
                You received this email because you subscribed to ${COMPANY.fullName} newsletter.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface SendNewsletterResult {
  total: number;
  sent: number;
  failed: number;
  errors: string[];
}

export async function sendNewsletter(
  emails: string[],
  subject: string,
  body: string,
): Promise<SendNewsletterResult> {
  const html = buildHtml(subject, body);
  const result: SendNewsletterResult = { total: emails.length, sent: 0, failed: 0, errors: [] };

  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: FROM_ADDRESS,
        to: email,
        subject,
        html,
      });
      result.sent++;
    } catch (err) {
      result.failed++;
      result.errors.push(`${email}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return result;
}
