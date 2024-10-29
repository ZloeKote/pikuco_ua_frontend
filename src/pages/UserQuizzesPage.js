import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken, useDeleteQuizMutation } from "../store";
import { ROUTES } from "../ROUTES";
import { LinearProgress } from "@mui/material";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import QuizzesList from "../components/QuizzesList";
import Link from "../components/simpleComponents/Link";
import { quizzesApi } from "../store/apis/quizzesApi";
import SnackbarsContext from "../context/snackbars";
import classNames from "classnames";

function UserQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const [params, setParams] = useState(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  const token = useSelector(selectCurrentToken);
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);

  const [fetchQuizzes, { data: quizzes, isFetching }] = quizzesApi.endpoints.fetchQuizzes.useLazyQuery();
  const [deleteQuiz, result] = useDeleteQuizMutation();

  const createButtonClassname = classNames(
    "w-40 h-9 rounded-2xl text-[26px] self-center mr-2",
    "border-green-400 bg-green-600 text-white hover:bg-green-500",
    "flex justify-center items-center"
  );

  useEffect(() => {
    setParams(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  }, [searchParams]);
  useEffect(() => {
    fetchQuizzes(
      params === ""
        ? `?creatorNickname=${nickname}&showRoughDraft=true&pageSize=4`
        : params + `&creatorNickname=${nickname}&showRoughDraft=true&pageSize=4`
    );
  }, [fetchQuizzes, nickname, params]);

  useEffect(() => {
    if (nickname.toLowerCase() !== authPersonNickname?.toLowerCase())
      navigate(ROUTES.Profile(nickname), { replace: true });
  }, [authPersonNickname, navigate, nickname]);

  const handleChangeParam = (newParam) => {
    navigate({
      pathname: location.pathname,
      search: newParam,
    });
    setParams(newParam);
  };

  const title = (
    <div className="flex justify-between">
      <h2>МОЇ ВІКТОРИНИ</h2>
      <div className={createButtonClassname}>
        <Link className="w-full text-center" to={ROUTES.CreateQuiz}>
          Створити
        </Link>
      </div>
    </div>
  );

  useEffect(() => {
    if (result.isError) {
      handleEnqueueSnackbar(
        `Сталася помилка при видаленні вікторини! Код ${result.error.status}`,
        "error",
        false
      );
    }
    if (result.isSuccess) {
      handleEnqueueSnackbar("Вікторина успішно видалена!", "success");
      if (quizzes.quizzes.length === 1 && searchParams.get("page") > 1) {
        navigate({
          pathname: location.pathname,
          search: `?page=${searchParams.get("page") - 1}`,
        });
      } else {
        fetchQuizzes(
          params === ""
            ? `?creatorNickname=${nickname}&showRoughDraft=true&pageSize=4`
            : params + `&creatorNickname=${nickname}&showRoughDraft=true&pageSize=4`
        );
      }
      result.reset();
    }
  }, [
    fetchQuizzes,
    handleEnqueueSnackbar,
    nickname,
    params,
    result,
    searchParams,
    quizzes,
    location.pathname,
    navigate,
  ]);

  function handleClickDeleteQuiz(pseudoId) {
    deleteQuiz({ pseudoId: pseudoId, token })
      .unwrap()
      .catch((error) => {
        if (error.status === 400) {
          for (let i = 0; i < error.data.length; i++) {
            handleEnqueueSnackbar(error.data[i], "error");
          }
        } else if (error.status === 403) {
          handleEnqueueSnackbar("В доступі відмовлено", "error");
        } else if (error.status === 500) {
          handleEnqueueSnackbar(error.data, "error");
        } else if (error.originalStatus) {
          handleEnqueueSnackbar(error.data.error, "error");
        } else {
          handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data}`, "error");
        }
      });
  }

  return (
    <div className="flex justify-center mt-9">
      <UserProfileLayout
        title={title}
        section={ProfileSections.my_quizzes}
        userNickname={nickname}
        className="h-[776px]"
        handleParam={handleChangeParam}
      >
        {!isFetching ? (
          <QuizzesList
            className="my-2 mx-8 justify-between h-full"
            quizzes={quizzes?.quizzes}
            numPages={quizzes?.numPages}
            page={searchParams.get("page")}
            gapY="middle"
            gapX="middle"
            handlePageParam={handleChangeParam}
            showActions={true}
            onDelete={handleClickDeleteQuiz}
            isLoadingDeleting={result.isLoading}
          />
        ) : (
          <LinearProgress />
        )}
      </UserProfileLayout>
    </div>
  );
}

export default UserQuizzesPage;
