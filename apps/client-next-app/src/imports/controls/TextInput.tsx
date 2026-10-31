"use client";
import React, { useState } from "react";

interface TextInputProps {
  onEnter: (text: string) => void;
  onChange: (text: string) => void;
  onBlur?: () => void;
  placeHolder: string;
}

export default function TextInput(props: TextInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    props.onChange(nextValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!inputValue.trim()) return;
      props.onEnter(inputValue.trim());
      setInputValue("");
    }
    if (event.key == "Escape") {
      setInputValue("");
      props.onBlur?.();
    }
  };

  return (
    <input
      type="text"
      placeholder={props.placeHolder}
      className="p-1 pl-3 border-2 border-blue-300 w-full rounded-lg focus:outline-none focus:border-blue-500  text-primary transition-colors"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => props.onBlur?.()}
      inputMode="text"
      enterKeyHint="enter"
    />
  );
}
