export function throttle(fn: (...args: any[]) => void, ms: number) {
  let handler: number | undefined;
  let lastArgs: unknown[] = [];
  return function throttleReturn(...args: unknown[]) {
    if (handler) {
      lastArgs = args;
      return;
    }
    handler = setTimeout(() => {
      clearTimeout(handler);
      handler = undefined;
      if (!lastArgs.length) return;
      const arg = lastArgs;
      lastArgs = [];
      throttleReturn(...arg);
    }, ms);
    return fn(...args);
  };
}
