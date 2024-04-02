import { useParams } from "react-router-dom";
import Link from "../components/Link";
import { GoArrowLeft } from "react-icons/go";
import classNames from "classnames";
import { ROUTES } from "../ROUTES";
import { useFetchQuizQuery } from "../store/apis/quizzesApi";
import ShowQuiz from "../components/ShowQuiz";

function QuizPage() {
  const { pseudoId } = useParams();
  const { data, isLoading } = useFetchQuizQuery(pseudoId);

  const mainStatClassname =
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover] px-[10px] rounded-md";
  const mainClassname = classNames(mainStatClassname, "font-semibold border-b");

  return (
    <div className="flex flex-col items-center mt-10 text-white w-full">
      <div>
        <div className="flex items-center gap-[30px] text-[24px] ml-[15px]">
          <Link
            className="bg-[--dark-quizcard-background-hover] w-[60px] rounded-full flex justify-center hover:bg-[--dark-link-background-hover]"
            to={ROUTES.QuizzesList}
          >
            <GoArrowLeft className="text-[30px]" />
          </Link>
          <Link className={mainClassname} to={ROUTES.Quiz(pseudoId)}>
            Загальна інформація
          </Link>
          <Link className={mainStatClassname} to={ROUTES.QuizStats(pseudoId)}>
            Статистика
          </Link>
        </div>
        {isLoading ? <span className="text-white">Loading...</span> : <ShowQuiz quiz={data} />}
      </div>
    </div>
  );
}

export default QuizPage;
