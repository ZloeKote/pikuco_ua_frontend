import ytEmptyImage from "../img/youtube_480x270_bw.jpg";
import { YtLinkToValid, getYtThumbnail } from "../hooks/YtLinkToValid";
import { types } from "../predefined/QuestionTypes";
import qualities from "../predefined/ytThumbnailQualities";
import Button from "./simpleComponents/Button";
import classNames from "classnames";
import { Tooltip } from "@mui/material";

function ShowQuestion({
  question,
  questionType,
  variant,
  lang,
  numQuestion,
  isHighlighted,
  onClickReset,
  onClickQuiz,
}) {
  let questionTitle = question.title;
  let questionDescription = question.description !== "null" ? question.description : "";
  const isEditable = variant === types.editingQuiz;
  const isQuestionEmpty = question.url === "" && question.title === "" && question.description === "";

  if (
    (variant === types.individual || variant === types.general) &&
    question.translations?.some((tr) => tr.language === lang)
  ) {
    questionTitle = question.translations.find((tr) => tr.language === lang).title;
    questionDescription = question.translations.find((tr) => tr.language === lang).description;
  }

  let questionInfoClassname = classNames("w-[70%] pl-3");

  if (isEditable) {
    questionInfoClassname = classNames("w-[77%] pl-3");
  } else if (variant === types.confirmingQuiz) {
    questionInfoClassname = classNames("w-max pl-3");
  }

  let questionInfo = (
    <div className={questionInfoClassname}>
      <div className="text-[24px]">{questionTitle}</div>
      <div className="text-[20px]">{questionDescription}</div>
    </div>
  );
  if (questionDescription === "" || questionDescription === null) {
    questionInfo = (
      <div className={questionInfoClassname + " flex items-center"}>
        <div className="text-[32px]">{questionTitle}</div>
      </div>
    );
  }

  let previewQuestion;
  if (questionType === "Tournament - Video" || questionType === "TOURNAMENT_VIDEO") {
    const validYtLink = YtLinkToValid(question.url);
    if (validYtLink === "error" || validYtLink === "//www.youtube.com/embed/undefined") {
      previewQuestion = <img className="h-full w-auto rounded" src={ytEmptyImage} alt="YouTube video" />;
    } else {
      previewQuestion = (
        <img
          className="h-full w-auto rounded"
          src={getYtThumbnail(question.url, qualities.low)}
          alt={questionTitle}
        />
        // <iframe
        //   title="Youtube"
        //   width="100%"
        //   height="100px"
        //   src={ytLinkToValid(question.url)}
        //   allowFullScreen
        // ></iframe>
      );
    }
  } else {
    previewQuestion = <img src={question.url} alt={questionTitle} />;
  }

  let score = null;
  if (variant === types.individual) {
    score = (
      <div className="w-[10%] text-[40px] flex items-center justify-center">
        {question.score ? question.score : 0}
      </div>
    );
  }

  const layoutClassname = classNames(
    "w-full",
    isQuestionEmpty ? "min-h-[40px]" : "h-[110px]",
    isHighlighted ? "bg-[--dark-quizcard-background-hover]" : "bg-[--dark-quizcard-background]",
    "border border-[--dark-quizcard-border] rounded-3xl flex hover:bg-[--dark-quizcard-background-hover]"
  );

  let content = (
    <div
      className={layoutClassname + (isEditable ? " hover:cursor-pointer" : "")}
      onClick={isEditable ? () => onClickQuiz(numQuestion) : undefined}
    >
      {!isQuestionEmpty && (
        <>
          {!isEditable ?? (
            <div className="w-[7%] text-[40px] flex items-center justify-center">{question.place}</div>
          )}
          <div className="ml-4 w-[13%] self-center">{previewQuestion}</div>
          {questionInfo}
          {isEditable ? (
            <div className="flex justify-center items-center mr-4">
              <Button
                type="button"
                className="w-[135px] h-[50px] rounded-xl z-20"
                onClick={() => onClickReset(numQuestion)}
                secondary
              >
                Очистити
              </Button>
            </div>
          ) : (
            score
          )}
        </>
      )}
    </div>
  );

  if (!isHighlighted && variant === types.editingQuiz)
    content = (
      <Tooltip
        title="Перейти до редагування питання"
        followCursor
        enterDelay={500}
        TransitionProps={{ timeout: 400 }}
      >
        {content}
      </Tooltip>
    );

  return content;
}

export default ShowQuestion;
