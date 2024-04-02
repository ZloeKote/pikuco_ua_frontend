import classNames from "classnames";
import ytLinkToValid from "../hooks/YtLinkToValid";

function ShowQuestion({ question, type, individual }) {
  let previewQuestion;
  if (type === "Tournament - Video") {
    previewQuestion = (
      <iframe title="Youtube" width="100%" height="100px" src={ytLinkToValid(question.url)} allowFullScreen></iframe>
    );
  } else {
    previewQuestion = <img src={question.url} alt={question.title} />;
  }
  const infoClassname = classNames("pl-[15px] flex flex-col", {
    "w-[70%]": individual,
    "w-[70%]": !individual,
  });
  let score = (
    <div className="w-[10%] text-[40px] flex items-center justify-center">
      {question.score ? question.score : 0}
    </div>
  );
  if (individual) {
    score = null;
  }

  const layoutClassname =
    "w-[95%] h-[110px] bg-[--dark-quizcard-background] border border-[--dark-quizcard-border] rounded-3xl flex hover:bg-[--dark-quizcard-background-hover]";
  return (
    <div className={layoutClassname}>
      <div className="w-[7%] text-[40px] flex items-center justify-center">{question.place}</div>
      <div className="w-[13%] self-center">{previewQuestion}</div>
      <div className="w-[70%]">
        <div className="text-[24px]">{question.title}</div>
        <div className="text-[20px]">{question.description}</div>
      </div>
      {score}
    </div>
  );
}

export default ShowQuestion;
