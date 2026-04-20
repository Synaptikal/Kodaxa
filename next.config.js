/**
 * Minimal Next.js config for Kodaxa weekly audit auto-fix.
 * Adds `poweredByHeader: false` to reduce fingerprinting.
 * Note: Security headers intentionally NOT modified by this automated audit.
 */
/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
};
