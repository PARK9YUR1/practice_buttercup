'use client';

import { Account } from '@/app/lib/definitions';
// import { User } from '@/app/lib/definitions';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { createAccount } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { createPool, sql } from '@vercel/postgres';

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

// console.log({
//   POSTGRES_URL: process.env.POSTGRES_URL,
//   POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING
// });

// const FormSchema = z
//   .object({
//     nickname: z.string().min(1, 'Nickname is required').max(100),
//     // email: z.string().min(1, 'Email is required').email('Invalid email'),
//     email: z.string().min(1, 'Email is required'),
//     password: z
//       .string()
//       .min(1, 'Password is required')
//       .min(8, 'Password must have than 8 characters'),
//     confirmPassword: z.string().min(1, 'Password confirmation is required'),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ['confirmPassword'],
//     message: 'Password do not match',
//   });

// export default function SignUpForm({ user }: { user: Account[] }) {
export default function SignUpForm() {
  // function checkEmail() {
  //   alert('email체크');
  // }

  async function checkEmail(email:string) {
    alert(`이메일은 ${email}입니다.`);
    try {
      const ckEmail = await sql<Account>`
        SELECT * FROM accounts WHERE email=${email}
      `;
      // return ckEmail.rows[0];
      // return ckEmail
      // alert(`${ckEmail}`)
      console.log(ckEmail.rows[0])
    } catch (error) {
      console.log(error)
      return {
        message: 'DB Error: Failed to Create Account.'
      }
    }

  // const checkEmail = async (email:string) => {
  //   alert(`이메일은 ${email}입니다.`);
  //   try {
  //     // SELECT COUNT(*) as count FROM accounts WHERE Email = ${email}
  //     const ckEmail = await sql<Account>`
  //       SELECT * FROM accounts WHERE email=${email}
  //     `;
  //     // return ckEmail.rows[0];
  //     // return ckEmail
  //     // alert(`${ckEmail}`)
  //     console.log(ckEmail.rows[0])
  //   } catch (error) {
  //     console.log(error)
  //     return {
  //       message: 'DB Error: Failed to Create Account.'
  //     }
  //   }

    // console.log('닉네임 체크')
    /*
    if () { // 중복아니면
      alert(~~)
      // 따로 로직은 필요 없을 듯 ?? 어차피 DB에서 중복 안 되게 막아놔서
      // return 'Pass'
    } else { // 중복이면
      alert(~~)
      return 'Fail'
    }
    */
  }
  const checkNickname = async (nickname:string) => {
    // console.log('닉네임 체크')
    alert(`닉네임은 ${nickname}입니다.`);
    try {
      // SELECT COUNT(*) as count FROM accounts WHERE Email = ${email}
      const ckNickname = await sql<Account>`
        SELECT * FROM accounts WHERE nickname=${nickname}
      `;
      // return ckEmail.rows[0];
      // return ckEmail
      // alert(`${ckEmail}`)
      console.log(ckNickname.rows[0])
    } catch (error) {
      console.log(error)
      // return {
      //   message: 'DB Error: Failed to Create Account.'
      // }
    }

  }
  const checkPw1 = (pw1:string) => {
    if (pw1 && pw1.length < 8) {
      return '비밀번호는 8자 이상입니다.'
    }
  }
  const checkPw2 = (pw1:string, pw2:string) => {
    if (pw1 && pw2 && pw1 !== pw2 ) {
      return '비밀번호가 일치하지 않습니다.'
    }
  }


  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     nickname: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: '',
  //   },
  // });

  // const onSubmit = (values: z.infer<typeof FormSchema>) => {
  //   console.log(values);
  // };

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAccount, initialState);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // function isDuplicate(field, value) {
  //   try {
  //     await sql`
  //       SELECT COUNT(*) as count FROM accounts WHERE ${field} = ${nickname}
  //     `
  //   } catch (error) {
      
  //     return {
  //       message: 'DB Error: Failed to Create Account.'
  //     }
  //   }

  //   console.log("Button clicked!");
  // }

  const myStyle: React.CSSProperties = {
    color: 'red',
    fontSize: '12px',
  };
  return (

    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">


        {/* Nickname */}
        <div className="mb-4">

          <label htmlFor="nickname" className="mb-2 block text-sm font-medium">
            Nickname
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nickname"
                name="nickname"
                value={nickname}
                onChange={(event)=> setNickname(event.target.value)}
                type="string"
                step="0.01"
                placeholder="Nickname"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                // required
              />

              {/* <FormMessage /> */}
              
            {/* <button onClick={isDuplicate}>중복확인(기능 x)</button> */}
            {/* <div onClick={checkNickname()}>중복확인(기능 x)</div> */}
            {/* <button type="button" onClick={checkNickname()}>중복확인(기능 x)</button> */}
            {/* <div onClick={checkNickname}>중복확인(기능 x)</div> */}
            <button type="button" onClick={() => checkNickname(nickname)}>중복확인(기능 x)</button>

            {/* `SELECT COUNT(*) as count FROM users WHERE username = ?` */}
            </div>
          {/* id="customer-error" : aira-describedby가 관계를 설정하기 위해 필요 */}
          {/* aria-live="polite" : div 내부의 에러가 업데이트 될 때, 변경사항을 알리지만 사용자를 방해하지 않도록 함. */}
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nickname &&
              state.errors.nickname.map((error: string) => (
                <p style={myStyle} className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          </div>
        </div>


        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                step="0.01"
                placeholder="buttercup@email.com"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                // required
              />
            <button type="button" onClick={() => checkEmail(email)}>중복확인(기능 x)</button>
            {/*  */}

            {/* <button type="button">중복확인(기능 x)</button> */}
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p style={myStyle} className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          </div>
        </div>


        {/* password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={password1}
                onChange={(event) => setPassword1(event.target.value)}
                step="0.01"
                placeholder="비밀번호"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                // required
              />
            </div>
            <div style={myStyle}>{checkPw1(password1)}</div>
            {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password &&
              state.errors.password.map((error: string) => (
                <p style={myStyle} className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
          </div>
        </div>


        {/* confirm password */}
        <div className="mb-4">
          <label htmlFor="confirmpassword" className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
                step="0.01"
                placeholder="비밀번호 확인"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                // required
              />
            </div>
            <div style={myStyle}>{checkPw2(password1, password2)}</div>

            {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.confirmpassword &&
              state.errors.confirmpassword.map((error: string) => (
                <p style={myStyle} className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
          </div>
        </div>




      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">가입</Button>
      </div>
    </form>

    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
    //     <div className='space-y-2'>
    //       <FormField
    //         control={form.control}
    //         name='nickname'
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Nickname</FormLabel>
    //             <FormControl>
    //               <Input placeholder='johndoe' {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name='email'
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Email</FormLabel>
    //             <FormControl>
    //               <Input placeholder='mail@example.com' {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name='password'
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Password</FormLabel>
    //             <FormControl>
    //               <Input
    //                 type='password'
    //                 placeholder='Enter your password'
    //                 {...field}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name='confirmPassword'
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Re-Enter your password</FormLabel>
    //             <FormControl>
    //               <Input
    //                 placeholder='Re-Enter your password'
    //                 type='password'
    //                 {...field}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //     </div>
    //     <Button className='w-full mt-6' type='submit'>
    //       Sign up
    //     </Button>
    //   </form>

      /* <p className='text-center text-sm text-gray-600 mt-2'>
        If you don&apos;t have an account, please&nbsp;
        <Link className='text-blue-500 hover:underline' href='/sign-in'>
          Sign in
        </Link>
      </p> */
    /* </Form> */
  );
};

// export default SignUpForm;
