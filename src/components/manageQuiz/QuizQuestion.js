import { YtLinkToValid } from "../../hooks/yt-hooks";
import ytEmptyImage from "../../img/youtube_480x270_bw.jpg";
import { RedAsterisk } from "../../custom-materials";
import classNames from "classnames";
import InfoIcon from "../simpleComponents/InfoIcon";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  validateQuizQuestionDescription,
  validateQuizQuestionTitle,
  validateQuizQuestionUrl,
} from "../../hooks/validate-hooks";

function QuizQuestion({ question, readOnlyUrl, originalTitle, originalDescription, onChange }) {
  const [isUrlError, setIsUrlError] = useState(false);
  const [urlErrorMsg, setUrlErrorMsg] = useState("");
  const [isTitleError, setIsTitleError] = useState(false);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [isDescrError, setIsDescrError] = useState(false);
  const [descrErrorMsg, setDescrErrorMsg] = useState("");

  useEffect(() => {
    validateQuizQuestionUrl(question?.url, setIsUrlError, setUrlErrorMsg);
    validateQuizQuestionTitle(question?.title, setIsTitleError, setTitleErrorMsg);
    validateQuizQuestionDescription(question?.description, setIsDescrError, setDescrErrorMsg);
  }, [question]);

  let isValid =
    !(YtLinkToValid(question?.url) === "error") &&
    !(YtLinkToValid(question?.url) === "//www.youtube.com/embed/undefined");

  const handleChangeURL = (e) => {
    onChange({ ...question, url: e.target.value });
    validateQuizQuestionUrl(e.target.value, setIsUrlError, setUrlErrorMsg);
  };
  const handleChangeTitle = (e) => {
    onChange({ ...question, title: e.target.value });
    validateQuizQuestionTitle(e.target.value, setIsTitleError, setTitleErrorMsg);
  };

  const handleChangeDescription = (e) => {
    onChange({ ...question, description: e.target.value });
    validateQuizQuestionDescription(e.target.value, setIsDescrError, setDescrErrorMsg);
  };

  const handleClickClear = () => {
    if (readOnlyUrl) onChange({ ...question, title: "", description: "" });
    else onChange({ ...question, url: "", title: "", description: "" });

    setIsUrlError(false);
    setUrlErrorMsg("");
    setIsTitleError(false);
    setTitleErrorMsg("");
    setIsDescrError(false);
    setDescrErrorMsg("");
  };

  const labelClassname = classNames("text-[26px] ml-[10px] flex");

  return (
    <div className="flex gap-5">
      <div className="w-[614px] h-[345px]">
        {isValid ? (
          <iframe
            className="rounded"
            title="Youtube"
            width="100%"
            height="100%"
            src={YtLinkToValid(question.url)}
            allowFullScreen
          ></iframe>
        ) : (
          <img className="h-full w-auto rounded" src={ytEmptyImage} alt="YouTube video" />
        )}
      </div>
      <div className="flex flex-col w-[450px]">
        <div className="flex flex-col">
          <label className={labelClassname + " justify-between"}>
            <div className="flex">
              Посилання {RedAsterisk}
              <InfoIcon className="ml-2 self-center">
                Посилання повинно бути на відео на платформі YouTube.
                <br /> Приклади посилань:
                <br /> https://www.youtube.com/watch?v=dQw4w9WgXcQ
                <br /> https://youtube.com/watch?v=dQw4w9WgXcQ
                <br /> www.youtube.com/watch?v=dQw4w9WgXcQ
                <br /> youtube.com/watch?v=dQw4w9WgXcQ
                <br /> watch?v=dQw4w9WgXcQ
              </InfoIcon>
            </div>
            <div>
              <span
                onClick={handleClickClear}
                className="text-[16px] text-blue-500 hover:cursor-pointer hover:text-blue-300 underline"
              >
                Очистити питання
              </span>
            </div>
          </label>
          <TextField
            id="question-url"
            value={question?.url}
            onChange={handleChangeURL}
            placeholder="youtube.com/watch?v=dQw4w9WgXcQ"
            disabled={readOnlyUrl}
            size="small"
            error={isUrlError}
            helperText={isUrlError ? urlErrorMsg : " "}
            inputProps={{ style: { fontSize: "20px" } }}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>
            Назва питання {RedAsterisk}
            <InfoIcon className="ml-2 self-center">
              Назва питання повинна мати довжину від 3 до 30 символів
            </InfoIcon>
          </label>
          <TextField
            id="question-title"
            value={question?.title}
            onChange={handleChangeTitle}
            placeholder={"Rick Astley - Never Gonna Give You Up"}
            size="small"
            error={isTitleError}
            helperText={isTitleError ? titleErrorMsg : (originalTitle || " ")}
            inputProps={{ style: { fontSize: "20px" } }}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>
            Опис вікторини
            <InfoIcon className="ml-2 self-center">
              Опис вікторини, якщо наводиться, повинно мати довжину від 5 до 80 символів.
            </InfoIcon>
          </label>
          <TextField
            id="question-description"
            value={question.description}
            inputProps={{ style: { fontSize: "20px" } }}
            onChange={handleChangeDescription}
            multiline
            rows={2}
            size="small"
            error={isDescrError}
            helperText={isDescrError ? descrErrorMsg : originalDescription}
          />
        </div>
      </div>
    </div>
  );
}

export default QuizQuestion;
