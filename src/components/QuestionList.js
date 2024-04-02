import ShowQuestion from "./ShowQuestion";

function QuestionList({ questions, type, individual }) {
  const renderedQuestions = questions.map((question) => {
    return <ShowQuestion key={question.place} question={question} type={type} individual={individual} />;
  });
  return <div className="flex flex-col items-center gap-[15px] my-[15px]">{renderedQuestions}</div>;
}

export default QuestionList;
