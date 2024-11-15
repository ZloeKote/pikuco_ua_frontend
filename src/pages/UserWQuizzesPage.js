import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser } from "../store";
import { ROUTES } from "../ROUTES";
import QuizzesList from "../components/QuizzesList";
import { quizzesApi } from "../store/apis/quizzesApi";

function UserWQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const [params, setParams] = useState(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  const token = useSelector(selectCurrentToken);

  const [fetchQuizzes, { data: quizzes, isFetching }] =
    quizzesApi.endpoints.fetchUserWishlistedQuizzes.useLazyQuery();

  useEffect(() => {
    setParams(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  }, [searchParams]);
  useEffect(() => {
    fetchQuizzes({ token: token, param: params });
  }, [fetchQuizzes, params, token]);

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
        title="СПИСОК БАЖАНОГО"
        section={ProfileSections.wishlisted_quizzes}
        userNickname={nickname}
        className="h-[776px]"
        handleParam={handleChangeParam}
      >
        <QuizzesList
          layoutClassname="justify-between h-full"
          quizzesClassName="mt-2 mx-8"
          paginationClassname="mb-2"
          quizzes={quizzes?.quizzes}
          numPages={quizzes?.numPages}
          page={searchParams.get("page")}
          gapY="middle"
          gapX="middle"
          handlePageParam={handleChangeParam}
          isFetchingQuizzes={isFetching}
          skeletonItems={4}
        />
      </UserProfileLayout>
    </div>
  );
}

export default UserWQuizzesPage;
