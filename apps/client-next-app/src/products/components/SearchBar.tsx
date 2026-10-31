"use client";

import TextInput from "@/src/imports/controls/TextInput";

export default function SearchBarComponent() {
  return (
    <div className="px-6 pt-6 w-full bg-bg-light">
      <div className="mx-auto max-w-xl">
        <TextInput
          onEnter={() => {}}
          onChange={() => {}}
          placeHolder={"Search our Products"}
        ></TextInput>
      </div>
    </div>
  );
}
