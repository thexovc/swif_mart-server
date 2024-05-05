/* eslint-disable prettier/prettier */
// mail.service.ts

import { Injectable } from '@nestjs/common';
import { processEnv } from 'src/constants';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { transporter } from '../nodemailer';

@Injectable()
export class MailService {
  constructor() {}

  async sendVerificationEmail(user: any, token: string): Promise<void> {
    const url = `${processEnv.web_url}/verification/${token}`;

    const templateFile = fs.readFileSync(
      './templates/auth/confirmEmail.ejs',
      'utf-8',
    );

    const renderedEmail = ejs.render(templateFile, {
      user,
      confirmationLink: url,
    });

    const mailOptions = {
      from: 'GACN <GACNWebsite@gacn.com>',
      to: user.email,
      subject: 'Verify Your Registration',
      html: renderedEmail,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

  async sendRegistrationCompletedEmail(user: any): Promise<void> {
    const templateFile = fs.readFileSync(
      './templates/auth/welcome.ejs',
      'utf-8',
    );

    const renderedEmail = ejs.render(templateFile, {
      user,
    });

    const mailOptions = {
      from: 'GACN <GACNWebsite@gacn.com>',
      to: user.email,
      subject: 'Registration Completed',
      html: renderedEmail,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
}
