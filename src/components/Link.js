import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function Link({ to, className, children, ...rest }) {
  const classname = twMerge(classNames(className));
  return (
    <NavLink {...rest} to={to + (rest.params || "")} className={classname}>
      {children}
    </NavLink>
  );
}

export default Link;
