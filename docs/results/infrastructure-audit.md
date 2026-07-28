# Infrastructure Audit

Generated: 2026-07-22

## Registry Rate Limiting

- CDN edge rate limits: 100 req/min per IP
- 429 response with Retry-After header
- CLI consumers should respect Retry-After and implement exponential backoff

## CDN Configuration

- Static assets served via edge CDN
- Cache-Control: public, max-age=31536000, immutable (for versioned tarballs)
- Registry index: max-age=300 (5 min TTL)
