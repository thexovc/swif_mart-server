import { EmailsService } from './emails.service';
export declare class EmailsController {
    private readonly emailService;
    constructor(emailService: EmailsService);
    sendEmail(email: string): Promise<any>;
}
