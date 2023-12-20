import ShowQuestion from "./ShowQuestion";

function QuestionList({questions}) {
  const renderedQuestions = questions.map((question) => {
    return <ShowQuestion key={question.place} question={question} />
  })
  return (<div className="flex flex-col items-center gap-[15px] my-[15px]">
    {renderedQuestions}
  </div>)
}

export default QuestionList;