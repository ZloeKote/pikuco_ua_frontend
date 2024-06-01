import { useParams, useSearchParams } from "react-router-dom";
import { useFetchQuizMainQuery } from "../store/apis/quizzesApi";
import ShowQuiz from "../components/ShowQuiz";
import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store";
import QuizNotFound from "../components/errors/QuizNotFound";
import QuizHeader from "../components/QuizHeader";

function QuizPage() {
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const token = useSelector(selectCurrentToken);
  const { data: quiz, isLoading, isSuccess, isError, error } = useFetchQuizMainQuery({ pseudoId, token });

  let currLanguage = "";
  if (isSuccess) {
    currLanguage =
      (quiz.languages.includes(searchParams.get("lang")) && searchParams.get("lang")) ||
      (quiz.languages.includes("uk") && "uk") ||
      quiz.language;
  }
  if (isError) {
    if (error.status === 404) return <QuizNotFound />;
  }

  return isLoading ? (
    <LinearProgress />
  ) : (
    <QuizHeader quiz={quiz} language={currLanguage} section="main">
      <ShowQuiz quiz={quiz} language={currLanguage} />
    </QuizHeader>
  );
}

export default QuizPage;
