import Button from "./simpleComponents/Button";
import toValidIframeYTLink from "../toValidIframeYTLink";

function QuizDuoBattle({ question1, question2, type, handleWinner }) {
  return (
    <>
      <div className="flex relative">
        <div className="w-[50%]">
          <iframe
            title="Youtube"
            width="100%"
            height="100%"
            src={toValidIframeYTLink(question1?.url)}
            allowFullScreen
          ></iframe>
        </div>
        <div className="w-[50%]">
          <iframe
            title="Youtube"
            width="100%"
            height="100%"
            src={toValidIframeYTLink(question2?.url)}
            allowFullScreen
          ></iframe>
        </div>
        <div className="absolute text-red-600 text-[120px] italic font-bold top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          VS
        </div>
      </div>

      <div className="w-[100%] flex text-[38px]">
        <Button
          className="w-[50%] border-none h-full"
          onClick={() => {
            handleWinner(1);
          }}
          success
        >
          Вибрати
        </Button>
        <Button className="w-[50%] border-none h-full" onClick={() => handleWinner(2)} primary>
          Вибрати
        </Button>
      </div>
    </>
  );
}

export default QuizDuoBattle;