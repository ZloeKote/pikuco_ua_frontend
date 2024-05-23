import { useState } from "react";
import classNames from "classnames";
import { quizTypes } from "../../predefined/QuizTypes";
import QuestionList from "../QuestionList";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { types } from "../../predefined/QuestionTypes";

function CreatingQuizConfirmation({ title, description, quizType, language, numQuestions, questions }) {
  const [isOpenedQuestionList, setIsOpenedQuestionList] = useState(false);

  const handleClickOpenQuestionList = () => setIsOpenedQuestionList(!isOpenedQuestionList);

  const labelClassname = classNames("text-[26px] flex");
  const questionListHeaderClassname = classNames(
    "flex justify-between w-[96%] text-[26px]",
    "hover:bg-[--dark-quizcard-background-hover] hover:cursor-pointer",
    "border-b border-[--dark-quizcard-border]"
  );

  return (
    <div>
      <div className="flex justify-around mt-2 mx-2">
        <div className="flex flex-col w-[450px] gap-3 pr-5">
          <div className="flex flex-col">
            <label className={labelClassname}>Назва вікторини</label>
            <span className="text-[22px] italic">{title}</span>
          </div>
          <div className="flex flex-col">
            <label className={labelClassname}>Тип вікторини</label>
            <span className="text-[22px] italic">
              {quizTypes.find((type) => type.value === quizType).label}
            </span>
          </div>
        </div>

        <div className="flex flex-col w-[250px] gap-3">
          <div className="flex flex-col">
            <label className={labelClassname}>Мова вікторини</label>
            <span className="text-[22px] italic">{language}</span>
          </div>
          <div className="flex flex-col">
            <label className={labelClassname}>Кількість питань</label>
            <span className="text-[22px] italic">{numQuestions}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-[150px] mt-2 px-2">
        <label className={labelClassname}>Опис вікторини</label>
        <span className="text-[20px] italic">{description}</span>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className={questionListHeaderClassname} onClick={handleClickOpenQuestionList}>
          <h2>Список питань</h2>
          <div className="self-center">{isOpenedQuestionList ? <FaChevronDown /> : <FaChevronUp />}</div>
        </div>
        {isOpenedQuestionList && (
          <div className="max-h-[305px] overflow-y-auto w-full flex justify-center">
            <QuestionList
              className="w-[95%] gap-[5px]"
              questions={questions}
              questionType={quizType}
              variant={types.confirmingQuiz}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatingQuizConfirmation;
