export const defineExpire = (expire: any) => {
  if (expire === undefined) return false;
  return expire !== null && !isNaN(expire) && expire > 0;
};

