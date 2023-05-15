export function throttle(func: () => void, delay = 1000) {
  let prev = Date.now();
  return function (...args: any) {
    if (Date.now() - prev >= delay) {
      func.apply(this, args);
      prev = Date.now();
    }
  };
}
