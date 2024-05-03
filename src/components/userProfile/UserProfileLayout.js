import classNames from "classnames";
import { Link } from "react-router-dom";
import ProfileSections from "../../predefined/ProfileSections";
import { ROUTES } from "../../ROUTES";

function UserProfileLayout({ title, section, userNickname, children }) {
  const classnameLayout = classNames(
    "bg-[--dark-quizcard-background]",
    "flex",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "w-[75rem] text-[20px]"
  );

  return (
    <div>
      <div className={classnameLayout}>
        <div className="w-1/5 border-r">
          <nav className="mt-4 pl-2">
            <div>
              <h3>Загальні</h3>
              <ul className="pl-2">
                <li>
                  <Link
                    className={classNames({ "font-bold": ProfileSections.general === section })}
                    to={ROUTES.Profile(userNickname)}
                  >
                    Профіль
                  </Link>
                </li>
                <li>
                  <Link
                    className={classNames({ "font-bold": ProfileSections.privacy === section })}
                    to={ROUTES.Privacy(userNickname)}
                  >
                    Конфіденційність
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <h3>Вікторини</h3>
              <ul className="pl-2">
                <li>
                  <Link
                    className={classNames({ "font-bold": ProfileSections.completed_quizzes === section })}
                    to={ROUTES.User_completed_quizzes(userNickname)}
                  >
                    Пройдені
                  </Link>
                </li>
                <li>
                  <Link
                    className={classNames({ "font-bold": ProfileSections.my_quizzes === section })}
                    to={ROUTES.User_quizzes(userNickname)}
                  >
                    Мої
                  </Link>
                </li>
                <li>
                  <Link
                    className={classNames({ "font-bold": ProfileSections.wishlisted_quizzes === section })}
                    to={ROUTES.User_wishlisted_quizzes(userNickname)}
                  >
                    Список бажаного
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="flex flex-col w-4/5">
          <div className="h-12 w-full border-b flex">
            <div className="self-center text-[28px] ml-2">{title}</div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileLayout;
