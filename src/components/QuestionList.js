import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowQuestion from "./ShowQuestion";
import classNames from "classnames";
import { Pagination, Skeleton } from "@mui/material";

function QuestionList({
  questions,
  questionType,
  variant,
  lang,
  onClickReset,
  onClickQuiz,
  currNumQuestion,
  className,
  numPages = 1,
  handlePageParam,
  hiddenPagination,
  isLoaded,
  skeletonItems = 1,
}) {
  const isDataLoaded = isLoaded && questions !== undefined;
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") !== null ? searchParams.get("page") : 1);

  useEffect(() => {
    if (!searchParams.has("page")) setPage(1);
    else setPage(searchParams.get("page"));
  }, [searchParams]);
  const handleChangePage = (_, value) => {
    if (value !== 1) searchParams.set("page", value);
    else searchParams.delete("page");
    setPage(value);
    handlePageParam(searchParams.toString() !== "" ? searchParams.toString() : "");
  };

  const classname = classNames("flex flex-col gap-[10px] my-[10px] w-full");
  const layoutClassname = classNames(className, "flex flex-col items-center");
  const renderedQuestions = (isDataLoaded ? questions : Array.from(new Array(skeletonItems))).map(
    (question, index) => {
      return isDataLoaded ? (
        <ShowQuestion
          key={index}
          question={question}
          questionType={questionType}
          variant={variant}
          numQuestion={index}
          onClickReset={onClickReset}
          onClickQuiz={onClickQuiz}
          isHighlighted={index === currNumQuestion}
        />
      ) : (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height={110}
          key={index}
          sx={{ borderRadius: "24px" }}
        />
      );
    }
  );
  return (
    <div className={layoutClassname}>
      <div className={classname}>{renderedQuestions}</div>
      <div className="flex justify-center mb-[10px]">
        <Pagination
          count={numPages}
          page={Number(page)}
          onChange={handleChangePage}
          size="large"
          showFirstButton
          showLastButton
          hidden={isDataLoaded ? !questions?.length || hiddenPagination : false}
          disabled={!isDataLoaded}
        />
      </div>
    </div>
  );
}

export default QuestionList;
