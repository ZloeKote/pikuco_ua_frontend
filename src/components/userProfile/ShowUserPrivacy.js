import { useState, useEffect } from "react";
import Input from "../simpleComponents/Input";
import PasswordInput from "../simpleComponents/PasswordInput";
import { Tooltip, Typography } from "@mui/material";
import { IoCheckbox } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import classNames from "classnames";
import Button from "../simpleComponents/Button";
import { useUpdateUserPrivacyMutation, useLogoutMutation } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, logOut } from "../../store";
import { useParams } from "react-router-dom";

function ShowUserPrivacy({ user }) {
  const { nickname } = useParams();
  const [logout] = useLogoutMutation();
  const [updateUser, result] = useUpdateUserPrivacyMutation();
  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();

  const [editedEmail, setEditedEmail] = useState(user.email);
  const [actualEmail, setActualEmail] = useState(editedEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [actualCurrentPassword, setActualCurrentPassword] = useState(currentPassword);
  const [newPassword, setNewPassword] = useState("");
  const [actualNewPassword, setActualNewPassword] = useState(newPassword);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const editedInfoClassname = classNames("italic", "hover:cursor-pointer hover:underline", "text-[26px]");

  const handleChangeEmail = (e) => {
    setEditedEmail(e.target.value);
  };
  const handleCompleteEditingEmail = () => {
    setIsEditingEmail(false);
    setActualEmail(editedEmail);
  };
  const handleCloseEditingEmailOnEscape = (e) => {
    if (e.code === "Escape") {
      setIsEditingEmail(false);
      setEditedEmail(actualEmail);
    }
  };

  const handleEditEmail = () => setIsEditingEmail(true);

  const handleChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };
  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleClickChangePassword = () => setIsChangingPassword(true);
  const handleClickSavePassword = () => {
    setIsChangingPassword(false);
    setActualCurrentPassword(currentPassword);
    setActualNewPassword(newPassword);
  };
  const handleClickResetPassword = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setActualCurrentPassword("");
    setActualNewPassword("");
  };

  const handleClickSave = () => {
    updateUser({
      newEmail: actualEmail,
      newPassword: actualNewPassword,
      currentPassword: actualCurrentPassword,
      nickname: nickname,
      token: token,
    });
  };
  const handleClickReset = () => {
    setIsEditingEmail(false);
    setIsChangingPassword(false);
    setActualEmail(user.email);
    setEditedEmail(user.email);
    setCurrentPassword("");
    setNewPassword("");
  };

  useEffect(() => {
    if (result.isSuccess) {
      logout(token);
      dispatch(logOut());
    }
  }, [dispatch, logout, token, result.isSuccess]);

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
      <div className="ml-2 mt-2">
        <div className="flex flex-col leading-tight">
          <h3 className="text-[28px]">Електронна пошта</h3>
          {isEditingEmail ? (
            <form onSubmit={handleCompleteEditingEmail} className="flex gap-1 text-[24px]">
              <Input
                className="w-[300px]"
                value={editedEmail}
                onChange={handleChangeEmail}
                autoFocus
                onKeyDown={handleCloseEditingEmailOnEscape}
              />
              <button type="submit">
                <IoCheckbox className="text-[38px] text-green-500 hover:text-green-400" />
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
                <PasswordInput
                  className="text-[22px]"
                  value={currentPassword}
                  onChange={handleChangeCurrentPassword}
                />
              </div>
              <div className="mt-1">
                <h4>Новий пароль</h4>
                <PasswordInput
                  className="text-[22px]"
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                />
              </div>
              <div className="flex mt-3 gap-4">
                <Button
                  className="rounded-md w-[120px] h-[40px]"
                  secondary
                  onClick={handleClickSavePassword}
                  disabled={currentPassword === "" || newPassword === ""}
                >
                  Зберегти
                </Button>
                <Button className="rounded-md w-[120px] h-[40px]" danger onClick={handleClickResetPassword}>
                  Скасувати
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex mt-1">
              <Button
                primary
                className="w-[120px] h-[40px] text-[24px] rounded-md"
                onClick={handleClickChangePassword}
              >
                Змінити
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="pl-5 mt-5 mb-4 row-start-6 row-end-7 col-span-full flex gap-5 items-end">
        <Button
          className="w-[150px] h-[50px]"
          success
          rounded
          onClick={handleClickSave}
          disabled={
            result.isLoading ||
            (user.email === actualEmail && actualCurrentPassword === "" && actualNewPassword === "")
          }
        >
          Зберегти
        </Button>
        <Button className="w-[150px] h-[50px]" danger rounded onClick={handleClickReset}>
          Скинути
        </Button>
      </div>
    </div>
  );
}

export default ShowUserPrivacy;
