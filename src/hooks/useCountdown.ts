import { onUnmounted, ref } from "vue";

export default function useCountdown(seconds: number) {
  const countdown = ref(0);
  const timer = ref<ReturnType<typeof setInterval>>();

  onUnmounted(() => {
    clearInterval(timer.value);
  });

  function start() {
    if (countdown.value > 0)
      console.warn("Countdown is already running");

    countdown.value = seconds;
    const startTime = Date.now();

    timer.value = setInterval(() => {
      const distance = Math.floor((Date.now() - startTime) / 1000);
      if ((seconds - distance) < 0) {
        clearInterval(timer.value);
      } else {
        countdown.value = seconds - distance;
      }
    }, 1000);
  }

  return {
    start,
    countdown
  };
}
