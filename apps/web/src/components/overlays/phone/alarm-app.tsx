"use client";

import { useState } from "react";
import { useAlarms } from "@/hooks/use-alarm";

/**
 * 手機裡的鬧鐘 App。
 * UI 已完成;真正的鬧鐘邏輯(排程/提醒/持久化)在 src/hooks/use-alarm.ts 留了洞給你實作。
 */
export function AlarmApp() {
  const { alarms, toggleAlarm, addAlarm, removeAlarm } = useAlarms();
  const [adding, setAdding] = useState(false);
  const [time, setTime] = useState("08:00");
  const [label, setLabel] = useState("");

  const submit = () => {
    addAlarm(time, label);
    setAdding(false);
    setLabel("");
  };

  return (
    <div className="flex h-full flex-col p-5 text-white">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">鬧鐘</h2>
        <button
          type="button"
          aria-label="新增鬧鐘"
          onClick={() => setAdding((v) => !v)}
          className="grid size-8 place-items-center rounded-full bg-[#7c9ef8] text-lg font-bold transition hover:brightness-110"
        >
          {adding ? "×" : "+"}
        </button>
      </header>

      {adding && (
        <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-white/10 p-3">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-lg bg-black/30 px-3 py-2 text-2xl font-bold tabular-nums outline-none"
          />
          <input
            type="text"
            placeholder="鬧鐘名稱"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-lg bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-[#7c9ef8] py-2 text-sm font-bold transition hover:brightness-110"
          >
            加入
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-2 overflow-auto">
        {alarms.map((alarm) => (
          <li
            key={alarm.id}
            className="group flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
          >
            <div className={alarm.enabled ? "" : "opacity-40"}>
              <p className="text-2xl font-bold tabular-nums">{alarm.time}</p>
              <p className="text-xs text-white/60">{alarm.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`刪除 ${alarm.label}`}
                onClick={() => removeAlarm(alarm.id)}
                className="text-xs text-white/25 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
              >
                刪除
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={alarm.enabled}
                aria-label={`${alarm.label} 開關`}
                onClick={() => toggleAlarm(alarm.id)}
                className={`h-7 w-12 rounded-full p-1 transition ${
                  alarm.enabled ? "bg-[#28c840]" : "bg-white/15"
                }`}
              >
                <span
                  className={`block size-5 rounded-full bg-white transition ${
                    alarm.enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-4 text-center text-[10px] leading-relaxed text-white/30">
        ⏰ 排程與提醒邏輯預留在 <code className="text-white/50">hooks/use-alarm.ts</code>
      </p>
    </div>
  );
}
