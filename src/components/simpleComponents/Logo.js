import Link from "./Link";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";
import LogoImg from "../../img/logo/PIKUCOUA.png";
import {ROUTES} from "../../ROUTES";

function Logo({ className }) {
  const classnames = twMerge(classNames("w-44", className));
  return (
    <Link to={ROUTES.Main}>
      <img className={classnames} src={LogoImg} alt="logo" />
    </Link>
  );
}

export default Logo;
