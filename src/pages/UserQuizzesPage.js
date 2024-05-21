import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken, useDeleteQuizMutation } from "../store";
import { ROUTES } from "../ROUTES";
import { LinearProgress } from "@mui/material";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import QuizzesList from "../components/QuizzesList";
import Button from "../components/simpleComponents/Button";
import Link from "../components/simpleComponents/Link";
import { quizzesApi } from "../store/apis/quizzesApi";
import SnackbarsContext from "../context/snackbars";

function UserQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const [params, setParams] = useState("");
  const token = useSelector(selectCurrentToken);
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);

  const [fetchQuizzes, { data: quizzes, isLoading }] = quizzesApi.endpoints.fetchQuizzes.useLazyQuery();
  const [deleteQuiz, result] = useDeleteQuizMutation();

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
      <Button className="w-40 h-9 rounded-2xl text-[26px] self-center mr-2" primary>
        <Link to={ROUTES.CreateQuiz}>Створити</Link>
      </Button>
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
      if (quizzes.quizzes.length === 1 && searchParams.get("page") > 1) {
        setParams(`?page=${searchParams.get("page") - 1}`);
        searchParams.set("page", searchParams.get("page") - 1);
      } else {
        fetchQuizzes(
          params === ""
            ? `?creatorNickname=${nickname}&showRoughDraft=true&pageSize=4`
            : params + `&creatorNickname=${nickname}&showRoughDraft=true&pageSize=4`
        );
      }
      result.reset();
    }
  }, [fetchQuizzes, handleEnqueueSnackbar, nickname, params, result, searchParams, quizzes]);

  function handleClickDeleteQuiz(pseudoId) {
    deleteQuiz({ pseudoId: pseudoId, token });
  }

  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout
        title={title}
        section={ProfileSections.my_quizzes}
        userNickname={nickname}
        className="h-[776px]"
      >
        {!isLoading ? (
          <QuizzesList
            className="my-2 mx-8 justify-between h-full"
            quizzes={quizzes?.quizzes}
            numPages={quizzes?.numPages}
            gapY="middle"
            gapX="middle"
            handlePageParam={handleChangeParam}
            showActions={true}
            onDelete={handleClickDeleteQuiz}
          />
        ) : (
          <LinearProgress />
        )}
      </UserProfileLayout>
    </div>
  );
}

export default UserQuizzesPage;
