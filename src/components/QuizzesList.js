import QuizCard from "./QuizCard";
import { Pagination } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function QuizzesList({ quizzes, handlePageParam, numPages = 1, hiddenPagination }) {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") !== null ? searchParams.get("page") : 1);
  
  const handleChangePage = (e, value) => {
    if (value !== 1) searchParams.set("page", value);
    else searchParams.delete("page");
    setPage(value);
    handlePageParam(searchParams.toString() !== "" ? "?" + searchParams.toString() : "");
  };
  const renderedQuizzes = quizzes?.map((quiz) => {
    return <QuizCard key={quiz.pseudoId} quiz={quiz} />;
  });

  return (
    <>
      <div className="mt-[20px] flex flex-wrap gap-x-3 gap-y-10">{renderedQuizzes}</div>
      <div className="flex justify-center mt-[20px]">
        <Pagination
          count={numPages}
          page={page}
          onChange={handleChangePage}
          size="large"
          showFirstButton
          showLastButton
          hidden={!quizzes?.length || hiddenPagination}
        />
      </div>
    </>
  );
}

export default QuizzesList;
