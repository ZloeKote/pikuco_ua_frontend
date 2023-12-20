import { useState } from "react";
import Link from "../components/Link";
import QuestionList from "../components/QuestionList";
import { GoArrowLeft, GoChevronUp, GoChevronDown } from "react-icons/go";
import classNames from "classnames";
import ActiveButton from "../components/ActiveButton";
import avatar from "../img/avatar.png";
import Ghostrunner from "../img/Ghostrunner.png";
import { ROUTES } from "../ROUTES";

function QuizStatsPage() {
  const [isLiked, setIsLiked] = useState(null);
  const [evaluation, setEvaluation] = useState(12);

  const mainStatClassname =
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover] px-[10px] rounded-md";
  const statClassname = classNames(mainStatClassname, "font-semibold border-b");

  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": isLiked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": !isLiked && isLiked != null });

  const questions = ([
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Fusce posuere varius sem a lobortis. Aliquam a lacus facilisis, consequat est nec, luctus massa. Donec in elementum ex. Aliquam facilisis dapibus massa id consectet",
      points: 8,
      place: 1,
    },
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Music festival celebrating various genres and local talent",
      points: 4,
      place: 4,
    },
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Outdoor adventure race for teams to test their physical and mental abilities",
      points: 6,
      place: 2,
    },
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Film festival showcasing independent and international films",
      points: 6,
      place: 3,
    },
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Music festival celebrating various genres and local talent",
      points: 2,
      place: 6,
    },
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Outdoor adventure race for teams to test their physical and mental abilities",
      points: 2,
      place: 7,
    },
    {
      img: Ghostrunner,
      title: "Назва питання",
      description: "Fusce posuere varius sem a lobortis. Aliquam a lacus facilisis, consequat est nec, luctus massa. Donec in elementum ex. Aliquam facilisis dapibus massa id consectet",
      points: 5,
      place: 5
    },
  ])

  const handleClickLike = () => {
    if (isLiked) {
      setIsLiked(null);
      setEvaluation(evaluation - 1);
    } else if (!isLiked && isLiked != null) {
      setIsLiked(true);
      setEvaluation(evaluation + 2);
    } else {
      setIsLiked(true);
      setEvaluation(evaluation + 1);
    }
  };
  const handleClickDislike = () => {
    if (!isLiked && isLiked != null) {
      setIsLiked(null);
      setEvaluation(evaluation + 1);
    } else if (isLiked) {
      setIsLiked(false);
      setEvaluation(evaluation - 2);
    } else {
      setIsLiked(false);
      setEvaluation(evaluation - 1);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 text-white w-full">
      <div>
        <div className="flex items-center gap-[30px] text-[24px] ml-[15px]">
          <Link
            className="bg-[--dark-quizcard-background-hover] w-[60px] rounded-full flex justify-center hover:bg-[--dark-link-background-hover]"
            to={ROUTES.QuizzesList}
          >
            <GoArrowLeft className="text-[30px]" />
          </Link>
          <Link className={mainStatClassname} to={ROUTES.Quiz}>
            Загальна інформація
          </Link>
          <Link className={statClassname} to={ROUTES.QuizStats}>
            Статистика
          </Link>
        </div>
        <div className="mt-[10px]">
          <div className="bg-[--dark-quizcard-background] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
            <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
              <span className="text-[36px] ml-[15px]">Назва вікторини</span>
              <div className="flex gap-[6rem]">
                <div className="flex items-center text-[36px] gap-[5px]">
                  <GoChevronUp className={likeClassname} onClick={handleClickLike} />
                  {evaluation}
                  <GoChevronDown className={dislikeClassname} onClick={handleClickDislike} />
                </div>
                <div className="quizcard-creator flex items-center border border-[--dark-quizcard-border] w-[170px] h-fit rounded-full self-center mr-3 z-10 bg-[--dark-quizcard-background]">
                  <img src={avatar} alt="creator" className="h-[40px] mr-2" />
                  <span
                    className="quizcard-creator-nickname text-[--dark-text] leading-none text-[20px] italic"
                    title="ZloeKote"
                  >
                    ZloeKote
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="self-center">
                <button className="mr-[25px] text-[32px]">Індивідуальна</button>
                <button className="text-[32px]">Загальна</button>
              </div>
              <div className="flex items-center gap-[20px] self-start ml-[15px] text-[28px]">
                <span>Сортування по:</span>
                <ActiveButton className="w-[150px] h-[50px] rounded-full">Місцю</ActiveButton>
                <ActiveButton className="w-[150px] h-[50px] rounded-full">Назві</ActiveButton>
              </div>
              <QuestionList questions={questions}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizStatsPage;
