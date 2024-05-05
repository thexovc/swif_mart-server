"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
require('dotenv').config();
const nodemailer = require('nodemailer');
exports.transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'kyilaxtech@gmail.com',
        pass: `${process.env.EMAIL_PASS}`,
    },
});
//# sourceMappingURL=nodemailer.js.map