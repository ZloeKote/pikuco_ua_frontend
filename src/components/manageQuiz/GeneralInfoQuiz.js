import classNames from "classnames";
import { useState } from "react";
import { MenuItem, TextField, Typography } from "@mui/material";
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
}) {
  const [numDescriptionSymbolsLeft, setNumDescriptionSymbolsLeft] = useState(80);
  const renderedQuizTypes = quizTypes.filter((type) => type.value !== "").map((type) => {
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
            helperText={isTitleError ? titleErrorMsg : (originalTitle || " ")}
          />
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
        </div>
      </div>

      <div className="flex flex-col w-[300px] gap-5">
        <div className="flex flex-col">
          <label className={labelClassname}>Тип вікторини {RedAsterisk}</label>
          <TextField
            label="Оберіть тип"
            value={quizType}
            onChange={handleChangeQuizType}
            select
            required
            disabled={readOnlyQuizType}
          >
            {renderedQuizTypes}
          </TextField>
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>Мова вікторини {RedAsterisk}</label>
          <LanguageAutocompleter
            value={language}
            onChange={handleChangeLanguage}
            required
            disabled={readOnlyLanguage}
            disabledOptions={disabledLanguages}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>Кількість питань {RedAsterisk}</label>
          <TextField
            label="Оберіть кількість"
            value={numQuestions}
            onChange={handleChangeNumQuestions}
            select
            required
            disabled={readOnlyNumQuestions}
          >
            {renderedNumQuestions}
          </TextField>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoQuiz;