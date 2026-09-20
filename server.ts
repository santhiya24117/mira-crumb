import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

dotenv.config();

/**
 * Server-Side Environment Variables Access
 * NEVER exposed to the client-side bundle.
 */
function getEmailConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const envAdminEmail = process.env.ADMIN_EMAIL?.trim();

  // In production, ADMIN_EMAIL must strictly be supplied via deployment environment variables.
  // Never fall back to a hardcoded or personal recipient email address in production.
  // In development, an explicit dummy local address is provided if unset for prototyping.
  const adminEmail = envAdminEmail || (isProduction ? '' : 'dev-admin@localhost');

  const smtpHost = process.env.SMTP_HOST?.trim() || '';
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT.trim(), 10) : 587;
  const smtpUser = process.env.SMTP_USER?.trim() || '';
  const smtpPass = process.env.SMTP_PASS?.trim() || '';
  const smtpFrom = process.env.SMTP_FROM?.trim() || (adminEmail ? `"MIRA & CRUMB Atelier" <${adminEmail}>` : '"MIRA & CRUMB Atelier"');

  const isSmtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

  return {
    adminEmail,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFrom,
    isSmtpConfigured,
    isProduction,
  };
}

/**
 * Helper to build an active nodemailer transporter using server-side env variables
 */
function createTransporter() {
  const { smtpHost, smtpPort, smtpUser, smtpPass, isSmtpConfigured } = getEmailConfig();

  if (!isSmtpConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass.replace(/\s+/g, ''),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      minVersion: 'TLSv1.2',
    },
  });
}

/**
 * HTML Entity Sanitizer to prevent HTML injection in email bodies
 * Strips dangerous control characters and Unicode BiDi override markers,
 * and encodes all sensitive HTML/attribute characters.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    // Strip null bytes and dangerous unprintable control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip Unicode BiDi override characters (prevents visual text spoofing)
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
}

/**
 * Sanitizes single-line text inputs (names, phones, occasions, categories)
 * Strips carriage returns, line breaks, null bytes, control characters,
 * and enforces strict length bounds.
 */
export function sanitizeSingleLine(val: any, maxLength: number): string {
  if (typeof val !== 'string') return '';
  return val
    // Strip null bytes and control chars (including \r, \n, \t)
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    // Replace Unicode BiDi override characters with space
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ' ')
    // Collapse any whitespace sequence into a single space
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes multi-line text inputs (enquiry messages)
 * Normalizes newlines, strips dangerous unprintable control characters and null bytes,
 * limits excessive consecutive blank lines, and enforces maximum length bounds.
 */
export function sanitizeMultiLine(val: any, maxLength: number): string {
  if (typeof val !== 'string') return '';
  return val
    // Strip null bytes and unprintable control characters (preserves standard \t and \n)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    // Replace Unicode BiDi override characters with space
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ' ')
    // Normalize newlines to standard LF
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Prevent excessive blank line flooding (cap consecutive newlines to 2)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates email address format with strict RFC 5322 structure checks:
 * - Exactly one @ separator
 * - Non-empty local part before @
 * - Non-empty domain part with valid extension after @
 * - Strictly rejects carriage returns, newlines, null bytes, or any control characters
 * - Strictly rejects consecutive dots (..)
 * - Enforces minimum 5 and maximum 254 characters (RFC 5321)
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // Strictly reject null bytes, CR/LF, or any ASCII control characters
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  // Strictly reject consecutive dots in address
  if (trimmed.includes('..')) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates 10-digit Indian mobile numbers starting with 6, 7, 8, or 9.
 * Pattern: ^[6-9]\d{9}$
 */
export function isValidIndianMobile(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  return /^[6-9]\d{9}$/.test(trimmed);
}

/**
 * Validates celebration date strings.
 * Rejects control characters, carriage returns, and invalid date ranges.
 */
export function isValidDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const trimmed = dateStr.trim();
  if (trimmed.length < 4 || trimmed.length > 50) return false;
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return false;
  const year = parsed.getFullYear();
  const currentYear = new Date().getFullYear();
  return year >= currentYear - 1 && year <= currentYear + 10;
}

/**
 * Validates positive party/guest count (e.g., '15', '6-10 guests', '40-75 guests').
 * Rejects control characters and excessive numbers.
 */
export function isValidPeople(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length < 1 || trimmed.length > 50) return false;
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  const digits = trimmed.match(/\d+/g);
  if (!digits) return false;
  const num = parseInt(digits[0], 10);
  return num > 0 && num <= 5000;
}

