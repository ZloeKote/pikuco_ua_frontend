import { useState } from "react";
import Input from "./Input";
import ActiveButton from "./ActiveButton";
import Dropdown from "./Dropdown";
import classNames from "classnames";

function QuizFilterSort({ params, handleParams }) {
  const inputClassname = classNames(
    "w-[350px]",
    "text-[26px] text-white pl-[10px] pr-[10px]",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "bg-[--dark-quizcard-background]",
    "hover:bg-[--dark-quizcard-background-hover] focus:bg-[--dark-quizcard-background-hover]"
  );
  const optionsType = [
    {
      label: "Всі",
      value: "",
    },
    {
      label: "Турнір - Відео",
      value: "TOURNAMENT_VIDEO",
    },
    {
      label: "Турнір - Картинки",
      value: "TOURNAMENT_PICTURE",
    },
  ];
  const optionsQuestions = [
    {
      label: "Всі",
      value: "",
    },
    {
      label: "4",
      value: "4",
    },
    {
      label: "8",
      value: "8",
    },
    {
      label: "16",
      value: "16",
    },
    {
      label: "32",
      value: "32",
    },
    {
      label: "64",
      value: "64",
    },
    {
      label: "128",
      value: "128",
    },
    {
      label: "256",
      value: "256",
    },
    {
      label: "512",
      value: "512",
    },
  ];
  const [TypeSelection, setTypeSelection] = useState(optionsType[0]);
  const [QuestionsSelection, setQuestionsSelection] = useState(optionsQuestions[0]);
  const [titleSearch, setTitleSearch] = useState("");
  const [isActiveBest, setIsActiveBest] = useState(false);
  const [isActiveNewest, setIsActiveNewest] = useState(false);

  const handleChangeType = (option) => {
    setTypeSelection(option);
    option.value !== "" ? handleParams(`?type=${option.value}`) : handleParams();
    setTitleSearch("");
    setQuestionsSelection(optionsQuestions[0]);
  };
  const handleChangeQuestions = (option) => {
    setQuestionsSelection(option);
    option.value !== "" ? handleParams(`?numberQuestions=${option.value}`) : handleParams();
    setTitleSearch("");
    setTypeSelection(optionsType[0]);
  };
  const handleChangeTitle = (e) => {
    setTitleSearch(e.target.value);
  };
  const handleSubmitTitleSearch = (e) => {
    e.preventDefault();
    titleSearch !== "" ? handleParams(`?title=${titleSearch}`) : handleParams();
    setTypeSelection(optionsType[0]);
    setQuestionsSelection(optionsQuestions[0]);
  };

  const handleClickSortBest = () => {
    setIsActiveBest(!isActiveBest);
    setIsActiveBest ? handleParams("?sort=HIGHEST_RATED") : handleParams();
    setIsActiveNewest(false);
    setTitleSearch("");
    setTypeSelection(optionsType[0]);
    setQuestionsSelection(optionsQuestions[0]);
  }

  const handleClickSortNewest = () => {
    setIsActiveNewest(!isActiveNewest);
    setIsActiveNewest ? handleParams("?sort=newest") : handleParams();
    setIsActiveBest(false);
    setTitleSearch("");
    setTypeSelection(optionsType[0]);
    setQuestionsSelection(optionsQuestions[0]);
  }

  return (
    <div className="flex gap-[13rem] border-b-2 border-[--dark-quizheader-border] pb-[20px]">
      <div className="flex gap-[40px]">
        <form onSubmit={handleSubmitTitleSearch}>
          <input
            className={inputClassname}
            width={440}
            placeholder="Назва вікторини"
            value={titleSearch}
            onChange={handleChangeTitle}
          />
        </form>
        <Dropdown
          options={optionsType}
          value={TypeSelection}
          param="type"
          onChange={handleChangeType}
          className="h-[40px] w-[300px] z-20 text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover] text-[26px]"
        />
        <Dropdown
          options={optionsQuestions}
          value={QuestionsSelection}
          param="numberQuestions"
          onChange={handleChangeQuestions}
          className="h-[40px] w-[100px] z-20 text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover] text-[26px]"
        />
      </div>
      <div className="flex gap-[40px]">
        <ActiveButton className="h-[40px] w-[200px] text-[26px] text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]"
        onClick={handleClickSortBest} isActive={isActiveBest}>
          ✨Найкращі
        </ActiveButton>
        <ActiveButton className="h-[40px] w-[150px] text-[26px] text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]"
        onClick={handleClickSortNewest} isActive={isActiveNewest}>
          😋Нові
        </ActiveButton>
      </div>
    </div>
  );
}

export default QuizFilterSort;
