import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/mosques/route";
import { DELETE, PATCH } from "@/app/api/mosques/[id]/route";

const listMosques = vi.fn();
const createMosque = vi.fn();
const updateMosque = vi.fn();
const deleteMosque = vi.fn();
const isAuthorized = vi.fn();

vi.mock("@/lib/mosqueRepo", () => ({
  listMosques,
  createMosque,
  updateMosque,
  deleteMosque
}));

vi.mock("@/lib/auth", () => ({
  isAuthorized
}));

describe("mosques API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mosques on GET", async () => {
    listMosques.mockResolvedValue([{ id: "m1" }]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: "m1" }]);
  });

  it("rejects unauthorized POST", async () => {
    isAuthorized.mockReturnValue(false);
    const request = new NextRequest("http://localhost/api/mosques", { method: "POST", body: JSON.stringify({}) });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("creates mosque on authorized POST", async () => {
    isAuthorized.mockReturnValue(true);
    createMosque.mockResolvedValue({ id: "m2", name: "Created" });
    const request = new NextRequest("http://localhost/api/mosques", {
      method: "POST",
      headers: { "x-admin-token": "ok" },
      body: JSON.stringify({
        name: "Created",
        city: "Leeds",
        country: "UK",
        services: [],
        latitude: 1,
        longitude: 1
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(createMosque).toHaveBeenCalled();
  });

  it("returns 401 for PATCH auth failures", async () => {
    isAuthorized.mockReturnValue(false);
    const request = new NextRequest("http://localhost/api/mosques/m1", { method: "PATCH", body: JSON.stringify({ name: "x" }) });
    const response = await PATCH(request, { params: { id: "m1" } });
    expect(response.status).toBe(401);
  });

  it("deletes mosque when authorized", async () => {
    isAuthorized.mockReturnValue(true);
    const request = new NextRequest("http://localhost/api/mosques/m1", {
      method: "DELETE",
      headers: { "x-admin-token": "ok" }
    });
    const response = await DELETE(request, { params: { id: "m1" } });
    expect(response.status).toBe(200);
    expect(deleteMosque).toHaveBeenCalledWith("m1");
  });
});
