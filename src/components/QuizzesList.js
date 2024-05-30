import QuizCard from "./QuizCard";
import { Pagination } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

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
  showActions = false,
  onDelete,
  isLoadingDeleting,
  ...rest
}) {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") !== null ? searchParams.get("page") : 1);
  const quizzesClassName = classNames(`flex flex-wrap ${gapXVariants[gapX]} ${gapYVariants[gapY]}`);
  const layoutClassname = twMerge(classNames(rest.className, "flex flex-col "));

  const handleChangePage = (_, value) => {
    if (value !== 1) searchParams.set("page", value);
    else searchParams.delete("page");
    setPage(value);
    handlePageParam(searchParams.toString() !== "" ? "?" + searchParams.toString() : "");
  };
  const renderedQuizzes = quizzes?.map((quiz) => {
    return (
      <QuizCard
        isLoadingDeleting={isLoadingDeleting}
        key={quiz.pseudoId}
        quiz={quiz}
        showActions={showActions}
        onDelete={onDelete}
      />
    );
  });

  return (
    // якщо щось зламалося, то замінити перший div на <>
    <div className={layoutClassname}>
      <div className={quizzesClassName}>{renderedQuizzes}</div>
      <div className="flex justify-center mt-[20px]">
        <Pagination
          count={numPages}
          page={Number(page)}
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
