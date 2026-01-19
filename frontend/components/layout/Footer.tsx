import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 기관 정보 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">120다산콜재단</h3>
            <p className="text-sm text-muted-foreground mb-4">
              서울시민의 생활 불편사항을 해결하고<br />
              행정서비스 품질 향상을 위해 노력합니다.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>전화: 국번없이 120</span>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  메인 대시보드
                </Link>
              </li>
              <li>
                <Link href="/call-issue" className="text-muted-foreground hover:text-primary transition-colors">
                  콜 이슈
                </Link>
              </li>
              <li>
                <Link href="/complaint/region" className="text-muted-foreground hover:text-primary transition-colors">
                  지역별 민원
                </Link>
              </li>
              <li>
                <Link href="/complaint/period" className="text-muted-foreground hover:text-primary transition-colors">
                  기간별 분석
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">문의</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>dasancall@seoul.go.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>서울특별시 중구 세종대로 110<br />서울시청 본관</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} 서울특별시 120다산콜재단. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
