import { describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
const create = vi.fn();
const update = vi.fn();
const remove = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    mosque: {
      findMany,
      create,
      update,
      delete: remove
    }
  }
}));

import { createMosque, deleteMosque, listMosques, updateMosque } from "@/lib/mosqueRepo";

describe("mosque repo with prisma", () => {
  it("lists with announcement include", async () => {
    findMany.mockResolvedValue([]);
    await listMosques();
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ include: { announcements: true } }));
  });

  it("creates mosque", async () => {
    create.mockResolvedValue({ id: "m1" });
    await createMosque({
      name: "A",
      city: "B",
      country: "C",
      services: [],
      latitude: 0,
      longitude: 0
    });
    expect(create).toHaveBeenCalled();
  });

  it("updates and deletes by id", async () => {
    update.mockResolvedValue({ id: "m1" });
    remove.mockResolvedValue({ id: "m1" });
    await updateMosque("m1", { city: "X" });
    await deleteMosque("m1");
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "m1" } }));
    expect(remove).toHaveBeenCalledWith({ where: { id: "m1" } });
  });
});
