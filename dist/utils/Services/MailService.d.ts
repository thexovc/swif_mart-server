export declare class MailService {
    constructor();
    sendVerificationEmail(user: any, token: string): Promise<void>;
    sendRegistrationCompletedEmail(user: any): Promise<void>;
}
