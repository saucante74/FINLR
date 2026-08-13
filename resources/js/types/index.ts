export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export interface Auth {
    user: User;
}

export interface PageProps {
    auth: Auth;
    [key: string]: unknown;
}
