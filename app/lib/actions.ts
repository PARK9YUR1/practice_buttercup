'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({  // 고객필드가 비어있는 경우 오류 throw, 사용자가 미선택시 메시지 보냄
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()  // 문자열에서 숫자로 변환되도록 설정되어 있음.
    .gt(0, { message: 'Please enter an amount greater than $0.' }),  // 문자열이 비어있으면 기본 0 -> 0보다 큰 금액을 원한다고 알려줌
  status: z.enum(['pending', 'paid'], {   // 상태필드가 비어있는 경우 오류 throw, 사용자가 미선택시 메시지 보냄.
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// prevState : useFormState 훅에서 전달된 상태를 포함.
export async function createInvoice(prevState: State, formData: FormData) {
  // Zod 사용해 폼 필드 유효성 검사
  // safeParse : success 또는 error 필드를 포함하는 객체를 반환 -> try/catch 블록내부에 이러한 로직 넣지 않고도 유효성 검사 처리
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 폼 유효성 검사 실패시, 즉시 에러 반환.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;  // 센트 단위로 변환
  const date = new Date().toISOString().split('T')[0];  // 날짜 "YYYY-MM-DD" 형식

  try {
    // DB에 데이터 삽입
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Client-side Router Cache
  // 경로 재검증 후 서버에서 새로운 데이터를 가져옴.
  revalidatePath('/dashboard/invoices');
  // redirect
  redirect('/dashboard/invoices');
}


export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // 데이터 추출, 타입 검증
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;  // 센트로 변환
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  // 클라이언트 캐시 지우고 새로운 서버 요청 보냄
  revalidatePath('/dashboard/invoices');
  // redirect
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');  // 새로운 서버 요청 -> 테이블 재렌더링
    // redirect 호출 필요 x
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // CredentialsSignin 오류가 있을 경우 오류 메시지 표시
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}