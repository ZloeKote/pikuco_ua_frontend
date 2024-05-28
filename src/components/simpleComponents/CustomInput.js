import { TextField } from "@mui/material";
import classNames from "classnames";

function CustomInput({ value, onChange, className, ...rest }) {
  const inputClassname = classNames(className);
  return (
    <TextField
      className={inputClassname}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}

export default CustomInput;
