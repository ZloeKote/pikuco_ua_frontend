import { useParams, useSearchParams } from "react-router-dom";
import { selectCurrentToken, useFetchQuizQuery } from "../store";
import PlayQuizLayout from "../components/PlayQuizLayout";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import QuizNotFound from "../components/errors/QuizNotFound";
import InternalServerError from "../components/errors/InternalServerError";

function PlayQuizPage() {
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const token = useSelector(selectCurrentToken);
  const {
    data: fetchedQuizData,
    error,
    isError,
    isLoading,
  } = useFetchQuizQuery({
    pseudoId,
    token,
    param: !!searchParams.toString() && "?" + searchParams.toString(),
  });

  if (isError) {
    if (error.status === 403) {
      return <QuizNotFound />;
    } else if (error.status === 500) return <InternalServerError />;
  }
  return <>{isLoading ? <LinearProgress /> : <PlayQuizLayout quiz={fetchedQuizData} />}</>;
}

export default PlayQuizPage;
