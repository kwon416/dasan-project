import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import EgovComplaintMain from "./EgovComplaintMain";

describe("EgovComplaintMain Component", () => {
  it("renders main dashboard title", () => {
    render(
      <MemoryRouter>
        <EgovComplaintMain />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "민원 데이터 대시보드" })
    ).toBeInTheDocument();
  });

  it("renders statistics cards", () => {
    render(
      <MemoryRouter>
        <EgovComplaintMain />
      </MemoryRouter>
    );

    // 통계 카드 제목들이 표시되는지 확인
    expect(screen.getByText("총 민원 건수")).toBeInTheDocument();
    expect(screen.getByText("금일 민원")).toBeInTheDocument();
    expect(screen.getByText("처리 완료")).toBeInTheDocument();
    expect(screen.getByText("처리 중")).toBeInTheDocument();
  });

  it("renders search input and button", () => {
    render(
      <MemoryRouter>
        <EgovComplaintMain />
      </MemoryRouter>
    );

    // 검색 입력과 버튼이 있는지 확인
    expect(screen.getByPlaceholderText("키워드를 입력하세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "검색" })).toBeInTheDocument();
  });

  it("renders recent complaints table", () => {
    render(
      <MemoryRouter>
        <EgovComplaintMain />
      </MemoryRouter>
    );

    // 최근 민원 테이블 제목 확인
    expect(screen.getByText("최근 민원 현황")).toBeInTheDocument();
  });
});
