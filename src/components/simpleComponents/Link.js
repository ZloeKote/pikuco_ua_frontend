import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function Link({ to, state, className, children, ...rest }) {
  const classname = twMerge(classNames(className));

  return (
    <NavLink {...rest} to={to + (rest.params || "")} state={state} className={classname}>
      {children}
    </NavLink>
  );
}

export default Link;
