export function padZero(n) {
  return String(n).padStart(2, "0");
}

export function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    expired: ms <= 0,
  };
}

/**
 * Resolve the shop hostname from the Liquid data-attribute or Shopify global.
 */
export function getShopDomain(rootEl) {
  // 1. From Liquid data attribute (most reliable)
  const fromAttr = rootEl?.dataset?.shop;
  if (fromAttr) return fromAttr;

  // 2. From Shopify global
  if (typeof Shopify !== "undefined" && Shopify.shop) {
    return Shopify.shop;
  }

  // 3. Fallback to hostname
  return window.location.hostname;
}
