import { withAuth } from 'next-auth/middleware';

export function proxy(request) {
  return withAuth(request, {
    pages: {
      signIn: '/login',
    },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
