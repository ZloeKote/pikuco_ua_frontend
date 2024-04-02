import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Input from "./Input";

function PasswordInput({value, onChange, ...rest }) {
  const [visible, setVisible] = useState(false);

  const handleClickVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="relative">
      <Input value={value} onChange={onChange} type={visible ? "text" : "password"} {...rest} />
      <button type="button"
        className="absolute top-[50%] translate-y-[-50%] right-[1rem] text-[26px] rounded-2xl p-1 hover:bg-[--dark-link-background-hover]"
        onClick={handleClickVisibility}
      >
        {visible ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default PasswordInput;
