// Click, then press a key combination to record a hotkey.
import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface HotkeyInputProps {
  value: string;
  onChange?: (key: string) => void;
  disabled?: boolean;
  className?: string;
}

export const HotkeyInput: React.FC<HotkeyInputProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Keep a stable ref for onChange so we don't recreate event listeners on every render
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        return;
      }

      const modifiers = [];
      if (e.ctrlKey) modifiers.push("Ctrl");
      if (e.shiftKey) modifiers.push("Shift");
      if (e.altKey) modifiers.push("Alt");

      const keyName = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      const newHotkey = [...modifiers, keyName].join("+");

      onChangeRef.current?.(newHotkey);
      setIsRecording(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsRecording(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isRecording]);

  return (
    <Button
      ref={buttonRef}
      disabled={disabled}
      onClick={() => setIsRecording(true)}
      className={cn(
        "flex items-center justify-center min-w-16 px-3 py-1.5 rounded-lg border border-b-3 border-app-border bg-app-bg text-xs font-bold shadow-sm select-none transition-all outline-none",
        isRecording
          ? "border-accent text-accent animate-pulse ring-1 ring-accent"
          : "text-app-text-primary hover:border-app-text-muted",
        disabled && "opacity-30 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {isRecording ? "Press key..." : value}
    </Button>
  );
};