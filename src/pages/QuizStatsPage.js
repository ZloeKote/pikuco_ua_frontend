import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Link from "../components/Link";
import QuestionList from "../components/QuestionList";
import { GoArrowLeft, GoChevronUp, GoChevronDown } from "react-icons/go";
import classNames from "classnames";
import ActiveButton from "../components/ActiveButton";
import avatar from "../img/avatar.png";
import { ROUTES } from "../ROUTES";
import {
  useFetchQuizQuery,
  useFetchQuizResultsQuery,
  useFetchIndividualResultsQuery,
  selectCurrentToken,
} from "../store";

function QuizStatsPage() {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const { pseudoId } = useParams();
  const [isLiked, setIsLiked] = useState(null);
  const [evaluation, setEvaluation] = useState(12);
  const [isIndividual, setIsIndividual] = useState(location.state?.isIndividual ? true : false);
  const { data: quiz, error: quizError, isLoading: quizIsLoading } = useFetchQuizQuery(pseudoId);
  const { data: results, isLoading: resultsIsLoading } = useFetchQuizResultsQuery(pseudoId);
  const { data: indResults } = useFetchIndividualResultsQuery(
    { pseudoId, token },
    {
      skip: location.state?.resultsAfterPassing ? true : false || token ? false : true,
    }
  );
  let isIndExists = location.state?.resultsAfterPassing ? true : false || indResults ? true : false;
  let questions;
  if (isIndividual) {
    questions = location.state?.resultsAfterPassing || indResults.quizResults.questions;
  } else {
    if (!resultsIsLoading && results === undefined) {
      questions = quiz.questions;
    } else {
      questions = results?.quizResults.questions;
    }
  }
  const mainStatClassname =
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover] px-[10px] rounded-md";
  const statClassname = classNames(mainStatClassname, "font-semibold border-b");

  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": isLiked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": !isLiked && isLiked != null });
  const indClassname = classNames("mr-[25px] text-[32px]", {
    "text-gray-500 cursor-no-drop": !isIndExists,
    "text-[--dark-text]": isIndExists,
  });

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

  const handleClickIndividual = () => setIsIndividual(true);
  const handleClickGeneral = () => setIsIndividual(false);

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
          <Link className={mainStatClassname} to={ROUTES.Quiz(pseudoId)}>
            Загальна інформація
          </Link>
          <Link className={statClassname} to={ROUTES.QuizStats(pseudoId)}>
            Статистика
          </Link>
        </div>
        {quizIsLoading ? (
          <span>Loading...</span>
        ) : (
          <div className="mt-[10px]">
            <div className="bg-[--dark-background-primary] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
              <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
                <span className="text-[36px] ml-[15px]">{quiz.title}</span>
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
                      title={quiz.creator.nickname}
                    >
                      {quiz.creator.nickname}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="self-center">
                  <button className={indClassname} onClick={isIndExists ? handleClickIndividual : null}>
                    Індивідуальна
                  </button>
                  <button className="text-[32px]" onClick={handleClickGeneral}>
                    Загальна
                  </button>
                </div>
                <div className="flex items-center gap-[20px] self-start ml-[15px] text-[28px]">
                  <span>Сортування по:</span>
                  <ActiveButton className="w-[150px] h-[50px] rounded-full">Місцю</ActiveButton>
                  <ActiveButton className="w-[150px] h-[50px] rounded-full">Назві</ActiveButton>
                </div>
                {resultsIsLoading ? (
                  <span>results loading...</span>
                ) : (
                  <QuestionList questions={questions} type={quiz.type} individual={isIndividual} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizStatsPage;

// const questions = [
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description:
//       "Fusce posuere varius sem a lobortis. Aliquam a lacus facilisis, consequat est nec, luctus massa. Donec in elementum ex. Aliquam facilisis dapibus massa id consectet",
//     points: 8,
//     place: 1,
//   },
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description: "Music festival celebrating various genres and local talent",
//     points: 4,
//     place: 4,
//   },
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description: "Outdoor adventure race for teams to test their physical and mental abilities",
//     points: 6,
//     place: 2,
//   },
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description: "Film festival showcasing independent and international films",
//     points: 6,
//     place: 3,
//   },
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description: "Music festival celebrating various genres and local talent",
//     points: 2,
//     place: 6,
//   },
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description: "Outdoor adventure race for teams to test their physical and mental abilities",
//     points: 2,
//     place: 7,
//   },
//   {
//     img: Ghostrunner,
//     title: "Назва питання",
//     description:
//       "Fusce posuere varius sem a lobortis. Aliquam a lacus facilisis, consequat est nec, luctus massa. Donec in elementum ex. Aliquam facilisis dapibus massa id consectet",
//     points: 5,
//     place: 5,
//   },
// ];
