import { Tooltip } from "@mui/material";
import classNames from "classnames";
import { BsInfoCircleFill } from "react-icons/bs";

function InfoIcon({ children, ...rest }) {
  const iconClassname = classNames(
    rest.className, 
    "hover:cursor-pointer hover:text-[--dark-quizcard-description]"
  );
  return (
    <div className={iconClassname}>
      <Tooltip title={children}>
        <span>
          <BsInfoCircleFill />
        </span>
      </Tooltip>
    </div>
  );
}

export default InfoIcon;
