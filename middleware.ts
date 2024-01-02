import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// authConfig 객체 사용해 NextAuth.js 초기화, auth 속성을 내보냄.
// matcher 옵션을 사용해 특정경로에서 실행되도록 지정
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};