// User type definition
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export type ScraperResponse = {
    type: string;
    src: string;
};