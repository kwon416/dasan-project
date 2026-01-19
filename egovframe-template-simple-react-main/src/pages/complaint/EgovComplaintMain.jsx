import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import initPage from "@/js/ui";
import { Button, TextInput, Badge, } from "krds-react";

function EgovComplaintMain() {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    initPage();
  }, []);

  // 더미 통계 데이터
  const stats = [
    { title: "총 민원 건수", value: "1,234", change: "+12%", variant: "primary" },
    { title: "금일 민원", value: "45", change: "+5", variant: "success" },
    { title: "처리 완료", value: "987", change: "80%", variant: "info" },
    { title: "처리 중", value: "247", change: "20%", variant: "warning" },
  ];

  // 더미 최근 민원 데이터
  const recentComplaints = [
    { id: 1, keyword: "소음", region: "도봉구", count: 45, date: "2026-01-19" },
    { id: 2, keyword: "불법주정차", region: "강북구", count: 32, date: "2026-01-19" },
    { id: 3, keyword: "쓰레기", region: "성북구", count: 28, date: "2026-01-18" },
    { id: 4, keyword: "가로등", region: "도봉구", count: 15, date: "2026-01-18" },
    { id: 5, keyword: "도로파손", region: "노원구", count: 12, date: "2026-01-17" },
  ];

  const handleSearch = () => {
    console.log("검색 키워드:", keyword);
    // 실제 검색 로직은 나중에 추가
  };

  return (
    <div className="container">
      <div className="P_MAIN" style={{ padding: "40px 0" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>민원 데이터 대시보드</h1>
          <p style={{ color: "var(--krds-light-color-text-subtle)", fontSize: "16px" }}>
            서울시 도봉구 민원 데이터를 실시간으로 확인하고 분석하세요
          </p>
        </div>

        {/* 통계 카드 그리드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{
                padding: "24px",
                borderRadius: "var(--krds-radius-large1)",
                background: "var(--krds-light-color-surface-white)",
                boxShadow: "0 4px 12px var(--krds-light-color-alpha-shadow1)",
                border: "1px solid var(--krds-light-color-border-gray-light)",
              }}
            >
              <div style={{ marginBottom: "12px", color: "var(--krds-light-color-text-subtle)", fontSize: "14px" }}>
                {stat.title}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "32px", fontWeight: "700", color: "var(--krds-light-color-text-basic)" }}>
                  {stat.value}
                </span>
                <Badge variant={stat.variant}>{stat.change}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 섹션 */}
        <div
          className="hero-search"
          style={{
            padding: "32px",
            borderRadius: "var(--krds-radius-large1)",
            background: "var(--krds-light-color-surface-white)",
            boxShadow: "0 8px 20px var(--krds-light-color-alpha-shadow1)",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>키워드 검색</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <TextInput
                label="검색어"
                
                placeholder="키워드를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
            <Button variant="primary" size="large" onClick={handleSearch} style={{ width: "100px" }}>
              검색
            </Button>
          </div>
        </div>

        {/* 최근 민원 현황 테이블 */}
        <div
          style={{
            padding: "32px",
            borderRadius: "var(--krds-radius-large1)",
            background: "var(--krds-light-color-surface-white)",
            boxShadow: "0 4px 12px var(--krds-light-color-alpha-shadow1)",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>최근 민원 현황</h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--krds-light-color-border-gray-light)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px 8px", fontWeight: "600" }}>순번</th>
                  <th style={{ padding: "12px 8px", fontWeight: "600" }}>키워드</th>
                  <th style={{ padding: "12px 8px", fontWeight: "600" }}>지역</th>
                  <th style={{ padding: "12px 8px", fontWeight: "600" }}>건수</th>
                  <th style={{ padding: "12px 8px", fontWeight: "600" }}>날짜</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((complaint, index) => (
                  <tr
                    key={complaint.id}
                    style={{
                      borderBottom: "1px solid var(--krds-light-color-border-gray-light)",
                    }}
                  >
                    <td style={{ padding: "12px 8px" }}>{index + 1}</td>
                    <td style={{ padding: "12px 8px", fontWeight: "500" }}>
                      <Link
                        to="#"
                        style={{
                          color: "var(--krds-light-color-text-primary)",
                          textDecoration: "none",
                        }}
                      >
                        {complaint.keyword}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 8px" }}>{complaint.region}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <Badge variant="neutral">{complaint.count}</Badge>
                    </td>
                    <td style={{ padding: "12px 8px", color: "var(--krds-light-color-text-subtle)" }}>
                      {complaint.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EgovComplaintMain;
