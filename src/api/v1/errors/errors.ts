class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); 
    }
}

class ErrorClass extends Error {
    constructor(
        public message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

class AuthenticationError extends ErrorClass {

    constructor(
        message: string,
        code: string = "AUTHENTICATION",
        statusCode: number = 401
    ) {
        super(message, code, statusCode);
    }
}

class AuthorizationError extends ErrorClass {


    constructor(
        message: string,
        code: string = "AUTHORIZATION",
        statusCode: number = 403
    ) {
        super(message, code, statusCode);
    }
}

class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class RepositoryError extends Error {
    code: string;
    statusCode: number;

    constructor(message: string, code: string, statusCode: number = 500) {
        super(message);
        this.name = "RepositoryError";
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, RepositoryError.prototype);
    }
}

class ServiceError extends Error {
    code: string;
    statusCode: number;

    constructor(message: string, code: string, statusCode: number = 500) {
        super(message);
        this.name = "ServiceError";
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}



export { AppError, ValidationError, NotFoundError, RepositoryError, ServiceError, ErrorClass, AuthenticationError, AuthorizationError };