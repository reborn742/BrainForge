/**
 * Bounded, dependency-free fixed-window rate limiter.
 *
 * The previous implementation stored one Map entry per IP forever, so an
 * attacker rotating source addresses could grow it until the process ran out
 * of memory. This one purges expired windows and hard-caps the number of keys
 * (evicting the oldest first).
 */
export interface LimitDecision {
  allowed: boolean;
  retryAfterSec: number;
}

export class RateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();
  private lastPurge = 0;

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
    private readonly maxKeys = 10_000
  ) {}

  consume(key: string, now = Date.now()): LimitDecision {
    if (now - this.lastPurge > this.windowMs) this.purge(now);

    const entry = this.hits.get(key);
    if (!entry || now >= entry.resetAt) {
      this.hits.delete(key); // re-insert at the end => newest
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      this.enforceCap();
      return { allowed: true, retryAfterSec: 0 };
    }

    if (entry.count >= this.max) {
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
    }
    entry.count++;
    return { allowed: true, retryAfterSec: 0 };
  }

  get size(): number {
    return this.hits.size;
  }

  private purge(now: number): void {
    this.lastPurge = now;
    for (const [k, v] of this.hits) if (now >= v.resetAt) this.hits.delete(k);
  }

  private enforceCap(): void {
    while (this.hits.size > this.maxKeys) {
      const oldest = this.hits.keys().next().value;
      if (oldest === undefined) break;
      this.hits.delete(oldest);
    }
  }
}

/** Daily counter (UTC) used as a hard ceiling on paid LLM calls. */
export class DailyBudget {
  private day = '';
  private used = 0;

  constructor(private readonly limit: number) {}

  tryConsume(now = new Date()): boolean {
    const day = now.toISOString().slice(0, 10);
    if (day !== this.day) {
      this.day = day;
      this.used = 0;
    }
    if (this.used >= this.limit) return false;
    this.used++;
    return true;
  }
}

/**
 * Collapse an IP to a rate-limit key. IPv6 clients usually own a whole /64, so
 * keying on the full address would let one machine rotate through 2^64 keys.
 */
export function ipKey(ip: string | undefined): string {
  if (!ip) return 'unknown';
  let addr = ip.trim().toLowerCase();
  const mapped = addr.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return mapped[1];
  if (!addr.includes(':')) return addr;

  const zone = addr.indexOf('%');
  if (zone !== -1) addr = addr.slice(0, zone);

  let groups: string[];
  if (addr.includes('::')) {
    const [head, tail] = addr.split('::');
    const h = head ? head.split(':') : [];
    const t = tail ? tail.split(':') : [];
    groups = [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  } else {
    groups = addr.split(':');
  }
  return groups.slice(0, 4).map((g) => g.padStart(4, '0')).join(':') + '::/64';
}
