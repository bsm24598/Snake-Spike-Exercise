// I was unable to get my custom hook to work properly for this exercise and had to refer to Dan Abramov's custom hook.  
// Custom Hook by Dan Abramov - Citation: https://github.com/weibenfalk/react-snake-starter-files
import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}