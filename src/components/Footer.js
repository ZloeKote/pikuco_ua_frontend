import { AiFillFacebook, AiFillInstagram, AiFillLinkedin, AiFillTwitterSquare } from "react-icons/ai";
import Link from "./Link";
import Logo from "./Logo";
import classNames from "classnames";

function Footer() {
  const classnames = classNames("text-[--dark-social-footer] hover:text-[--dark-link-text-hover]");

  return (
    <div className="bg-[--dark-nav] flex justify-around items-center text-white">
      <div>
        <Logo className="w-64" />
      </div>
      <div className="self-end text-lg">© 2023 Pikuco.ua</div>
      <div>
        <span className="text-lg">Наші соціальні мережі</span>
        <div className="flex text-[35px] gap-2">
          <Link
            className={classnames}
            to="https://www.facebook.com/groups/304790906885280/"
            target="_blank"
            title="Facebook"
          >
            <AiFillFacebook />
          </Link>
          <Link
            className={classnames}
            to="https://www.instagram.com/kotenko_ppp/"
            target="_blank"
            title="Instagram"
          >
            <AiFillInstagram />
          </Link>
          <Link
            className={classnames}
            to="https://www.linkedin.com/in/ілля-котенко-b26519214/"
            target="_blank"
            title="LinkedIn"
          >
            <AiFillLinkedin />
          </Link>
          <Link className={classnames} to="https://x.com/CounterStrike" target="_blank" title="X">
            <AiFillTwitterSquare />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
