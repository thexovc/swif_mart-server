"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const ejs = require("ejs");
const fs = require("fs");
const constants_1 = require("../constants");
const nodemailer_1 = require("../utils/nodemailer");
let EmailsService = class EmailsService {
    async sendVerificationEmail(user, token) {
        const url = `${constants_1.processEnv.web_url}/verification/${token}`;
        const templateFile = fs.readFileSync('./templates/auth/confirmEmail.ejs', 'utf-8');
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
        nodemailer_1.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
    }
    async sendRegistrationCompletedEmail(user) {
        const templateFile = fs.readFileSync('./templates/auth/welcome.ejs', 'utf-8');
        const renderedEmail = ejs.render(templateFile, {
            user,
        });
        const mailOptions = {
            from: 'DataCoupon <GACNWebsite@gacn.com>',
            to: user.email,
            subject: 'Registration Completed',
            html: renderedEmail,
        };
        nodemailer_1.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
    }
    async sendWelcomeEmail(user) {
        try {
            const templateFile = fs.readFileSync('./templates/auth/welcome.ejs', 'utf-8');
            const renderedEmail = ejs.render(templateFile, {
                data: user,
            });
            await nodemailer_1.transporter.sendMail({
                from: 'DataCoupon <GACNWebsite@gacn.com>',
                to: user.email,
                subject: 'Welcome toDataCoupon',
                html: renderedEmail,
            });
            console.log('Welcome email sent successfully!');
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }
    async sendConfirmEmail(user, confirmationLink) {
        try {
            const templateFile = fs.readFileSync('./templates/auth/confirmEmail.ejs', 'utf-8');
            const renderedEmail = ejs.render(templateFile, {
                user,
                confirmationLink,
            });
            await nodemailer_1.transporter.sendMail({
                from: 'DataCoupon <GACNWebsite@gacn.com>',
                to: user?.email,
                subject: 'Confirm Your Email Address for DataCoupon Registration',
                html: renderedEmail,
            });
            console.log('Welcome email sent successfully!');
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }
    async sendResetLink(user, email, resetLink) {
        try {
            const templateFile = fs.readFileSync('./templates/auth/resetPassword.ejs', 'utf-8');
            const renderedEmail = ejs.render(templateFile, {
                user,
                resetLink,
            });
            await nodemailer_1.transporter.sendMail({
                from: 'DataCoupon <GACNWebsite@gacn.com>',
                to: email,
                subject: 'Password Reset Request Confirmation',
                html: renderedEmail,
            });
            console.log('Password Reset Request Confirmation Successfully!');
        }
        catch (error) {
            console.error('Error sending reset password:', error);
        }
    }
    async sendPasswordChanged(user, email) {
        try {
            const templateFile = fs.readFileSync('./templates/auth/passwordChangedEmail.ejs', 'utf-8');
            const renderedEmail = ejs.render(templateFile, {
                user,
            });
            await nodemailer_1.transporter.sendMail({
                from: 'DataCoupon <GACNWebsite@gacn.com>',
                to: email,
                subject: 'Password Successfully Changed',
                html: renderedEmail,
            });
            console.log('Password changed email sent successfully!');
        }
        catch (error) {
            console.error('Error sending password changed email:', error);
        }
    }
    async sendDynamic(email, data, fileName, subject) {
        console.log({ fileName, email });
        try {
            const templateFile = fs.readFileSync(`./templates/${fileName}`, 'utf-8');
            const renderedEmail = ejs.render(templateFile, {
                data,
            });
            await nodemailer_1.transporter.sendMail({
                from: 'Swif Mart <kyilaxtech@gmail.com>',
                to: email,
                subject: subject,
                html: renderedEmail,
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                }
                else {
                    console.log('Email sent:', info.response);
                }
            });
            return { message: 'message sent' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.EmailsService = EmailsService;
exports.EmailsService = EmailsService = __decorate([
    (0, common_1.Injectable)()
], EmailsService);
//# sourceMappingURL=emails.service.js.map