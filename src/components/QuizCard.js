import "../css/QuizCard.css";
import classNames from "classnames";
import Button from "./Button";
import { BsFillPlayFill } from "react-icons/bs";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";

function QuizCard({ quiz }) {
  const classnames = classNames(
    "border-2 border-[--dark-quizcard-border] rounded-2xl",
    "w-[432px] h-[314px] bg-[--dark-quizcard-background]",
    "layout-quizcard"
  );

  return (
    <div className={classnames}>
      <img className="rounded-t-2xl quiz-cover" src={quizCover} alt="cover" />
      <Button className="quizcard-playbutton w-full h-full self-end" success rounded>
        <BsFillPlayFill className="text-5xl" />
      </Button>
      <div className="quizcard-creator flex items-center border border-[--dark-quizcard-border] w-[120px] h-fit rounded-full self-center mr-3 z-10 bg-[--dark-quizcard-background]">
        <img src={avatar} alt="creator" className="h-7 mr-2" />
        <span className="quizcard-creator-nickname text-[--dark-quizcard-description] leading-none text-[16px] italic" title={quiz.creator.nickname}>
          {quiz.creator.nickname}
        </span>
      </div>
      <div className="quizcard-content-layout rounded-b-2xl">
        <div className="quizcard-content px-2 mt-11">
          <div className="quizcard-content-title text-white text-[26px] pb-2 leading-none" title={quiz.title}>{quiz.title}</div>
          <div className="quizcard-content-desc text-[--dark-quizcard-description] text-[17px] leading-[1.1]">
            {quiz.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;
