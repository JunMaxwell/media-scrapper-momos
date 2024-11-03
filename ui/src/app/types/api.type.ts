// User type definition
export interface User {
    id: number;
    name: string;
    email: string;
}

// Comment type definition
export interface Comment {
    id: string;
    text: string;
    user: User;
    createdAt: Date;
    updatedAt?: Date;
}

// ImageData type definition
export interface ImageData {
    id: number;
    url: string;
    userId: number;
    user: User;
    comments: Comment[];
    createdAt: Date;
    updatedAt?: Date;
}

// You might also want to define a type for the image upload payload
export interface ImageUploadPayload {
    imageData: string; // Base64 encoded image data
}

// And a type for the comment creation payload
export interface CommentCreatePayload {
    text: string;
}

// Optional: Define a type for API responses
export interface ApiResponse<T> {
    data: T;
    message?: string;
}