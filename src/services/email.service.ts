import nodemailer from 'nodemailer';
import { ENVIRONMENT } from '../config/environment.js';
import { Submission, Registration } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENVIRONMENT.SMTP_HOST,
    port: ENVIRONMENT.SMTP_PORT,
    secure: ENVIRONMENT.SMTP_PORT === 465,
    auth: ENVIRONMENT.SMTP_USER && ENVIRONMENT.SMTP_PASS ? {
      user: ENVIRONMENT.SMTP_USER,
      pass: ENVIRONMENT.SMTP_PASS,
    } : undefined,
  });

  public static async sendSubmissionNotification(submission: Submission): Promise<void> {
    try {
      if (!ENVIRONMENT.SMTP_USER || !ENVIRONMENT.SMTP_PASS) {
        Logger.info(`📧 [EMAIL NOTIFICATION LOG] New Submission Received for ${submission.clientName} (${submission.email}). (Set SMTP_USER & SMTP_PASS in server/.env to enable live email delivery via SMTP)`);
        return;
      }

      const servicesList = Array.isArray(submission.services)
        ? submission.services.join(', ')
        : submission.services || 'General Inquiry';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
          <h2 style="color: #1455B8; border-bottom: 2px solid #1455B8; padding-bottom: 10px;">New Client Form Submission</h2>
          <p><strong>A new inquiry/booking has been submitted via the website:</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%;">Client Name:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.clientName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;"><a href="mailto:${submission.email}">${submission.email}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Language:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.preferredLanguage || 'English'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Scheduled Date:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.scheduledDate || 'Not Scheduled'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Scheduled Time:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.scheduledTime || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Services:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${servicesList}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Lead Source:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.leadSource || 'Website Direct'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Notes:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${submission.notes || 'None'}</td></tr>
          </table>

          <p style="margin-top: 20px; font-size: 12px; color: #777777;">
            Sent automatically by Taxfiler Backend Server • MongoDB Atlas Sync Active
          </p>
        </div>
      `;

      await EmailService.transporter.sendMail({
        from: `"NexGen Accounting System" <${ENVIRONMENT.SMTP_USER}>`,
        to: ENVIRONMENT.NOTIFICATION_EMAIL,
        subject: `🚨 New NEXGEN Inquiry: ${submission.clientName}`,
        html: htmlContent,
      });

      Logger.info(`✉️ Email notification sent successfully to ${ENVIRONMENT.NOTIFICATION_EMAIL} for submission ${submission.id}`);
    } catch (error) {
      Logger.error('Failed to send submission email notification:', error);
    }
  }

  public static async sendRegistrationNotification(registration: Registration): Promise<void> {
    try {
      if (!ENVIRONMENT.SMTP_USER || !ENVIRONMENT.SMTP_PASS) {
        Logger.info(`📧 [EMAIL NOTIFICATION LOG] New Registration Received for ${registration.fullName} (${registration.email}). (Set SMTP_USER & SMTP_PASS in server/.env to enable live email delivery via SMTP)`);
        return;
      }

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
          <h2 style="color: #5CA300; border-bottom: 2px solid #5CA300; padding-bottom: 10px;">New Client Portal Registration</h2>
          <p><strong>A new user has registered for the client portal:</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%;">Client Name:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${registration.fullName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;"><a href="mailto:${registration.email}">${registration.email}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${registration.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Account Type:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${registration.accountType || 'Business Portal'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eeeeee; font-weight: bold;">Portal Status:</td><td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${registration.portalStatus}</td></tr>
          </table>

          <p style="margin-top: 20px; font-size: 12px; color: #777777;">
            Sent automatically by Taxfiler Backend Server • MongoDB Atlas Sync Active
          </p>
        </div>
      `;

      await EmailService.transporter.sendMail({
        from: `"NexGen Accounting System" <${ENVIRONMENT.SMTP_USER}>`,
        to: ENVIRONMENT.NOTIFICATION_EMAIL,
        subject: `👤 New Client Portal Signup: ${registration.fullName}`,
        html: htmlContent,
      });

      Logger.info(`✉️ Email notification sent successfully to ${ENVIRONMENT.NOTIFICATION_EMAIL} for registration ${registration.id}`);
    } catch (error) {
      Logger.error('Failed to send registration email notification:', error);
    }
  }
}
