export function debounce<T extends(...args: any[]) => any>(func: T, delay = 1000) {
  let timer: number | null = null;

  return function(...args: Parameters<T>) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      func.apply(this, args);
    }, delay);
  };
}
