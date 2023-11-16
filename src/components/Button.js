import PropTypes from "prop-types";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function Button({ children, primary, secondary, success, warning, danger, rounded, ...rest }) {
  const className = twMerge(classNames("flex items-center justify-center border w-20 h-6", {
    "border-blue-300 bg-blue-500 text-white": primary,
    "border-gray-400 bg-gray-600 text-white": secondary,
    "border-green-300 bg-green-500 text-white hover:bg-green-400": success,
    "border-yellow-400 bg-yellow-600 text-white": warning,
    "border-red-300 bg-red-500 text-white": danger,
    "rounded-full": rounded,
  }, rest.className));

  return (
    <button {...rest} className={className}>
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
