import React from "react";

export function useClock(initialDate: Date) {
  const [time, setTime] = React.useState<Date>(initialDate);

  React.useEffect(() => {
    setTime(initialDate);

    const interval = setInterval(() => {
      setTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialDate]);

  return time;
}
