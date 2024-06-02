import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import QuestionList from "./QuestionList";
import ActiveButton from "./simpleComponents/ActiveButton";
import { LinearProgress } from "@mui/material";
import classNames from "classnames";
import { useFetchQuizResultsQuery } from "../store";
import { types } from "../predefined/QuestionTypes";
import { ROUTES } from "../ROUTES";

function ShowQuizStats({
  quiz,
  indResults,
  isResultsAfterPassing,
  generalParams,
  onChangeParam,
  isIndividual,
  onChangeIndividual,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pseudoId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: results, isFetching: resultsIsLoading } = useFetchQuizResultsQuery({
    pseudoId: pseudoId,
    param: generalParams,
  });

  let questions;
  if (isIndividual) {
    if (isResultsAfterPassing) {
      const page = searchParams.get("page");
      const sort = searchParams.get("sort");
      let questionsTemp = location.state?.resultsAfterPassing;
      if (questionsTemp.length <= 4) questions = questionsTemp;
      else {
        if (sort === "TITLE_ASC")
          questionsTemp.sort((q1, q2) => (q1.title > q2.title ? 1 : q2.title > q1.title ? -1 : 0));
        else questionsTemp.sort((q1, q2) => q1.place - q2.place);

        if (page === null || page <= 1) {
          questionsTemp = questionsTemp.slice(0, 4);
        } else {
          questionsTemp = questionsTemp.slice((Number(page) - 1) * 4, Number(page) * 4);
        }
        questions = questionsTemp;
      }
    } else questions = indResults?.quizResults.questions;
  } else {
    if (!resultsIsLoading && results === undefined) {
      questions = quiz.questions;
    } else {
      questions = results?.quizResults.questions;
    }
  }
  let isIndExists = location.state?.resultsAfterPassing ? true : false || indResults ? true : false;
  const indClassname = classNames("mr-[25px] text-[32px]", {
    "text-gray-500 cursor-no-drop": !isIndExists,
    "text-[--dark-text]": isIndExists,
    "font-bold": isIndividual,
  });

  const handleClickSort = (sortBy) => {
    if (searchParams.has("sort")) {
      if (searchParams.get("sort") === "PLACE_ASC" && sortBy === "title")
        searchParams.set("sort", "TITLE_ASC");
      else if (searchParams.get("sort") === "TITLE_ASC" && sortBy === "place")
        searchParams.set("sort", "PLACE_ASC");
      else searchParams.delete("sort");
    } else {
      if (sortBy === "place") searchParams.set("sort", "PLACE_ASC");
      else if (sortBy === "title") searchParams.set("sort", "TITLE_ASC");
    }
    searchParams.delete("page");

    if (isResultsAfterPassing)
      navigate(
        ROUTES.QuizStats(pseudoId) + (!!searchParams.toString() ? "?" + searchParams.toString() : ""),
        {
          state: { isIndividual: true, resultsAfterPassing: location.state?.resultsAfterPassing },
        }
      );
    else onChangeParam(searchParams.toString());
  };

  const handlePageParam = (param) => {
    if (isResultsAfterPassing) {
      console.log(param);
      navigate(ROUTES.QuizStats(pseudoId) + (!!param ? "?" + param : ""), {
        state: { isIndividual: true, resultsAfterPassing: location.state?.resultsAfterPassing },
      });
    } else onChangeParam(param);
  };

  const handleClickIndividual = () => onChangeIndividual(true);
  const handleClickGeneral = () => onChangeIndividual(false);

  return (
    <div className="flex flex-col">
      <div className="self-center">
        <button className={indClassname} onClick={isIndExists ? handleClickIndividual : null}>
          Індивідуальна
        </button>
        <button className={`${isIndividual ? "" : "font-bold"} text-[32px]`} onClick={handleClickGeneral}>
          Загальна
        </button>
      </div>
      <div className="flex items-center gap-[20px] self-start ml-[15px] text-[28px]">
        <span>Сортування по:</span>
        <ActiveButton
          className="w-[150px] h-[50px] rounded-full"
          isActive={
            searchParams.get("sort") === "PLACE_ASC" || searchParams.get("sort") === null ? true : false
          }
          onClick={() => handleClickSort("place")}
        >
          Місцю
        </ActiveButton>
        <ActiveButton
          className="w-[150px] h-[50px] rounded-full"
          isActive={searchParams.get("sort") === "TITLE_ASC"}
          onClick={() => handleClickSort("title")}
        >
          Назві
        </ActiveButton>
      </div>
      {resultsIsLoading ? (
        <LinearProgress />
      ) : (
        <QuestionList
          className="w-[95%] self-center"
          questions={questions}
          questionType={quiz.type}
          variant={isIndividual ? types.individual : types.general}
          numPages={results.numPages}
          handlePageParam={handlePageParam}
          hiddenPagination={results.numPages < 2}
        />
      )}
    </div>
  );
}

export default ShowQuizStats;
