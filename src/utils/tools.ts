function throttle(fn, delay = 1000): Function {
  let timer: any = null;
  return function () {
    let res = undefined;
    if (timer) return res;
    timer = setTimeout(() => {
      res = fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

function throttle2(fn, delay = 1000): Function {
  let p: Promise<any> | null = null;
  return async function () {
    if (!p) {
      p = new Promise((resolve) => {
        resolve(fn.apply(this, arguments));
      });
      let res = await p;
      p = null;
      return res;
    } else {
      return await p;
    }
  };
}

export { throttle, throttle2 };
