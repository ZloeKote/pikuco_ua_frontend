import "../css/QuizCard.css";
import classNames from "classnames";
import Button from "./Button";
import { BsFillPlayFill } from "react-icons/bs";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";
import Link from "./Link";
import { ROUTES } from "../ROUTES";

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
      <div className="quizcard-creator flex items-center border border-[--dark-quizcard-border] w-[120px] h-fit rounded-full self-center mr-3 z-10 bg-[--dark-quizcard-background]">
        <img src={avatar} alt="creator" className="h-7 mr-2" />
        <span
          className="quizcard-creator-nickname text-[--dark-text] leading-none text-[16px] italic"
          title={quiz.creator.nickname}
        >
          {quiz.creator.nickname}
        </span>
      </div>
      <Link className="quizcard-content-layout rounded-b-2xl" to={ROUTES.Quiz(quiz.pseudoId)}>
        <div className="quizcard-content px-2 mt-11">
          <div className="quizcard-content-title text-white text-[26px] pb-2 leading-none" title={quiz.title}>
            {quiz.title}
          </div>
          <div className="quizcard-content-desc text-[--dark-quizcard-description] text-[17px] leading-[1.1]">
            {quiz.description}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default QuizCard;
