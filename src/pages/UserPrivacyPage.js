import { useParams } from "react-router-dom";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../store";
import { ROUTES } from "../ROUTES";
import { useFetchUserPrivacyByNicknameQuery } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ShowUserPrivacy from "../components/userProfile/ShowUserPrivacy";
import { LinearProgress } from "@mui/material";

function UserPrivacyPage() {
  const navigate = useNavigate();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    if (nickname.toLowerCase() !== authPersonNickname?.toLowerCase())
      navigate(ROUTES.Profile(nickname), { replace: true });
  }, [authPersonNickname, navigate, nickname]);
  const { data: user, isLoading } = useFetchUserPrivacyByNicknameQuery({ nickname: nickname, token: token });

  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title="КОНФІДЕНЦІЙНІСТЬ" section={ProfileSections.privacy} userNickname={nickname}>
        {!isLoading ? <ShowUserPrivacy user={user} /> : <LinearProgress />}
      </UserProfileLayout>
    </div>
  );
}

export default UserPrivacyPage;
