import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it } from "vitest";
import EgovMain from "@/pages/main/EgovMain";

describe("EgovMain Component", () => {
  it("renders dashboard sections", () => {
    render(
      <MemoryRouter>
        <EgovMain />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "데이터 현황" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "데이터 검색" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "최신 다빈도" })
    ).toBeInTheDocument();
  });

  it("filters results by keyword", async () => {
    render(
      <MemoryRouter>
        <EgovMain />
      </MemoryRouter>
    );

    const keywordInput = screen.getByLabelText("키워드");
    await userEvent.clear(keywordInput);
    await userEvent.type(keywordInput, "소음");
    await userEvent.click(screen.getByRole("button", { name: "검색" }));

    const table = screen.getByRole("table");
    expect(within(table).getAllByText("소음").length).toBeGreaterThan(0);
    expect(within(table).queryByText("불법주정차")).not.toBeInTheDocument();
  });
});
