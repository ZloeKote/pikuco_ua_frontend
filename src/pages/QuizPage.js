import { useState } from "react";
import Link from "../components/Link";
import { GoArrowLeft, GoChevronUp, GoChevronDown } from "react-icons/go";
import classNames from "classnames";
import Button from "../components/Button";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";
import { ROUTES } from "../ROUTES";

function QuizPage() {
  const [isLiked, setIsLiked] = useState(null);
  const [evaluation, setEvaluation] = useState(12);

  const mainStatClassname =
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover] px-[10px] rounded-md";
  const mainClassname = classNames(mainStatClassname, "font-semibold border-b");

  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": isLiked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": !isLiked && isLiked != null });

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
          <Link className={mainClassname} to={ROUTES.Quiz}>
            Загальна інформація
          </Link>
          <Link className={mainStatClassname} to={ROUTES.QuizStats}>
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
            <div className="flex flex-col items-center text-center text-[24px]">
              <div className="w-[50rem] mt-[10px]">
                <img src={quizCover} alt="cover" />
              </div>
              <div className="w-[60rem]">
                <p className="my-[5px]">Турнір - Відео</p>
                <p className="mb-[5px]">
                  Fusce posuere varius sem a lobortis. Sed finibus nibh vel congue mollis. Nulla viverra erat
                  sed quam viverra condimentum. Aliquam a lacus facilisis, consequat est nec, luctus massa.
                  Donec in elementum ex. Aliquam facilisis dapibus massa id consectet
                </p>
                <p className="mb-[15px]">64 варіанти</p>
              </div>
            </div>
            <div className="flex justify-center mb-[20px]">
              <Button className="w-[200px] h-[90px] text-[32px]" success rounded>
                <Link to={ROUTES.PlayQuiz}>Грати</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
