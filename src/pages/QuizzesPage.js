import QuizzesList from "../components/QuizzesList";
import QuizFilterSort from "../components/QuizFilterSort";
import { useFetchQuizzesQuery } from "../store";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParamsContext from "../context/searchParams";
import { LinearProgress } from "@mui/material";

function QuizzesPage() {
  const { quizzesSearchParams, changeQuizzesSearchParams } = useContext(ParamsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, error, isFetching } = useFetchQuizzesQuery(quizzesSearchParams);
  
  const handleChangeParams = (newParam) => {
    navigate({
      pathname: location.pathname,
      search: newParam,
    });
    changeQuizzesSearchParams(newParam);
  };
  return (
    <div className="flex flex-col mx-[50px] mt-[40px]">
      <QuizFilterSort isLoading={isFetching} params={quizzesSearchParams} handleParams={handleChangeParams} />
      {error && <span className="text-white">Errors could happens...</span>}
      {isFetching && !error ? (
        <LinearProgress />
      ) : (
        <QuizzesList
          gapY="small"
          className="mt-[20px]"
          quizzes={data?.quizzes}
          numPages={data?.numPages}
          handlePageParam={handleChangeParams}
        />
      )}
    </div>
  );
}

export default QuizzesPage;
