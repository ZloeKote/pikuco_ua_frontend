import classNames from "classnames";
import { useState } from "react";
import { MenuItem, Skeleton, TextField, Typography } from "@mui/material";
import InfoIcon from "../simpleComponents/InfoIcon";
import LanguageAutocompleter from "../simpleComponents/LanguageAutocompleter";
import predefinedNumQuestions from "../../predefined/NumQuestions";
import { RedAsterisk } from "../../custom-materials";
import { quizTypes } from "../../predefined/QuizTypes";

function GeneralInfoQuiz({
  title,
  originalTitle,
  onChangeTitle,
  readOnlyTitle,
  description,
  descriptionRequired,
  originalDescription,
  onChangeDescription,
  readOnlyDescription,
  quizType,
  onChangeQuizType,
  readOnlyQuizType,
  language,
  onChangeLanguage,
  disabledLanguages,
  readOnlyLanguage,
  numQuestions,
  onChangeNumQuestions,
  readOnlyNumQuestions,
  isTitleError,
  titleErrorMsg,
  isDescrError,
  descrErrorMsg,
  isFetchingQuiz,
}) {
  const isDataLoaded =
    !isFetchingQuiz &&
    title !== undefined &&
    description !== undefined &&
    quizType !== undefined &&
    language !== undefined &&
    numQuestions !== undefined;
  const [numDescriptionSymbolsLeft, setNumDescriptionSymbolsLeft] = useState(80);
  const renderedQuizTypes = quizTypes
    .filter((type) => type.value !== "")
    .map((type) => {
      return (
        <MenuItem key={type.value} value={type.value}>
          <Typography sx={{ fontSize: "22px" }}>{type.label}</Typography>
        </MenuItem>
      );
    });

  const renderedNumQuestions = predefinedNumQuestions
    .filter((num) => num.value !== "")
    .map((num) => {
      return (
        <MenuItem key={num.value} value={num.value}>
          <Typography sx={{ fontSize: "22px" }}>{num.label}</Typography>
        </MenuItem>
      );
    });

  const handleChangeQuizType = (e) => onChangeQuizType(e.target.value);
  const handleChangeLanguage = (lang) => onChangeLanguage(lang);
  const handleChangeNumQuestions = (e) => onChangeNumQuestions(e.target.value);

  const labelClassname = classNames("text-[26px] ml-[10px] flex");

  const handleChangeTitle = (e) => onChangeTitle(e.target.value);
  const handleChangeDescription = (e) => {
    onChangeDescription(e.target.value);
    setNumDescriptionSymbolsLeft(80 - e.target.value.length);
  };

  return (
    <div className="flex justify-around mt-2">
      <div className="flex flex-col w-[500px] gap-6">
        <div className="flex flex-col">
          <label className={labelClassname}>
            Назва вікторини {RedAsterisk}
            <InfoIcon className="ml-2 self-center">
              Назва вікторини повинна мати довжину від 3 до 30 символів
            </InfoIcon>
          </label>
          {isDataLoaded ? (
            <TextField
              value={title}
              onChange={handleChangeTitle}
              placeholder={"Найкраща пісня останнього десятиліття"}
              autoFocus
              required
              disabled={readOnlyTitle}
              size="small"
              inputProps={{ style: { fontSize: "22px" } }}
              error={isTitleError}
              helperText={isTitleError ? titleErrorMsg : originalTitle || " "}
            />
          ) : (
            <Skeleton
              animation="wave"
              variant="rectangular"
              height={49}
              sx={{ borderRadius: 1, marginBottom: "23px" }}
            />
          )}
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>
            Опис вікторини {RedAsterisk}
            <InfoIcon className="ml-2 self-center">
              Опис вікторини повинен мати довжину від 5 до 80 символів.
              <br />
              Чернетка не обов'язково повинна мати опис
              <br /> <span>Залишилося символів {numDescriptionSymbolsLeft}</span>
            </InfoIcon>
          </label>
          {isDataLoaded ? (
            <TextField
              value={description}
              inputProps={{ style: { fontSize: "22px" } }}
              onChange={handleChangeDescription}
              multiline
              rows={6}
              disabled={readOnlyDescription}
              error={isDescrError}
              helperText={isDescrError ? descrErrorMsg : originalDescription}
              required={descriptionRequired}
            />
          ) : (
            <Skeleton animation="wave" variant="rectangular" height={177} sx={{ borderRadius: 1 }} />
          )}
        </div>
      </div>

      <div className="flex flex-col w-[300px] gap-5">
        <div className="flex flex-col">
          <label className={labelClassname}>Тип вікторини {RedAsterisk}</label>
          {isDataLoaded ? (
            <TextField
              value={quizType ?? ""}
              onChange={handleChangeQuizType}
              select
              required
              disabled={readOnlyQuizType}
            >
              {renderedQuizTypes}
            </TextField>
          ) : (
            <Skeleton animation="wave" variant="rectangular" height={66} sx={{ borderRadius: 1 }} />
          )}
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>Мова вікторини {RedAsterisk}</label>
          {isDataLoaded ? (
            <LanguageAutocompleter
              value={language}
              onChange={handleChangeLanguage}
              required
              disabled={readOnlyLanguage}
              disabledOptions={disabledLanguages}
            />
          ) : (
            <Skeleton animation="wave" variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          )}
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>Кількість питань {RedAsterisk}</label>
          {isDataLoaded ? (
            <TextField
              value={numQuestions}
              onChange={handleChangeNumQuestions}
              select
              required
              disabled={readOnlyNumQuestions}
            >
              {renderedNumQuestions}
            </TextField>
          ) : (
            <Skeleton animation="wave" variant="rectangular" height={66} sx={{ borderRadius: 1 }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoQuiz;
