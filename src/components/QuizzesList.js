import QuizCard from "./QuizCard";

function QuizzesList({ quizzes }) {
  const renderedQuizzes = quizzes.map((quiz) => {
    return <QuizCard key={quiz.pseudoId} quiz={quiz} />
  });

  return <div className="mt-[20px] flex flex-wrap justify-between gap-y-10">{renderedQuizzes}</div>;
}

export default QuizzesList;
