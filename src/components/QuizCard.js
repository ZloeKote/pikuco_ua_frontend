import "../css/QuizCard.css";
import { useState } from "react";
import classNames from "classnames";
import Button from "./simpleComponents/Button";
import { BsFillPlayFill } from "react-icons/bs";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";
import Link from "./simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import { IconButton, Menu, Typography, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { IoMenu } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { BsTranslate } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const actionOptions = [
  { label: "Редагувати", to: "/quizzes/edit", icon: <BiEditAlt /> },
  { label: "Додати перевод", to: "/quizzes/translation/add", icon: <BsTranslate /> },
  { label: "Видалити", icon: <MdDelete /> },
];

function QuizCard({ quiz, showActions = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const classnames = classNames(
    "border-2 border-[--dark-quizcard-border] rounded-2xl",
    "w-[432px] h-[314px] bg-[--dark-quizcard-background]",
    "layout-quizcard relative"
  );

  const renderedActions = actionOptions.map((option) => {
    return (
      <MenuItem key={option.label} onClick={handleClose}>
        <ListItemIcon>{option.icon}</ListItemIcon>
        <ListItemText>{option.to ? <Link to={option.to}>{option.label}</Link> : option.label}</ListItemText>
      </MenuItem>
    );
  });

  return (
    <div className={classnames}>
      <Link className="quiz-cover" to={ROUTES.Quiz(quiz.pseudoId)}>
        <img className="rounded-t-2xl" src={quizCover} alt="cover" />
      </Link>

      <Button className="quizcard-playbutton w-full h-full self-end" success rounded>
        <Link to={ROUTES.PlayQuiz}>
          <BsFillPlayFill className="text-5xl" />
        </Link>
      </Button>

      <Link
        to={`/user/${quiz.creator.nickname.toLowerCase()}`}
        className="quizcard-creator z-10 mr-3 w-[120px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]"
      >
        <div className="flex items-center">
          <img src={avatar} alt="creator" className="h-7 mr-1" />
          <Tooltip title={<Typography>{quiz.creator.nickname}</Typography>} placement="bottom">
            <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[16px] italic">
              {quiz.creator.nickname}
            </span>
          </Tooltip>
        </div>
      </Link>

      <Link className="quizcard-content-layout rounded-b-2xl" to={ROUTES.Quiz(quiz.pseudoId)}>
        <div className="quizcard-content px-2 mt-11">
          <Tooltip
            title={<Typography>{quiz.title}</Typography>}
            placement="bottom-start"
            slotProps={{
              popper: {
                sx: {
                  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                    {
                      marginTop: "0px",
                    },
                },
              },
            }}
          >
            <div className="quizcard-content-title text-white text-[26px] pb-2 leading-none">
              {quiz.title}
            </div>
          </Tooltip>
          <div className="quizcard-content-desc text-[--dark-quizcard-description] text-[17px] leading-[1.1]">
            {quiz.description}
          </div>
        </div>
      </Link>

      {showActions && (
        <div className="absolute top-0 right-0">
          <IconButton
            id="long-button"
            aria-label="more"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            size="large"
            onClick={handleClick}
          >
            <IoMenu />
          </IconButton>
          <Menu
            MenuListProps={{ "aria-labelledby": "long-button" }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: "max-content",
                  backgroundColor: "var(--dark-quizcard-background)",
                  border: "1px solid var(--dark-quizcard-border)",
                  backgroundImage: "none",
                },
              },
            }}
            variant="menu"
          >
            {renderedActions}
          </Menu>
        </div>
      )}
    </div>
  );
}

export default QuizCard;
