import type { CorsOptions } from 'cors';
import { config } from './env.js';

/**
 * CORS configuration allowing the Angular frontend origin.
 * Credentials are enabled so that the browser can send cookies / Authorization headers.
 */
export const corsOptions: CorsOptions = {
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};
