// cb: (elapsedTime: number) => void
export default function getCounter(cb) {
  let startTime = 0;
  let token = undefined;

  const isRunning = () => token !== undefined;
  const getState = () => ({
    isRunning: isRunning(),
    elapsedTime: (token !== undefined ? Date.now() : 0) - startTime,
  });

  const refresh = () => {
    cb(Date.now() - startTime);
    token = requestAnimationFrame(refresh);
  };

  const events = {
    start: () => {
      if (isRunning()) return;
      startTime += Date.now();
      refresh();
    },
    stop: () => {
      if (!isRunning()) return;
      startTime -= Date.now();
      cancelAnimationFrame(token);
      token = undefined;
    },
    reset: () => {
      if (isRunning() || startTime === 0) return;
      startTime = 0;
      cb(0);
    },
  };

  function dispatch(event) {
    (events[event] || Function.prototype)();
  }

  return [getState, dispatch];
}
