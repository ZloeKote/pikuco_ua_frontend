import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken, useFetchQuizzesQuery } from "../store";
import { ROUTES } from "../ROUTES";
import { LinearProgress } from "@mui/material";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import QuizzesList from "../components/QuizzesList";
import Button from "../components/simpleComponents/Button";
import Link from "../components/simpleComponents/Link";

function UserQuizzesPage() {
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

  const { data: quizzes, isLoading } = useFetchQuizzesQuery(
    params === "" ? `?creatorNickname=${nickname}&showRoughDraft=true` : params + `&creatorNickname=${nickname}&showRoughDraft=true`
  );

  const title = (
    <div className="flex justify-between">
      <h2>МОЇ ВІКТОРИНИ</h2>
      <Button className="w-40 h-9 rounded-2xl text-[26px] self-center mr-2" primary>
        <Link to={ROUTES.Create_quiz} >Створити</Link>
      </Button>
    </div>
  );

  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title={title} section={ProfileSections.my_quizzes} userNickname={nickname}>
        {!isLoading ? (
          <QuizzesList
            className="my-2 mx-8"
            quizzes={quizzes?.quizzes}
            numPages={quizzes?.numPages}
            gapY="middle"
            gapX="middle"
            handlePageParam={handleChangeParam}
            showActions={true}
          />
        ) : (
          <LinearProgress />
        )}
      </UserProfileLayout>
    </div>
  );
}

export default UserQuizzesPage;
