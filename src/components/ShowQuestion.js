function ShowQuestion({ question }) {
  const layoutClassname =
    "w-[95%] h-[110px] bg-[--dark-nav] border border-[--dark-quizcard-border] rounded-3xl flex hover:bg-[--dark-quizcard-background-hover]";
  return <div className={layoutClassname}>
    <div className="w-[7%] text-[40px] flex items-center justify-center">
      {question.place}
    </div>
    <div className="w-[13%] self-center">
      <img src={question.img} alt={question.title} />
    </div>
    <div className="w-[70%] pl-[15px] flex flex-col">
      <div className="text-[24px]">
        {question.title}
      </div>
      <div className="text-[20px]">
        {question.description}
      </div>
    </div>
    <div className="w-[10%] text-[40px] flex items-center justify-center">
      {question.points}
    </div>
  </div>;
}

export default ShowQuestion;
