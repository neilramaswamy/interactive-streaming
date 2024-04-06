const IS_DEV = false;

/**
 * A utility to construct a delay across development and production modes.
 */
export const d = (delay: number): number => {
  // 5x faster in dev
  return IS_DEV ? delay / 5 : delay;
};
