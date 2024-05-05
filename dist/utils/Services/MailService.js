"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const ejs = require("ejs");
const fs = require("fs");
const nodemailer_1 = require("../nodemailer");
let MailService = class MailService {
    constructor() { }
    async sendVerificationEmail(user, token) {
        const url = `${constants_1.processEnv.web_url}/verification/${token}`;
        const templateFile = fs.readFileSync('./templates/auth/confirmEmail.ejs', 'utf-8');
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
            from: 'GACN <GACNWebsite@gacn.com>',
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
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=MailService.js.map