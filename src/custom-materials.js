import { Tooltip } from "@mui/material";
import "./css/WishlistIcon.css";
import classNames from "classnames";

export const RedAsterisk = (
  <Tooltip
    title="Обов'язкове поле"
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -14],
            },
          },
        ],
      },
    }}
  >
    <span className="bold text-red-600">*</span>
  </Tooltip>
);

export const WishlistIcon = ({ title, wishlisted = false, onClick, disabled, className }) => {
  const wishlistClassname = classNames(className, "bookmark");
  return (
    <Tooltip title={title} enterDelay={400}>
      <label className="ui-bookmark" >
        <input type="checkbox" checked={wishlisted} onChange={onClick} disabled={disabled}/>
        <div className={wishlistClassname}>
          <svg viewBox="0 0 16 16" className="bi bi-heart-fill ">
            <path
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
      </label>
    </Tooltip>
  );
};
