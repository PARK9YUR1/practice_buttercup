import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // authorized : 페이지 액세스 권한 확인
    // 속성 - auth: 사용자세션 포함, request: 들어오는 요청 포함 
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  // providers : 다른 로그인 옵션 나열하는 배열
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;