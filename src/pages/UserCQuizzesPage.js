import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectCurrentUser, selectCurrentToken, useFetchUserCompletedQuizzesQuery } from "../store";
import { ROUTES } from "../ROUTES";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import QuizzesList from "../components/QuizzesList";
import { LinearProgress } from "@mui/material";

function UserCQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const [params, setParams] = useState("");
  const token = useSelector(selectCurrentToken);

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

  const { data: quizzes, isLoading } = useFetchUserCompletedQuizzesQuery({ token: token, param: params });

  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout
        title="ПРОЙДЕНІ ВІКТОРИНИ"
        section={ProfileSections.completed_quizzes}
        userNickname={nickname}
      >
        {!isLoading ? (
          <QuizzesList
            className="my-2 mx-8"
            quizzes={quizzes?.quizzes}
            numPages={quizzes?.numPages}
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
