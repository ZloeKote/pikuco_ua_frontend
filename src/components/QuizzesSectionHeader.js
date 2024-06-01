import classNames from "classnames";

function QuizzesSectionHeader({ children }) {
  const className = classNames(
    "text-[50px] text-white", // border-b-2 border-[--dark-quizheader-border]
    "h-[64px] w-full content-start leading-none pl-[38px]"
  );

  return <div className={className}>{children}</div>;
}

export default QuizzesSectionHeader;
