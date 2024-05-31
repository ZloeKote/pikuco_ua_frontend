import notFoundImage from "../../img/errors/quiz-not-found.png";

function QuizNotFound() {
  return (
    <div className="grid place-items-center h-full">
      <img src={notFoundImage} alt="not found" />
    </div>
  );
}

export default QuizNotFound;
