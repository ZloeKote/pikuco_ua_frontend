import toValidIframeYTLink from "../toValidIframeYTLink";
import imgVs from "../img/img-vs.png";
import { Button, Skeleton } from "@mui/material";

function QuizDuoBattle({ question1, question2, type, handleWinner, isDataLoaded }) {
  return (
    <>
      <div className="flex relative">
        <div className="w-[50%]">
          {isDataLoaded ? (
            <iframe
              title="Youtube"
              width="100%"
              height="100%"
              src={toValidIframeYTLink(question1?.url)}
              allowFullScreen
            ></iframe>
          ) : (
            <Skeleton animation="wave" variant="rectangular" height="100%" />
          )}
        </div>
        <div className="w-[50%]">
          {isDataLoaded ? (
            <iframe
              title="Youtube"
              width="100%"
              height="100%"
              src={toValidIframeYTLink(question2?.url)}
              allowFullScreen
            ></iframe>
          ) : (
            <Skeleton animation="wave" variant="rectangular" height="100%" />
          )}
        </div>
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <img src={imgVs} alt="VS" width="250" />
        </div>
      </div>

      <div className="w-[100%] flex text-[38px]">
        <Button
          className="w-[50%] border-none h-full"
          onClick={() => {
            handleWinner(1);
          }}
          color="success"
          variant="contained"
          sx={{
            fontSize: "38px",
            borderRadius: 0,
            boxShadow: 0,
            "&:disabled": { backgroundColor: "var(--button-success-disabled)", color: "rgba(0,0,0,0.87)" },
          }}
          disabled={!isDataLoaded}
        >
          Вибрати
        </Button>
        <Button
          className="w-[50%] border-none h-full"
          color="info"
          variant="contained"
          onClick={() => handleWinner(2)}
          sx={{
            fontSize: "38px",
            borderRadius: 0,
            boxShadow: 0,
            "&:disabled": { backgroundColor: "var(--button-info-disabled)", color: "rgba(0,0,0,0.87)" },
          }}
          disabled={!isDataLoaded}
        >
          Вибрати
        </Button>
      </div>
    </>
  );
}

export default QuizDuoBattle;
