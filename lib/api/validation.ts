import { ZodError, ZodType } from "zod";

import { errorResponse } from "./errors";

export async function parseAndValidate<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      response: ReturnType<typeof errorResponse>;
    }
> {
  try {
    const json = await request.json();
    const data = schema.parse(json);

    return { ok: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        ok: false,
        response: errorResponse("VALIDATION_ERROR", "Validation failed", 400, {
          details: error.flatten(),
        }),
      };
    }

    return {
      ok: false,
      response: errorResponse("BAD_REQUEST", "Invalid JSON body", 400),
    };
  }
}
