import { useState, useEffect, useRef } from "react";
import { FcCollapse, FcExpand } from "react-icons/fc";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function Dropdown({ options, onChange, value, className, param }) {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef();
  const layoutClassname = twMerge(
    classNames("w-48 relative", className, `${!isOpen || "bg-[--dark-quizcard-background-hover]"}`)
  );
  const optionsClassname = classNames(
    "absolute mt-1 w-full",
    "border border-[--dark-quizcard-background-hover]",
    "bg-[--dark-quizcard-background] rounded"
  );
  const optionClassname = classNames(
    "hover:bg-[--dark-quizcard-background-hover] cursor-pointer pl-[10px] pr-[10px]",
    "border-b-[1px] border-[--dark-link-background-hover] last:border-0"
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option) => {
    setIsOpen(false);
    onChange(option);
  };

  useEffect(() => {
    const handler = (event) => {
      if (!divEl.current) return;

      if (!divEl.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  let renderedOptions;
  if (param !== null) {
    renderedOptions = options.map((option) => {
      return (
        <div
          className={optionClassname + " block"}
          onClick={() => handleOptionClick(option)}
          key={option.value}
        >
          {option.label}
        </div>
      );
    });
  } else {
    renderedOptions = options.map((option) => {
      return (
        <div className={optionClassname} onClick={() => handleOptionClick(option)} key={option.value}>
          {option.label}
        </div>
      );
    });
  }

  return (
    <div ref={divEl} className={layoutClassname}>
      <div
        className="flex justify-between items-center cursor-pointer pl-[10px] pr-[10px]"
        onClick={handleClick}
      >
        {value?.label || "Select..."}
        {isOpen ? <FcExpand className="text-lg" /> : <FcCollapse className="text-lg" />}
      </div>
      {isOpen && <div className={optionsClassname}>{renderedOptions}</div>}
    </div>
  );
}

export default Dropdown;
