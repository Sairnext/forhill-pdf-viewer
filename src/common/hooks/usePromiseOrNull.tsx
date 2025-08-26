import { useEffect, useState } from "react";

export function usePromiseOrNull<T>(
  promise: Promise<T> | null | undefined,
): T | null {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    let cancelled = false;
    setValue(null);

    if (promise) {
      promise
        .then((res) => {
          if (!cancelled) setValue(res);
        })
        .catch(() => {
          if (!cancelled) setValue(null);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [promise]);

  return value;
}
