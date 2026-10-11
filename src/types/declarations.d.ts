declare module 'lucide-react' {
  import * as React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }
  export type Icon = React.FC<LucideProps>;
  export const [key: string]: any;
}

declare module '@clerk/nextjs' {
  export const [key: string]: any;
  export const auth: any;
  export const currentUser: any;
  export const ClerkProvider: any;
  export const SignIn: any;
  export const SignUp: any;
  export const UserButton: any;
  export const useUser: any;
  export const useAuth: any;
}

declare module '@clerk/nextjs/server' {
  export const auth: any;
  export const currentUser: any;
  export const clerkMiddleware: any;
  export const createRouteMatcher: any;
  export const clerkClient: any;
}
