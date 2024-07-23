import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useFetchUserWishlistedQuizzesQuery, selectCurrentToken, selectCurrentUser } from "../store";
import { ROUTES } from "../ROUTES";
import QuizzesList from "../components/QuizzesList";
import { LinearProgress } from "@mui/material";

function UserWQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const [params, setParams] = useState(searchParams.size !== 0 ? "?" + searchParams.toString() : "");
  const token = useSelector(selectCurrentToken);

  const { data: quizzes, isLoading } = useFetchUserWishlistedQuizzesQuery({ token: token, param: params });
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
    <div className="flex justify-center mt-12">
      <UserProfileLayout
        title="СПИСОК БАЖАНОГО"
        section={ProfileSections.wishlisted_quizzes}
        userNickname={nickname}
        className="h-[776px]"
        handleParam={handleChangeParam}
      >
        {!isLoading ? (
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

export default UserWQuizzesPage;
