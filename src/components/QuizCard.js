import "../css/QuizCard.css";
import { useState, memo } from "react";
import classNames from "classnames";
import { BsFillPlayFill, BsTranslate } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { IoMenu, IoClose } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";
import placeholderCover from "../img/placeholderCover.png";
import Link from "./simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import { IconButton, Menu, Typography, MenuItem, ListItemText, CircularProgress } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { IconMenuItem, NestedMenuItem } from "mui-nested-menu";
import { iso6393 } from "iso-639-3";
import GeneratedUserAvatar from "./simpleComponents/GeneratedUserAvatar";
import Button from "./simpleComponents/Button";

function QuizCard({ quiz, showActions = false, onDelete, isLoadingDeleting }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpened, setConfirmOpened] = useState(false);
  const open = Boolean(anchorEl);
  const isCreatorDeleted = quiz.creator.nickname.startsWith("[deleted-");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setConfirmOpened(false);
  };

  const handleClickOpenConfirmDeleting = () => setConfirmOpened(true);
  const deleteQuiz = () => {
    setConfirmOpened(false);
    onDelete(quiz.pseudoId);
  };

  const classnames = classNames(
    "border-2 border-[--dark-quizcard-border] rounded-2xl",
    "w-[432px] h-[314px] bg-[--dark-quizcard-background]",
    "layout-quizcard relative"
  );

  const playbuttonClassname = classNames(
    "quizcard-playbutton flex items-center justify-center",
    "w-full h-full self-end rounded-full",
    "border-green-400 bg-green-600 text-white hover:bg-green-500"
  );

  const deletingConfirmationClassname = classNames(
    "flex flex-col gap-2 p-2",
    "absolute h-fit w-[300px] z-30 right-[0%]",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "bg-[--dark-dropdown-background] text-[length:var(--desktop-body-text-size)]",
    `${confirmOpened ? "" : "hidden"}`
  );

  return (
    <div className={classnames}>
      <Link className="quiz-cover" to={ROUTES.Quiz(quiz.pseudoId)}>
        <img
          className="rounded-t-2xl h-full w-full object-cover"
          src={quiz.cover || placeholderCover}
          alt="cover"
        />
      </Link>

      <div className={playbuttonClassname}>
        <Link to={ROUTES.PlayQuiz(quiz.pseudoId) + `?lang=${quiz.language}`}>
          <BsFillPlayFill className="text-5xl" />
        </Link>
      </div>

      {isCreatorDeleted ? (
        <div className="quizcard-creator-deleted z-10 mr-3 w-[150px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]">
          <div className="flex items-center">
            <ImCross className="h-7 w-12 mr-1 bg-lime-300 rounded-full text-red-600" />
            <Tooltip title={<Typography>{quiz.creator.nickname}</Typography>} placement="bottom">
              <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[16px] italic">
                {quiz.creator.nickname}
              </span>
            </Tooltip>
          </div>
        </div>
      ) : (
        <Link
          to={`/user/${quiz.creator.nickname.toLowerCase()}`}
          className="quizcard-creator z-10 mr-3 w-[150px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]"
        >
          <div className="flex items-center">
            <GeneratedUserAvatar
              username={quiz.creator.nickname}
              saturation="60"
              className="h-7 mr-1 bg-lime-300 rounded-full"
            />
            <Tooltip title={<Typography>{quiz.creator.nickname}</Typography>} placement="bottom">
              <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[16px] italic">
                {quiz.creator.nickname}
              </span>
            </Tooltip>
          </div>
        </Link>
      )}

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
        <div className="absolute top-1 right-1">
          <IconButton
            id="long-button"
            aria-label="more"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            size="medium"
            onClick={handleClick}
            sx={{
              backgroundColor: "var(--dark-background-quiz-card-menu-button)",
              "&:hover": { backgroundColor: "var(--dark-background-quiz-card-menu-button-hover)" },
            }}
          >
            {anchorEl === null ? <IoMenu /> : <IoClose />}
          </IconButton>
          <div>
            <Menu
              MenuListProps={{ "aria-labelledby": "long-button" }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              variant="menu"
              sx={{ zIndex: 10 }}
            >
              <Link to={ROUTES.EditQuiz} state={{ pseudoId: quiz.pseudoId }}>
                <IconMenuItem leftIcon={<BiEditAlt />} label="Редагувати" />
              </Link>
              <Link
                to={ROUTES.CreateQuizTranslation}
                state={{ pseudoId: quiz.pseudoId }}
                disabled={quiz.isRoughDraft}
                className="!text-white"
              >
                <IconMenuItem
                  leftIcon={<BsTranslate />}
                  label="Додати переклад"
                  disabled={quiz.isRoughDraft}
                />
              </Link>
              <NestedMenuItem
                leftIcon={<BsTranslate />}
                rightIcon={<FaChevronRight />}
                label="Редагувати переклад"
                parentMenuOpen={open}
                disabled={quiz.languages.length < 2}
              >
                {quiz.languages.slice(1).map((lang) => {
                  return (
                    <Link
                      to={ROUTES.EditQuizTranslation}
                      state={{ pseudoId: quiz.pseudoId, language: lang }}
                      key={lang}
                    >
                      <MenuItem>
                        <ListItemText>
                          {iso6393.find((isoLang) => isoLang.iso6391 === lang)?.name}
                        </ListItemText>
                      </MenuItem>
                    </Link>
                  );
                })}
              </NestedMenuItem>
              <IconMenuItem
                onClick={() => (isLoadingDeleting ? undefined : handleClickOpenConfirmDeleting())}
                className="hover:!bg-red-600"
                leftIcon={isLoadingDeleting ? <CircularProgress size={20} /> : <MdDelete />}
                label="Видалити"
              />
            </Menu>
            {/* Deleting quiz confirmation */}
            <div className={deletingConfirmationClassname}>
              <span>Ви дійсно хочете видалити вікторину?</span>
              <Button
                className="self-end"
                sx={{"fontWeight": 600}}
                size="small"
                color="error"
                variant="contained"
                onClick={deleteQuiz}
              >
                Видалити
              </Button>
            </div>
          </div>
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
