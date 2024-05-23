import { useLocation, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import QuestionList from "./QuestionList";
import ActiveButton from "./simpleComponents/ActiveButton";
import { LinearProgress, CircularProgress, Tooltip, Typography } from "@mui/material";
import classNames from "classnames";
import avatar from "../img/avatar.png";
import SnackbarsContext from "../context/snackbars";
import {
  useAddEvaluationQuizMutation,
  useDeleteEvaluationQuizMutation,
  useAddQuizToWishlistMutation,
  useDeleteQuizFromWishlistMutation,
  useLazyCheckIsInWishlistQuery,
  useLazyFetchEvaluationQuizQuery,
  useFetchQuizResultsQuery,
  selectCurrentToken,
} from "../store";
import { types } from "../predefined/QuestionTypes";
import { useSelector } from "react-redux";
import { WishlistIcon } from "../custom-materials";
import Link from "./simpleComponents/Link";

function ShowQuizStats({ quiz, indResults, language }) {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const { pseudoId } = useParams();
  const [isIndividual, setIsIndividual] = useState(location.state?.isIndividual ? true : false);

  const { data: results, isLoading: resultsIsLoading } = useFetchQuizResultsQuery(pseudoId);
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const [fetchEvaluation, fetchingResult] = useLazyFetchEvaluationQuizQuery();
  const [addEvaluation, addingResult] = useAddEvaluationQuizMutation();
  const [deleteEvaluation, deletingResult] = useDeleteEvaluationQuizMutation();
  const [checkWishlist, checkingWishlistResult] = useLazyCheckIsInWishlistQuery();
  const [addToWishlist, addingWishlistResult] = useAddQuizToWishlistMutation();
  const [deleteFromWishlist, deletingWishlistResult] = useDeleteQuizFromWishlistMutation();

  useEffect(() => {
    fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
    if (token) checkWishlist({ pseudoId: quiz.pseudoId, token });
  }, [fetchEvaluation, checkWishlist, quiz.pseudoId, token]);

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

  useEffect(() => {
    if (addingWishlistResult.isSuccess) {
      checkWishlist({ pseudoId: quiz.pseudoId, token });
      handleEnqueueSnackbar("Вікторина успішно додана до списку бажаного", "default");
      addingWishlistResult.reset();
    } else if (addingWishlistResult.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при додаванні вікторини до списку бажаного. ${addingWishlistResult.error.data}`,
        "error"
      );
    } else if (deletingWishlistResult.isSuccess) {
      checkWishlist({ pseudoId: quiz.pseudoId, token });
      deletingWishlistResult.reset();
    } else if (deletingWishlistResult.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при видаленні вікторини зі списку бажаного. ${deletingWishlistResult.error.data}`,
        "error"
      );
    }
  }, [
    addingWishlistResult,
    deletingWishlistResult,
    handleEnqueueSnackbar,
    checkWishlist,
    quiz.pseudoId,
    token,
  ]);

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

  let isIndExists = location.state?.resultsAfterPassing ? true : false || indResults ? true : false;
  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": fetchingResult.data?.liked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": fetchingResult.data?.disliked });
  const indClassname = classNames("mr-[25px] text-[32px]", {
    "text-gray-500 cursor-no-drop": !isIndExists,
    "text-[--dark-text]": isIndExists,
  });

  let quizTitle =
    language === quiz.language ? quiz.title : quiz.translations.find((tr) => tr.language === language).title;

  if (quiz.isRoughDraft) {
    quizTitle = (
      <Tooltip title="Вікторина є чернеткою">
        <span className="text-[36px] ml-[15px] italic">{quizTitle} *</span>
      </Tooltip>
    );
  } else {
    quizTitle = <span className="text-[36px] ml-[15px]">{quizTitle}</span>;
  }
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
  const handleClickWishlist = () => {
    if (
      token &&
      checkingWishlistResult.isSuccess &&
      !checkingWishlistResult.isLoading &&
      !addingWishlistResult.isLoading &&
      !deletingWishlistResult.isLoading
    ) {
      if (checkingWishlistResult.data.isWishlisted)
        deleteFromWishlist({ pseudoId: quiz.pseudoId, token: token });
      else addToWishlist({ pseudoId: quiz.pseudoId, token: token });
    } else if (token === null) {
      handleEnqueueSnackbar(
        "Тільки авторизовані користувачі можуть додавати вікторину до списку бажаного",
        "error"
      );
    }
  };

  const handleClickIndividual = () => setIsIndividual(true);
  const handleClickGeneral = () => setIsIndividual(false);

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
          <span className="text-[36px] ml-[15px]">{quizTitle}</span>
          <div className="flex gap-[6rem]">
            {!quiz.isRoughDraft && (
              <>
                <div className="self-center">
                  <WishlistIcon
                    title="Додати вікторину до списку бажаного"
                    wishlisted={checkingWishlistResult.data?.isWishlisted}
                    onClick={handleClickWishlist}
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
              </>
            )}
            <Link
              to={`/user/${quiz.creator.nickname.toLowerCase()}`}
              className="quizcard-creator z-10 mr-3 w-[170px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]"
            >
              <div className="flex items-center">
                <img src={avatar} alt="creator" className="h-[40px] mr-2" />
                <Tooltip title={<Typography>{quiz.creator.nickname}</Typography>} placement="bottom">
                  <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[20px] italic">
                    {quiz.creator.nickname}
                  </span>
                </Tooltip>
              </div>
            </Link>
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
            <LinearProgress />
          ) : (
            <QuestionList
              questions={questions}
              questionType={quiz.type}
              variant={isIndividual ? types.individual : types.general}
              lang={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowQuizStats;
