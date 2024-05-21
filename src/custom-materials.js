import { Tooltip } from "@mui/material";

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