import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// 자격 증명 후 DB에서 사용자를 가져오는 함수
async function getUser(email: string): Promise<User | undefined> {
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,  // authConfig 확장 ..
  providers: [  // 구글, 깃허브 같은 다양한 로그인 옵션 나열하는 배열
    Credentials({
        // authorize 함수 사용해 인증로직 처리
        // zod 사용해 이메일, 비밀번호 유효성 검사 후 DB에서 사용자가 존재하는지 확인
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;
            // 비밀번호 일치 확인위해 bcrypt.compare 호출
            const passwordsMatch = await bcrypt.compare(password, user.password);
            
            if (passwordsMatch) return user;  // 일치하면 사용자 반환
          }
    
          console.log('Invalid credentials');
          return null;  // 그렇지 않으면 로그인 방지위해 null 반환
        },
      }),
  ],
});