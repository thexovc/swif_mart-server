export declare class RegisterDto {
    email: string;
}
export declare class loginDto {
    email: string;
    passCode: string;
}
export declare class forgotDto {
    email: string;
}
export declare class refreshDto {
    refreshToken: string;
}
export declare class resetDto {
    token: string;
    password: string;
}
export declare class createUserAdminDto {
    email: string;
    fullName: string;
    role: string;
}
export declare class createProxyUserDto {
    email: string;
    fullName: string;
}
export declare class comRegDto {
    token: string;
    password: string;
}
