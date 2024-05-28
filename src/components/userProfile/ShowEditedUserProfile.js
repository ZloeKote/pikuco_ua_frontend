import classNames from "classnames";
import { Alert, TextField, Tooltip, Typography } from "@mui/material";
import { BsInfoCircleFill } from "react-icons/bs";
import Button from "../simpleComponents/Button";
import { useState, useEffect } from "react";
import { BiEditAlt } from "react-icons/bi";
import { IoCheckbox } from "react-icons/io5";
import Input from "../simpleComponents/Input";
import { selectCurrentToken, useUpdateUserPublicMutation } from "../../store";
import { useSelector } from "react-redux";
import { ROUTES } from "../../ROUTES";
import GeneratedUserAvatar from "../simpleComponents/GeneratedUserAvatar";

function ShowEditedUserProfile({ user }) {
  const token = useSelector(selectCurrentToken);
  const [editedNickname, setEditedNickname] = useState(user.nickname);
  const [editedDescription, setEditedDescription] = useState(user.description);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [actualNickname, setActualNickname] = useState(editedNickname);
  const [actualDescription, setActualDescription] = useState(editedDescription);
  const [updateUser, result] = useUpdateUserPublicMutation();

  const classnameLayout = classNames(
    "grid grid-cols-[200px_100px_1fr_1fr]",
    "grid-rows-[25px_repeat(3,minmax(0,65px))_300px_1fr]"
  );
  const editedInfoClassname = classNames("italic", "hover:cursor-pointer hover:underline");

  const handleEditNickname = () => setIsEditingNickname(true);
  const handleCompleteEditingNickname = () => {
    setIsEditingNickname(false);
    setActualNickname(editedNickname);
  };
  const handleCloseEditingNicknameOnEscape = (e) => {
    if (e.code === "Escape") {
      setIsEditingNickname(false);
      setEditedNickname(actualNickname);
    }
  };
  const handleChangeNickname = (e) => setEditedNickname(e.target.value);
  const handleEditDescription = () => setIsEditingDescription(true);
  const handleChangeDescription = (e) => setEditedDescription(e.target.value);
  const handleKeyDownDescription = (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
      setIsEditingDescription(false);
      setActualDescription(editedDescription);
    } else if (e.code === "Escape") {
      setIsEditingDescription(false);
      setEditedDescription(actualDescription);
    }
  };
  const handleClickReset = () => {
    setEditedNickname(user.nickname);
    setEditedDescription(user.description);
    setIsEditingNickname(false);
    setIsEditingDescription(false);
  };

  const handleClickSave = () => {
    updateUser({
      newNickname: editedNickname,
      newDescription: editedDescription,
      nickname: user.nickname,
      token: token,
    });
  };
  useEffect(() => {
    if (result.isSuccess) window.location.replace(ROUTES.Profile(editedNickname.toLowerCase()));
  }, [editedNickname, result.isSuccess]);

  let error = "";
  if (result.isError) {
    error += (
      <Alert className="absolute left-2 bottom-11 z-40" variant="filled" severity="error">
        Сталася помилка при застосуванні змін!
      </Alert>
    );
  }

  let userBirthdate = "Не вказано";
  const userCreationDate = new Date(user.creationDate);
  if (user.birthdate) {
    userBirthdate = new Date(user.birthdate);
    userBirthdate = `${
      userBirthdate.getDate() < 10 ? "0" + userBirthdate.getDate() : userBirthdate.getDate()
    }.${
      userBirthdate.getMonth() + 1 < 10 ? "0" + (userBirthdate.getMonth() + 1) : userBirthdate.getMonth() + 1
    }.${userBirthdate.getFullYear()}`;
  }
  const formattedShortCreationDate = `${
    userCreationDate.getDate() < 10 ? "0" + userCreationDate.getDate() : userCreationDate.getDate()
  }.${
    userCreationDate.getMonth() + 1 < 10
      ? "0" + (userCreationDate.getMonth() + 1)
      : userCreationDate.getMonth() + 1
  }.${userCreationDate.getFullYear()}`;
  const formattedFullCreationDate = `${
    userCreationDate.getDate() < 10 ? "0" + userCreationDate.getDate() : userCreationDate.getDate()
  }.${
    userCreationDate.getMonth() + 1 < 10
      ? "0" + (userCreationDate.getMonth() + 1)
      : userCreationDate.getMonth() + 1
  }.${userCreationDate.getFullYear()}, ${
    userCreationDate.getHours() < 10 ? "0" + userCreationDate.getHours() : userCreationDate.getHours()
  }:${
    userCreationDate.getMinutes() < 10 ? "0" + userCreationDate.getMinutes() : userCreationDate.getMinutes()
  }:${
    userCreationDate.getSeconds() < 10 ? "0" + userCreationDate.getSeconds() : userCreationDate.getSeconds()
  }`;

  return (
    <div className={classnameLayout}>
      <div className="row-start-1 row-end-1 col-start-1 col-end-1 z-10 flex items-center text-[--dark-link-text-hover] text-[18px]">
        <div className="hover:cursor-default">
          <Tooltip title={<Typography>{formattedFullCreationDate}</Typography>}>
            <span className="pl-2">{formattedShortCreationDate}</span>
          </Tooltip>
        </div>
        <div className="ml-2 hover:cursor-pointer hover:text-[--dark-quizcard-description]">
          <Tooltip title={<Typography>Дата створення акаунту</Typography>}>
            <span>
              <BsInfoCircleFill />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="row-start-1 row-end-5 col-start-1 col-end-3 flex items-center justify-center">
        <GeneratedUserAvatar
          username={user.nickname}
          saturation="60"
          className="w-40 h-40 bg-lime-300 rounded-full"
        />
        {/* <img
          className="w-40 h-40 rounded-sm"
          src={user.avatar === "some path" ? defaultAvatar : user.avatar}
          alt={`${user.nickname}'s profile`}
        /> */}
      </div>
      <div className="col-start-3 col-end-4 row-start-2 row-end-5">
        <div className="mb-2 leading-tight">
          <h3>Нікнейм</h3>
          {isEditingNickname ? (
            <form onSubmit={handleCompleteEditingNickname} className="flex gap-1 text-[20px]">
              <Input
                className="w-[150px]"
                value={editedNickname}
                onChange={handleChangeNickname}
                autoFocus
                onKeyDown={handleCloseEditingNicknameOnEscape}
              />
              <button type="submit">
                <IoCheckbox className="text-[27px] text-green-500 hover:text-green-400" />
              </button>
            </form>
          ) : (
            <div className="flex gap-2">
              <Tooltip title={<Typography>Натисніть, щоб змінити нікнейм</Typography>} arrow>
                <span className={editedInfoClassname} onClick={handleEditNickname}>
                  {actualNickname}
                </span>
              </Tooltip>
              <button
                onClick={handleEditNickname}
                className="text-[--dark-link-text-hover] hover:text-[--dark-quizcard-description]"
              >
                <BiEditAlt />
              </button>
            </div>
          )}
        </div>
        <div className="mb-2 leading-tight">
          <h3>Роль</h3>
          <span className="italic">{user.role}</span>
        </div>
        <div className="leading-tight">
          <h3>Дата народження</h3>
          <span className="italic">{userBirthdate}</span>
        </div>
      </div>
      <div className="px-5 row-start-5 row-end-6 col-span-full border-t border-[--dark-link-text-hover]">
        <h2 className="text-[28px]">Опис</h2>
        {isEditingDescription ? (
          <TextField
            sx={{ lineHeight: 0 }}
            variant="outlined"
            value={editedDescription}
            onChange={handleChangeDescription}
            fullWidth
            multiline
            maxRows={9}
            onKeyDownCapture={handleKeyDownDescription}
            autoFocus
          />
        ) : (
          <Tooltip title={<Typography>Натисніть, щоб змінити опис</Typography>} arrow placement="left">
            <p className={editedInfoClassname} onClick={handleEditDescription}>
              {actualDescription || "Змінити опис..."}
            </p>
          </Tooltip>
        )}
      </div>
      <div className="pl-5 mt-5 mb-4 row-start-6 row-end-7 col-span-full flex gap-5 items-end">
        <Button
          className="w-[150px] h-[50px]"
          success
          rounded
          onClick={handleClickSave}
          disabled={
            result.isLoading || (user.nickname === actualNickname && user.description === actualDescription)
          }
        >
          Зберегти
        </Button>
        <Button className="w-[150px] h-[50px]" danger rounded onClick={handleClickReset}>
          Скинути
        </Button>
      </div>
      {error}
    </div>
  );
}

export default ShowEditedUserProfile;
