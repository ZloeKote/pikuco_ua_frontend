import { useCallback, useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import classNames from "classnames";
import Link from "../components/simpleComponents/Link";
import { GoChevronUp, GoChevronDown, GoArrowLeft } from "react-icons/go";
import { ImCross } from "react-icons/im";
import { CircularProgress, Skeleton, Tooltip, Typography } from "@mui/material";
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
import LanguagePicker from "./simpleComponents/LanguagePicker";
import GeneratedUserAvatar from "./simpleComponents/GeneratedUserAvatar";
import { ROUTES } from "../ROUTES";

function QuizHeader({ children, quiz, language, onChangeLanguage, section, isFetchingQuiz }) {
  const { pseudoId } = useParams();
  const [searchParams] = useSearchParams();
  const token = useSelector(selectCurrentToken);
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const [fetchEvaluation, fetchingEvalResult] = useLazyFetchEvaluationQuizQuery();
  const [addEvaluation, addingEvalResult] = useAddEvaluationQuizMutation();
  const [deleteEvaluation, deletingEvalResult] = useDeleteEvaluationQuizMutation();
  const [checkWishlist, checkingWishlistResult] = useLazyCheckIsInWishlistQuery();
  const [addToWishlist, addingWishlistResult] = useAddQuizToWishlistMutation();
  const [deleteFromWishlist, deletingWishlistResult] = useDeleteQuizFromWishlistMutation();

  const isDataLoaded = !isFetchingQuiz && quiz !== undefined;

  const isCreatorDeleted = quiz?.creator.nickname.startsWith("[deleted-");
  const currLanguage = language || quiz?.language;
  // (quiz?.languages.includes(searchParams.get("lang")) && searchParams.get("lang")) ||
  // (quiz?.languages.includes("uk") && "uk") ||
  // quiz?.language;
  const langParam = searchParams.get("lang") !== null ? "?lang=" + searchParams.get("lang") : "";

  const sectionTitleClassname = classNames(
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover]",
    " px-[10px] rounded-md"
  );
  const titleStatsDisabledClassname = classNames("px-[10px] rounded-md");
  const titleMainClassname = classNames(sectionTitleClassname, {
    "font-bold border-b": section === "main",
  });
  const titleStatsClassname = classNames(sectionTitleClassname, {
    "font-bold border-b": section === "stats",
  });
  const buttonBackClassname = classNames(
    "bg-[--dark-quizcard-background-hover] w-[60px] rounded-full",
    "flex justify-center items-center",
    "hover:bg-[--dark-link-background-hover] hover:cursor-pointer"
  );

  const handleChangeLanguage = (newLang) => onChangeLanguage(newLang);

  const fetchEvaluationFunction = useCallback(() => {
    fetchEvaluation({ pseudoId: quiz?.pseudoId, token: token })
      .unwrap()
      .catch((error) => {
        if (error.status === 500) {
          handleEnqueueSnackbar("Сталася помилка зі сторони серверу при завантаженні оцінки", "error");
        } else {
          handleEnqueueSnackbar(
            `Не вдалося отримати оцінку. Код помилки ${error.status} ${error.data}`,
            "error",
            false
          );
        }
      });
  }, [fetchEvaluation, handleEnqueueSnackbar, quiz?.pseudoId, token]);
  const checkWishlistFunction = useCallback(() => {
    checkWishlist({ pseudoId: quiz?.pseudoId, token })
      .unwrap()
      .catch((error) => {
        if (error.status === 500) {
          handleEnqueueSnackbar("Сталася помилка зі сторони серверу при перевірці бажаного", "error");
        } else {
          handleEnqueueSnackbar(
            "Сталася непередбачуваня помилка при перевірці чи є вікторина у списку бажаного :(",
            "error",
            false
          );
        }
      });
  }, [checkWishlist, token, quiz?.pseudoId, handleEnqueueSnackbar]);

  useEffect(() => {
    if (isDataLoaded) {
      fetchEvaluationFunction();
      if (token) checkWishlistFunction();
    }
  }, [fetchEvaluationFunction, checkWishlistFunction, token, isDataLoaded]);

  let quizTitle = <Skeleton animation="wave" width="60%" sx={{ fontSize: "36px", marginLeft: "15px" }} />;

  if (isDataLoaded) {
    quizTitle = quiz?.title;

    if (quiz?.isRoughDraft) {
      quizTitle = (
        <Tooltip title="Вікторина є чернеткою">
          <span className="text-[36px] ml-[15px] italic">{quizTitle} *</span>
        </Tooltip>
      );
    } else {
      quizTitle = <span className="text-[36px] ml-[15px]">{quizTitle}</span>;
    }
  }

  const evalClassName = "hover:bg-[--dark-link-background-hover] hover:cursor-pointer rounded-full";
  const likeClassname = classNames(evalClassName, { "text-[green]": fetchingEvalResult.data?.liked });
  const dislikeClassname = classNames(evalClassName, { "text-[red]": fetchingEvalResult.data?.disliked });
  const creatorClassname =
    "quizcard-creator z-10 mr-3 w-[170px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]";

  const handleClickLike = () => {
    if (addingEvalResult.isLoading || deletingEvalResult.isLoading) return;
    if (token === null) {
      handleEnqueueSnackbar("Тільки авторизовані користувачі можуть оцінювати вікторину", "error");
    } else if (fetchingEvalResult.data?.liked) {
      deleteEvaluation({ pseudoId: quiz.pseudoId, token: token })
        .unwrap()
        .then(() => fetchEvaluationFunction())
        .catch((error) => {
          if (error.status === 401) {
            handleEnqueueSnackbar("Тільки авторизовані користувачі можуть оцінювати вікторину", "error");
          } else if (error.status === 500) {
            handleEnqueueSnackbar("Сталася помилка зі сторони серверу під час оцінки вікторини", "error");
          } else {
            handleEnqueueSnackbar(error.data, "error");
          }
        });
    } else
      addEvaluation({ isLiked: true, pseudoId: quiz.pseudoId, token: token })
        .unwrap()
        .then(() => fetchEvaluationFunction())
        .catch((error) => {
          if (error.status === 401) {
            handleEnqueueSnackbar("Тільки авторизовані користувачі можуть оцінювати вікторину", "error");
          } else if (error.status === 500) {
            handleEnqueueSnackbar("Сталася помилка зі сторони серверу під час оцінки вікторини", "error");
          } else {
            handleEnqueueSnackbar(error.data, "error");
          }
        });
  };
  const handleClickDislike = () => {
    if (addingEvalResult.isLoading || deletingEvalResult.isLoading) return;
    if (token === null) {
      handleEnqueueSnackbar("Тільки авторизовані користувачі можуть оцінювати вікторину", "error");
    } else if (fetchingEvalResult.data?.disliked)
      deleteEvaluation({ pseudoId: quiz.pseudoId, token: token })
        .unwrap()
        .then(() => fetchEvaluationFunction())
        .catch((error) => {
          if (error.status === 401) {
            handleEnqueueSnackbar("Тільки авторизовані користувачі можуть оцінювати вікторину", "error");
          } else if (error.status === 500) {
            handleEnqueueSnackbar("Сталася помилка зі сторони серверу під час оцінки вікторини", "error");
          } else {
            handleEnqueueSnackbar(error.data, "error");
          }
        });
    else
      addEvaluation({ isLiked: false, pseudoId: quiz.pseudoId, token: token })
        .unwrap()
        .then(() => fetchEvaluationFunction())
        .catch((error) => {
          if (error.status === 401) {
            handleEnqueueSnackbar("Тільки авторизовані користувачі можуть оцінювати вікторину", "error");
          } else if (error.status === 500) {
            handleEnqueueSnackbar("Сталася помилка зі сторони серверу під час оцінки вікторини", "error");
          } else {
            handleEnqueueSnackbar(error.data, "error");
          }
        });
  };
  const handleClickWishlist = () => {
    if (token === null) {
      handleEnqueueSnackbar(
        "Тільки авторизовані користувачі можуть додавати вікторину до списку бажаного",
        "error"
      );
    } else if (
      checkingWishlistResult.isSuccess &&
      !checkingWishlistResult.isLoading &&
      !addingWishlistResult.isLoading &&
      !deletingWishlistResult.isLoading
    ) {
      if (checkingWishlistResult.data.isWishlisted) {
        deleteFromWishlist({ pseudoId: quiz.pseudoId, token: token })
          .unwrap()
          .then(() => checkWishlistFunction())
          .catch((error) => {
            if (error.status === 401) {
              handleEnqueueSnackbar(
                "Тільки авторизовані користувачі можуть додавати вікторину до бажаного",
                "error"
              );
            } else if (error.status === 500) {
              handleEnqueueSnackbar(
                "Сталася помилка зі сторони серверу під час додавання вікторини до бажаного",
                "error"
              );
            } else {
              handleEnqueueSnackbar(error.data, "error");
            }
          });
      } else {
        addToWishlist({ pseudoId: quiz.pseudoId, token: token })
          .unwrap()
          .then(() => {
            handleEnqueueSnackbar("Вікторина успішно додана до списку бажаного", "default");
            checkWishlistFunction();
          })
          .catch((error) => {
            if (error.status === 401 || error.status === 403) {
              handleEnqueueSnackbar(
                "Тільки авторизовані користувачі можуть додавати вікторину до бажаного",
                "error"
              );
            } else if (error.status === 500) {
              handleEnqueueSnackbar(
                "Сталася помилка зі сторони серверу під час додавання вікторини до бажаного",
                "error"
              );
            } else {
              handleEnqueueSnackbar(error.data, "error");
            }
          });
      }
    } else if (checkingWishlistResult.isError) {
      if (checkingWishlistResult.error.status === 401) {
        handleEnqueueSnackbar(
          "Тільки авторизовані користувачі можуть додавати вікторину до бажаного",
          "error"
        );
      } else if (checkingWishlistResult.error.status === 500) {
        handleEnqueueSnackbar(
          "Сталася помилка зі сторони серверу під час додаванні чи видаленні вікторини з бажаного",
          "error"
        );
      } else {
        handleEnqueueSnackbar(checkingWishlistResult.error.data.error, "error");
      }
    }
  };

  let evaluationContent = "0";
  if (fetchingEvalResult.isLoading) evaluationContent = <CircularProgress />;
  if (fetchingEvalResult.isSuccess) evaluationContent = fetchingEvalResult.data.evaluation;

  return (
    <div className="flex flex-col items-center mt-10 text-white w-full">
      <div>
        <div className="flex items-center justify-between text-[24px] ml-[15px]">
          <div className="flex gap-[30px]">
            <Link className={buttonBackClassname} to={ROUTES.QuizzesList}>
              <GoArrowLeft className="text-[30px]" />
            </Link>
            <Link className={titleMainClassname} to={ROUTES.Quiz(pseudoId)} params={langParam}>
              Загальна інформація
            </Link>
            <Link
              className={!quiz?.isRoughDraft ? titleStatsClassname : titleStatsDisabledClassname}
              to={ROUTES.QuizStats(pseudoId)}
              params={langParam}
              disabled={quiz?.isRoughDraft}
            >
              Статистика
            </Link>
          </div>
          <div>
            {isDataLoaded ? (
              <LanguagePicker
                currLanguageCode={currLanguage}
                languageCodes={quiz?.languages}
                handleChangeLanguage={handleChangeLanguage}
                label="Мова вікторини"
                disabled={quiz?.languages.length === 1}
                title={quiz?.languages.length === 1 ? "Вікторина має лише 1 мову" : "Оберіть мову вікторини"}
              />
            ) : (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={150}
                height={40}
                sx={{ borderRadius: 1 }}
              />
            )}
          </div>
        </div>

        <div className="mt-[10px]">
          <div className="bg-[--dark-quizcard-background] border border-[--dark-quizcard-border] w-[75rem] rounded-2xl">
            <div className="flex items-center justify-between py-[10px] border-b border-[--dark-quizcard-border]">
              {quizTitle}
              <div className="flex gap-[4rem]">
                {!quiz?.isRoughDraft && (
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
                {isDataLoaded ? (
                  isCreatorDeleted ? (
                    <div className={creatorClassname}>
                      <div className="flex items-center">
                        <ImCross className="h-[40px] w-20 mr-2 bg-lime-300 rounded-full text-red-600" />
                        <Tooltip title={<Typography>{quiz?.creator.nickname}</Typography>} placement="bottom">
                          <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[20px] italic">
                            {quiz?.creator.nickname}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <Link to={`/user/${quiz?.creator.nickname.toLowerCase()}`} className={creatorClassname}>
                      <div className="flex items-center">
                        <GeneratedUserAvatar
                          username={quiz?.creator.nickname}
                          saturation="60"
                          className="h-[40px] mr-2 bg-lime-300 rounded-full"
                        />
                        <Tooltip title={<Typography>{quiz?.creator.nickname}</Typography>} placement="bottom">
                          <span className="quizcard-creator-nickname text-[--dark-text] leading-none text-[20px] italic">
                            {quiz?.creator.nickname}
                          </span>
                        </Tooltip>
                      </div>
                    </Link>
                  )
                ) : (
                  <div className="z-10 mr-3 w-[170px] h-fit border border-[--dark-quizcard-border] rounded-full self-center bg-[--dark-quizcard-background]">
                    <div className="flex items-center">
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{ marginRight: "8px" }}
                      />
                      <Skeleton animation="wave" width="65%" sx={{ fontSize: "20px" }} />
                    </div>
                  </div>
                )}
                {/* <Link
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
                </Link> */}
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizHeader;
