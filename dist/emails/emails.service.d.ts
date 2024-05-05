export declare class EmailsService {
    sendVerificationEmail(user: any, token: string): Promise<void>;
    sendRegistrationCompletedEmail(user: any): Promise<void>;
    sendWelcomeEmail(user: any): Promise<void>;
    sendConfirmEmail(user: any, confirmationLink: string): Promise<void>;
    sendResetLink(user: any, email: string, resetLink: string): Promise<void>;
    sendPasswordChanged(user: any, email: string): Promise<void>;
    sendDynamic(email: any, data: any, fileName: string, subject: string): Promise<any>;
}
