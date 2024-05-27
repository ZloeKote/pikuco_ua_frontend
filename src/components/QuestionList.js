import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowQuestion from "./ShowQuestion";
import classNames from "classnames";
import { Pagination } from "@mui/material";

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
}) {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") !== null ? searchParams.get("page") : 1);
  useEffect(() => {
    if (!searchParams.has("page")) setPage(1);
    else setPage(searchParams.get("page"))
  }, [searchParams]);
  const handleChangePage = (_, value) => {
    if (value !== 1) searchParams.set("page", value);
    else searchParams.delete("page");
    setPage(value);
    handlePageParam(searchParams.toString() !== "" ? searchParams.toString() : "");
  };

  const classname = classNames("flex flex-col gap-[10px] my-[15px] w-full");
  const layoutClassname = classNames(className, "flex flex-col items-center");
  const renderedQuestions = questions.map((question, i) => {
    return (
      <ShowQuestion
        key={i}
        question={question}
        questionType={questionType}
        variant={variant}
        lang={lang}
        numQuestion={i}
        onClickReset={onClickReset}
        onClickQuiz={onClickQuiz}
        isHighlighted={i === currNumQuestion}
      />
    );
  });
  return (
    <div className={layoutClassname}>
      <div className={classname}>{renderedQuestions}</div>
      <div className="flex justify-center mt-[10px]">
        <Pagination
          count={numPages}
          page={Number(page)}
          onChange={handleChangePage}
          size="large"
          showFirstButton
          showLastButton
          hidden={!questions?.length || hiddenPagination}
        />
      </div>
    </div>
  );
}

export default QuestionList;
