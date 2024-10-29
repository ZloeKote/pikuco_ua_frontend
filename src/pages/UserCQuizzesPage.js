import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectCurrentUser, selectCurrentToken } from "../store";
import { ROUTES } from "../ROUTES";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import QuizzesList from "../components/QuizzesList";
import { LinearProgress } from "@mui/material";
import { quizzesApi } from "../store/apis/quizzesApi";

function UserCQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = useParams();
  const [searchParams] = useSearchParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const [params, setParams] = useState(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  const token = useSelector(selectCurrentToken);

  const [fetchQuizzes, { data: quizzes, isFetching }] =
    quizzesApi.endpoints.fetchUserCompletedQuizzes.useLazyQuery();

  useEffect(() => {
    setParams(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  }, [searchParams]);
  useEffect(() => {
    fetchQuizzes({ token: token, param: params });
  }, [fetchQuizzes, token, params]);

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

  return (
    <div className="flex justify-center mt-9">
      <UserProfileLayout
        title="ПРОЙДЕНІ ВІКТОРИНИ"
        section={ProfileSections.completed_quizzes}
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
          />
        ) : (
          <LinearProgress />
        )}
      </UserProfileLayout>
    </div>
  );
}

export default UserCQuizzesPage;
