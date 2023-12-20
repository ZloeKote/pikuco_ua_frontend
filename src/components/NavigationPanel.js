import Link from "./Link";
import Logo from "./Logo";
import DropdownLink from "./DropdownLink";
import classNames from "classnames";
import Button from "./Button";
import { FiLogIn } from "react-icons/fi";
import {ROUTES} from "../ROUTES";

function NavigationPanel() {
  const classnames = classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md px-2 flex");

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
          <DropdownLink options={options} to={ROUTES.QuizzesList}>
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
        <Link className={classnames} to={ROUTES.Signup}>
          Реєстрація
        </Link>
        <Link to={ROUTES.Login}>
          <Button
            className="w-[35px] h-[35px] border-[--dark-quizcard-border] hover:bg-[--dark-link-background-hover]"
            rounded
          >
            <FiLogIn className="text-[26px]"/>
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default NavigationPanel;
