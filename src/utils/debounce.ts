export function debounce(func: () => any, delay = 1000) {
  let timer: number | null = null;
  return function(...args: any) {
    if (!timer) {
      func.apply(this, args);
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}
