import { useParams } from "react-router-dom";
import { useFetchQuizQuery } from "../store";
import PlayQuizLayout from "../components/PlayQuizLayout";

function PlayQuizPage() {
  const { pseudoId } = useParams();
  const { data: quiz, error, isLoading } = useFetchQuizQuery(pseudoId);

  return <>{isLoading ? <div>Loading...</div> : <PlayQuizLayout quiz={quiz} />}</>;
}

export default PlayQuizPage;
