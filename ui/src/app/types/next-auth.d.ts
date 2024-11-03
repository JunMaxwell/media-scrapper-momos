import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id: string;
    user: {
      id: string;
      username?: string;
      email?: string;
      image?: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: number;
  }
}
