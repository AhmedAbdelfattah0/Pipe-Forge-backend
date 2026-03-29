/**
 * PipeForge backend — Express application entry point.
 *
 * Import order is intentional:
 *  1. `config` is imported first so that env vars are validated before anything else.
 *     The process will exit immediately if any required variable is missing or malformed.
 *  2. Third-party middleware (cors, express.json, morgan) is applied next.
 *  3. Feature routes are mounted.
 *  4. The global error handler is registered LAST (it must receive 4 arguments).
 */

// 1. Validate environment (crashes if invalid).
import { config } from './config/env.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { corsOptions } from './config/cors.js';
import { requestLoggerMiddleware } from './shared/middleware/request-logger.middleware.js';
import { errorMiddleware } from './shared/middleware/error.middleware.js';
import healthRouter from './features/health/routes/health.routes.js';
import authRouter from './features/auth/routes/auth.routes.js';
import pipelineRouter from './features/pipelines/routes/pipeline.routes.js';
import historyRouter from './features/history/routes/history.routes.js';
import billingRouter from './features/billing/routes/billing.routes.js';
import feedbackRouter from './features/feedback/routes/feedback.routes.js';
import { authMiddleware } from './features/auth/middleware/auth.middleware.js';

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ────────────────────────────────────────────────────────────
app.use('/api', rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));
app.use('/api/pipelines/generate', rateLimit({ windowMs: 60_000, max: 10 }));
app.use('/api/history', rateLimit({ windowMs: 60_000, max: 10 }));
app.use(requestLoggerMiddleware);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth', authMiddleware, authRouter);
app.use('/api/pipelines', authMiddleware, pipelineRouter);
app.use('/api/history', authMiddleware, historyRouter);
app.use('/api/billing', authMiddleware, billingRouter);
app.use('/api/feedback', feedbackRouter);

// ── Global error handler (MUST be last middleware) ──────────────────────────
app.use(errorMiddleware);

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(config.PORT, () => {
  console.log(
    `🚀  PipeForge backend running on http://localhost:${config.PORT} [${config.NODE_ENV}]`,
  );
});

export default app;
