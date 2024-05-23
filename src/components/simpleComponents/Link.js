import { NavLink } from "react-router-dom";

function Link({ to, state, className, children, disabled, ...rest }) {
  let link = (
    <NavLink {...rest} to={to + (rest.params || "")} state={state} className={className}>
      {children}
    </NavLink>
  );
  if (disabled) {
    link = (
      <span {...rest} className={className + " !text-gray-400 cursor-default"}>
        {children}
      </span>
    );
  }

  return link;
}

export default Link;
