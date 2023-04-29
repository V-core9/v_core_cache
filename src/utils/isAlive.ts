// Check if the item is alive || Not expired yet/ever
export const isAlive = (ttl: boolean | number) =>
  !ttl || (typeof ttl === "number" && ttl > Date.now());

