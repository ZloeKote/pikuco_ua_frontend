import { YtLinkToValid } from "./yt-hooks";

export function validateEmail(email, setIsError, setErrorMsg) {
  const regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+/;
  if (!regex.test(email)) {
    setIsError(true);
    setErrorMsg("Неправильний формат пошти");
    return false;
  } else {
    setIsError(false);
    setErrorMsg("");
    return true;
  }
}

export function validateNickname(nickname, setIsError, setErrorMsg) {
  const regex = /^(?!.*[.,\\/'"`()[\]{}*]).*$/;
  if (nickname.length < 3) {
    setIsError(true);
    setErrorMsg("Нікнейм повинен мати не менше 3 символів");
    return false;
  } else if (nickname.length > 25) {
    setIsError(true);
    setErrorMsg("Нікнейм повинен мати не більше 25 символів");
    return false;
  } else if (!regex.test(nickname)) {
    setIsError(true);
    setErrorMsg("Нікнейм не повинен містити спец. символів");
    return false;
  } else {
    setIsError(false);
    setErrorMsg("");
    return true;
  }
}

export function validatePassword(password, setIsError, setErrorMsg) {
  const regexSymbol = /^(?=.*[a-zA-Z]).+$/;
  const regexDigit = /.*\d.*/;
  if (password.length < 6) {
    setIsError(true);
    setErrorMsg("Пароль повинен мати не менше 6 символів");
    return false;
  } else if (password.length > 20) {
    setIsError(true);
    setErrorMsg("Пароль повинен мати не більше 20 символів");
    return false;
  } else if (!regexSymbol.test(password)) {
    setIsError(true);
    setErrorMsg("Пароль повинен мати хоча б 1 літеру");
    return false;
  } else if (!regexDigit.test(password)) {
    setIsError(true);
    setErrorMsg("Пароль повинен мати хоча б 1 цифру");
    return false;
  } else {
    setIsError(false);
    setErrorMsg("");
    return true;
  }
}

export function validateBirthdate(birthdate, setIsError, setErrorMsg) {
  const regex = /^\d{4,5}-\d{1,2}-\d{1,2}$/;
  // Parse the date parts to integers
  var parts = birthdate.split("-");
  var day = parseInt(parts[2], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[0], 10);
  // Adjust for leap years
  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) monthLength[1] = 29;
  const currentDate = new Date();
  // First check for the pattern
  if (!regex.test(birthdate)) {
    setIsError(true);
    setErrorMsg("Невірний формат дати");
    return false;
    // Check the ranges of month and year
  } else if (year < 1900) {
    setIsError(true);
    setErrorMsg("Тобі що, більше ніж 124 років?");
    return false;
  } else if (
    year > 2014 &&
    year <= currentDate.getFullYear() &&
    month <= currentDate.getMonth() + 1 &&
    day <= currentDate.getDate()
  ) {
    setIsError(true);
    setErrorMsg("Дітей не впускаємо");
    return false;
  } else if (
    year > currentDate.getFullYear() ||
    (year === currentDate.getFullYear() && month > currentDate.getMonth() + 1) ||
    (year === currentDate.getFullYear() &&
      month === currentDate.getMonth() + 1 &&
      day > currentDate.getDate())
  ) {
    setIsError(true);
    setErrorMsg("Тебе навіть ще не існує...");
    return false;
  } else if (month <= 0 || month > 12) {
    setIsError(true);
    setErrorMsg("Неправильно введений місяць");
    return false;
    // Check the range of the day
  } else if (!(day > 0 && day <= monthLength[month - 1])) {
    setIsError(true);
    setErrorMsg("Вказаної дати не існує");
    return false;
  } else {
    setIsError(false);
    setErrorMsg("");
    return true;
  }
}

export function validateUserDescription(description, setIsDescriptionError, setDescriptionErrorMsg) {
  if (!!!description) {
    setIsDescriptionError(false);
    setDescriptionErrorMsg("");
    return true;
  } else if (description.length > 255) {
    setIsDescriptionError(true);
    setDescriptionErrorMsg("Опис не може містити більше ніж 255 символів");
    return false;
  } else {
    setIsDescriptionError(false);
    setDescriptionErrorMsg("");
    return true;
  }
}

export function validateQuizTitle(title, setIsTitleError, setTitleErrorMsg) {
  if (title.length < 3) {
    setIsTitleError(true);
    setTitleErrorMsg("Назва повинна мати не менше 3 символів");
    return false;
  } else if (title.length > 30) {
    setIsTitleError(true);
    setTitleErrorMsg("Назва повинна мати не більше 30 символів");
    return false;
  } else {
    setIsTitleError(false);
    setTitleErrorMsg("");
    return true;
  }
}

export function validateQuizDescription(
  description,
  setIsDescriptionError,
  setDescriptionErrorMsg,
  required = true
) {
  if (!required && !!!description) {
    setIsDescriptionError(false);
    setDescriptionErrorMsg("");
    return true;
  } else if (description.length < 5) {
    setIsDescriptionError(true);
    setDescriptionErrorMsg("Опис повинен мати не менше 5 символів");
    return false;
  } else if (description.length > 80) {
    setIsDescriptionError(true);
    setDescriptionErrorMsg("Опис повинен мати не більше 80 символів");
    return false;
  } else {
    setIsDescriptionError(false);
    setDescriptionErrorMsg("");
    return true;
  }
}

export function validateQuizQuestionUrl(url, setIsUrlError, setUrlErrorMsg, hideIfEmpty = true) {
  if (hideIfEmpty && !!!url) {
    setIsUrlError(false);
    setUrlErrorMsg("");
    return true;
  } else if (YtLinkToValid(url) === "error" || YtLinkToValid(url) === "//www.youtube.com/embed/undefined") {
    setIsUrlError(true);
    setUrlErrorMsg("Посилання на Youtube-відео не дійсне");
    return false;
  } else {
    setIsUrlError(false);
    setUrlErrorMsg("");
    return true;
  }
}

export function validateQuizQuestionTitle(title, setIsTitleError, setTitleErrorMsg) {
  if (!!!title) {
    setIsTitleError(false);
    setTitleErrorMsg("");
    return true;
  } else if (title.length < 3) {
    setIsTitleError(true);
    setTitleErrorMsg("Назва повинна мати не менше 3 символів");
    return false;
  } else if (title.length > 30) {
    setIsTitleError(true);
    setTitleErrorMsg("Назва повинна мати не більше 30 символів");
    return false;
  } else {
    setIsTitleError(false);
    setTitleErrorMsg("");
    return true;
  }
}

export function validateQuizQuestionDescription(description, setIsDescriptionError, setDescriptionErrorMsg) {
  if (!!!description) {
    setIsDescriptionError(false);
    setDescriptionErrorMsg("");
    return true;
  } else if (description.length < 5) {
    setIsDescriptionError(true);
    setDescriptionErrorMsg("Опис повинен мати не менше 5 символів (якщо присутній)");
    return false;
  } else if (description.length > 80) {
    setIsDescriptionError(true);
    setDescriptionErrorMsg("Опис повинен мати не більше 80 символів (якщо присутній)");
    return false;
  } else {
    setIsDescriptionError(false);
    setDescriptionErrorMsg("");
    return true;
  }
}
