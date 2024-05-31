import Link from "../components/simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import SignupCover from "../img/Screenshot_2.png";
import classNames from "classnames";
import { setCredentials, useSignupMutation } from "../store";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, IconButton, InputAdornment, OutlinedInput, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  validateBirthdate,
  validateEmail,
  validateNickname,
  validatePassword,
} from "../hooks/validate-hooks";
import { LoadingButton } from "@mui/lab";
import { IoMdCheckmarkCircle } from "react-icons/io";
import SnackbarsContext from "../context/snackbars";

function Signup() {
  const [signup, result] = useSignupMutation();
  const { handleEnqueueSnackbar, closeAllSnackbars } = useContext(SnackbarsContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [isNicknameError, setIsNicknameError] = useState(false);
  const [nicknameErrorMsg, setNicknameErrorMsg] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isBirthdateError, setIsBirthdateError] = useState(false);
  const [birthdateErrorMsg, setBirthdateErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    birthdate: "",
  });

  const labelClassname = classNames("text-[26px] ml-[10px]");
  const redAsterix = (
    <span className="text-[red]" title="Обов'язкове поле">
      *
    </span>
  );

  useEffect(() => {
    if (result.isSuccess) handleEnqueueSnackbar("Реєстрація пройшла успішно!", "default");
  }, [handleEnqueueSnackbar, result.isSuccess])

  const handleChangeEmail = (e) => {
    setUser({ ...user, email: e.target.value });
    validateEmail(e.target.value, setIsEmailError, setEmailErrorMsg);
    closeAllSnackbars();
  };
  const handleChangeUsername = (e) => {
    setUser({ ...user, username: e.target.value });
    validateNickname(e.target.value, setIsNicknameError, setNicknameErrorMsg);
    closeAllSnackbars();
  };
  const handleChangePassword = (e) => {
    setUser({ ...user, password: e.target.value });
    validatePassword(e.target.value, setIsPasswordError, setPasswordErrorMsg);
    closeAllSnackbars();
  };
  const handleChangeBirthdate = (e) => {
    setUser({ ...user, birthdate: e.target.value });
    if (!!e.target.value) validateBirthdate(e.target.value, setIsBirthdateError, setBirthdateErrorMsg);
    else {
      setIsBirthdateError(false);
      setBirthdateErrorMsg("");
    }
    closeAllSnackbars();
  };
  const handleClickShowPassword = () => setIsPasswordVisible(!isPasswordVisible);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    const emailValid = validateEmail(user.email, setIsEmailError, setEmailErrorMsg);
    const nicknameValid = validateNickname(user.username, setIsNicknameError, setNicknameErrorMsg);
    const passwordValid = validatePassword(user.password, setIsPasswordError, setPasswordErrorMsg);
    const birthdateValid = !!user.birthdate
      ? validateBirthdate(user.birthdate, setIsBirthdateError, setBirthdateErrorMsg)
      : true;

    closeAllSnackbars();
    if (emailValid && nicknameValid && passwordValid && birthdateValid) {
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
        if (err.status === 500) {
          handleEnqueueSnackbar(err.data.error, "error");
        } else if (err.status === 400) {
          for (let i = 0; i < err.data.length; i++) {
            handleEnqueueSnackbar(err.data[i], "error");
          }
        } else {
          handleEnqueueSnackbar("Не вдалося виконати реєстрацію. Спробуйте пізніше", "error");
        }
      }
    }
  };
  // if (results.isSuccess) {
  //   const cookies = new Cookies();
  //   cookies.set("Authorization", results.data.token, { path: "/"})
  // }

  return (
    <div className="flex justify-center items-center">
      <div className="w-[90rem] h-[45rem] border border-[--dark-quizcard-border] rounded-2xl flex bg-[--dark-quizcard-background]">
        <div className="w-[60%] border-r border-[--dark-quizcard-border]">
          <img src={SignupCover} alt="signup" className="w-full h-full rounded-l-2xl" />
        </div>
        <div className="flex flex-col items-center w-[40%] text-[--dark-text]">
          <div className="flex flex-col h-full justify-center">
            <h2 className="text-[52px] mb-[15px] self-center">Реєстрація</h2>
            <form className="flex flex-col" onSubmit={handleSubmitSignup}>
              <div className="flex flex-col">
                <label className={labelClassname}>Електронна пошта {redAsterix}</label>
                <TextField
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={handleChangeEmail}
                  placeholder="test@gmail.com"
                  margin="none"
                  size="small"
                  inputProps={{ style: { fontSize: "26px" } }}
                  required
                  autoFocus
                  error={isEmailError}
                  helperText={isEmailError ? emailErrorMsg : " "}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClassname}>Нікнейм {redAsterix}</label>
                <TextField
                  id="nickname"
                  value={user.username}
                  onChange={handleChangeUsername}
                  placeholder="Username"
                  margin="none"
                  size="small"
                  inputProps={{ style: { fontSize: "26px" } }}
                  required
                  error={isNicknameError}
                  helperText={isNicknameError ? nicknameErrorMsg : " "}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClassname}>Пароль {redAsterix}</label>
                <OutlinedInput
                  value={user.password}
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
                <FormHelperText sx={{ marginX: "14px" }} error={isPasswordError}>
                  {isPasswordError ? passwordErrorMsg : " "}
                </FormHelperText>
              </div>
              <div className="flex flex-col">
                <label className={labelClassname}>Дата народження</label>
                <TextField
                  type="date"
                  value={user.birthdate}
                  onChange={handleChangeBirthdate}
                  margin="none"
                  size="small"
                  inputProps={{ style: { fontSize: "26px" } }}
                  error={isBirthdateError}
                  helperText={isBirthdateError ? birthdateErrorMsg : " "}
                />
              </div>
              <LoadingButton
                className="self-center w-[15rem] h-[3rem]"
                loading={result.isLoading}
                loadingPosition="start"
                startIcon={<IoMdCheckmarkCircle />}
                type="submit"
                color="success"
                variant="contained"
              >
                <span className="text-[18px]">Зареєструватися</span>
              </LoadingButton>
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
