import Link from "./Link";
import Logo from "./Logo";
import avatar from "../img/avatar.png";
import DropdownLink from "./DropdownLink";
import classNames from "classnames";
import Button from "./Button";
import { FiLogIn } from "react-icons/fi";
import { ROUTES } from "../ROUTES";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser, selectCurrentAvatar, useLogoutMutation, logOut } from "../store";

function NavigationPanel() {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const email = useSelector(selectCurrentUser);
  const userAvatar = useSelector(selectCurrentAvatar);
  const classnames = classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md px-2 flex");

  const handleClick = () => {
    logout(token);
    dispatch(logOut());
    navigate(location.pathname);
  };

  const userOptions = [
    {
      label: "Вихід",
      handleClick: handleClick,
    },
  ];

  let userContent = null;
  if (token) {
    userContent = (
      <DropdownLink
        options={userOptions}
        onClick
        className="h-fit max-w-[260px] self-center mr-3"
        titleClassName="!rounded-full pr-1"
        to={ROUTES.Profile(email)}
      >
        <div className="flex">
          <img src={avatar} alt="creator" className="h-9 mr-2" />
          <span
            className="self-center truncate text-[--dark-text] leading-none text-[16px] italic"
            title={email}
          >
            {email}
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
    },
    {
      label: "Турніри - Картинки",
      to: ROUTES.QuizzesList,
    },
  ];

  return (
    <nav className="flex items-center justify-between pl-10 pr-10 bg-[--dark-nav] text-[--dark-text] text-[20px]">
      <div className="flex">
        <div>
          <Logo className="mr-12" />
        </div>
        <div className="flex gap-3">
          <DropdownLink options={options} to={ROUTES.QuizzesList} titleClassName="px-2">
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
