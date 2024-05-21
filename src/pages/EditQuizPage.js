import { useLocation } from "react-router-dom";
import { useFetchQuizQuery } from "../store";
import EditQuiz from "../components/manageQuiz/EditQuiz";
import { LinearProgress } from "@mui/material";
import Button from "../components/simpleComponents/Button";

function EditQuizPage() {
  const location = useLocation();

  const { data, isSuccess, isError, error } = useFetchQuizQuery(location.state?.pseudoId);

  let content = <LinearProgress />;

  if (isSuccess) {
    content = <EditQuiz quiz={data} />;
  } else if (isError) {
    content = (
      <div className="flex flex-col gap-2">
        <p>Ой! Сталася помилка при завантаженні вікторини для редагування</p>
        <p>Деталі помилки {error.status}:</p>
        <p>{error.message}</p>
        <div className="flex gap-4">
          <Button primary>Повторити спробу</Button>
          <Button secondary>Повернутися назад</Button>
        </div>
      </div>
    );
  }

  return content;
}

export default EditQuizPage;
