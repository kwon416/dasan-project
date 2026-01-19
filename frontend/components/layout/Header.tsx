'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '홈', href: '/' },
  { name: '콜 이슈', href: '/call-issue' },
  {
    name: '민원',
    href: '#',
    children: [
      { name: '지역별', href: '/complaint/region' },
      { name: '기간별', href: '/complaint/period' },
    ]
  },
  { name: '관리자', href: '/admin' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [complaintMenuOpen, setComplaintMenuOpen] = useState(false);
  const complaintMenuRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === '/';

  // 민원 하위 페이지인지 확인
  const isComplaintPage = pathname.startsWith('/complaint');

  // 외부 클릭 시 민원 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (complaintMenuRef.current && !complaintMenuRef.current.contains(event.target as Node)) {
        setComplaintMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/call-issue?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 상단 정부 배너 */}


      {/* 메인 헤더 */}
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/logo.jpg"
            alt="120 다산콜"
            width={96}
            height={96}
            className="rounded"
          />

        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            'children' in item ? (
              <div key={item.name} className="relative" ref={complaintMenuRef}>
                <button
                  onClick={() => setComplaintMenuOpen(!complaintMenuOpen)}
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary py-2',
                    isComplaintPage
                      ? 'text-[#0033A0]'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                  <ChevronDown className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    complaintMenuOpen && 'rotate-180'
                  )} />
                </button>
                {/* 드롭다운 메뉴 */}
                {complaintMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-lg shadow-lg border py-1 z-50">
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setComplaintMenuOpen(false)}
                        className={cn(
                          'block px-4 py-2 text-sm transition-colors',
                          pathname === child.href
                            ? 'bg-[#0033A0] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-[#0033A0] border-b-2 border-[#0033A0] pb-1'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* 검색바 - 홈에서만 표시 */}
        {isHomePage ? (
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="키워드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[200px] lg:w-[300px]"
              />
            </div>
            <Button type="submit" size="sm" className="bg-[#0033A0] hover:bg-[#002080]">
              검색
            </Button>
          </form>
        ) : (
          <div className="hidden md:block w-[200px] lg:w-[300px]" />
        )}

        {/* 모바일 메뉴 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-4 space-y-4">
            {/* 검색바 - 홈에서만 표시 */}
            {isHomePage && (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="키워드 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button type="submit" size="sm" className="bg-[#0033A0] hover:bg-[#002080]">
                  검색
                </Button>
              </form>
            )}
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                'children' in item ? (
                  <div key={item.name} className="space-y-1">
                    <span className="px-3 py-2 text-sm font-medium text-muted-foreground">
                      {item.name}
                    </span>
                    <div className="pl-4 space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            pathname === child.href
                              ? 'bg-[#0033A0] text-white'
                              : 'text-muted-foreground hover:bg-muted'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-[#0033A0] text-white'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
