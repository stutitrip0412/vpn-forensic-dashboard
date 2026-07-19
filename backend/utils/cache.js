/**
 * Minimal in-memory TTL cache used for GeoIP lookup caching (FR3.2).
 *
 * The PRD lists Redis as optional. This module intentionally exposes the
 * same shape a Redis-backed cache would (`get`/`set` with a TTL, async
 * even though the in-memory version doesn't need to be) so that swapping
 * this out for `ioredis` later means changing this file only — nothing
 * that calls `cache.get()`/`cache.set()` needs to change.
 *
 * Not suitable for multi-process deployments (each Node process has its
 * own cache) — that's exactly the case Redis would solve in production.
 */

const store = new Map(); // key -> { value, expiresAt }

async function get(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expiresAt !== null && Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

async function set(key, value, ttlSeconds = null) {
  store.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  });
}

function _clearAll() {
  // Test/debug helper only.
  store.clear();
}

module.exports = { get, set, _clearAll };
