import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { processEnv } from 'src/constants';
import { transporter } from 'src/utils/nodemailer';

@Injectable()
export class EmailsService {
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
      from: 'DataCoupon <GACNWebsite@gacn.com>',
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
      from: 'DataCoupon <GACNWebsite@gacn.com>',
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

  async sendWelcomeEmail(user: any): Promise<void> {
    try {
      // Read EJS template file
      const templateFile = fs.readFileSync(
        './templates/auth/welcome.ejs',
        'utf-8',
      );

      const renderedEmail = ejs.render(templateFile, {
        data: user,
      });

      await transporter.sendMail({
        from: 'DataCoupon <GACNWebsite@gacn.com>',
        to: user.email,
        subject: 'Welcome toDataCoupon',
        html: renderedEmail,
      });

      console.log('Welcome email sent successfully!');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendConfirmEmail(user: any, confirmationLink: string): Promise<void> {
    try {
      // Read EJS template file
      const templateFile = fs.readFileSync(
        './templates/auth/confirmEmail.ejs',
        'utf-8',
      );

      const renderedEmail = ejs.render(templateFile, {
        user,
        confirmationLink,
      });

      await transporter.sendMail({
        from: 'DataCoupon <GACNWebsite@gacn.com>',
        to: user?.email,
        subject: 'Confirm Your Email Address for DataCoupon Registration',
        html: renderedEmail,
      });

      console.log('Welcome email sent successfully!');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendResetLink(
    user: any,
    email: string,
    resetLink: string,
  ): Promise<void> {
    try {
      // Read EJS template file
      const templateFile = fs.readFileSync(
        './templates/auth/resetPassword.ejs',
        'utf-8',
      );

      const renderedEmail = ejs.render(templateFile, {
        user,
        resetLink,
      });

      await transporter.sendMail({
        from: 'DataCoupon <GACNWebsite@gacn.com>',
        to: email,
        subject: 'Password Reset Request Confirmation',
        html: renderedEmail,
      });

      console.log('Password Reset Request Confirmation Successfully!');
    } catch (error) {
      console.error('Error sending reset password:', error);
    }
  }

  async sendPasswordChanged(user: any, email: string): Promise<void> {
    try {
      // Read EJS template file
      const templateFile = fs.readFileSync(
        './templates/auth/passwordChangedEmail.ejs',
        'utf-8',
      );

      const renderedEmail = ejs.render(templateFile, {
        user,
      });

      await transporter.sendMail({
        from: 'DataCoupon <GACNWebsite@gacn.com>',
        to: email,
        subject: 'Password Successfully Changed',
        html: renderedEmail,
      });

      console.log('Password changed email sent successfully!');
    } catch (error) {
      console.error('Error sending password changed email:', error);
    }
  }

  async sendDynamic(
    email: any,
    data: any,
    fileName: string,
    subject: string,
  ): Promise<any> {
    console.log({ fileName, email });
    try {
      const templateFile = fs.readFileSync(`./templates/${fileName}`, 'utf-8');

      const renderedEmail = ejs.render(templateFile, {
        data,
      });

      await transporter.sendMail(
        {
          from: 'DataCoupon <GACNWebsite@gacn.com>',
          to: email,
          subject: subject,
          html: renderedEmail,
        },
        (error: any, info: any) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        },
      );

      return { message: 'message sent' };
    } catch (error) {
      throw error;
    }
  }
}
