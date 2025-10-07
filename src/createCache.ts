import V_Core_Cache from "./V_Core_Cache";
import type { InitProps } from "./V_Core_Cache";

export const createCache = (props: InitProps): V_Core_Cache =>
  new V_Core_Cache(props);
