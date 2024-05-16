export interface User {
    user_uid: string;
    first_name: string;
    last_name: string;
    email: string;
    is_verified: boolean;
    is_admin: boolean;
    created_at?: Date;
    updated_at?: Date;
}