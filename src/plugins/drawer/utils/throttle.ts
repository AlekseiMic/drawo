export function throttle(fn: (...args: any[]) => void, ms: number) {
  let handler: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: unknown[] = [];
  return function throttleReturn(...args: unknown[]) {
    lastArgs = args;
    if (handler) {
      return;
    }
    handler = setTimeout(() => {
      clearTimeout(handler);
      handler = undefined;
      fn(...lastArgs);
      lastArgs = [];
    }, ms);
    return fn(...args);
  };
}
