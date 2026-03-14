import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

type ErrorOptions = {
  details?: unknown;
};

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  options: ErrorOptions = {},
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(options.details ? { details: options.details } : {}),
      },
    },
    { status },
  );
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}
