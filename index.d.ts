export interface InitProps {
  cleanInterval?: number,
  expires?: number,
}

export interface CacheItem {
  key: string | number, // cache item key
  value: any, // value to cache
  exp: number | undefined, // expires in milliseconds
}