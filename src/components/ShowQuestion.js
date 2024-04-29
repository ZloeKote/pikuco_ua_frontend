import ytLinkToValid from "../hooks/YtLinkToValid";

function ShowQuestion({ question, type, individual, lang }) {
  let questionTitle = question.title;
  let questionDescription = question.description !== "null" ? question.description : "";

  if (question.translations?.some((tr) => tr.language === lang)) {
    questionTitle = question.translations.find((tr) => tr.language === lang).title;
    questionDescription = question.translations.find((tr) => tr.language === lang).description;
  }
  let questionInfo = (
    <div className="w-[70%] pl-3">
        <div className="text-[24px]">{questionTitle}</div>
        <div className="text-[20px]">{questionDescription}</div>
      </div>
  );
  if (questionDescription === "" || questionDescription === null) {
    questionInfo = (
      <div className="w-[70%] pl-3 flex items-center">
          <div className="text-[32px]">{questionTitle}</div>
        </div>
    );
  }

  let previewQuestion;
  if (type === "Tournament - Video") {
    previewQuestion = (
      <iframe
        title="Youtube"
        width="100%"
        height="100px"
        src={ytLinkToValid(question.url)}
        allowFullScreen
      ></iframe>
    );
  } else {
    previewQuestion = <img src={question.url} alt={questionTitle} />;
  }

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
      {questionInfo}
      {score}
    </div>
  );
}

export default ShowQuestion;
