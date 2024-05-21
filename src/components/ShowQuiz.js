import { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Link from "../components/simpleComponents/Link";
import Button from "./simpleComponents/Button";
import { ROUTES } from "../ROUTES";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";
import LanguagePicker from "./simpleComponents/LanguagePicker";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store/slices/authSlice";
import SnackbarsContext from "../context/snackbars";
import {
  useAddEvaluationQuizMutation,
  useDeleteEvaluationQuizMutation,
  useLazyFetchEvaluationQuizQuery,
} from "../store";

function ShowQuiz({ quiz }) {
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const [searchParams] = useSearchParams();
  const languages = [quiz.language];

  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const [fetchEvaluation, fetchingResult] = useLazyFetchEvaluationQuizQuery();
  const [addEvaluation, addingResult] = useAddEvaluationQuizMutation();
  const [deleteEvaluation, deletingResult] = useDeleteEvaluationQuizMutation();

  useEffect(() => {
    fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
  }, [fetchEvaluation, quiz.pseudoId, token]);

  quiz.translations?.forEach((translation) => {
    languages.push(translation.language);
  });

  const currLanguage =
    (languages.includes(searchParams.get("lang")) ? searchParams.get("lang") : false) ||
    (languages.includes("uk") ? "uk" : false) ||
    quiz.language;
  let quizTitle =
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

  if (quiz.isRoughDraft) {
    quizTitle = (
      <Tooltip title="Вікторина є чернеткою">
        <span className="text-[36px] ml-[15px] italic">{quizTitle} *</span>
      </Tooltip>
    );
  } else {
    quizTitle = <span className="text-[36px] ml-[15px]">{quizTitle}</span>;
  }

  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": fetchingResult.data?.liked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": fetchingResult.data?.disliked });

  const handleClickLike = () => {
    if (addingResult.isLoading || deletingResult.isLoading) return;

    if (fetchingResult.data?.liked) deleteEvaluation({ pseudoId: quiz.pseudoId, token: token });
    else addEvaluation({ isLiked: true, pseudoId: quiz.pseudoId, token: token });
  };
  const handleClickDislike = () => {
    if (addingResult.isLoading || deletingResult.isLoading) return;

    if (fetchingResult.data?.disliked) deleteEvaluation({ pseudoId: quiz.pseudoId, token: token });
    else addEvaluation({ isLiked: false, pseudoId: quiz.pseudoId, token: token });
  };

  useEffect(() => {
    if (addingResult.isSuccess) {
      fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
      addingResult.reset();
    } else if (addingResult.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при оцінці вікторини! Код помилки ${addingResult.error.originalStatus}: ${addingResult.error.data}`,
        "error",
        false
      );
    } else if (deletingResult.isSuccess) {
      fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
      deletingResult.reset();
    } else if (deletingResult.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при оцінці вікторини! Код помилки ${deletingResult.error.originalStatus}: ${deletingResult.error.data}`,
        "error",
        false
      );
    }
  }, [addingResult, deletingResult, fetchEvaluation, handleEnqueueSnackbar, quiz.pseudoId, token]);

  let evaluationContent = "";
  if (fetchingResult.isLoading) evaluationContent = <CircularProgress />;
  else if (fetchingResult.isError) {
    evaluationContent = 0;
    handleEnqueueSnackbar(
      `Не вдалося отримати оцінку. Код помилки ${fetchingResult.error.status} ${fetchingResult.error.data}`,
      "error",
      false
    );
  } else if (fetchingResult.isSuccess) evaluationContent = fetchingResult.data.evaluation;

  return (
    <div className="mt-[10px]">
      <div className="bg-[--dark-quizcard-background] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
        <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
          {quizTitle}
          <div className="flex gap-[6rem]">
            <div>
              <LanguagePicker
                currLanguageCode={currLanguage}
                languageCodes={languages}
                handleChangeLanguage={handleChangeLanguage}
              />
            </div>
            <div className="flex items-center text-[36px] gap-[5px]">
              <GoChevronUp
                className={
                  fetchingResult.isLoading ||
                  addingResult.isLoading ||
                  deletingResult.isLoading ||
                  likeClassname
                }
                onClick={handleClickLike}
              />
              {evaluationContent}
              <GoChevronDown
                className={
                  fetchingResult.isLoading ||
                  addingResult.isLoading ||
                  deletingResult.isLoading ||
                  dislikeClassname
                }
                onClick={handleClickDislike}
              />
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
        {!quiz.isRoughDraft && (
          <div className="flex justify-center mb-[20px]">
            <Button className="w-[200px] h-[90px] text-[32px]" success rounded>
              <Link to={ROUTES.PlayQuiz(quiz.pseudoId)}>Грати</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowQuiz;
