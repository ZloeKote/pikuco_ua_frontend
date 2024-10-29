import { useState, useContext } from "react";
import { FaFilter } from "react-icons/fa6";
import ActiveButton from "./simpleComponents/ActiveButton";
import Dropdown from "./simpleComponents/Dropdown";
import classNames from "classnames";
import { useSearchParams } from "react-router-dom";
import ParamsContext from "../context/searchParams";
import { quizTypes } from "../predefined/QuizTypes";
import { LoadingButton } from "@mui/lab";
import numQuestions from "../predefined/NumQuestions";

function QuizFilterSort({ isLoading, handleParams }) {
  const { quizzesTypeSelection, changeQuizzesTypeSelection } = useContext(ParamsContext);
  const [searchParams] = useSearchParams();
  const inputClassname = classNames(
    "w-[350px]",
    "text-white pl-[10px] pr-[10px]",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "bg-[--dark-quizcard-background]",
    "hover:bg-[--dark-quizcard-background-hover] focus:bg-[--dark-quizcard-background-hover]"
  );

  const [questionsSelection, setQuestionsSelection] = useState(
    searchParams.get("numberQuestions") !== null
      ? numQuestions.find((opt) => opt.value === searchParams.get("numberQuestions"))
      : numQuestions[0]
  );
  const [titleSearch, setTitleSearch] = useState(searchParams.get("title") ? searchParams.get("title") : "");
  const [isActiveBest, setIsActiveBest] = useState(
    searchParams.get("sort") === "HIGHEST_RATED" ? true : false
  );
  const [isActiveNewest, setIsActiveNewest] = useState(
    searchParams.get("sort") === "HIGHEST_RATED" ? false : true
  );

  const handleChangeType = (option) => {
    changeQuizzesTypeSelection(option);
  };
  const handleChangeQuestions = (option) => {
    setQuestionsSelection(option);
  };
  const handleChangeTitle = (e) => {
    setTitleSearch(e.target.value);
  };

  const handleSubmitFilter = (e) => {
    e.preventDefault();

    if (titleSearch !== "") searchParams.set("title", titleSearch);
    else searchParams.delete("title");

    if (quizzesTypeSelection.value !== "") searchParams.set("type", quizzesTypeSelection.value);
    else searchParams.delete("type");

    if (questionsSelection.value !== "") searchParams.set("numberQuestions", questionsSelection.value);
    else searchParams.delete("numberQuestions");

    searchParams.delete("page");

    handleParams(searchParams.toString() !== "" ? "?" + searchParams.toString() : "");
  };

  const handleClickSortBest = () => {
    setIsActiveBest(!isActiveBest);
    setIsActiveNewest(false);
    if (!isActiveBest) searchParams.set("sort", "HIGHEST_RATED");
    else searchParams.delete("sort");
    handleParams(searchParams.toString() !== "" ? "?" + searchParams.toString() : "");
  };

  const handleClickSortNewest = () => {
    setIsActiveNewest(!isActiveNewest);
    setIsActiveBest(false);
    if (!isActiveNewest) searchParams.set("sort", "NEWEST");
    else searchParams.delete("sort");
    handleParams(searchParams.toString() !== "" ? "?" + searchParams.toString() : "");
  };

  return (
    <div className="flex justify-between gap-[13rem] border-b-2 border-[--dark-quizheader-border] pb-[20px]">
      <div>
        <form className="flex gap-[40px] text-[26px]" onSubmit={handleSubmitFilter}>
          <input
            className={inputClassname}
            width={440}
            placeholder="Назва вікторини"
            value={titleSearch}
            onChange={handleChangeTitle}
          />
          <Dropdown
            options={quizTypes}
            value={quizzesTypeSelection}
            param="type"
            onChange={handleChangeType}
            className="h-[40px] w-[300px] z-20 text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]"
          />
          <Dropdown
            options={numQuestions}
            value={questionsSelection}
            param="numberQuestions"
            onChange={handleChangeQuestions}
            className="h-[40px] w-[100px] z-20 text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]"
          />
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={<FaFilter />}
            type="submit"
            color="success"
            variant="contained"
            className="h-[40px] w-[200px]"
          >
            <span>Застосувати</span>
          </LoadingButton>
        </form>
      </div>
      <div className="flex gap-[40px]">
        <ActiveButton
          className="h-[40px] w-[200px] text-[26px] text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]"
          onClick={handleClickSortBest}
          isActive={isActiveBest}
        >
          ✨Найкращі
        </ActiveButton>
        <ActiveButton
          className="h-[40px] w-[150px] text-[26px] text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]"
          onClick={handleClickSortNewest}
          isActive={isActiveNewest}
        >
          😋Нові
        </ActiveButton>
      </div>
    </div>
  );
}

export default QuizFilterSort;
