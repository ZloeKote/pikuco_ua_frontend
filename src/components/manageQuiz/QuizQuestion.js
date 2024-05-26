import { YtLinkToValid } from "../../hooks/yt-hooks";
import ytEmptyImage from "../../img/youtube_480x270_bw.jpg";
import { RedAsterisk } from "../../custom-materials";
import classNames from "classnames";
import InfoIcon from "../simpleComponents/InfoIcon";
import Input from "../simpleComponents/Input";
import { TextField } from "@mui/material";

function QuizQuestion({ question, readOnlyUrl, originalTitle, originalDescription, isCreatingTranslation, onChange }) {
  let isValid =
    !(YtLinkToValid(question?.url) === "error") &&
    !(YtLinkToValid(question?.url) === "//www.youtube.com/embed/undefined");

  const handleChangeURL = (e) => {
    onChange({ ...question, url: e.target.value });
  };
  const handleChangeTitle = (e) => onChange({ ...question, title: e.target.value });

  const handleChangeDescription = (e) => onChange({ ...question, description: e.target.value });

  const handleClickClear = () => {
    if (readOnlyUrl) onChange({ ...question, title: "", description: "" });
    else onChange({ ...question, url: "", title: "", description: "" });
  };

  const labelClassname = classNames("text-[26px] ml-[10px] flex");

  return (
    <div className="flex gap-5">
      <div className="w-[590px] h-[332px]">
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
      <div className="flex flex-col w-[450px] gap-2">
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
          <Input
            className="text-[22px] !rounded"
            value={question?.url}
            onChange={handleChangeURL}
            placeholder="youtube.com/watch?v=dQw4w9WgXcQ"
            disabled={readOnlyUrl}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClassname}>
            Назва питання {RedAsterisk}
            <InfoIcon className="ml-2 self-center">
              Назва питання повинна мати довжину від 3 до 30 символів
            </InfoIcon>
          </label>
          <Input
            className="text-[22px] !rounded"
            value={question.title}
            onChange={handleChangeTitle}
            placeholder={originalTitle || "Rick Astley - Never Gonna Give You Up"}
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
            value={question.description}
            inputProps={{ style: { fontSize: "22px" } }}
            onChange={handleChangeDescription}
            multiline
            rows={4}
            placeholder={originalDescription}
          />
        </div>
      </div>
    </div>
  );
}

export default QuizQuestion;
