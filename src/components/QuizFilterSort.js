import { useState } from "react";
import Input from "./Input";
import ActiveButton from "./ActiveButton";
import Dropdown from "./Dropdown";

function QuizFilterSort() {
  const optionsType = [
    {
      label: "Всі",
    },
    {
      label: "Турнір - Відео",
    },
    {
      label: "Турнір - Картинки",
    },
  ];
  const optionsQuestions = [
    {
      label: "Всі",
    },
    {
      label: "4",
    },
    {
      label: "8",
    },
    {
      label: "16",
    },
    {
      label: "32",
    },
    {
      label: "64",
    },
    {
      label: "128",
    },
    {
      label: "256",
    },
    {
      label: "512",
    },
  ];
  const [TypeSelection, setTypeSelection] = useState(optionsType[0]);
  const [QuestionsSelection, setQuestionsSelection] = useState(optionsQuestions[0]);

  const handleChangeType = (option) => {
    setTypeSelection(option);
  };
  const handleChangeQuestions = (option) => {
    setQuestionsSelection(option);
  };

  return (
    <div className="flex gap-[13rem] border-b-2 border-[--dark-quizheader-border] pb-[20px]">
      <div className="flex gap-[40px]">
        <Input width={440} placeholder="Назва вікторини" />
        <Dropdown
          options={optionsType}
          value={TypeSelection}
          onChange={handleChangeType}
          className="h-[40px] w-[300px] z-20 text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover] text-[26px]"
        />
        <Dropdown
          options={optionsQuestions}
          value={QuestionsSelection}
          onChange={handleChangeQuestions}
          className="h-[40px] w-[100px] z-20 text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover] text-[26px]"
        />
      </div>
      <div className="flex gap-[40px]">
        <ActiveButton className="h-[40px] w-[200px] text-[26px] text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]">
          ✨Найкращі
        </ActiveButton>
        <ActiveButton className="h-[40px] w-[150px] text-[26px] text-white border border-[--dark-quizcard-border] rounded-2xl bg-[--dark-quizcard-background] hover:bg-[--dark-quizcard-background-hover]">
          😋Нові
        </ActiveButton>
      </div>
    </div>
  );
}

export default QuizFilterSort;
