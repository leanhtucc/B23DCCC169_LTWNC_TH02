import { useEffect, useState } from "react";

export function useToday() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const now = new Date();

      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      timer = setTimeout(() => {
        setToday(new Date());
        schedule();
      }, tomorrow.getTime() - now.getTime());
    };

    schedule();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setToday(new Date());
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearTimeout(timer);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return today;
}
