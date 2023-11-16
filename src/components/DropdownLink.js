import classNames from "classnames";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

function DropdownLink({ options, children, NotDefaultOpening, isOpenExt, to, ...rest }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  const listClassName = classNames(
    "whitespace-nowrap  bg-[--dark-dropdown-background]",
    "border border-[--dark-link-background-hover] rounded-md"
  );
  const linkClassName = classNames(
    "hover:bg-[--dark-link-background-hover]",
    "border-b-[1px] border-[--dark-link-background-hover]",
    "px-2 py-1 last:border-0"
  );
  const titleClassName = classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md px-2 flex");

  const renderedOptions = options.map((option) => {
    return (
      <div className={linkClassName} key={option.label}>
        <Link onClick={handleClose} className="block" to={option.to}>
          {option.label}
        </Link>
      </div>
    );
  });

  let defaultOpening = null;
  let DropdownTitle = (
    <div className={titleClassName}>
      {children}
      {isOpen || isOpenExt ? (
        <GoChevronUp className="self-center" />
      ) : (
        <GoChevronDown className="self-center" />
      )}
    </div>
  );
  if (!NotDefaultOpening && true) {
    defaultOpening = { onMouseEnter: handleOpen, onMouseLeave: handleClose };
  }

  if (to) {
    DropdownTitle = (
      <Link className={titleClassName} to={to}>
        {children}
        {isOpen || isOpenExt ? (
          <GoChevronUp className="self-center" />
        ) : (
          <GoChevronDown className="self-center" />
        )}
      </Link>
    );
  }

  return (
    <div {...defaultOpening} {...rest} className="relative">
      {DropdownTitle}
      {(isOpen || isOpenExt) && (
        <div className="absolute pt-2">
          <div className={listClassName}>{renderedOptions}</div>
        </div>
      )}
    </div>
  );
}

export default DropdownLink;
