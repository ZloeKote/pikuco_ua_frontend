import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Tooltip,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Modal,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IoCheckbox } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import classNames from "classnames";
import Button from "../simpleComponents/Button";
import { useUpdateUserPrivacyMutation, useLogoutMutation, useDeleteUserMutation } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, logOut } from "../../store";
import { useParams } from "react-router-dom";
import { validateEmail, validatePassword } from "../../hooks/validate-hooks";
import { LoadingButton } from "@mui/lab";
import { RiSave3Fill } from "react-icons/ri";
import SnackbarsContext from "../../context/snackbars";
import { ROUTES } from "../../ROUTES";

const modalStyle = {
  position: "absolute",
  top: "15%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "var(--dark-quizcard-background)",
  border: "1px solid var(--dark-quizcard-border)",
  borderRadius: 4,
  boxShadow: 12,
  p: 2,
};

function ShowUserPrivacy({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const { nickname } = useParams();
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);

  const [editedEmail, setEditedEmail] = useState(user.email);
  const [actualEmail, setActualEmail] = useState(editedEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [actualCurrentPassword, setActualCurrentPassword] = useState(currentPassword);
  const [newPassword, setNewPassword] = useState("");
  const [actualNewPassword, setActualNewPassword] = useState(newPassword);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [isCurrentPasswordError, setIsCurrentPasswordError] = useState(false);
  const [currentPasswordErrorMsg, setCurrentPasswordErrorMsg] = useState("");
  const [isNewPasswordError, setIsNewPasswordError] = useState(false);
  const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteQuizzes, setDeleteQuizzes] = useState(false);

  const [logout] = useLogoutMutation();
  const [updateUser, resultUpdate] = useUpdateUserPrivacyMutation();
  const [deleteUser, resultDelete] = useDeleteUserMutation();

  const editedInfoClassname = classNames("italic", "hover:cursor-pointer hover:underline", "text-[26px]");

  useEffect(() => {
    if (resultUpdate.isSuccess) {
      logout(token).then(() => {
        navigate(ROUTES.Login);
      });
      dispatch(logOut());
    }
  }, [dispatch, logout, token, resultUpdate.isSuccess, navigate]);

  const handleChangeEmail = (e) => {
    setEditedEmail(e.target.value);
    validateEmail(e.target.value, setIsEmailError, setEmailErrorMsg);
  };
  const handleCompleteEditingEmail = (e) => {
    e.preventDefault();
    if (validateEmail(editedEmail, setIsEmailError, setEmailErrorMsg)) {
      setIsEditingEmail(false);
      setActualEmail(editedEmail);
    }
  };
  const handleCloseEditingEmailOnEscape = (e) => {
    if (e.code === "Escape") {
      setIsEditingEmail(false);
      setEditedEmail(actualEmail);

      setIsEmailError(false);
      setEmailErrorMsg("");
    }
  };

  const handleEditEmail = () => setIsEditingEmail(true);

  const handleChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
    validatePassword(e.target.value, setIsCurrentPasswordError, setCurrentPasswordErrorMsg);
  };
  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
    validatePassword(e.target.value, setIsNewPasswordError, setNewPasswordErrorMsg);
  };
  const handleClickChangePassword = () => setIsChangingPassword(true);
  const handleClickSavePassword = () => {
    if (
      validatePassword(currentPassword, setIsCurrentPasswordError, setCurrentPasswordErrorMsg) &&
      validatePassword(newPassword, setIsNewPasswordError, setNewPasswordErrorMsg)
    ) {
      setIsChangingPassword(false);
      setActualCurrentPassword(currentPassword);
      setActualNewPassword(newPassword);
    }
  };
  const handleClickResetPassword = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setActualCurrentPassword("");
    setActualNewPassword("");

    setIsCurrentPasswordError(false);
    setCurrentPasswordErrorMsg("");
    setIsNewPasswordError(false);
    setNewPasswordErrorMsg("");
  };

  const handleClickReset = () => {
    setIsEditingEmail(false);
    setIsChangingPassword(false);
    setActualEmail(user.email);
    setEditedEmail(user.email);
    setCurrentPassword("");
    setNewPassword("");

    setIsEmailError(false);
    setEmailErrorMsg("");
    setIsCurrentPasswordError(false);
    setCurrentPasswordErrorMsg("");
    setIsNewPasswordError(false);
    setNewPasswordErrorMsg("");
  };
  const handleClickShowCurrentPassword = () => setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  const handleClickShowNewPassword = () => setIsNewPasswordVisible(!isNewPasswordVisible);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleClickSave = () => {
    updateUser({
      newEmail: actualEmail,
      newPassword: actualNewPassword,
      currentPassword: actualCurrentPassword,
      nickname: nickname,
      token: token,
    })
      .unwrap()
      .catch((error) => {
        console.log(error);
        if (error.status === 400) {
          for (let i = 0; i < error.data.length; i++) {
            handleEnqueueSnackbar(error.data[i], "error");
          }
        } else if (error.status === 403) {
          handleEnqueueSnackbar("В доступі відмовлено", "error");
        } else if (error.status === 500) {
          handleEnqueueSnackbar(error.data, "error");
        } else if (error.originalStatus) {
          handleEnqueueSnackbar(error.data.error, "error");
        } else {
          handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data}`, "error");
        }
      });
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const handleClickCheckboxDeleteQuizzes = () => setDeleteQuizzes(!deleteQuizzes);

  const handleSubmitDeleteUser = (e) => {
    e.preventDefault();
    deleteUser({
      nickname: nickname,
      deleteQuizzes: deleteQuizzes,
      token: token,
    })
      .unwrap()
      .then(() => {
        logout(token).then(() => {
          navigate(ROUTES.Main);
        });
        dispatch(logOut());
      });
    handleCloseDeleteModal();
  };

  let passwordTitle = <h3 className="text-[28px]">Пароль</h3>;
  if (actualCurrentPassword !== "" && actualNewPassword !== "") {
    passwordTitle = (
      <Tooltip title={<Typography>Ви змінили пароль</Typography>} placement="right" arrow>
        <h3 className="text-[28px] italic w-fit">Пароль*</h3>
      </Tooltip>
    );
  }

  return (
    <div className="flex flex-col h-[606px] justify-between">
      <div className="ml-2 mt-2 flex flex-col basis-full">
        <div className="grid grid-rows-[111px_1fr] leading-tight">
          <div>
            <h3 className="text-[28px]">Електронна пошта</h3>
            {isEditingEmail ? (
              <form onSubmit={handleCompleteEditingEmail} className="flex gap-1 text-[24px]">
                <TextField
                  id="email"
                  value={editedEmail}
                  onChange={handleChangeEmail}
                  autoFocus
                  onKeyDown={handleCloseEditingEmailOnEscape}
                  size="small"
                  error={isEmailError}
                  helperText={isEmailError ? emailErrorMsg : " "}
                  inputProps={{ style: { fontSize: "24px" } }}
                />
                <button type="submit" className="self-start">
                  <IoCheckbox className="text-[51px] text-green-500 hover:text-green-400" />
                </button>
              </form>
            ) : (
              <div className="flex gap-2">
                <Tooltip title={<Typography>Натисніть, щоб змінити пошту</Typography>} arrow>
                  <span className={editedInfoClassname} onClick={handleEditEmail}>
                    {actualEmail}
                  </span>
                </Tooltip>
                <button
                  onClick={handleEditEmail}
                  className="text-[--dark-link-text-hover] hover:text-[--dark-quizcard-description]"
                >
                  <BiEditAlt />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-4">
            {passwordTitle}
            {isChangingPassword ? (
              <div>
                <div>
                  <h4>Поточний пароль</h4>
                  <OutlinedInput
                    value={currentPassword}
                    onChange={handleChangeCurrentPassword}
                    type={isCurrentPasswordVisible ? "text" : "password"}
                    placeholder="arroweatsbugs123"
                    margin="none"
                    size="small"
                    inputProps={{ style: { fontSize: "22px" } }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {isCurrentPasswordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                    error={isCurrentPasswordError}
                  />
                  <FormHelperText sx={{ marginX: "14px" }} error={isCurrentPasswordError}>
                    {isCurrentPasswordError ? currentPasswordErrorMsg : " "}
                  </FormHelperText>
                </div>
                <div className="mt-1">
                  <h4>Новий пароль</h4>
                  <OutlinedInput
                    value={newPassword}
                    onChange={handleChangeNewPassword}
                    type={isNewPasswordVisible ? "text" : "password"}
                    placeholder="arroweatsbugs123"
                    margin="none"
                    size="small"
                    inputProps={{ style: { fontSize: "22px" } }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {isNewPasswordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                    error={isNewPasswordError}
                  />
                  <FormHelperText sx={{ marginX: "14px" }} error={isNewPasswordError}>
                    {isNewPasswordError ? newPasswordErrorMsg : " "}
                  </FormHelperText>
                </div>
                <div className="flex mt-3 gap-4">
                  <Button
                    color="secondary"
                    variant="contained"
                    className="w-[120px] h-[40px]"
                    onClick={handleClickSavePassword}
                    disabled={currentPassword === "" || newPassword === ""}
                  >
                    Зберегти
                  </Button>
                  <Button
                    className="w-[120px] h-[40px]"
                    color="warning"
                    variant="contained"
                    onClick={handleClickResetPassword}
                  >
                    Скасувати
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex mt-1">
                <Button
                  color="primary"
                  variant="contained"
                  className="w-[120px] h-[40px]"
                  onClick={handleClickChangePassword}
                >
                  Змінити
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grow flex items-end">
          <Button className="w-max h-[40px]" color="error" onClick={handleOpenDeleteModal}>
            <span className="text-[length:var(--desktop-title-text-size)]">Видалити акаунт</span>
          </Button>
          <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
            <Box sx={modalStyle}>
              <Typography variant="h5" component="h2" sx={{ textAlign: "center" }}>
                Ви дійсно хочете видалити акаунт?
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <form onSubmit={handleSubmitDeleteUser}>
                  <input
                    type="checkbox"
                    id="deleteQuizzes"
                    value={deleteQuizzes}
                    onClick={handleClickCheckboxDeleteQuizzes}
                    className="mr-[0.4rem] mb-8"
                  />
                  <label for="deleteQuizzes">Також видалити створені вікторини</label>

                  <br />
                  <span className="text-[length:var(--desktop-smallest-text-size)]">
                    *Відновлення акаунту після видалення неможливе
                  </span>

                  <div className="flex justify-between">
                    <Button className="h-[40px] w-fit px-8" variant="contained" color="error" type="submit">
                      <span className="text-[length:var(--desktop-body-text-size)]">Видалити</span>
                    </Button>
                    <Button
                      className="h-[40px] w-fit px-8"
                      variant="contained"
                      type="button"
                      onClick={handleCloseDeleteModal}
                    >
                      <span className="text-[length:var(--desktop-body-text-size)]">Скасувати</span>
                    </Button>
                  </div>
                </form>
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>

      <div className="pl-5 mt-5 mb-4 row-start-6 row-end-7 col-span-full flex gap-5 items-end">
        <LoadingButton
          loading={resultUpdate.isLoading}
          loadingPosition="start"
          startIcon={<RiSave3Fill />}
          className="w-[150px] h-[50px]"
          color="success"
          type="submit"
          variant="contained"
          onClick={handleClickSave}
          disabled={
            resultUpdate.isLoading ||
            (user.email === actualEmail && actualCurrentPassword === "" && actualNewPassword === "")
          }
        >
          <span>Зберегти</span>
        </LoadingButton>
        <Button
          className="w-[150px] h-[50px]"
          type="button"
          color="primary"
          variant="contained"
          onClick={handleClickReset}
        >
          Скинути
        </Button>
      </div>
    </div>
  );
}

export default ShowUserPrivacy;
