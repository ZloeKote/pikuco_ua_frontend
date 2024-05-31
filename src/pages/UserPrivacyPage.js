import { useParams } from "react-router-dom";
import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../store";
import { ROUTES } from "../ROUTES";
import { useFetchUserPrivacyByNicknameQuery } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import ShowUserPrivacy from "../components/userProfile/ShowUserPrivacy";
import { LinearProgress } from "@mui/material";
import SnackbarsContext from "../context/snackbars";

function UserPrivacyPage() {
  const navigate = useNavigate();
  const { nickname } = useParams();
  const { nickname: authPersonNickname } = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useFetchUserPrivacyByNicknameQuery({ nickname: nickname, token: token });

  useEffect(() => {
    if (nickname.toLowerCase() !== authPersonNickname?.toLowerCase())
      navigate(ROUTES.Profile(nickname), { replace: true });
  }, [authPersonNickname, navigate, nickname]);

  if (isError) {
    if (error.status === 400) {
      for (let i = 0; i < error.data.length; i++) {
        handleEnqueueSnackbar(error.data[i], "error");
      }
    } else if (error.status === 403) {
      handleEnqueueSnackbar("В доступі відмовлено", "error");
    } else if (error.status === 401 || error.status === 500) {
      handleEnqueueSnackbar(error.data.error, "error");
    } else if (error.originalStatus) {
      handleEnqueueSnackbar(error.data, "error");
    } else {
      handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data.error}`, "error");
    }
    if (nickname.toLowerCase() !== authPersonNickname?.toLowerCase())
      navigate(ROUTES.Profile(nickname), { replace: true });
  }

  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title="КОНФІДЕНЦІЙНІСТЬ" section={ProfileSections.privacy} userNickname={nickname}>
        {!isLoading ? <ShowUserPrivacy user={user} /> : <LinearProgress />}
      </UserProfileLayout>
    </div>
  );
}

export default UserPrivacyPage;
