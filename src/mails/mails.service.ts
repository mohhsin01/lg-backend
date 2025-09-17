import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserCredentials(email: string, username: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Account Credentials',
        template: 'user_credentials',
        context: { email, username, password },
      });
    } catch (err) {
      console.error(' Mail send error:', err);
      throw err;
    }
  }

  // MailService.ts
async sendJobCreatedNotification(email: string, jobId: number, bdUserId: number) {
  try {
    await this.mailerService.sendMail({
      to: email,
      subject: 'New Job Created',
      template: 'job_create', // optional if using handlebars templates
      context: { jobId, bdUserId }, // these will be available in your template
      html: `
        <p>A new job has been <b>added</b> to the system.</p>
        <p>Job ID: <b>${jobId}</b></p>
        <p>BD User ID: <b>${bdUserId}</b></p>
      `,
    });
  } catch (err) {
    console.error('Mail send error (job created):', err);
    throw err;
  }
}
async sendInterviewAssignedNotification(
  email: string,
  jobId: number,
  date: string,
  time: string,
  round_no:number,
) {
  try {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Interview Scheduled',
      template: 'interview_assigned', // will use interview_assigned.hbs
      context: { jobId, date, time, round_no },
    });
  } catch (err) {
    console.error('Mail send error (interview assigned):', err);
    throw err;
  }
}


}