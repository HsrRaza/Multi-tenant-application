export interface JwtUserPayload {
    userId: number;
    email: string;
    organizationId?: number;
    role?: string;
}