import classNames from "classnames";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { twMerge } from "tailwind-merge";

function DropdownLink({ options, children, onClick, isOpenExt, to, titleClassName, ...rest }) {
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
    "border-b-[1px] border-[--dark-link-background-hover]",
    "px-2 py-1 last:border-0"
  );
  const layoutClassName = twMerge(classNames("relative z-30", rest.className));
  const titleClassNames = twMerge(
    classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md flex", titleClassName)
  );

  const renderedOptions = options.map((option) => {
    return (
      <div className={linkClassName} key={option.label}>
        <Link
          onClick={option.handleClick ? option.handleClick : handleClose}
          className="block"
          to={option.to}
        >
          {option.label}
        </Link>
      </div>
    );
  });

  let defaultOpening = null;
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
  if (onClick) {
    defaultOpening = { onClick: handleClick };
  } else {
    defaultOpening = { onMouseEnter: handleOpen, onMouseLeave: handleClose };
  }

  if (to) {
    if (onClick) {
      DropdownTitle = (
        <div className={titleClassNames}>
          <Link to={to}>{children}</Link>
          {isOpen || isOpenExt ? (
            <GoChevronUp className="self-center cursor-pointer" />
          ) : (
            <GoChevronDown className="self-center cursor-pointer" />
          )}
        </div>
      );
    } else {
      DropdownTitle = (
        <Link className={titleClassNames} to={to}>
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
        <div className="absolute pt-2 min-w-full">
          <div className={listClassName}>{renderedOptions}</div>
        </div>
      )}
    </div>
  );
}

export default DropdownLink;
