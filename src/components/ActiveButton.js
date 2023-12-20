import { useState } from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function ActiveButton({ children, ...rest }) {
  const [isActive, setIsActive] = useState(false);
  const classname = twMerge(
    classNames(
      "flex items-center justify-center border w-20 h-6",
      rest.className,
      {
        "border-[--dark-button-border-active]": isActive,
      },
    )
  );

  const handleClickActive = () => {
    setIsActive(!isActive);
  }
  return (
    <button {...rest} onClick={handleClickActive} className={classname}>
      {children}
    </button>
  );
}

export default ActiveButton;
