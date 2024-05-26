import ytEmptyImage from "../img/youtube_480x270_bw.jpg";
import { YtLinkToValid, getYtThumbnail } from "../hooks/yt-hooks";
import { types } from "../predefined/QuestionTypes";
import qualities from "../predefined/ytThumbnailQualities";
import Button from "./simpleComponents/Button";
import classNames from "classnames";
import { Tooltip } from "@mui/material";
import Link from "./simpleComponents/Link";

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
  const isQuestionEmpty = question.url === "" && question.title === "" && question.description === "";

  if (
    (variant === types.individual || variant === types.general) &&
    question.translations?.some((tr) => tr.language === lang)
  ) {
    questionTitle = question.translations.find((tr) => tr.language === lang).title;
    questionDescription = question.translations.find((tr) => tr.language === lang).description;
  }

  let questionInfoClassname = classNames("w-[70%] pl-3");

  if (variant === types.editingQuiz) {
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
      if (variant === types.editingQuiz) {
        previewQuestion = (
          <img
            className="h-full w-auto rounded"
            src={getYtThumbnail(question.url, qualities.low)}
            alt={questionTitle}
          />
        );
      } else {
        previewQuestion = (
          <Link to={question.url} target="_blank">
            <img
              className="h-full w-auto rounded"
              src={getYtThumbnail(question.url, qualities.low)}
              alt={questionTitle}
              title="Відкрити відео на новій сторінці"
            />
          </Link>
        );
      }
    }
  } else {
    previewQuestion = <img src={question.url} alt={questionTitle} />;
  }

  let score = <div className="w-[10%]"></div>;
  if (variant === types.general) {
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
      className={layoutClassname + (variant === types.editingQuiz ? " hover:cursor-pointer" : "")}
      onClick={variant === types.editingQuiz ? () => onClickQuiz(numQuestion) : undefined}
    >
      {!isQuestionEmpty && (
        <>
          {(variant === types.individual || variant === types.general) && (
            <div className="w-[7%] text-[40px] flex items-center justify-center">{question.place}</div>
          )}
          <div className="ml-4 w-[13%] self-center">{previewQuestion}</div>
          {questionInfo}
          {variant === types.editingQuiz ? (
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

// <iframe
//   title="Youtube"
//   width="100%"
//   height="100px"
//   src={ytLinkToValid(question.url)}
//   allowFullScreen
// ></iframe>
