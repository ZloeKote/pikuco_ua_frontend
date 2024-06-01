import classNames from "classnames";
import Link from "../components/simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import placeholderCover from "../img/placeholderCover.png";
import { quizTypes } from "../predefined/QuizTypes";

function ShowQuiz({ quiz, language }) {
  const quizType = quizTypes.find((type) => type.value === quiz.type).label;

  const playButtonClassname = classNames(
    "w-[200px] h-[90px] text-[32px] flex",
    "border-green-400 bg-green-600 text-white hover:bg-green-500 rounded-full"
  );

  const quizDescription =
    language === quiz.language
      ? quiz.description
      : quiz.translations.find((tr) => tr.language === language).description;

  return (
    <>
      <div className="flex flex-col items-center text-center text-[24px]">
        <div className=" mt-[10px] flex justify-center">
          <img src={quiz.cover || placeholderCover} alt="cover" />
        </div>
        <div className="w-[60rem]">
          <p className="my-[5px]">{quizType}</p>
          <p className="mb-[5px]">{quizDescription}</p>
          <p className="mb-[15px]">{quiz.amountQuestions} варіанти</p>
        </div>
      </div>
      {!quiz.isRoughDraft && (
        <div className="flex justify-center mb-[20px]">
          <div className={playButtonClassname}>
            <Link
              className="w-full h-full flex justify-center items-center"
              to={ROUTES.PlayQuiz(quiz.pseudoId) + `?lang=${language}`}
            >
              Грати
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowQuiz;
