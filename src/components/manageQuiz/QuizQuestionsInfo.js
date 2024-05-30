import { useState } from "react";
import classNames from "classnames";
import QuizQuestion from "./QuizQuestion";
import QuestionList from "../QuestionList";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { types } from "../../predefined/QuestionTypes";

function QuizQuestionsInfo({ questions, originalQuestions = [], questionType, readOnlyUrl, onChange }) {
  const [numQuestion, setNumQuestion] = useState(0);
  const [isOpenedQuestionList, setIsOpenedQuestionList] = useState(false);

  const isFirst = numQuestion === 0;
  const isLast = numQuestion + 1 === questions.length;

  const handleClickBackQuestion = () => {
    if (isFirst) return;
    setNumQuestion(numQuestion - 1);
  };

  const handleClickNextQuestion = () => {
    if (isLast) return;
    setNumQuestion(numQuestion + 1);
  };

  const handleChangeQuestion = (question) => onChange(question, numQuestion);
  const handleClickOpenQuestionList = () => setIsOpenedQuestionList(!isOpenedQuestionList);
  const handleClickQuestion = (num) => setNumQuestion(num);

  const handleClickResetQuestion = (num) => {
    if (readOnlyUrl) onChange({ ...questions[num], title: "", description: "" }, num);
    else onChange({ ...questions[num], url: "", title: "", description: "" }, num);
  };

  const activeArrowClassname = classNames(
    "text-[50px] self-center",
    "hover:cursor-pointer hover:text-[--dark-quizcard-border]"
  );
  const disabledArrowClassname = classNames(
    "text-[50px] self-center text-[--dark-quizcard-border] hover:cursor-no-drop"
  );
  const questionListHeaderClassname = classNames(
    "flex justify-between w-[96%] text-[26px]",
    "hover:bg-[--dark-quizcard-background-hover] hover:cursor-pointer",
    "border-b border-[--dark-quizcard-border]"
  );
  return (
    <div className="flex flex-col">
      <div className="flex justify-center text-[26px]">
        <span>{numQuestion + 1}</span>/<span>{questions.length}</span>
      </div>
      <div className="flex w-full justify-between mt-2">
        <FaChevronLeft
          className={isFirst ? disabledArrowClassname : activeArrowClassname}
          onClick={handleClickBackQuestion}
        />
        <QuizQuestion
          question={questions[numQuestion]}
          originalTitle={originalQuestions[numQuestion]?.title}
          originalDescription={originalQuestions[numQuestion]?.description}
          readOnlyUrl={readOnlyUrl}
          onChange={handleChangeQuestion}
        />
        <FaChevronRight
          className={isLast ? disabledArrowClassname : activeArrowClassname}
          onClick={handleClickNextQuestion}
        />
      </div>
      <div className="mt-4 flex flex-col items-center h-full">
        <div className={questionListHeaderClassname} onClick={handleClickOpenQuestionList}>
          <h2>Список питань</h2>
          <div className="self-center">{isOpenedQuestionList ? <FaChevronDown /> : <FaChevronUp />}</div>
        </div>
        {isOpenedQuestionList && (
          <div className="max-h-[287px] overflow-y-auto w-full flex justify-center">
            <QuestionList
              className="w-[95%] gap-[5px]"
              currNumQuestion={numQuestion}
              questions={questions}
              questionType={questionType}
              variant={types.editingQuiz}
              onClickQuiz={handleClickQuestion}
              onClickReset={handleClickResetQuestion}
              hiddenPagination
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizQuestionsInfo;
