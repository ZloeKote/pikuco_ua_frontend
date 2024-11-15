import { useLocation, useParams, useSearchParams } from "react-router-dom";
import QuestionList from "./QuestionList";
import ActiveButton from "./simpleComponents/ActiveButton";
import classNames from "classnames";
import { types } from "../predefined/QuestionTypes";
import { quizResultsApi } from "../store/apis/quizResultsApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";

function ShowQuizStats({ quiz, language, isFetching }) {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const { pseudoId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [fetchQuizResults, { data: results, isFetching: isFetchingResults }] =
    quizResultsApi.endpoints.fetchQuizResults.useLazyQuery();
  const [fetchIndividualResults, { data: indResults, isFetching: isFetchingIndResults }] =
    quizResultsApi.endpoints.fetchIndividualResults.useLazyQuery();

  const [isIndividual, setIsIndividual] = useState(location.state?.isIndividual);
  const [generalParams, setGeneralParams] = useState(language === "" ? "" : "lang=" + language);
  const [individualParams, setIndividualParams] = useState(language === "" ? "" : "lang=" + language);

  const [resultsAfterPassing] = useState(location.state?.resultsAfterPassing);
  const [questions, setQuestions] = useState([]);
  let isIndExists = !!resultsAfterPassing || results?.userResultExists;
  const indClassname = classNames("mr-[25px] text-[32px]", {
    "text-gray-500 cursor-no-drop": !isIndExists,
    "text-[--dark-text]": isIndExists,
    "font-bold": isIndividual,
  });
  const isQuizLoaded = !isFetching && quiz !== undefined;
  const isDataLoaded =
    isQuizLoaded &&
    (isIndividual
      ? !!resultsAfterPassing || (!isFetchingIndResults && indResults !== undefined)
      : !isFetchingResults && results !== undefined);

  useEffect(() => {
    if (isDataLoaded) {
      if (isIndividual) {
        if (!!resultsAfterPassing) {
          const page = searchParams.get("page");
          const sort = searchParams.get("sort");
          let questionsTemp = resultsAfterPassing;
          if (sort === "TITLE_ASC")
            questionsTemp.sort((q1, q2) => (q1.title > q2.title ? 1 : q2.title > q1.title ? -1 : 0));
          else questionsTemp.sort((q1, q2) => q1.place - q2.place);

          if (page === null || page <= 1) {
            questionsTemp = questionsTemp.slice(0, 4);
          } else {
            questionsTemp = questionsTemp.slice((Number(page) - 1) * 4, Number(page) * 4);
          }
          setQuestions(questionsTemp);
        } else setQuestions(indResults?.quizResults.questions);
      } else {
        if (!isFetchingResults && results === undefined) {
          setQuestions(quiz?.questions);
        } else {
          setQuestions(results?.quizResults.questions);
        }
      }
    }
  }, [
    indResults?.quizResults.questions,
    isDataLoaded,
    isFetchingResults,
    isIndividual,
    resultsAfterPassing,
    location.state?.resultsAfterPassing,
    quiz?.questions,
    results,
    searchParams,
  ]);

  useEffect(() => {
    if (isQuizLoaded) {
      if (isIndividual) {
        if (token === null && !!!resultsAfterPassing) {
          setIsIndividual(false);
          fetchQuizResults({
            pseudoId: pseudoId,
            param: generalParams,
            token: token,
          });
        } else if (!!!resultsAfterPassing) {
          fetchIndividualResults({ pseudoId: pseudoId, token: token, param: individualParams });
        }
      } else {
        fetchQuizResults({
          pseudoId: pseudoId,
          param: generalParams,
          token: token,
        });
      }
    }
  }, [
    fetchIndividualResults,
    individualParams,
    isIndividual,
    resultsAfterPassing,
    pseudoId,
    token,
    isQuizLoaded,
    fetchQuizResults,
    generalParams,
  ]);

  useEffect(() => {
    if (!!!resultsAfterPassing && !isIndividual) setQuestions();
    setIndividualParams(updateQueryParam(individualParams, "lang", language));
    setGeneralParams(updateQueryParam(generalParams, "lang", language));
    setSearchParams(isIndividual ? individualParams : generalParams);
  }, [language, individualParams, generalParams, isIndividual, setSearchParams, resultsAfterPassing]);

  const handleChangeIndividual = (isIndividual) => {
    setIsIndividual(isIndividual);
  };
  const handleClickSort = (sortBy) => {
    let tempParams = isIndividual ? individualParams : generalParams;

    if (searchParams.has("sort")) {
      if (searchParams.get("sort") === "PLACE_ASC" && sortBy === "title") {
        isIndividual
          ? setIndividualParams(updateQueryParam(individualParams, "sort", "TITLE_ASC"))
          : setGeneralParams(updateQueryParam(generalParams, "sort", "TITLE_ASC"));
        tempParams = updateQueryParam(tempParams, "sort", "TITLE_ASC");
      } else if (searchParams.get("sort") === "TITLE_ASC" && sortBy === "place") {
        isIndividual
          ? setIndividualParams(updateQueryParam(individualParams, "sort", "PLACE_ASC"))
          : setGeneralParams(updateQueryParam(generalParams, "sort", "PLACE_ASC"));
        tempParams = updateQueryParam(tempParams, "sort", "PLACE_ASC");
      } else {
        isIndividual
          ? setIndividualParams(updateQueryParam(individualParams, "sort", ""))
          : setGeneralParams(updateQueryParam(generalParams, "sort", ""));
        tempParams = updateQueryParam(tempParams, "sort", "");
      }
    } else {
      if (sortBy === "place") {
        isIndividual
          ? setIndividualParams(updateQueryParam(individualParams, "sort", "PLACE_ASC"))
          : setGeneralParams(updateQueryParam(generalParams, "sort", "PLACE_ASC"));
        tempParams = updateQueryParam(tempParams, "sort", "PLACE_ASC");
      } else if (sortBy === "title") {
        isIndividual
          ? setIndividualParams(updateQueryParam(individualParams, "sort", "TITLE_ASC"))
          : setGeneralParams(updateQueryParam(generalParams, "sort", "TITLE_ASC"));
        tempParams = updateQueryParam(tempParams, "sort", "TITLE_ASC");
      }
    }
    isIndividual
      ? setIndividualParams(updateQueryParam(tempParams, "page", ""))
      : setGeneralParams(updateQueryParam(tempParams, "page", ""));
  };

  const handlePageParam = (param) => (isIndividual ? setIndividualParams(param) : setGeneralParams(param));

  const handleClickIndividual = () => handleChangeIndividual(true);
  const handleClickGeneral = () => handleChangeIndividual(false);

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
      <QuestionList
        className="w-[95%] self-center"
        questions={questions}
        questionType={quiz?.type}
        variant={isIndividual ? types.individual : types.general}
        numPages={
          isIndividual
            ? !!resultsAfterPassing
              ? resultsAfterPassing.length / 4
              : indResults?.numPages
            : results?.numPages
        }
        handlePageParam={handlePageParam}
        hiddenPagination={isIndividual ? indResults?.numPages < 2 : results?.numPages < 2}
        isLoaded={isDataLoaded}
        skeletonItems={4}
      />
    </div>
  );
}

export default ShowQuizStats;

function updateQueryParam(query, paramToUpdate, paramValue) {
  // Розділяємо параметри на масив
  let paramsArray = query.split("&");
  let langFound = false;

  if (query === "" && paramValue !== "") return `${paramToUpdate}=${paramValue}`;

  // Проходимося по кожному параметру
  for (let i = 0; i < paramsArray.length; i++) {
    let param = paramsArray[i].split("=");

    // Якщо параметр знайдено, замінюємо його значення
    if (param[0] === paramToUpdate) {
      if (paramValue !== "") {
        param[1] = paramValue;
        paramsArray[i] = param.join("=");
        // або видаляємо, якщо він пустий
      } else {
        paramsArray = paramsArray.filter((fparam) => fparam !== param.join("="));
      }
      langFound = true;
      break;
    }
  }

  // Якщо параметр не знайдено, додаємо його
  if (!langFound) {
    if (paramValue !== "") paramsArray.push(`${paramToUpdate}=` + paramValue);
  }

  // Збираємо параметри назад у рядок
  return paramsArray.join("&");
}
