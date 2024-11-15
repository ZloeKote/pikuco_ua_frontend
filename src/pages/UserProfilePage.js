import { useParams } from "react-router-dom";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { selectCurrentUser, useFetchUserByNicknameQuery } from "../store";
import { useSelector } from "react-redux";
import ShowEditedUserProfile from "../components/userProfile/ShowEditedUserProfile";
import ShowPublicUserProfile from "../components/userProfile/ShowPublicUserProfile";
import UserNotFound from "../components/errors/UserNotFound";
import InternalServerError from "../components/errors/InternalServerError";
import { useContext } from "react";
import SnackbarsContext from "../context/snackbars";

function UserProfilePage() {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const { data: user, isError, error, isSuccess, isFetching } = useFetchUserByNicknameQuery(nickname);

  if (isError) {
    if (error.status === 404) {
      return <UserNotFound />;
    } else if (error.status === 500) {
      return <InternalServerError />;
    } else if (error.originalStatus) {
      handleEnqueueSnackbar("Сталася непередбачувана помилка! Спробуйте пізніше", "error", false);
    }
  }

  let content = <ShowPublicUserProfile user={user} isFetchingUser={isFetching} />;
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

  return <div className="flex justify-center mt-9">{content}</div>;
}

export default UserProfilePage;
