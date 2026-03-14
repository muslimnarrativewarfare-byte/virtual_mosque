import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminPanelPage from "@/app/admin/page";

const get = vi.fn();
const isAuthorized = vi.fn();

vi.mock("next/headers", () => ({
  headers: () => ({ get })
}));

vi.mock("@/lib/auth", () => ({
  isAuthorized
}));

describe("admin auth guard behavior", () => {
  it("shows unauthorized copy when token invalid", () => {
    get.mockReturnValue(null);
    isAuthorized.mockReturnValue(false);
    render(<AdminPanelPage />);
    expect(screen.getByText(/Unauthorized/)).toBeInTheDocument();
  });

  it("shows admin controls when token valid", () => {
    get.mockReturnValue("valid");
    isAuthorized.mockReturnValue(true);
    render(<AdminPanelPage />);
    expect(screen.getByText(/Pending approvals/)).toBeInTheDocument();
  });
});
