import Link from "./simpleComponents/Link";
import Logo from "./simpleComponents/Logo";
import avatar from "../img/avatar.png";
import DropdownLink from "./simpleComponents/DropdownLink";
import classNames from "classnames";
import Button from "./simpleComponents/Button";
import { FiLogIn } from "react-icons/fi";
import { ROUTES } from "../ROUTES";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectCurrentToken,
  selectCurrentUser,
  selectCurrentAvatar,
  useLogoutMutation,
  logOut,
} from "../store";
import { useContext } from "react";
import ParamsContext from "../context/searchParams";
import { optionsType } from "../predefined/OptionsType";

function NavigationPanel() {
  const { changeQuizzesSearchParams, changeQuizzesTypeSelection } = useContext(ParamsContext);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const { nickname } = useSelector(selectCurrentUser);
  const userAvatar = useSelector(selectCurrentAvatar);
  const classnames = classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md px-2 flex");

  const handleClick = () => {
    logout(token);
    dispatch(logOut());
    window.location.reload(true);
  };

  const userOptions = [
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
      >
        <div className="flex">
          <img src={userAvatar === "some path" ? avatar : userAvatar} alt="creator" className="h-9 mr-2" />
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
      <div className="flex gap-3 items-center">
        <Link className={classnames} to={ROUTES.Signup}>
          Реєстрація
        </Link>
        <Link to={ROUTES.Login}>
          <Button
            className="w-[35px] h-[35px] border-[--dark-quizcard-border] hover:bg-[--dark-link-background-hover]"
            rounded
          >
            <FiLogIn className="text-[26px]" />
          </Button>
        </Link>
      </div>
    );
  }

  const options = [
    {
      label: "Турніри - Відео",
      to: ROUTES.QuizzesList,
      param: "?type=TOURNAMENT_VIDEO",
      handleClick: () => {
        changeQuizzesSearchParams("?type=TOURNAMENT_VIDEO");
        changeQuizzesTypeSelection(optionsType[1]);
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
        changeQuizzesTypeSelection(optionsType[2]);
        navigate({
          pathname: ROUTES.QuizzesList,
          search: "?type=TOURNAMENT_PICTURE",
        });
      },
    },
  ];

  const handleClickTournierTitle = () => {
    changeQuizzesSearchParams("");
    changeQuizzesTypeSelection(optionsType[0]);
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
      {userContent}
    </nav>
  );
}

export default NavigationPanel;
