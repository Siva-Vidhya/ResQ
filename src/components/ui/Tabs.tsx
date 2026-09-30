import React, { useRef } from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== index) {
      e.preventDefault();
      onChange(tabs[nextIndex].id);
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      className={`flex items-center gap-1.5 overflow-x-auto ${
        variant === 'pills'
          ? 'bg-navy-900/80 p-1.5 rounded-subtle border border-white/10'
          : 'border-b border-white/10'
      } ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={() => onChange(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold font-sans transition-all relative min-h-[44px] flex items-center gap-2 ${
                isActive ? 'text-aqua' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-aqua to-indigo-500 rounded-full" />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-2 rounded-md text-xs font-bold font-sans transition-all flex items-center gap-2 min-h-[44px] whitespace-nowrap ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
