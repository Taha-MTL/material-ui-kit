// app/api/auth/login/route.ts
import mockUsers from '@/app/constants/mockUsers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (mockUsers.find((user) => user.email === email && user.password === password)) {
      return NextResponse.json({ message: 'Login successful', token: 'fake-jwt-token' });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Error during login' }, { status: 500 });
  }
}
