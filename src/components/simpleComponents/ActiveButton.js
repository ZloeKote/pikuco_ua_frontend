import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function ActiveButton({ children, isActive, onClick, ...rest }) {
  const classname = twMerge(
    classNames(
      "flex items-center justify-center border w-20 h-6",
      rest.className,
      {
        "border-[--dark-button-border-active]": isActive,
      },
    )
  );

  return (
    <button {...rest} onClick={onClick} className={classname}>
      {children}
    </button>
  );
}

export default ActiveButton;
