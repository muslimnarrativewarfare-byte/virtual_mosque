import { randomUUID } from 'node:crypto';

export type UserRole = 'USER' | 'ADMIN';

type LooseArgs = {
  where?: { id?: string; email?: string };
  data?: Record<string, unknown>;
  create?: Record<string, unknown>;
  update?: Record<string, unknown>;
  [key: string]: unknown;
};

class EmptyDelegate {
  async findUnique(_args?: LooseArgs): Promise<any> {
    return null;
  }

  async findMany(_args?: unknown): Promise<any[]> {
    return [];
  }

  async create(args?: LooseArgs): Promise<any> {
    return {
      id: randomUUID(),
      ...(args?.data ?? {}),
    };
  }

  async update(args?: LooseArgs): Promise<any> {
    return {
      id: args?.where?.id ?? randomUUID(),
      ...(args?.data ?? {}),
    };
  }

  async delete(args?: LooseArgs): Promise<any> {
    return {
      id: args?.where?.id ?? randomUUID(),
    };
  }

  async upsert(args?: LooseArgs): Promise<any> {
    return {
      id: args?.where?.id ?? randomUUID(),
      ...(args?.update ?? args?.create ?? {}),
    };
  }
}

export class PrismaClient {
  user = new EmptyDelegate();
  mosque = new EmptyDelegate();
  announcement = new EmptyDelegate();

  constructor(_options?: unknown) {}

  async $disconnect() {
    return;
  }
}
