import classNames from "classnames";
import { TextField, Tooltip, Typography, Button } from "@mui/material";
import { BsInfoCircleFill } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import { BiEditAlt } from "react-icons/bi";
import { IoCheckbox } from "react-icons/io5";
import { selectCurrentToken, useUpdateUserPublicMutation } from "../../store";
import { useSelector } from "react-redux";
import { ROUTES } from "../../ROUTES";
import GeneratedUserAvatar from "../simpleComponents/GeneratedUserAvatar";
import { validateNickname, validateUserDescription } from "../../hooks/validate-hooks";
import { LoadingButton } from "@mui/lab";
import { RiSave3Fill } from "react-icons/ri";
import SnackbarsContext from "../../context/snackbars";

function ShowEditedUserProfile({ user }) {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const token = useSelector(selectCurrentToken);
  const [editedNickname, setEditedNickname] = useState(user.nickname);
  const [editedDescription, setEditedDescription] = useState(user.description);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [actualNickname, setActualNickname] = useState(editedNickname);
  const [actualDescription, setActualDescription] = useState(editedDescription);
  const [isNicknameError, setIsNicknameError] = useState(false);
  const [nicknameErrorMsg, setNicknameErrorMsg] = useState("");
  const [isDescrError, setIsDescrError] = useState(false);
  const [descrErrorMsg, setDescrErrorMsg] = useState("");

  const [updateUser, result] = useUpdateUserPublicMutation();

  useEffect(() => {
    setEditedNickname(user.nickname);
    setActualNickname(user.nickname);
    setEditedDescription(user.description);
    setActualDescription(user.description);
  }, [user]);

  const classnameLayout = classNames(
    "grid grid-cols-[200px_100px_1fr_1fr]",
    "grid-rows-[25px_repeat(3,minmax(0,80px))_255px_1fr]"
  );
  const editedInfoClassname = classNames("italic break-words", "hover:cursor-pointer hover:underline");

  const handleEditNickname = () => setIsEditingNickname(true);

  const handleCompleteEditingNickname = (e) => {
    e.preventDefault();
    if (validateNickname(editedNickname, setIsNicknameError, setNicknameErrorMsg)) {
    setIsEditingNickname(false);
    setActualNickname(editedNickname);
    }
  };
  const handleCloseEditingNicknameOnEscape = (e) => {
    if (e.code === "Escape") {
      setIsEditingNickname(false);
      setEditedNickname(actualNickname);

      setIsNicknameError(false);
      setNicknameErrorMsg("");
    }
  };
  const handleChangeNickname = (e) => {
    setEditedNickname(e.target.value);
    validateNickname(e.target.value, setIsNicknameError, setNicknameErrorMsg);
  };
  const handleEditDescription = () => setIsEditingDescription(true);
  const handleChangeDescription = (e) => {
    setEditedDescription(e.target.value);
    validateUserDescription(e.target.value, setIsDescrError, setDescrErrorMsg);
  };
  const handleKeyDownDescription = (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (validateUserDescription(editedDescription, setIsDescrError, setDescrErrorMsg)) {
        setIsEditingDescription(false);
        setActualDescription(editedDescription);
      }
    } else if (e.code === "Escape") {
      setIsEditingDescription(false);
      setEditedDescription(actualDescription);

      setIsDescrError(false);
      setDescrErrorMsg("");
    }
  };
  const handleClickReset = () => {
    setEditedNickname(user.nickname);
    setActualNickname(user.nickname);
    setEditedDescription(user.description);
    setActualDescription(user.description);
    setIsEditingNickname(false);
    setIsEditingDescription(false);
    setIsNicknameError(false);
    setNicknameErrorMsg("");
    setIsDescrError(false);
    setDescrErrorMsg("");
  };

  const handleClickSave = () => {
    const validNickname = validateNickname(actualNickname, setIsNicknameError, setNicknameErrorMsg);
    const validDescription = validateUserDescription(actualDescription, setIsDescrError, setDescrErrorMsg);
    if (validNickname && validDescription) {
    updateUser({
      newNickname: editedNickname,
      newDescription: editedDescription,
      nickname: user.nickname,
      token: token,
    })
      .unwrap()
      .catch((error) => {
        if (error.status === 400) {
          for (let i = 0; i < error.data.length; i++) {
            handleEnqueueSnackbar(error.data[i], "error");
          }
        } else if (error.status === 403) {
          handleEnqueueSnackbar("В доступі відмовлено", "error");
        } else if (error.status === 500) {
          handleEnqueueSnackbar(error.data, "error");
        } else if (error.originalStatus) {
          handleEnqueueSnackbar(error.data, "error");
        } else {
          handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data}`, "error");
        }
      });
    } else if (!validNickname) setIsEditingNickname(true);
    else if (!validDescription) setIsEditingDescription(true);
  };
  useEffect(() => {
    if (result.isSuccess) window.location.replace(ROUTES.Profile(editedNickname.toLowerCase()));
  }, [editedNickname, result.isSuccess]);

  let userBirthdate = "Не вказано";
  if (user.birthdate) userBirthdate = formatDate(new Date(user.birthdate));

  const formattedShortCreationDate = formatDate(new Date(user.creationDate));
  const formattedFullCreationDate = formatDate(new Date(user.creationDate), true);

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
          className="w-52 h-52 bg-lime-300 rounded-full"
        />
      </div>
      <div className="leading-tight col-start-3 col-end-4 row-start-2 row-end-3">
        <h3>Нікнейм</h3>
        {isEditingNickname ? (
          <form onSubmit={handleCompleteEditingNickname} className="flex gap-1">
            <TextField
              id="nickname"
              value={editedNickname}
              onChange={handleChangeNickname}
              autoFocus
              onKeyDown={handleCloseEditingNicknameOnEscape}
              size="small"
              error={isNicknameError}
              helperText={isNicknameError && nicknameErrorMsg}
              FormHelperTextProps={{ style: { marginLeft: 0, marginTop: 0 } }}
              fullWidth
              inputProps={{ style: { padding: 2, fontSize: "20px" } }}
            />
            <button className="self-start" type="submit">
              <IoCheckbox className="text-[32px] text-green-500 hover:text-green-400" />
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
      <div className="leading-tight col-start-3 col-end-4 row-start-3 row-end-4">
        <h3>Роль</h3>
        <span className="italic">{user.role}</span>
      </div>
      <div className="leading-tight col-start-3 col-end-4 row-start-4 row-end-5">
        <h3>Дата народження</h3>
        <span className="italic">{userBirthdate}</span>
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
            maxRows={8}
            onKeyDownCapture={handleKeyDownDescription}
            autoFocus
            error={isDescrError}
            helperText={isDescrError && descrErrorMsg}
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
        <LoadingButton
          loading={result.isLoading}
          loadingPosition="start"
          startIcon={<RiSave3Fill />}
          className="w-[150px] h-[50px]"
          color="success"
          type="submit"
          variant="contained"
          onClick={handleClickSave}
          disabled={
            result.isLoading || (user.nickname === actualNickname && user.description === actualDescription)
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

export default ShowEditedUserProfile;

function formatDate(date, detailed) {
  if (detailed) {
    return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }.${date.getFullYear()}, ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`;
  } else {
    return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    }.${date.getFullYear()}`;
  }
}