/**
 * Sliding Window Email Address Rate Limiter
 * Enforces rate limiting per normalized recipient/customer email address (max 5 requests per 15 minutes).
 * Complements IP-based rate limiting to prevent distributed email spamming.
 */
export class EmailRateLimiter {
  private records: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly max: number;

  constructor(windowMs = 15 * 60 * 1000, max = 5) {
    this.windowMs = windowMs;
    this.max = max;

    // Periodic cleanup of expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  public check(email: string): { allowed: boolean; remaining: number; resetTime: number } {
    if (!email || typeof email !== 'string') {
      return { allowed: true, remaining: this.max, resetTime: Math.ceil(this.windowMs / 1000) };
    }
    const normalized = email.trim().toLowerCase();
    const now = Date.now();
    const timestamps = (this.records.get(normalized) || []).filter(t => now - t < this.windowMs);

    if (timestamps.length >= this.max) {
      const oldest = timestamps[0];
      const resetTime = Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000));
      this.records.set(normalized, timestamps);
      return { allowed: false, remaining: 0, resetTime };
    }

    timestamps.push(now);
    this.records.set(normalized, timestamps);
    return {
      allowed: true,
      remaining: this.max - timestamps.length,
      resetTime: Math.ceil(this.windowMs / 1000),
    };
  }

  public reset(): void {
    this.records.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.records.entries()) {
      const valid = timestamps.filter(t => now - t < this.windowMs);
      if (valid.length === 0) {
        this.records.delete(key);
      } else {
        this.records.set(key, valid);
      }
    }
  }
}

export const emailAddressLimiter = new EmailRateLimiter(15 * 60 * 1000, 5);

/**
 * Hardened Public Form Submissions Rate Limiter Factory
 * Protects all endpoints that can trigger email delivery (POST /api/send-email, POST /api/contact, POST /api/custom-order).
 * Window: 15 minutes, Maximum: 5 requests per IP per window.
 * - Accurately normalizes client IPs via ipKeyGenerator (normalizes IPv4-mapped IPv6 and IPv6 /56 CIDR subnets).
 * - Emits standard IETF draft-7 RateLimit headers (`RateLimit: limit=5, remaining=X, reset=Y`) and `Retry-After`.
 * - When limit is exceeded, immediately sends HTTP 429 and strictly DOES NOT call _next(),
 *   dropping requests before reaching any input validation, controller logic, or email transport.
 */
export function createFormSubmissionLimiter(customOptions?: { windowMs?: number; max?: number }) {
  const windowMs = customOptions?.windowMs ?? 15 * 60 * 1000;
  const max = customOptions?.max ?? 5;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: 'draft-7', // Standard IETF draft-7 `RateLimit` header
    legacyHeaders: false, // Disable deprecated `X-RateLimit-*` headers
    statusCode: 429,
    // Accurately normalize IP representations (IPv6 /56 subnets, IPv4-mapped IPv6)
    keyGenerator: (req) => {
      const clientIp = req.ip || req.socket?.remoteAddress || '127.0.0.1';
      return ipKeyGenerator(clientIp);
    },
    validate: {
      xForwardedForHeader: false, // Explicitly handled by Express trust proxy = 1
      default: true,
    },
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
    handler: (req, res, _next, options) => {
      const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
      console.warn(`[RATE_LIMIT_EXCEEDED] Client IP: ${clientIp} exceeded rate limit on ${req.method} ${req.originalUrl || req.url}`);

      // Calculate retry-after seconds from rateLimit store reset time
      const resetTime = (req as any).rateLimit?.resetTime;
      const retryAfterSeconds = resetTime instanceof Date
        ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
        : Math.ceil(options.windowMs / 1000);

      res.setHeader('Retry-After', String(retryAfterSeconds));

      // Strictly terminate response immediately with HTTP 429.
      // Do NOT call _next() — guarantees that rate-limited requests are dropped
      // before reaching validation routines or email transport logic.
      return res.status(options.statusCode).json(options.message);
    },
  });
}

export class RateLimitExceededError extends Error {
  public statusCode = 429;
  public resetSeconds: number;

  constructor(message = 'Too many requests. Please try again later.', resetSeconds = 900) {
    super(message);
    this.name = 'RateLimitExceededError';
    this.resetSeconds = resetSeconds;
  }
}

export class ServerValidationError extends Error {
  public statusCode = 400;
  public errors: Record<string, string>;

  constructor(errors: Record<string, string>, message?: string) {
    super(message || Object.values(errors)[0] || 'Please check the submitted information.');
    this.name = 'ServerValidationError';
    this.errors = errors;
  }
}

