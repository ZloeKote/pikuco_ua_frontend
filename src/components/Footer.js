import { AiFillFacebook, AiFillInstagram, AiFillLinkedin, AiFillTwitterSquare } from "react-icons/ai";
import Link from "./Link";
import Logo from "./Logo";
import classNames from "classnames";
import { ROUTES } from "../ROUTES";

function Footer() {
  const classnames = classNames("text-[--dark-social-footer] hover:text-[--dark-link-text-hover]");

  return (
    <div className="bg-[--dark-nav] flex justify-around items-center text-white mt-[20px]">
      <div>
        <Logo className="w-64" />
      </div>
      <div className="self-end text-lg">© 2023 Pikuco.ua</div>
      <div>
        <span className="text-lg">Наші соціальні мережі</span>
        <div className="flex text-[35px] gap-2">
          <Link className={classnames} to={ROUTES.Facebook} target="_blank" title="Facebook">
            <AiFillFacebook />
          </Link>
          <Link className={classnames} to={ROUTES.Instagram} target="_blank" title="Instagram">
            <AiFillInstagram />
          </Link>
          <Link className={classnames} to={ROUTES.LinkedIn} target="_blank" title="LinkedIn">
            <AiFillLinkedin />
          </Link>
          <Link className={classnames} to={ROUTES.X} target="_blank" title="X">
            <AiFillTwitterSquare />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
