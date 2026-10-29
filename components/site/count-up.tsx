"use client";

import { useEffect, useRef, useState } from "react";
import { parseCountValue } from "@/lib/utils";

/**
 * Animates the leading number of `value` ("2,000 kg", "20+") from 0 when it
 * scrolls into view. Non-numeric values are rendered as-is. The final value is
 * server-rendered so the figure is correct without JavaScript.
 */
export function CountUp({ value, duration = 1800 }: { value: string; duration?: number }) {
  const parsed = parseCountValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const { number, decimals, prefix, suffix } = parsed;
    const useGrouping = /\d,\d/.test(value);
    const fmt = (n: number) =>
      prefix +
      n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping }) +
      suffix;
    setDisplay(fmt(0));
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(fmt(number * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
