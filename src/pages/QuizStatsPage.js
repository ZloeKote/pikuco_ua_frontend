import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Link from "../components/simpleComponents/Link";
import { GoArrowLeft } from "react-icons/go";
import classNames from "classnames";
import { ROUTES } from "../ROUTES";
import {
  useFetchQuizQuery,
  useFetchIndividualResultsQuery,
  selectCurrentToken,
} from "../store";
import { LinearProgress } from "@mui/material";
import ShowQuizStats from "../components/ShowQuizStats";

function QuizStatsPage() {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const { data: quiz, error: quizError, isLoading: quizIsLoading } = useFetchQuizQuery(pseudoId);
  const { data: indResults } = useFetchIndividualResultsQuery(
    { pseudoId, token },
    {
      skip: location.state?.resultsAfterPassing ? true : false || token ? false : true,
    }
  );
  const langParam = searchParams.get("lang") !== null ? "?lang=" + searchParams.get("lang") : "";

  const mainStatClassname =
    "hover:cursor-pointer hover:bg-[--dark-link-background-hover] px-[10px] rounded-md";
  const statClassname = classNames(mainStatClassname, "font-semibold border-b");

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
          <Link className={mainStatClassname} to={ROUTES.Quiz(pseudoId)} params={langParam}>
            Загальна інформація
          </Link>
          <Link className={statClassname} to={ROUTES.QuizStats(pseudoId)}>
            Статистика
          </Link>
        </div>
        {quizIsLoading ? (
          <LinearProgress />
        ) : (
          <ShowQuizStats quiz={quiz} indResults={indResults} />
        )}
      </div>
    </div>
  );
}

export default QuizStatsPage;