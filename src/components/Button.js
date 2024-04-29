import PropTypes from "prop-types";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function Button({ children, primary, secondary, success, warning, danger, rounded, disabled, ...rest }) {
  const className = twMerge(classNames("flex items-center justify-center border w-20 h-6", {
    "border-blue-400 bg-blue-600 text-white hover:bg-blue-500": primary,
    "border-gray-400 bg-gray-600 text-white": secondary,
    "border-green-500 bg-green-700 text-white hover:bg-green-600": success && !disabled,
    "border-green-700 bg-green-800 hover:cursor-no-drop": success && disabled,
    "border-yellow-400 bg-yellow-600 text-white": warning,
    "border-red-400 bg-red-600 text-white hover:bg-red-500": danger,
    "rounded-full": rounded,
  }, rest.className));

  return (
    <button {...rest} disabled={disabled} className={className}>
      {children}
    </button>
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
