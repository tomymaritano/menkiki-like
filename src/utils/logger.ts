/**
 * Production-ready logging utility
 * Filters logs based on environment and provides structured logging
 */

import { IS_DEV, APP_VERSION } from "../config";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Only show debug/info in development
const MIN_LOG_LEVEL: LogLevel = IS_DEV ? "debug" : "warn";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (context) {
    return `${prefix} ${message} ${JSON.stringify(context)}`;
  }

  return `${prefix} ${message}`;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (shouldLog("debug")) {
      console.log(formatMessage("debug", message, context));
    }
  },

  info(message: string, context?: LogContext) {
    if (shouldLog("info")) {
      console.log(formatMessage("info", message, context));
    }
  },

  warn(message: string, context?: LogContext) {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, context));
    }
  },

  error(message: string, error?: Error, context?: LogContext) {
    if (shouldLog("error")) {
      const errorContext = {
        ...context,
        appVersion: APP_VERSION,
        errorName: error?.name,
        errorMessage: error?.message,
        errorStack: IS_DEV ? error?.stack : undefined,
      };

      console.error(formatMessage("error", message, errorContext));

      // TODO: In production, send to crash reporting service
      // crashReporting.recordError(error, errorContext);
    }
  },

  // Track user actions for analytics
  track(event: string, properties?: LogContext) {
    if (IS_DEV) {
      console.log(`[TRACK] ${event}`, properties);
    }

    // TODO: In production, send to analytics service
    // analytics.track(event, properties);
  },
};
