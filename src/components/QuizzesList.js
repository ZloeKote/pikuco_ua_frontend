import QuizCard from "./QuizCard";
import { Pagination, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
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
  page,
  gapX = "small",
  gapY = "distant",
  hiddenPagination,
  showActions = false,
  onDelete,
  isLoadingDeleting,
  isFetchingQuizzes,
  layoutClassname,
  quizzesClassName,
  paginationClassname,
  skeletonItems = 2,
}) {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    page !== undefined && page !== null
      ? page
      : searchParams.get("page") !== null
      ? searchParams.get("page")
      : 1
  );
  const quizzesClassNames = classNames(
    `flex flex-wrap ${gapXVariants[gapX]} ${gapYVariants[gapY]} h-full`,
    quizzesClassName
  );
  const layoutClassnames = twMerge(classNames("flex flex-col h-full", layoutClassname));
  const paginationClassnames = classNames(
    `flex justify-center mt-[20px] ${hiddenPagination && "hidden"}`,
    paginationClassname
  );

  useEffect(() => {
    setCurrentPage(
      page !== undefined && page !== null
        ? page
        : searchParams.get("page") !== null
        ? searchParams.get("page")
        : 1
    );
  }, [page, searchParams]);

  const handleChangePage = (_, value) => {
    if (value !== 1) searchParams.set("page", value);
    else searchParams.delete("page");
    setCurrentPage(value);
    handlePageParam(searchParams.toString() !== "" ? "?" + searchParams.toString() : "");
  };
  const renderedQuizzes = (
    quizzes && !isFetchingQuizzes ? quizzes : Array.from(new Array(skeletonItems))
  ).map((quiz, index) => {
    return quiz && !isFetchingQuizzes ? (
      <QuizCard
        isLoadingDeleting={isLoadingDeleting}
        key={quiz.pseudoId}
        quiz={quiz}
        showActions={showActions}
        onDelete={onDelete}
      />
    ) : (
      <Skeleton
        sx={{
          borderRadius: "1rem",
        }}
        animation="wave"
        variant="rectangular"
        height={314}
        width={432}
        key={index}
      />
    );
  });

  let content;

  content = (
    <div className={layoutClassnames}>
      <div className={quizzesClassNames}>{renderedQuizzes}</div>
      <div className={paginationClassnames}>
        <Pagination
          count={numPages}
          page={Number(currentPage)}
          onChange={handleChangePage}
          size="large"
          showFirstButton
          showLastButton
          disabled={isFetchingQuizzes}
        />
      </div>
    </div>
  );

  return (
    // якщо щось зламалося, то замінити перший div на <>
    content
  );
}

export default QuizzesList;