export class EmailDeliveryError extends Error {
  public statusCode: number;
  public technicalDetails?: string;

  constructor(
    message = "We couldn't send your enquiry right now. Please try again later.",
    statusCode = 502,
    technicalDetails?: string
  ) {
    super(message);
    this.name = 'EmailDeliveryError';
    this.statusCode = statusCode;
    this.technicalDetails = technicalDetails;
  }
}

/**
 * Safe server-side operational logging for technical and unexpected errors.
 * Logs structured operational details (timestamp, method, path, statusCode, sanitized message)
 * strictly to server logs. Never leaks secrets, passwords, tokens, full request bodies,
 * or stack traces to clients.
 */
function logTechnicalError(
  category: string,
  req: express.Request,
  statusCode: number,
  errorMessage: string,
  stack?: string
) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.originalUrl || req.url;
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now().toString(36)}`;

  // Sanitize message to strip any potential sensitive credentials or tokens
  const sanitized = String(errorMessage || '')
    .replace(/(password|pass|secret|token|key|auth)=([^\s&]+)/gi, '$1=[REDACTED]')
    .replace(/(Bearer\s+)[^\s]+/gi, '$1[REDACTED]');

  const logPayload = {
    timestamp,
    category,
    requestId,
    method,
    path,
    statusCode,
    message: sanitized,
    ...(stack ? { stack: stack.split('\n').slice(0, 5).join('\n') } : {}),
  };

  console.error('[SERVER ERROR]', JSON.stringify(logPayload));
}

export interface ValidatedContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ValidatedCustomOrderInput {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  cakeType: string;
  preferredDate: string;
  numberOfPeople: string;
  budgetRange?: string;
  preferredFlavour?: string;
  message?: string;
}

/**
 * Rigorous server-side validator for general contact form submissions
 */
export function validateContactInput(body: any): ValidatedContactInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ServerValidationError({ general: 'Invalid request body.' }, 'Invalid request body.');
  }

  const errors: Record<string, string> = {};

  // 1. Name validation
  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  if (!rawName) {
    errors.name = 'Please provide your full name.';
  } else if (rawName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (rawName.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }
  const name = sanitizeSingleLine(rawName, 100);

  // 2. Email validation
  const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
  if (!rawEmail) {
    errors.email = 'Please enter a valid email address.';
  } else if (!isValidEmail(rawEmail)) {
    errors.email = 'Please enter a valid email address.';
  }
  const email = rawEmail.toLowerCase();

  // 3. Optional Phone validation (if provided, must be valid 10-digit Indian mobile)
  let phone: string | undefined = undefined;
  if (body.phone !== undefined && body.phone !== null) {
    const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
    if (rawPhone.length > 0) {
      if (!isValidIndianMobile(rawPhone)) {
        errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
      } else {
        phone = sanitizeSingleLine(rawPhone, 20);
      }
    }
  }

  // 4. Message validation
  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (!rawMessage) {
    errors.message = 'Please provide your message.';
  } else if (rawMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters in length.';
  } else if (rawMessage.length > 3000) {
    errors.message = 'Message cannot exceed 3000 characters.';
  }
  const message = sanitizeMultiLine(rawMessage, 3000);

  if (Object.keys(errors).length > 0) {
    throw new ServerValidationError(errors);
  }

  return { name, email, phone, message };
}

/**
 * Rigorous server-side validator for bespoke custom cake enquiries
 */
export function validateCustomOrderInput(body: any): ValidatedCustomOrderInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ServerValidationError({ general: 'Invalid request body.' }, 'Invalid request body.');
  }

  const errors: Record<string, string> = {};

  // 1. Name validation
  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  if (!rawName) {
    errors.name = 'Please provide your full name.';
  } else if (rawName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (rawName.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }
  const name = sanitizeSingleLine(rawName, 100);

  // 2. Email validation
  const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
  if (!rawEmail) {
    errors.email = 'Please enter a valid email address.';
  } else if (!isValidEmail(rawEmail)) {
    errors.email = 'Please enter a valid email address.';
  }
  const email = rawEmail.toLowerCase();

  // 3. Required Phone validation (must be 10-digit Indian mobile)
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  if (!rawPhone) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  } else if (!isValidIndianMobile(rawPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  }
  const phone = sanitizeSingleLine(rawPhone, 20);

  // 4. Required Occasion validation
  const rawOccasion = typeof body.occasion === 'string' ? body.occasion.trim() : '';
  if (!rawOccasion) {
    errors.occasion = 'Please select an occasion.';
  } else if (rawOccasion.length < 2 || rawOccasion.length > 100) {
    errors.occasion = 'Please select a valid occasion.';
  }
  const occasion = sanitizeSingleLine(rawOccasion, 100);

  // 5. Required Cake Type validation
  const rawCakeType = typeof body.cakeType === 'string' ? body.cakeType.trim() : '';
  if (!rawCakeType) {
    errors.cakeType = 'Please select a cake style.';
  } else if (rawCakeType.length < 2 || rawCakeType.length > 100) {
    errors.cakeType = 'Please select a valid cake style.';
  }
  const cakeType = sanitizeSingleLine(rawCakeType, 100);

  // 6. Required Preferred Date validation
  const rawDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';
  if (!rawDate) {
    errors.preferredDate = 'Please select your preferred celebration date.';
  } else if (!isValidDate(rawDate)) {
    errors.preferredDate = 'Celebration date must be a valid upcoming date.';
  }
  const preferredDate = sanitizeSingleLine(rawDate, 50);

  // 7. Required Number of People / Guests validation
  const rawPeople = typeof body.numberOfPeople === 'string' ? body.numberOfPeople.trim() : '';
  if (!rawPeople) {
    errors.numberOfPeople = 'Please indicate estimated guest count.';
  } else if (!isValidPeople(rawPeople)) {
    errors.numberOfPeople = 'Please select a valid guest count.';
  }
  const numberOfPeople = sanitizeSingleLine(rawPeople, 50);

  // 8. Optional Budget Range
  let budgetRange: string | undefined;
  if (body.budgetRange && typeof body.budgetRange === 'string') {
    const b = sanitizeSingleLine(body.budgetRange, 100);
    if (b) budgetRange = b;
  }

  // 9. Optional Preferred Flavour
  let preferredFlavour: string | undefined;
  if (body.preferredFlavour && typeof body.preferredFlavour === 'string') {
    const f = sanitizeSingleLine(body.preferredFlavour, 100);
    if (f) preferredFlavour = f;
  }

  // 10. Optional Message / Notes
  let message: string | undefined;
  if (body.message && typeof body.message === 'string') {
    const m = sanitizeMultiLine(body.message, 3000);
    if (m) message = m;
  }

  if (Object.keys(errors).length > 0) {
    throw new ServerValidationError(errors);
  }

  return {
    name,
    email,
    phone,
    occasion,
    cakeType,
    preferredDate,
    numberOfPeople,
    budgetRange,
    preferredFlavour,
    message,
  };
}

/**
 * Core secure email handler for Contact and Custom Cake enquiries
 */
async function processEmailDispatch(payload: { type: 'contact' | 'custom-order' } & Record<string, any>) {
  const { adminEmail, smtpFrom, isProduction } = getEmailConfig();

  // Fail-closed: In production, missing ADMIN_EMAIL halts delivery with a safe 503
  if (isProduction && !adminEmail) {
    throw new EmailDeliveryError(
      "We couldn't send your enquiry right now. Please try again later.",
      503,
      'ADMIN_EMAIL environment variable is required in production'
    );
  }

  const { type } = payload;

  const submissionDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });

  let emailSubject = '';
  let emailText = '';
  let emailHtml = '';
  let customerEmail = '';
  let customerName = '';

  if (type === 'custom-order') {
    const {
      name,
      phone,
      email,
      occasion,
      cakeType,
      preferredDate,
      numberOfPeople,
      budgetRange,
      preferredFlavour,
      message,
    } = payload;

    customerEmail = email;
    customerName = name;
    emailSubject = 'New Custom Cake Enquiry — MIRA & CRUMB';

    emailText = `
