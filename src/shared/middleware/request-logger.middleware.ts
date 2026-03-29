import morgan from 'morgan';
import type { Handler } from 'express';
import { config } from '../../config/env.js';

/**
 * HTTP request logger middleware.
 *
 * Uses Morgan's `dev` format (coloured, concise) in development and
 * `combined` (Apache-style, production-grade) in all other environments.
 */
export const requestLoggerMiddleware: Handler =
  config.NODE_ENV === 'development' ? morgan('dev') : morgan('combined');
