import ShowQuestion from "./ShowQuestion";
import { types } from "../predefined/QuestionTypes";
import classNames from "classnames";

function QuestionList({ questions, questionType, variant, lang, onClickReset, onClickQuiz, currNumQuestion, className }) {
  const classname = classNames(className, "flex flex-col items-center gap-[15px] my-[15px]");

  const renderedQuestions = questions.map((question, i) => {
    return (
      <ShowQuestion
        key={variant === types.editingQuiz ? i : question.place}
        question={question}
        questionType={questionType}
        variant={variant}
        lang={lang}
        numQuestion={i}
        onClickReset={onClickReset}
        onClickQuiz={onClickQuiz}
        isHighlighted={i === currNumQuestion}
      />
    );
  });
  return <div className={classname}>{renderedQuestions}</div>;
}

export default QuestionList;
