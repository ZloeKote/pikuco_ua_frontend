import Input from "../components/Input";
import Button from "../components/Button";
import Link from "../components/Link";
import { ROUTES } from "../ROUTES";
import SignupCover from "../img/Screenshot_2.png";
import classNames from "classnames";
import PasswordInput from "../components/PasswordInput";
import { setCredentials, useSignupMutation } from "../store";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [signup, { isLoading }] = useSignupMutation();
  const emailRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    birthdate: "",
  });

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const labelClassname = classNames("text-[26px] ml-[10px]");
  const redAsterix = (
    <span className="text-[red]" title="Обов'язкове поле">
      *
    </span>
  );

  const handleChangeEmail = (e) => setUser({ ...user, email: e.target.value });
  const handleChangeUsername = (e) => setUser({ ...user, username: e.target.value });
  const handleChangePassword = (e) => setUser({ ...user, password: e.target.value });
  const handleChangeBirthdate = (e) => setUser({ ...user, birthdate: e.target.value });

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    try {
      const userData = await signup(user).unwrap();
      dispatch(setCredentials({ ...userData, email: user.email }));
      setUser({
        username: "",
        email: "",
        password: "",
        birthdate: "",
      });
      navigate("/");
    } catch (err) {
      if (!err?.originalStatus) {
        // setErrMsg("No server response");
      } else if (err.originalStatus?.status === 400) {
        // setErrMsg("Missing email or password");
      } else if (err.originalStatus?.status === 403) {
        // setErrMsg("Unathorized");
      } else {
        // setErrMsg("Login Failed");
      }
    }
  };
  // if (results.isSuccess) {
  //   const cookies = new Cookies();
  //   cookies.set("Authorization", results.data.token, { path: "/"})
  // }

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
                <Input
                  className="w-[350px] text-[26px]"
                  type="email"
                  innerRef={emailRef}
                  value={user.email}
                  onChange={handleChangeEmail}
                  placeholder="test@gmail.com"
                />
              </div>
              <div className="flex flex-col mt-[15px]">
                <label className={labelClassname}>Нікнейм {redAsterix}</label>
                <Input
                  className="w-[350px] text-[26px]"
                  value={user.username}
                  onChange={handleChangeUsername}
                  placeholder="Username"
                />
              </div>
              <div className="flex flex-col mt-[15px]">
                <label className={labelClassname}>Пароль {redAsterix}</label>
                <PasswordInput
                  className="w-[350px] text-[26px]"
                  value={user.password}
                  onChange={handleChangePassword}
                  placeholder="Вводь, я дивлюся"
                />
              </div>
              <div className="flex flex-col mt-[15px]">
                <label className={labelClassname}>Дата народження</label>
                <Input
                  className="w-[350px] text-[26px]"
                  value={user.birthdate}
                  onChange={handleChangeBirthdate}
                  type="date"
                />
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
