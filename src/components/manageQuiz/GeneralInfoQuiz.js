import classNames from "classnames";
import Input from "../simpleComponents/Input";
import { useState } from "react";
import { MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import InfoIcon from "../simpleComponents/InfoIcon";
import LanguageAutocompleter from "../simpleComponents/LanguageAutocompleter";
import { iso6393 } from "iso-639-3";
import predefinedNumQuestions from "../../predefined/NumQuestions";

function GeneralInfoQuiz({
  title,
  onChangeTitle,
  description,
  onChangeDescription,
  quizType,
  onChangeQuizType,
  language,
  onChangeLanguage,
  numQuestions,
  onChangeNumQuestions,
}) {
  const [numDescriptionSymbolsLeft, setNumDescriptionSymbolsLeft] = useState(255);

  const RedAsterisk = (
    <Tooltip
      title="Обов'язкове поле"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -14],
              },
            },
          ],
        },
      }}
    >
      <span className="bold text-red-600">*</span>
    </Tooltip>
  );

  const renderedQuizTypes = QuizTypes.filter((type) => type.value !== "").map((type) => {
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
    setNumDescriptionSymbolsLeft(255 - e.target.value.length);
  };

  return (
    <div className="flex justify-around mt-2">
      <div className="flex flex-col w-[500px] gap-6">
        <div className="flex flex-col">
          <label className={labelClassname}>
            Назва вікторини {RedAsterisk}
            <InfoIcon className="ml-2 self-center">
              Назва вікторини повинна мати довжину від 2 до 30 символів
            </InfoIcon>
          </label>
          <Input
            className="text-[22px] !rounded"
            value={title}
            onChange={handleChangeTitle}
            placeholder="Найкраща пісня останнього десятиліття"
            autoFocus
            required
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>
            Опис вікторини
            <InfoIcon className="ml-2 self-center">
              Опис вікторини повинен мати довжину до 255 символів.
              <br /> <span>{numDescriptionSymbolsLeft}</span>
            </InfoIcon>
          </label>
          <TextField
            value={description}
            inputProps={{ style: { fontSize: "22px" } }}
            onChange={handleChangeDescription}
            multiline
            rows={8}
          />
        </div>
      </div>

      <div className="flex flex-col w-[300px] gap-6">
        <div className="flex flex-col">
          <label className={labelClassname}>Тип вікторини {RedAsterisk}</label>
          <TextField label="Обери тип" value={quizType} onChange={handleChangeQuizType} select required>
            {renderedQuizTypes}
          </TextField>
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>Мова вікторини {RedAsterisk}</label>
          <LanguageAutocompleter value={language} onChange={handleChangeLanguage} required />
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>Кількість питань {RedAsterisk}</label>
          <TextField
            label="Обери кількість"
            value={numQuestions}
            onChange={handleChangeNumQuestions}
            select
            required
          >
            {renderedNumQuestions}
          </TextField>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoQuiz;

const QuizTypes = [
  {
    label: "Обери тип",
    value: "",
  },
  {
    label: "Турнір - Відео",
    value: "TOURNAMENT_VIDEO",
  },
  {
    label: "Турнір - Картинки",
    value: "TOURNAMENT_PICTURE",
  },
];
