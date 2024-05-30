import classNames from "classnames";
import { Tooltip, Typography } from "@mui/material";
import { BsInfoCircleFill } from "react-icons/bs";
import GeneratedUserAvatar from "../simpleComponents/GeneratedUserAvatar";

function ShowPublicUserProfile({ user }) {
  const classnameLayout = classNames(
    "grid grid-cols-[200px_100px_1fr_1fr]",
    "grid-rows-[25px_repeat(3,minmax(0,65px))_300px]",
    "bg-[--dark-quizcard-background]",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "w-[60rem] h-fit text-[20px]"
  );

  let userBirthdate = "Не вказано";
  if (user.birthdate) userBirthdate = formatDate(new Date(user.birthdate));

  const formattedShortCreationDate = formatDate(new Date(user.creationDate));
  const formattedFullCreationDate = formatDate(new Date(user.creationDate), true)

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
          <span className="italic">{user.nickname}</span>
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
        <h2 className="text-[28px] bold">Опис</h2>
        <p className="italic">{user.description}</p>
      </div>
    </div>
  );
}

export default ShowPublicUserProfile;

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
