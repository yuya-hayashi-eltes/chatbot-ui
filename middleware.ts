import type { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/'],
};

export default async function middleware(req: NextRequest) {
  // IP ホワイトリスト検証
  const ipWhitelist = process.env.IP_WHITELIST?.split(',');
  const reqIps = req.headers.get('x-forwarded-for')?.split(', ');
	if (ipWhitelist !== undefined && reqIps !== undefined) {
    // IP ホワイトリストに含まれていればアクセス許可
    if (reqIps.some((ip) => ipWhitelist.includes(ip))) {
      return NextResponse.next();
    }
  }

  // ステータスは 200 なのであれだが middleware ではそれが手軽にできないので一旦許容
  return NextResponse.json({ message: 'unauthorized' });
}
