import PropTypes from "prop-types";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { Button as MuiButton } from "@mui/material";

function Button({ children, primary, secondary, success, warning, danger, rounded, disabled, ...rest }) {
  const className = twMerge(
    classNames(
      "flex items-center justify-center border w-20 h-6",
      {
        "border-blue-400 bg-blue-600 text-white hover:bg-blue-500": primary && !disabled,
        "border-blue-700 bg-blue-800 text-white hover:cursor-no-drop": primary && disabled,
        "border-gray-400 bg-gray-600 text-white hover:bg-gray-500": secondary && !disabled,
        "border-gray-700 bg-gray-800 text-white hover:cursor-no-drop": secondary && disabled,
        "border-green-400 bg-green-600 text-white hover:bg-green-500": success && !disabled,
        "border-green-700 bg-green-800 hover:cursor-no-drop": success && disabled,
        "border-yellow-400 bg-yellow-600 hover:bg-yellow-500 text-white": warning && !disabled,
        "border-yellow-700 bg-yellow-800 text-white hover:cursor-no-drop": warning && disabled,
        "border-red-400 bg-red-600 text-white hover:bg-red-500": danger && !disabled,
        "border-red-700 bg-red-800 text-white hover:cursor-no-drop": danger && disabled,
        "rounded-full": rounded,
      },
      rest.className
    )
  );

  return (
    <MuiButton {...rest} disabled={disabled} className={className}>
      {children}
    </MuiButton>
    // <button {...rest} disabled={disabled} className={className}>
    //   {children}
    // </button>
  );
}

Button.propTypes = {
  children: PropTypes.string,
  checkButtonVariations: ({ primary, secondary, success, warning, danger }) => {
    const count =
      Number(!!primary) + Number(!!secondary) + Number(!!success) + Number(!!warning) + Number(!!danger);
    if (count > 1) {
      return new Error("Only one of button variations must be applied");
    }
  },
};

export default Button;
