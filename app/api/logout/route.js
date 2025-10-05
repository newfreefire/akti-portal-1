import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Create a response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear the token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Error during logout" },
      { status: 500 }
    );
  }
}