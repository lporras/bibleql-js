export class BibleQLError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "BibleQLError";
  }
}

export class ConfigurationError extends BibleQLError {
  constructor(message?: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export class ConnectionError extends BibleQLError {
  constructor(message?: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

export class TimeoutError extends ConnectionError {
  constructor(message?: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

export class APIError extends BibleQLError {
  status: number;
  body: string;

  constructor(message?: string, status?: number, body?: string) {
    super(message);
    this.name = "APIError";
    this.status = status ?? 0;
    this.body = body ?? "";
  }
}

export class AuthenticationError extends APIError {
  constructor(message?: string, status?: number, body?: string) {
    super(message, status, body);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends APIError {
  constructor(message?: string, status?: number, body?: string) {
    super(message, status, body);
    this.name = "RateLimitError";
  }
}

export class ServerError extends APIError {
  constructor(message?: string, status?: number, body?: string) {
    super(message, status, body);
    this.name = "ServerError";
  }
}

export class QueryError extends BibleQLError {
  errors: Array<{ message: string; [key: string]: unknown }>;

  constructor(
    message?: string,
    errors?: Array<{ message: string; [key: string]: unknown }>,
  ) {
    super(message);
    this.name = "QueryError";
    this.errors = errors ?? [];
  }
}

export class NotFoundError extends QueryError {
  constructor(
    message?: string,
    errors?: Array<{ message: string; [key: string]: unknown }>,
  ) {
    super(message, errors);
    this.name = "NotFoundError";
  }
}
