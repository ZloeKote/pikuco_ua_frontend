import "../css/QuizCard.css";
import { useState, useEffect, memo } from "react";
import classNames from "classnames";
import Button from "./simpleComponents/Button";
import { BsFillPlayFill } from "react-icons/bs";
import placeholderCover from "../img/placeholderCover.png";
import Link from "./simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import { IconButton, Menu, Typography, MenuItem, ListItemText } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { IoMenu, IoClose } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { BsTranslate } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";
import { IconMenuItem, NestedMenuItem } from "mui-nested-menu";
import { iso6393 } from "iso-639-3";
import GeneratedUserAvatar from "./simpleComponents/GeneratedUserAvatar";

function QuizCard({ quiz, showActions = false, onDelete }) {
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

  return (
    <div className={classnames}>
      <Link className="quiz-cover" to={ROUTES.Quiz(quiz.pseudoId)}>
        <img className="rounded-t-2xl h-full w-full object-cover" src={quiz.cover || placeholderCover} alt="cover" />
      </Link>

      <Button className="quizcard-playbutton w-full h-full self-end" success rounded>
        <Link to={ROUTES.PlayQuiz(quiz.pseudoId) + `?lang=${quiz.language}`}>
          <BsFillPlayFill className="text-5xl" />
        </Link>
      </Button>

      <Link
        to={`/user/${quiz.creator.nickname.toLowerCase()}`}
        className="quizcard-creator z-10 mr-3 w-[120px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]"
      >
        <div className="flex items-center">
          <GeneratedUserAvatar username={quiz.creator.nickname} saturation="60" className="h-7 mr-1 bg-lime-300 rounded-full"/>
          {/* <img src={avatar} alt="creator" className="h-7 mr-1" /> */}
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
            {anchorEl === null ? <IoMenu /> : <IoClose />}
          </IconButton>
          <Menu
            MenuListProps={{ "aria-labelledby": "long-button" }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            variant="menu"
          >
            <IconMenuItem
              leftIcon={<BiEditAlt />}
              label={
                <Link to={ROUTES.EditQuiz} state={{ pseudoId: quiz.pseudoId }}>
                  Редагувати
                </Link>
              }
            />
            <IconMenuItem
              leftIcon={<BsTranslate />}
              label={
                <Link to={ROUTES.CreateQuizTranslation} state={{ pseudoId: quiz.pseudoId }}>
                  Додати переклад
                </Link>
              }
              
              disabled={quiz.isRoughDraft}
            />
            <NestedMenuItem
              leftIcon={<BsTranslate />}
              rightIcon={<FaChevronRight />}
              label="Редагувати переклад"
              parentMenuOpen={open}
              disabled={quiz.languages.length < 2}
            >
              {quiz.languages.slice(1).map((lang) => {
                return (
                  <MenuItem onClick={handleClose} key={lang}>
                    <ListItemText>
                      <Link
                        to={ROUTES.EditQuizTranslation}
                        state={{ pseudoId: quiz.pseudoId, language: lang }}
                      >
                        {iso6393.find((isoLang) => isoLang.iso6391 === lang)?.name}
                      </Link>
                    </ListItemText>
                  </MenuItem>
                );
              })}
            </NestedMenuItem>
            <IconMenuItem
              onClick={() => onDelete(quiz.pseudoId)}
              className="hover:!bg-red-600"
              leftIcon={<MdDelete />}
              label="Видалити"
            />
          </Menu>
        </div>
      )}

      {quiz.isRoughDraft && (
        <div className="absolute h-min w-[160px] flex justify-end bg-[--dark-quizcard-background] left-0 top-5 rounded-r-full">
          <span className="select-none text-red-500 text-[22px] mr-3">ЧЕРНЕТКА</span>
        </div>
      )}
    </div>
  );
}

export default memo(QuizCard);

// дизайн меню дій
// slotProps={{
//   paper: {
//     style: {
//       maxHeight: "max-content",
//       backgroundColor: "var(--dark-quizcard-background)",
//       border: "1px solid var(--dark-quizcard-border)",
//       backgroundImage: "none",
//     },
//   },
// }}
