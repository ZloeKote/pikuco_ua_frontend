import QuizCard from "./QuizCard";
import { Pagination } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";

const gapXVariants = {
  small: "gap-x-3",
  middle: "gap-x-6",
  distant: "gap-x-10",
};
const gapYVariants = {
  small: "gap-y-3",
  middle: "gap-y-6",
  distant: "gap-y-10",
};

function QuizzesList({
  quizzes,
  handlePageParam,
  numPages = 1,
  gapX = "small",
  gapY = "distant",
  hiddenPagination,
  ...rest
}) {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") !== null ? searchParams.get("page") : 1);
  const quizzesClassName = classNames(
    `flex flex-wrap ${gapXVariants[gapX]} ${gapYVariants[gapY]} justify-center`
  );

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
    // якщо щось зламалося, то замінити перший div на <>
    <div {...rest}>
      <div className={quizzesClassName}>{renderedQuizzes}</div>
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
    </div>
  );
}

export default QuizzesList;
