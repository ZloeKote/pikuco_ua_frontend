import classNames from "classnames";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { twMerge } from "tailwind-merge";

function DropdownLink({
  options,
  children,
  onClick,
  OnClickTitle,
  isOpenExt,
  to,
  titleClassName,
  position = "left",
  itemBordered = false,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleClick = () => setIsOpen(!isOpen);

  const listClassName = classNames(
    "whitespace-nowrap  bg-[--dark-dropdown-background]",
    "border border-[--dark-link-background-hover] rounded-md"
  );
  const linkClassName = classNames(
    "hover:bg-[--dark-link-background-hover]",
    itemBordered && "border-b-[1px] border-[--dark-link-background-hover] last:border-0",
    "px-2 py-1"
  );
  const layoutClassName = twMerge(classNames("relative z-30", rest.className));
  const titleClassNames = twMerge(
    classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md flex", titleClassName)
  );

  const renderedOptions = options.map((option) => {
    return (
      <div className={linkClassName + " " + option.className} key={option.label}>
        <Link
          onClick={() => {
            setIsOpen(false);
            if (option.handleClick) option.handleClick();
          }}
          className="block"
          to={option.to + (option.param || "")}
        >
          {option.label}
        </Link>
      </div>
    );
  });

  let defaultOpening = null;
  if (onClick) {
    defaultOpening = { onClick: handleClick };
  } else {
    defaultOpening = { onMouseEnter: handleOpen, onMouseLeave: handleClose };
  }

  let DropdownTitle = (
    <div className={titleClassNames}>
      {children}
      {isOpen || isOpenExt ? (
        <GoChevronUp className="self-center" />
      ) : (
        <GoChevronDown className="self-center" />
      )}
    </div>
  );
  if (to) {
    if (onClick) {
      DropdownTitle = (
        <div className={titleClassNames}>
          <Link to={to} onClick={OnClickTitle ?? null}>
            {children}
          </Link>
          {isOpen || isOpenExt ? (
            <GoChevronUp className="self-center cursor-pointer" />
          ) : (
            <GoChevronDown className="self-center cursor-pointer" />
          )}
        </div>
      );
    } else {
      DropdownTitle = (
        <Link className={titleClassNames} to={to} onClick={OnClickTitle ?? null}>
          {children}
          {isOpen || isOpenExt ? (
            <GoChevronUp className="self-center" />
          ) : (
            <GoChevronDown className="self-center" />
          )}
        </Link>
      );
    }
  }

  return (
    <div {...defaultOpening} {...rest} className={layoutClassName}>
      {DropdownTitle}
      {(isOpen || isOpenExt) && (
        <div className={`absolute pt-2 min-w-full ${position === "right" && "right-0"}`}>
          <div className={listClassName}>{renderedOptions}</div>
        </div>
      )}
    </div>
  );
}

export default DropdownLink;
