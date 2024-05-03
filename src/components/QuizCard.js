import "../css/QuizCard.css";
import classNames from "classnames";
import Button from "./simpleComponents/Button";
import { BsFillPlayFill } from "react-icons/bs";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";
import Link from "./simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import { Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

function QuizCard({ quiz }) {
  const classnames = classNames(
    "border-2 border-[--dark-quizcard-border] rounded-2xl",
    "w-[432px] h-[314px] bg-[--dark-quizcard-background]",
    "layout-quizcard"
  );
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

      <Link to={`/user/${quiz.creator.nickname.toLowerCase()}`} className="quizcard-creator z-10 mr-3 w-[120px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]">
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
    </div>
  );
}

export default QuizCard;
