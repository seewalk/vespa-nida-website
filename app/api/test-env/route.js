// app/api/test-env/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
    apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING'
  });
}