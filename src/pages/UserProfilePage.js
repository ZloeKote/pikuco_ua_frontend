import { useParams } from "react-router-dom";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { selectCurrentUser, useFetchUserByNicknameQuery } from "../store";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import ShowEditedUserProfile from "../components/userProfile/ShowEditedUserProfile";
import ShowPublicUserProfile from "../components/userProfile/ShowPublicUserProfile";
import UserNotFound from "../components/errors/UserNotFound";
import InternalServerError from "../components/errors/InternalServerError";

function UserProfilePage() {
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const { data: user, isError, error, isSuccess } = useFetchUserByNicknameQuery(nickname);

  let userContent = <LinearProgress />;
  if (isError) {
    if (error.status === 404) {
      userContent = <UserNotFound />;
    } else if(error.status === 500) {
      userContent = <InternalServerError />
    }
  }
  if (isSuccess) userContent = <ShowPublicUserProfile user={user} />;

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

  return <div className="flex justify-center mt-12">{content}</div>;
}

export default UserProfilePage;
