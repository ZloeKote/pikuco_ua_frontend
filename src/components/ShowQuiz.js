import { useContext, useEffect } from "react";
import classNames from "classnames";
import Link from "../components/simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import placeholderCover from "../img/placeholderCover.png";
import { CircularProgress, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SnackbarsContext from "../context/snackbars";
import {
  useAddEvaluationQuizMutation,
  useDeleteEvaluationQuizMutation,
  useAddQuizToWishlistMutation,
  useDeleteQuizFromWishlistMutation,
  useLazyCheckIsInWishlistQuery,
  useLazyFetchEvaluationQuizQuery,
  selectCurrentToken,
} from "../store/";
import { WishlistIcon } from "../custom-materials";
import { quizTypes } from "../predefined/QuizTypes";
import GeneratedUserAvatar from "./simpleComponents/GeneratedUserAvatar";

function ShowQuiz({ quiz, language }) {
  const token = useSelector(selectCurrentToken);
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const [fetchEvaluation, fetchingEvalResult] = useLazyFetchEvaluationQuizQuery();
  const [addEvaluation, addingEvalResult] = useAddEvaluationQuizMutation();
  const [deleteEvaluation, deletingEvalResult] = useDeleteEvaluationQuizMutation();
  const [checkWishlist, checkingWishlistResult] = useLazyCheckIsInWishlistQuery();
  const [addToWishlist, addingWishlistResult] = useAddQuizToWishlistMutation();
  const [deleteFromWishlist, deletingWishlistResult] = useDeleteQuizFromWishlistMutation();

  const quizType = quizTypes.find((type) => type.value === quiz.type).label;

  const playButtonClassname = classNames(
    "w-[200px] h-[90px] text-[32px] flex",
    "border-green-400 bg-green-600 text-white hover:bg-green-500 rounded-full"
  );

  useEffect(() => {
    fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
    if (token) checkWishlist({ pseudoId: quiz.pseudoId, token });
  }, [fetchEvaluation, checkWishlist, quiz.pseudoId, token]);

  useEffect(() => {
    if (addingEvalResult.isSuccess) {
      fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
      addingEvalResult.reset();
    } else if (addingEvalResult.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при оцінці вікторини! Код помилки ${addingEvalResult.error.originalStatus}: ${addingEvalResult.error.data}`,
        "error",
        false
      );
    } else if (deletingEvalResult.isSuccess) {
      fetchEvaluation({ pseudoId: quiz.pseudoId, token: token });
      deletingEvalResult.reset();
    } else if (deletingEvalResult.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при оцінці вікторини! Код помилки ${deletingEvalResult.error.originalStatus}: ${deletingEvalResult.error.data}`,
        "error",
        false
      );
    }
  }, [addingEvalResult, deletingEvalResult, fetchEvaluation, handleEnqueueSnackbar, quiz.pseudoId, token]);

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

  let quizTitle =
    language === quiz.language ? quiz.title : quiz.translations.find((tr) => tr.language === language).title;
  const quizDescription =
    language === quiz.language
      ? quiz.description
      : quiz.translations.find((tr) => tr.language === language).description;

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
  const likeClassname = classNames(evalClassName, { "text-[green]": fetchingEvalResult.data?.liked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": fetchingEvalResult.data?.disliked });

  const handleClickLike = () => {
    if (addingEvalResult.isLoading || deletingEvalResult.isLoading) return;

    if (fetchingEvalResult.data?.liked) deleteEvaluation({ pseudoId: quiz.pseudoId, token: token });
    else addEvaluation({ isLiked: true, pseudoId: quiz.pseudoId, token: token });
  };
  const handleClickDislike = () => {
    if (addingEvalResult.isLoading || deletingEvalResult.isLoading) return;

    if (fetchingEvalResult.data?.disliked) deleteEvaluation({ pseudoId: quiz.pseudoId, token: token });
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

  let evaluationContent = "";
  if (fetchingEvalResult.isLoading) evaluationContent = <CircularProgress />;
  else if (fetchingEvalResult.isError) {
    evaluationContent = 0;
    handleEnqueueSnackbar(
      `Не вдалося отримати оцінку. Код помилки ${fetchingEvalResult.error.status} ${fetchingEvalResult.error.data}`,
      "error",
      false
    );
  } else if (fetchingEvalResult.isSuccess) evaluationContent = fetchingEvalResult.data.evaluation;

  return (
    <div className="mt-[10px]">
      <div className="bg-[--dark-quizcard-background] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
        <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
          {quizTitle}
          <div className="flex gap-[4rem]">
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
                      fetchingEvalResult.isLoading ||
                      addingEvalResult.isLoading ||
                      deletingEvalResult.isLoading ||
                      likeClassname
                    }
                    onClick={handleClickLike}
                  />
                  {evaluationContent}
                  <GoChevronDown
                    className={
                      fetchingEvalResult.isLoading ||
                      addingEvalResult.isLoading ||
                      deletingEvalResult.isLoading ||
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
                <GeneratedUserAvatar
                  username={quiz.creator.nickname}
                  saturation="60"
                  className="h-[40px] mr-2 bg-lime-300 rounded-full"
                />
                <Tooltip title={<Typography>{quiz.creator.nickname}</Typography>} placement="bottom">
                  <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[20px] italic">
                    {quiz.creator.nickname}
                  </span>
                </Tooltip>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center text-center text-[24px]">
          <div className=" mt-[10px] flex justify-center">
            <img src={quiz.cover || placeholderCover} alt="cover" />
          </div>
          <div className="w-[60rem]">
            <p className="my-[5px]">{quizType}</p>
            <p className="mb-[5px]">{quizDescription}</p>
            <p className="mb-[15px]">{quiz.amountQuestions} варіанти</p>
          </div>
        </div>
        {!quiz.isRoughDraft && (
          <div className="flex justify-center mb-[20px]">
            <div className={playButtonClassname}>
              <Link
                className="w-full h-full flex justify-center items-center"
                to={ROUTES.PlayQuiz(quiz.pseudoId) + `?lang=${language}`}
              >
                Грати
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowQuiz;