MIRA & CRUMB — ARTISAN BAKES & PÂTISSERIE
NEW CUSTOM CAKE ENQUIRY
===========================================

Customer Name: ${name}
Customer Email: ${email}
Phone Number: ${phone}
Occasion: ${occasion}
Cake Type: ${cakeType}
Preferred Date: ${preferredDate}
Number of People: ${numberOfPeople}
Budget Range: ${budgetRange || 'Not specified'}
Preferred Flavour: ${preferredFlavour || 'Not specified'}

Customer Message:
${message || 'No additional message provided.'}

Submission Date/Time: ${submissionDate}
Admin Recipient: ${adminEmail}
===========================================
    `.trim();

    const safeEmailHref = encodeURIComponent(email);
    const safePhoneHref = phone.replace(/[^0-9+]/g, '');

    emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #F7F3F5; margin: 0; padding: 30px 15px; color: #292129; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; border: 1px solid #D8C3A5; overflow: hidden; }
    .header { background: #4A263F; padding: 28px 24px; text-align: center; color: #FFFFFF; }
    .brand { font-size: 24px; font-weight: 600; letter-spacing: 2px; margin: 0; }
    .tagline { font-size: 13px; color: #D8C3A5; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 6px; }
    .content { padding: 32px 28px; }
    .badge { display: inline-block; background: #f1e7d9; color: #4A263F; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; margin-bottom: 20px; }
    .field-row { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f2ecef; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8a7a85; font-weight: 600; }
    .value { font-size: 15px; color: #292129; margin-top: 4px; font-weight: 500; }
    .message-box { background: #F7F3F5; border-left: 3px solid #D8C3A5; padding: 16px; border-radius: 4px; margin-top: 8px; font-style: italic; white-space: pre-wrap; line-height: 1.6; }
    .footer { background: #faf8f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #8a7a85; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">MIRA & CRUMB</div>
      <div class="tagline">Artisan Bakes & Pâtisserie</div>
    </div>
    <div class="content">
      <div class="badge">Bespoke Custom Cake Commission</div>
      
      <div class="field-row">
        <div class="label">Customer Name</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      
      <div class="field-row">
        <div class="label">Customer Email</div>
        <div class="value"><a href="mailto:${safeEmailHref}" style="color: #4A263F; font-weight: bold;">${escapeHtml(email)}</a></div>
      </div>
      
      <div class="field-row">
        <div class="label">Phone Number</div>
        <div class="value"><a href="tel:${safePhoneHref}" style="color: #4A263F;">${escapeHtml(phone)}</a></div>
      </div>
      
      <div class="field-row">
        <div class="label">Occasion & Cake Type</div>
        <div class="value">${escapeHtml(occasion)} &mdash; ${escapeHtml(cakeType)}</div>
      </div>
      
      <div class="field-row">
        <div class="label">Preferred Date & Party Size</div>
        <div class="value">${escapeHtml(preferredDate)} &bull; ${escapeHtml(numberOfPeople)}</div>
      </div>
      
      ${budgetRange ? `
      <div class="field-row">
        <div class="label">Budget Range</div>
        <div class="value">${escapeHtml(budgetRange)}</div>
      </div>` : ''}

      ${preferredFlavour ? `
      <div class="field-row">
        <div class="label">Preferred Flavour Profile</div>
        <div class="value">${escapeHtml(preferredFlavour)}</div>
      </div>` : ''}
      
      <div class="field-row" style="border-bottom: none;">
        <div class="label">Customer Message & Requirements</div>
        <div class="message-box">${escapeHtml(message || 'None provided')}</div>
      </div>
    </div>
    <div class="footer">
      Dispatched to: <strong>${escapeHtml(adminEmail)}</strong> &bull; Received on ${submissionDate}
    </div>
  </div>
</body>
</html>
    `;
  } else {
    // General contact enquiry
    const { name, email, phone, message } = payload;

    customerEmail = email;
    customerName = name;
    emailSubject = 'New Website Enquiry — MIRA & CRUMB';

    emailText = `
MIRA & CRUMB — ARTISAN BAKES & PÂTISSERIE
NEW WEBSITE ENQUIRY
===========================================

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

Submission Date/Time: ${submissionDate}
Admin Recipient: ${adminEmail}
===========================================
    `.trim();

    const safeEmailHref = encodeURIComponent(email);
    const safePhoneHref = phone ? phone.replace(/[^0-9+]/g, '') : '';

    emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #F7F3F5; margin: 0; padding: 30px 15px; color: #292129; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; border: 1px solid #D8C3A5; overflow: hidden; }
    .header { background: #4A263F; padding: 28px 24px; text-align: center; color: #FFFFFF; }
    .brand { font-size: 24px; font-weight: 600; letter-spacing: 2px; margin: 0; }
    .tagline { font-size: 13px; color: #D8C3A5; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 6px; }
    .content { padding: 32px 28px; }
    .badge { display: inline-block; background: #f1e7d9; color: #4A263F; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; margin-bottom: 20px; }
    .field-row { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f2ecef; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8a7a85; font-weight: 600; }
    .value { font-size: 15px; color: #292129; margin-top: 4px; font-weight: 500; }
    .message-box { background: #F7F3F5; border-left: 3px solid #D8C3A5; padding: 16px; border-radius: 4px; margin-top: 8px; line-height: 1.6; white-space: pre-wrap; }
    .footer { background: #faf8f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #8a7a85; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">MIRA & CRUMB</div>
      <div class="tagline">Artisan Bakes & Pâtisserie</div>
    </div>
    <div class="content">
      <div class="badge">General Boutique Enquiry</div>
      
      <div class="field-row">
        <div class="label">Customer Name</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      
      <div class="field-row">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${safeEmailHref}" style="color: #4A263F; font-weight: bold;">${escapeHtml(email)}</a></div>
      </div>
      
      <div class="field-row">
        <div class="label">Phone Number</div>
        <div class="value">${phone ? `<a href="tel:${safePhoneHref}" style="color: #4A263F;">${escapeHtml(phone)}</a>` : 'Not provided'}</div>
      </div>
      
      <div class="field-row" style="border-bottom: none;">
        <div class="label">Message</div>
        <div class="message-box">${escapeHtml(message)}</div>
      </div>
    </div>
    <div class="footer">
      Dispatched to: <strong>${escapeHtml(adminEmail)}</strong> &bull; Received on ${submissionDate}
    </div>
  </div>
</body>
</html>
    `;
  }

  // Enforce per-email address rate limiting before attempting SMTP dispatch
  const emailLimitCheck = emailAddressLimiter.check(customerEmail);
  if (!emailLimitCheck.allowed) {
    throw new RateLimitExceededError(
      'Too many enquiries submitted for this email address. Please try again later.',
      emailLimitCheck.resetTime
    );
  }

  const transporter = createTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: adminEmail,
        replyTo: customerEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
      console.log(`[SMTP EMAIL SENT] Successfully processed ${type} email notification`);
    } catch (smtpErr: any) {
      throw new EmailDeliveryError(
        "We couldn't send your enquiry right now. Please try again later.",
        502,
        typeof smtpErr?.message === 'string' ? smtpErr.message : 'SMTP dispatch failure'
      );
    }
  } else {
    if (isProduction) {
      // In production, failure to configure email transport means delivery cannot occur.
      // We must NOT silently report success.
      throw new EmailDeliveryError(
        "We couldn't send your enquiry right now. Please try again later.",
        503,
        'SMTP credentials are not configured in production environment'
      );
    }
    // Development fallback for local prototyping without SMTP credentials
    console.log(`[DEV EMAIL DISPATCH] (Simulated dispatch for ${type} enquiry)`);
  }

  const confirmationMessage = type === 'custom-order'
    ? "Thank you! Your enquiry has been received. We'll get back to you shortly."
    : "Thank you! Your message has been sent successfully.";

  return {
    success: true,
    message: confirmationMessage,
    timestamp: submissionDate,
  };
}

export async function startServer(overridePort?: number): Promise<{ app: express.Express; server: import('http').Server }> {
  const app = express();
  const PORT = overridePort || 3000;

  // Trust the first reverse proxy hop (Nginx reverse proxy in container / Cloud Run).
  // Accurately resolves client IPs from X-Forwarded-For headers, prevents IP spoofing,
  // and ensures the rate limiter window tracks true client IPs.
  app.set('trust proxy', 1);

  // Explicitly disable X-Powered-By to prevent framework information disclosure
  app.disable('x-powered-by');

  const isProduction = process.env.NODE_ENV === 'production';

  /**
   * Security Headers via Helmet (Audited & Environment-Aware CSP)
   * - style-src: Stricter in production ('self' & Google Fonts only; no 'unsafe-inline').
   *              Development includes 'unsafe-inline' for Vite runtime <style> injection.
   * - style-src-attr: 'unsafe-inline' retained specifically for document.body.style.overflow in Lightbox.
   * - frame-ancestors: Stricter in production ('self' only). Development permits AI Studio preview iframe.
   * - Google Fonts: Scoped strictly to style-src (googleapis.com) and font-src (gstatic.com).
   * - Unsplash: Scoped strictly to imgSrc (images.unsplash.com).
   * - Google Maps: Scoped strictly to frameSrc (maps.google.com, www.google.com).
   * - Disables HSTS in development; active in production.
   */
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          // Development requires 'unsafe-inline' for Vite's runtime <style> injection.
          // Production serves compiled CSS exclusively via <link rel="stylesheet">, eliminating 'unsafe-inline'.
          styleSrc: isProduction
            ? ["'self'", 'https://fonts.googleapis.com']
            : ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
          // Lightbox modal dynamically sets `document.body.style.overflow` to lock/unlock background scroll
          styleSrcAttr: ["'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'],
          scriptSrc: isProduction
            ? [
                "'self'",
                // Exact SHA-256 hash of container preview error-suppression inline script in index.html
                "'sha256-0imtb2/iDtm1gWJy3utIuoCpfUKJ9yjheF6uMFCdPP0='",
              ]
            : [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
              ],
          scriptSrcAttr: ["'none'"],
          frameSrc: ["'self'", 'https://maps.google.com', 'https://www.google.com'],
          // Production strictly restricts embedding to same-origin ('self').
          // Development permits the Google AI Studio container preview environment.
          frameAncestors: isProduction
            ? ["'self'"]
            : [
                "'self'",
                'https://*.google.com',
                'https://*.ai.studio',
                'https://ai.studio',
                'https://*.run.app',
                'https://*.googleusercontent.com',
              ],
          connectSrc: isProduction
            ? ["'self'"]
            : ["'self'", 'ws:', 'wss:', 'https://*.run.app'],
          objectSrc: ["'none'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      originAgentCluster: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      strictTransportSecurity: isProduction
        ? { maxAge: 31536000, includeSubDomains: true }
        : false,
      xContentTypeOptions: true,
      xDnsPrefetchControl: { allow: false },
      xDownloadOptions: true,
      xFrameOptions: isProduction ? { action: 'sameorigin' } : false,
      xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
      xXssProtection: true,
    })
  );

  /**
   * CORS Hardening (Security Checkpoint 6)
   * - Strict exact-match allowlists separating development from production.
   * - Production allows ONLY 'https://www.miraandcrumb.com'.
   * - Development allows 'http://localhost:3000' (and dev container APP_URL if present).
   * - No wildcards (*), no arbitrary reflection, no substring matching (.includes / .endsWith).
   * - credentials: false (public forms, no cookies, sessions, or Authorization tokens).
   * - methods: ['GET', 'POST', 'OPTIONS'] (only endpoints used by this application).
   * - allowedHeaders: ['Content-Type'] (only JSON payloads sent by frontend fetch).
   * - optionsSuccessStatus: 204 (proper preflight response).
   * - maxAge: 600 (10 minutes preflight cache).
   */
  const allowedOrigins: string[] = isProduction
    ? ['https://www.miraandcrumb.com']
    : ['http://localhost:3000', ...(process.env.APP_URL ? [process.env.APP_URL] : [])];

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. same-origin GET/navigation, server-to-server, curl)
      if (!origin) {
        return callback(null, true);
      }

      // Strict exact string matching against the active environment allowlist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject unauthorized origins (passes false so cors omits Access-Control-Allow-Origin)
      return callback(null, false);
    },
    credentials: false,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204,
    maxAge: 600,
  };

  app.use(cors(corsOptions));

  // Explicit preflight handler for unauthorized origins:
  // If an OPTIONS request on /api/* bypasses CORS (unauthorized origin), terminate it cleanly with 204
  // and zero permission headers, preventing downstream dev middleware from injecting generic headers.
  app.options('/api/*', (_req, res) => {
    res.status(204).setHeader('Content-Length', '0').end();
  });

  // Safe JSON parser with size limit to prevent body overflow attacks
  app.use(express.json({ limit: '100kb' }));

  // Body parser error handler: safely catches oversized JSON payloads without exposing stack traces
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      if (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413) {
        return res.status(413).json({
          success: false,
          message: 'Request body is too large.',
        });
      }
      if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && (err as any).status === 400)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request payload.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload.',
      });
    }
    next();
  });

  /**
   * Hardened Public Form Submissions Rate Limiter
   * Shared instance across POST /api/send-email, POST /api/contact, and POST /api/custom-order.
   */
  const formSubmissionLimiter = createFormSubmissionLimiter();

  // 1. Unified Secure Email API Endpoint
  app.post('/api/send-email', formSubmissionLimiter, async (req, res, next) => {
    try {
      const isCustomOrder = req.body?.type === 'custom-order' || req.body?.occasion || req.body?.cakeType;
      const validated = isCustomOrder
        ? validateCustomOrderInput(req.body)
        : validateContactInput(req.body);

      const result = await processEmailDispatch({
        type: isCustomOrder ? 'custom-order' : 'contact',
        ...validated,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  // 2. Contact Enquiry Endpoint (Rate-limited & Validated server-side)
  app.post('/api/contact', formSubmissionLimiter, async (req, res, next) => {
    try {
      const validated = validateContactInput(req.body);
      const result = await processEmailDispatch({ type: 'contact', ...validated });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  // 3. Custom Cake Enquiry Endpoint (Rate-limited & Validated server-side)
  app.post('/api/custom-order', formSubmissionLimiter, async (req, res, next) => {
    try {
      const validated = validateCustomOrderInput(req.body);
      const result = await processEmailDispatch({ type: 'custom-order', ...validated });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  // 4. Service Health Check (Minimal, safe production response - zero configuration disclosure)
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
    });
  });

  // API 404 handler: Any unknown /api/* endpoint returns safe JSON 404
  app.all('/api/*', (_req, res) => {
    return res.status(404).json({
      success: false,
      message: 'Not found.',
    });
  });

  /**
   * Centralized Express Error Handling Middleware (Security Checkpoint 7)
   * Registered AFTER all API routes and API 404 handler, but BEFORE frontend SPA handling.
   * - Enforces safe, uniform JSON errors for API clients.
   * - Never exposes stack traces, filesystem paths, environment variables, or SMTP details.
   * - Logs detailed technical information strictly server-side with structured metadata.
   */
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // 1. Client-Side Input Validation Failures (HTTP 400)
    if (err instanceof ServerValidationError || err.name === 'ServerValidationError' || (err.statusCode === 400 && err.errors)) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Please check the submitted information.',
        errors: err.errors || {},
      });
    }

    // 2. Rate Limiting Exceeded (HTTP 429)
    if (err instanceof RateLimitExceededError || err.statusCode === 429) {
      const resetSec = err.resetSeconds || 900;
      res.setHeader('Retry-After', String(resetSec));
      return res.status(429).json({
        success: false,
        message: err.message || 'Too many requests. Please try again later.',
      });
    }

    // 3. Upstream Email Delivery Failures (HTTP 502 / 503)
    if (err instanceof EmailDeliveryError || err.name === 'EmailDeliveryError') {
      const statusCode = err.statusCode === 503 ? 503 : 502;
      logTechnicalError('EMAIL_DELIVERY_FAILURE', req, statusCode, err.technicalDetails || err.message, err.stack);
      return res.status(statusCode).json({
        success: false,
        message: "We couldn't send your enquiry right now. Please try again later.",
      });
    }

    // 3. Known HTTP status code errors (4xx)
    if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 500) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message || 'Request could not be processed.',
      });
    }

    // 4. Unexpected Server-Side Failures (HTTP 500)
    logTechnicalError('UNEXPECTED_SERVER_ERROR', req, 500, err?.message || 'Unknown internal server error', err?.stack);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  });

  /**
   * Information Exposure & Sensitive File Protection (Security Checkpoint 9)
   * Strictly prevents access to server source files, source maps, environment configs,
   * dotfiles, build/package manifests, internal logs, and diagnostics across dev and prod.
   */
  const FORBIDDEN_STATIC_PATTERNS = [
    /^\/\.env(\..+)?$/i,
    /^\/\.git(\/.*)?$/i,
    /^\/(server|src\/server)\.(ts|js|cjs|mjs)$/i,
    /^\/server\.(cjs|cjs\.map|js|ts)$/i,
    /^\/.*\.map$/i,
    /^\/(package|package-lock|yarn|pnpm-lock|bun)\.(json|lock|yaml)$/i,
    /^\/(tsconfig|vite\.config|metadata)\.(json|ts|js)$/i,
    /^\/(debug|config|logs)(\/.*)?$/i,
    /^\/api\/(debug|test|dev|internal|admin|config|env|logs|status)(\/.*)?$/i,
  ];

  app.use((req, res, next) => {
    const requestPath = req.path;

    // In production, strictly forbid public access to /node_modules/
    if (isProduction && /^\/node_modules(\/.*)?$/i.test(requestPath)) {
      return res.status(404).json({ success: false, message: 'Not found.' });
    }

    // Reject dotfiles (e.g. /.env, /.git/config, etc.)
    // In development mode ONLY, permit Vite's pre-bundled dependency cache in /node_modules/.vite/
    const isDevViteCache = !isProduction && requestPath.startsWith('/node_modules/.vite/');
    if (/\/\.[^/]+/.test(requestPath) && !isDevViteCache) {
      return res.status(404).json({ success: false, message: 'Not found.' });
    }

    // Check against forbidden sensitive files, source files, and development endpoints
    for (const pattern of FORBIDDEN_STATIC_PATTERNS) {
      if (pattern.test(requestPath)) {
        return res.status(404).json({ success: false, message: 'Not found.' });
      }
    }

    next();
  });

  // Vite Middleware / Static Asset Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        dotfiles: 'ignore',
        index: false,
      })
    );
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return new Promise((resolve) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`MIRA & CRUMB server running on port ${PORT}`);
      resolve({ app, server });
    });
  });
}

if (process.env.AUTO_START !== 'false' && process.env.NODE_ENV !== 'test') {
  startServer();
}
