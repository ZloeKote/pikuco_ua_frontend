import Input from "../components/simpleComponents/Input";
import PasswordInput from "../components/simpleComponents/PasswordInput";
import Button from "../components/simpleComponents/Button";
import Link from "../components/simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import SignupCover from "../img/Screenshot_2.png";
import classNames from "classnames";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, setCredentials } from "../store";

function LoginPage() {
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const labelClassname = classNames("text-[26px] ml-[10px]");

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData, email }));
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg("No server response");
      } else if (err.originalStatus?.status === 400) {
        setErrMsg("Missing email or password");
      } else if (err.originalStatus?.status === 403) {
        setErrMsg("Unathorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="flex flex-col items-center justify-between w-[40%] text-[--dark-text]">
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}></p>

      <div className="flex flex-col h-full justify-center">
        <h2 className="text-[52px] mb-[15px] text-center">Увійти</h2>
        <form className="flex flex-col" onSubmit={handleSubmitLogin}>
          <div className="flex flex-col">
            <label for="email" className={labelClassname}>
              Пошта або нікнейм
            </label>
            <Input
              className="w-[350px] text-[26px]"
              type="email"
              value={email}
              onChange={handleChangeEmail}
              innerRef={userRef}
              placeholder="test@gmail.com"
              id="email"
              required
            />
          </div>
          <div className="flex flex-col mt-[15px]">
            <label for="password" className={labelClassname}>
              Пароль
            </label>
            <PasswordInput
              className="w-[350px] text-[26px]"
              id="password"
              value={password}
              onChange={handleChangePassword}
              placeholder="Пароль"
              required
            />
          </div>
          <Button
            className="w-[10rem] h-[3rem] text-[26px] rounded-2xl self-center mt-[25px]"
            type="submit"
            success
          >
            Увійти
          </Button>
        </form>
      </div>
      <div className="ml-[15px] mb-1 flex self-start text-[22px]">
        <span className="mr-1">Досі не маєте акаунту?</span>
        <Link to={ROUTES.Signup} className="inline text-blue-500 hover:text-blue-300 underline">
          Зареєструватися
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center">
      <div className="w-[90rem] h-[40rem] border border-[--dark-quizcard-border] rounded-2xl flex bg-[--dark-quizcard-background]">
        <div className="w-[60%] border-r border-[--dark-quizcard-border]">
          <img src={SignupCover} alt="signup" className="w-full h-full rounded-l-2xl" />
        </div>
        {content}
      </div>
    </div>
  );
}
export default LoginPage;
