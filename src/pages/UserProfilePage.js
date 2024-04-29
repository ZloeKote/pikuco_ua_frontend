import { useParams } from "react-router-dom";
import UserProfileLayout from "../components/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { selectCurrentUser, useFetchUserByNicknameQuery } from "../store";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import ShowEditedUserProfile from "../components/ShowEditedUserProfile";
import ShowPublicUserProfile from "../components/ShowPublicUserProfile";

function UserProfilePage() {
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const { data: user, isLoading, error, isSuccess } = useFetchUserByNicknameQuery(nickname);

  let userContent = <LinearProgress />;
  if (error) userContent = `Виникла помилка! Код: ${error.status}`;
  if (isSuccess) {
    userContent = <ShowPublicUserProfile user={user} />;
  }

  let content = userContent;
  if (nickname.toLowerCase() === authPersonNickname?.toLowerCase() && isSuccess) {
    content = (
      <UserProfileLayout
        title="ПРОФІЛЬ КОРИСТУВАЧА"
        section={ProfileSections.general}
        userNickname={nickname}
      >
        <ShowEditedUserProfile user={user} />
      </UserProfileLayout>
    );
  }

  return (
    <div className="flex justify-center mt-12">
      {content}
    </div>
  );
}

export default UserProfilePage;
