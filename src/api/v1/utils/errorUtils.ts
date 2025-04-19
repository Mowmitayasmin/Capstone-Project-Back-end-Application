import { UNKNOWN_ERROR_CODE } from "../../../constants/errorConstants";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

export function hasErrorCode(error: unknown): error is { code: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as Record<string, unknown>).code === "string"
    );
}

export function getErrorMessage(error: unknown): string {
    if (isError(error)) {
        return error.message;
    }
    return String(error);
}

export function getErrorCode(error: unknown): string {
    if (hasErrorCode(error)) {
        return error.code;
    }
    return UNKNOWN_ERROR_CODE;
}

export function getFirebaseErrorStatusCode(error: unknown): number {
    if (hasErrorCode(error)) {
        switch (error.code) {
            case "not-found":
                return HTTP_STATUS.NOT_FOUND;
            case "already-exists":
                return HTTP_STATUS.CONFLICT;
            case "permission-denied":
                return HTTP_STATUS.FORBIDDEN;
            case "unauthenticated":
                return HTTP_STATUS.UNAUTHORIZED;
            case "invalid-argument":
                return HTTP_STATUS.BAD_REQUEST;
            default:
                return HTTP_STATUS.INTERNAL_SERVER_ERROR;
        }
    }
    return HTTP_STATUS.INTERNAL_SERVER_ERROR;
}