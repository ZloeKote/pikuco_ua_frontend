import Button from "../components/simpleComponents/Button";
import Link from "../components/simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import SignupCover from "../img/Screenshot_2.png";
import classNames from "classnames";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, setCredentials } from "../store";
import SnackbarsContext from "../context/snackbars";
import { OutlinedInput, TextField, InputAdornment, IconButton, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { validateEmail, validatePassword } from "../hooks/validate-hooks";

function LoginPage() {
  const { handleEnqueueSnackbar, closeAllSnackbars } = useContext(SnackbarsContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    closeAllSnackbars();
  }, [email, password, closeAllSnackbars]);

  useEffect(() => {
    if (isSuccess) handleEnqueueSnackbar("Авторизація пройшла успішно!", "default");
  });

  const labelClassname = classNames("text-[26px] ml-[10px]");

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const emailValid = validateEmail(email, setIsEmailError, setEmailErrorMsg);
    const passwordValid = validatePassword(password, setIsPasswordError, setPasswordErrorMsg);
    if (emailValid && passwordValid) {
      try {
        const userData = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...userData, email }));
        setEmail("");
        setPassword("");
        navigate("/");
      } catch (err) {
        if (!err?.originalStatus) {
          handleEnqueueSnackbar("Сервер не відповідає!", "error");
        } else if (err.originalStatus?.status === 400) {
          handleEnqueueSnackbar("Ви не ввели пошту чи пароль!", "error");
        } else if (err.originalStatus?.status === 403) {
          handleEnqueueSnackbar("В авторизації відмовлено!", "error");
        } else {
          handleEnqueueSnackbar("Ой! Сталася помилка ;(", "error");
        }
      }
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value, setIsEmailError, setEmailErrorMsg);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value, setIsPasswordError, setPasswordErrorMsg);
  };
  const handleClickShowPassword = () => setIsPasswordVisible(!isPasswordVisible);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="flex flex-col items-center justify-between w-[40%] text-[--dark-text]">
      <div className="flex flex-col h-full justify-center">
        <h2 className="text-[52px] mb-[15px] text-center">Увійти</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmitLogin}>
          <div className="flex flex-col">
            <label htmlFor="email" className={labelClassname}>
              Електронна пошта
            </label>
            <TextField
              type="email"
              value={email}
              onChange={handleChangeEmail}
              placeholder="test@gmail.com"
              margin="none"
              size="small"
              inputProps={{ style: { fontSize: "26px" } }}
              required
              autoFocus
              error={isEmailError}
              helperText={isEmailError && emailErrorMsg}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className={labelClassname}>
              Пароль
            </label>
            <OutlinedInput
              value={password}
              onChange={handleChangePassword}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="arroweatsbugs123"
              margin="none"
              size="small"
              inputProps={{ style: { fontSize: "26px" } }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              required
              error={isPasswordError}
            />
            {isPasswordError && (
              <FormHelperText sx={{ marginX: "14px" }} error={isPasswordError}>
                {passwordErrorMsg}
              </FormHelperText>
            )}
          </div>
          <Button
            className="w-[10rem] h-[3rem] text-[26px] rounded-2xl self-center mt-[15px]"
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
      <div className="w-[90rem] h-[45rem] border border-[--dark-quizcard-border] rounded-2xl flex bg-[--dark-quizcard-background]">
        <div className="w-[60%] border-r border-[--dark-quizcard-border]">
          <img src={SignupCover} alt="signup" className="w-full h-full rounded-l-2xl" />
        </div>
        {content}
      </div>
    </div>
  );
}
export default LoginPage;
