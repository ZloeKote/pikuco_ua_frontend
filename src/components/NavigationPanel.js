import Link from "./simpleComponents/Link";
import Logo from "./simpleComponents/Logo";
import DropdownLink from "./simpleComponents/DropdownLink";
import classNames from "classnames";
import { FiLogIn } from "react-icons/fi";
import { ROUTES } from "../ROUTES";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser, useLogoutMutation, logOut } from "../store";
import { useContext } from "react";
import ParamsContext from "../context/searchParams";
import { quizTypes } from "../predefined/QuizTypes";
import GeneratedUserAvatar from "./simpleComponents/GeneratedUserAvatar";
import { IconButton } from "@mui/material";

function NavigationPanel() {
  const { changeQuizzesSearchParams, changeQuizzesTypeSelection } = useContext(ParamsContext);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const { nickname } = useSelector(selectCurrentUser);
  const classnames = classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md px-2 flex");

  const handleClick = () => {
    logout(token);
    dispatch(logOut());
    // window.location.reload(true);
  };

  const userOptions = [
    {
      label: "Профіль",
      to: ROUTES.Profile(nickname?.toLowerCase()),
    },
    {
      label: "Конфіденційність",
      to: ROUTES.Privacy(nickname?.toLowerCase()),
      className: "mb-2",
    },
    {
      label: "Пройдені вікторини",
      to: ROUTES.UserCompletedQuizzes(nickname?.toLowerCase()),
    },
    {
      label: "Мої вікторини",
      to: ROUTES.UserQuizzes(nickname?.toLowerCase()),
    },
    {
      label: "Список бажаного",
      to: ROUTES.UserWishlistedQuizzes(nickname?.toLowerCase()),
      className: "mb-2",
    },
    {
      label: "Вихід",
      handleClick: handleClick,
      to: location.pathname + location.search,
    },
  ];

  let userContent = null;
  if (token) {
    userContent = (
      <DropdownLink
        options={userOptions}
        className="h-fit max-w-[260px] self-center mr-3"
        titleClassName="!rounded-full pr-1"
        to={ROUTES.Profile(nickname.toLowerCase())}
        position="right"
      >
        <div className="flex">
          <GeneratedUserAvatar
            username={nickname}
            saturation="60"
            className="h-9 mr-2 bg-lime-300 rounded-full"
          />
          <span
            className="self-center truncate text-[--dark-text] leading-none text-[16px] italic"
            title={nickname}
          >
            {nickname}
          </span>
        </div>
      </DropdownLink>
    );
  } else {
    userContent = (
      <>
        <Link className={classnames} to={ROUTES.Signup}>
          Реєстрація
        </Link>
        <Link to={ROUTES.Login}>
          <IconButton
            className="w-[35px] h-[35px] border-[--dark-quizcard-border] hover:bg-[--dark-link-background-hover]"
            title="Авторизуватися"
          >
            <FiLogIn className="text-[26px]" />
          </IconButton>
        </Link>
      </>
    );
  }

  const options = [
    {
      label: "Турніри - Відео",
      to: ROUTES.QuizzesList,
      param: "?type=TOURNAMENT_VIDEO",
      handleClick: () => {
        changeQuizzesSearchParams("?type=TOURNAMENT_VIDEO");
        changeQuizzesTypeSelection(quizTypes[1]);
        navigate({
          pathname: ROUTES.QuizzesList,
          search: "?type=TOURNAMENT_VIDEO",
        });
      },
    },
    {
      label: "Турніри - Картинки",
      to: ROUTES.QuizzesList,
      param: "?type=TOURNAMENT_PICTURE",
      handleClick: () => {
        changeQuizzesSearchParams("?type=TOURNAMENT_PICTURE");
        changeQuizzesTypeSelection(quizTypes[2]);
        navigate({
          pathname: ROUTES.QuizzesList,
          search: "?type=TOURNAMENT_PICTURE",
        });
      },
    },
  ];

  const handleClickTournierTitle = () => {
    changeQuizzesSearchParams("");
    changeQuizzesTypeSelection(quizTypes[0]);
  };

  return (
    <nav className="flex items-center justify-between pl-10 pr-10 bg-[--dark-nav] text-[--dark-text] text-[20px]">
      <div className="flex">
        <div>
          <Logo className="mr-12" />
        </div>
        <div className="flex gap-3">
          <DropdownLink
            options={options}
            to={ROUTES.QuizzesList}
            OnClickTitle={handleClickTournierTitle}
            titleClassName="px-2"
            itemBordered
          >
            Турніри
          </DropdownLink>

          <Link className={classnames} to={ROUTES.About}>
            Про нас
          </Link>
          <Link className={classnames} to={ROUTES.Contacts}>
            Контакти
          </Link>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Link className={classnames + " mr-4"} to={ROUTES.CreateQuiz}>
          Створити турнір
        </Link>
        {userContent}
      </div>
    </nav>
  );
}

export default NavigationPanel;
