/**
 * Custom application error class.
 *
 * Distinguishes between *operational* errors (expected, safe to surface to the client,
 * e.g. 400 validation failure, 401 unauthorized) and *programmer* errors (unexpected
 * bugs that should never reach the client in detail).
 */
export class AppError extends Error {
  /** HTTP status code to be sent in the response. */
  public readonly statusCode: number;

  /**
   * `true` for anticipated errors (validation failures, auth errors, etc.).
   * `false` / `undefined` for unexpected bugs — these get a generic 500 response.
   */
  public readonly isOperational: boolean;

  /**
   * @param message - Human-readable error message (returned to the client).
   * @param statusCode - HTTP status code (default 500).
   * @param isOperational - Whether this is a predictable operational error (default true).
   */
  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture a clean stack trace that starts at the call site, not inside this constructor.
    Error.captureStackTrace(this, this.constructor);
  }
}
