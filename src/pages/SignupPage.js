import Input from "../components/Input";
import Button from "../components/Button";
import Link from "../components/Link";
import { ROUTES } from "../ROUTES";
import SignupCover from "../img/Screenshot_2.png";
import classNames from "classnames";

function Signup() {
  const labelClassname = classNames("text-[26px] ml-[10px]");
  const redAsterix = (
    <span className="text-[red]" title="Обов'язкове поле">
      *
    </span>
  );

  const handleSubmitSignup = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[90rem] h-[40rem] border border-[--dark-quizcard-border] rounded-2xl flex bg-[--dark-quizcard-background]">
        <div className="w-[60%] border-r border-[--dark-quizcard-border]">
          <img src={SignupCover} alt="signup" className="w-full h-full rounded-l-2xl" />
        </div>
        <div className="flex flex-col items-center w-[40%] text-[--dark-text]">
          <div className="flex flex-col h-full justify-center">
            <h2 className="text-[52px] mb-[15px] self-center">Реєстрація</h2>
            <form className="flex flex-col" onSubmit={handleSubmitSignup}>
              <div className="flex flex-col">
                <label className={labelClassname}>Електронна пошта {redAsterix}</label>
                <Input type="email" placeholder="test@gmail.com" />
              </div>
              <div className="flex flex-col mt-[15px]">
                <label className={labelClassname}>Нікнейм {redAsterix}</label>
                <Input placeholder="Username" />
              </div>
              <div className="flex flex-col mt-[15px]">
                <label className={labelClassname}>Пароль {redAsterix}</label>
                <Input type="password" placeholder="Вводь, я дивлюся" />
              </div>
              <div className="flex flex-col mt-[15px]">
                <label className={labelClassname}>Дата народження</label>
                <Input type="date" />
              </div>
              <Button
                className="w-[15rem] h-[3rem] text-[26px] rounded-2xl self-center mt-[25px]"
                type="submit"
                success
              >
                Зареєструватися
              </Button>
            </form>
          </div>
          <div className="ml-[15px] mb-1 flex self-start text-[22px]">
            <span className="mr-1">Вже маєте акаунт?</span>
            <Link to={ROUTES.Login} className="inline text-blue-500 hover:text-blue-300 underline">
              Увійти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
