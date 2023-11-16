import Link from "./Link";
import Logo from "./Logo";
import DropdownLink from "./DropdownLink";
import classNames from "classnames";

function NavigationPanel() {
  const classnames = classNames("hover:bg-[--dark-link-background-hover] hover:rounded-md px-2 flex");

  const options = [
    {
      label: "Турніри - Відео",
      to: "/content",
    },
    {
      label: "Турніри - Картинки",
      to: "/content",
    },
  ];

  return (
    <nav className="flex items-center pl-10 pr-10 bg-[--dark-nav]">
      <div className="">
        <Logo className="mr-12" />
      </div>
      <div className="flex gap-3 text-[--dark-text] text-[20px]">
        <DropdownLink options={options} to="/content">
          Турніри
        </DropdownLink>

        <Link className={classnames} to="/about">
          Про нас
        </Link>
        <Link className={classnames} to="/contacts">
          Контакти
        </Link>
      </div>
    </nav>
  );
}

export default NavigationPanel;
