type FlattenedErrors = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};

export class ZodError extends Error {
  constructor(private readonly flattened: FlattenedErrors) {
    super('Validation failed');
  }

  flatten() {
    return this.flattened;
  }
}

interface Schema<T> {
  parse(value: unknown): T;
  optional(): Schema<T | undefined>;
}

class StringSchema implements Schema<string> {
  private minLength?: number;
  private maxLength?: number;

  min(length: number) {
    this.minLength = length;
    return this;
  }

  max(length: number) {
    this.maxLength = length;
    return this;
  }

  parse(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('Expected string');
    }

    if (this.minLength !== undefined && value.length < this.minLength) {
      throw new Error(`Must be at least ${this.minLength} characters`);
    }

    if (this.maxLength !== undefined && value.length > this.maxLength) {
      throw new Error(`Must be at most ${this.maxLength} characters`);
    }

    return value;
  }

  optional(): Schema<string | undefined> {
    return new OptionalSchema(this);
  }
}

class DateSchema implements Schema<Date> {
  parse(value: unknown): Date {
    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return date;
  }

  optional(): Schema<Date | undefined> {
    return new OptionalSchema(this);
  }
}

class EnumSchema<T extends string> implements Schema<T> {
  constructor(private readonly values: readonly T[]) {}

  parse(value: unknown): T {
    if (typeof value !== 'string' || !this.values.includes(value as T)) {
      throw new Error('Invalid enum value');
    }

    return value as T;
  }

  optional(): Schema<T | undefined> {
    return new OptionalSchema(this);
  }
}

class OptionalSchema<T> implements Schema<T | undefined> {
  constructor(private readonly inner: Schema<T>) {}

  parse(value: unknown) {
    if (value === undefined || value === null) {
      return undefined;
    }

    return this.inner.parse(value);
  }

  optional() {
    return this;
  }
}

type Shape = Record<string, Schema<any>>;

type InferShape<T extends Shape> = {
  [K in keyof T]: ReturnType<T[K]['parse']>;
};

class ObjectSchema<T extends Shape> implements Schema<InferShape<T>> {
  private refinements: Array<{ check: (value: any) => boolean; message: string }> = [];

  constructor(private readonly shape: T) {}

  partial() {
    const partialShape = Object.fromEntries(
      Object.entries(this.shape).map(([key, schema]) => [key, schema.optional()]),
    ) as T;

    return new ObjectSchema(partialShape);
  }

  refine(check: (value: InferShape<T>) => boolean, message: string) {
    this.refinements.push({ check: check as (value: any) => boolean, message });
    return this;
  }

  parse(value: unknown): InferShape<T> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new ZodError({ formErrors: ['Expected object'], fieldErrors: {} });
    }

    const parsed: Record<string, unknown> = {};
    const fieldErrors: Record<string, string[]> = {};

    for (const [key, schema] of Object.entries(this.shape)) {
      try {
        parsed[key] = schema.parse((value as Record<string, unknown>)[key]);
      } catch (error) {
        fieldErrors[key] = [(error as Error).message];
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      throw new ZodError({ formErrors: [], fieldErrors });
    }

    for (const refinement of this.refinements) {
      if (!refinement.check(parsed)) {
        throw new ZodError({ formErrors: [refinement.message], fieldErrors: {} });
      }
    }

    return parsed as InferShape<T>;
  }

  optional(): Schema<InferShape<T> | undefined> {
    return new OptionalSchema(this);
  }
}

export type ZodType<T> = Schema<T>;

export const z = {
  string: () => new StringSchema(),
  object: <T extends Shape>(shape: T) => new ObjectSchema(shape),
  enum: <T extends string>(values: readonly T[]) => new EnumSchema(values),
  coerce: {
    date: () => new DateSchema(),
  },
};
