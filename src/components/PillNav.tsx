import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface PillItem<T extends string> {
  key: T;
  label: string;
}

interface PillNavProps<T extends string> {
  items: PillItem<T>[];
  activeKey: T;
  onChange: (key: React.SetStateAction<T>) => void;
}

export function PillNav<T extends string>({ items, activeKey, onChange }: PillNavProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = items.findIndex((i) => i.key === activeKey);
    const el = container.querySelectorAll<HTMLButtonElement>('button')[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const crect = container.getBoundingClientRect();
    setIndicator({ left: rect.left - crect.left, width: rect.width });
  }, [activeKey, items]);

  return (
    <div className="inline-flex items-center rounded-full border border-black/70 bg-black text-white p-1 shadow-[0_0_0_2px_#000]">
      <div ref={containerRef} className="relative flex gap-2">
        <motion.div
          className="absolute top-0 bottom-0 rounded-full bg-white"
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`relative z-10 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                active ? 'text-black' : 'text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
