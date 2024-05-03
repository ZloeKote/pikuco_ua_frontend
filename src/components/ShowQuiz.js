import { useState } from "react";
import classNames from "classnames";
import Link from "../components/simpleComponents/Link";
import Button from "./simpleComponents/Button";
import { ROUTES } from "../ROUTES";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";
import LanguagePicker from "./simpleComponents/LanguagePicker";
import { useNavigate, useSearchParams } from "react-router-dom";

function ShowQuiz({ quiz }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLiked, setIsLiked] = useState(null);
  const [evaluation, setEvaluation] = useState(12);
  const languages = [quiz.language];
  quiz.translations?.forEach((translation) => {
    languages.push(translation.language);
  });

  const currLanguage =
    (languages.includes(searchParams.get("lang")) ? searchParams.get("lang") : false) ||
    (languages.includes("uk") ? "uk" : false) ||
    quiz.language;
  const quizTitle =
    currLanguage === quiz.language
      ? quiz.title
      : quiz.translations.find((tr) => tr.language === currLanguage).title;
  const quizDescription =
    currLanguage === quiz.language
      ? quiz.description
      : quiz.translations.find((tr) => tr.language === currLanguage).description;

  const handleChangeLanguage = (newLang) => {
    searchParams.set("lang", newLang);
    navigate({
      pathname: ROUTES.Quiz(quiz.pseudoId),
      search: searchParams.toString().length !== 0 ? "?" + searchParams.toString() : "",
    });
  };

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
    <div className="mt-[10px]">
      <div className="bg-[--dark-quizcard-background] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
        <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
          <span className="text-[36px] ml-[15px]">{quizTitle}</span>
          <div className="flex gap-[6rem]">
            <div>
              <LanguagePicker
                currLanguageCode={currLanguage}
                languageCodes={languages}
                handleChangeLanguage={handleChangeLanguage}
              />
            </div>
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
        <div className="flex flex-col items-center text-center text-[24px]">
          <div className="w-[50rem] mt-[10px]">
            <img src={quizCover} alt="cover" />
          </div>
          <div className="w-[60rem]">
            <p className="my-[5px]">{quiz.type}</p>
            <p className="mb-[5px]">{quizDescription}</p>
            <p className="mb-[15px]">{quiz.amountQuestions} варіанти</p>
          </div>
        </div>
        <div className="flex justify-center mb-[20px]">
          <Button className="w-[200px] h-[90px] text-[32px]" success rounded>
            <Link to={ROUTES.PlayQuiz(quiz.pseudoId)}>Грати</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShowQuiz;
