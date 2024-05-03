import { useState } from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function Input({ className, width, height, type, value, onChange, innerRef, ...rest}) {
  const [inputText, setInputText] = useState("");

  const classname = twMerge(
    classNames(
      className,
      "text-white pl-[10px] pr-[10px]",
      "border border-[--dark-quizcard-border] rounded-2xl",
      "bg-[--dark-quizcard-background]",
      "hover:bg-[--dark-quizcard-background-hover] focus:bg-[--dark-quizcard-background-hover]"
    )
  );

  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };

  return (
    <input
      className={classname}
      type={type || "text"}
      value={value ? value : inputText}
      onChange={onChange ? onChange : handleChangeInput}
      ref={innerRef}
      {...rest}
    />
  );
}

export default Input;
