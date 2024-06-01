import { useLocation, useParams, useSearchParams } from "react-router-dom";
import QuestionList from "./QuestionList";
import ActiveButton from "./simpleComponents/ActiveButton";
import { LinearProgress } from "@mui/material";
import classNames from "classnames";
import { useFetchQuizResultsQuery } from "../store";
import { types } from "../predefined/QuestionTypes";

function ShowQuizStats({
  quiz,
  indResults,
  individualParams,
  generalParams,
  onChangeParam,
  isIndividual,
  onChangeIndividual,
  language,
}) {
  const location = useLocation();
  const { pseudoId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: results, isLoading: resultsIsLoading } = useFetchQuizResultsQuery({
    pseudoId: pseudoId,
    param: generalParams,
  });

  let questions;
  if (isIndividual) {
    questions = location.state?.resultsAfterPassing || indResults?.quizResults.questions;
  } else {
    if (!resultsIsLoading && results === undefined) {
      if (language !== quiz.language && quiz.translations.some((tr) => tr.language === language))
        questions = quiz.translations.find((tr) => tr.language === language).questions;
      else questions = quiz.questions;
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
    onChangeParam(searchParams.toString());
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
          lang={language}
          numPages={results.numPages}
          handlePageParam={onChangeParam}
          hiddenPagination={results.numPages < 2}
        />
      )}
    </div>
  );
}

export default ShowQuizStats;
