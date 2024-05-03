import Button from "./simpleComponents/Button";

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

function toValidIframeYTLink(ytLink) {
  const curYTLink = ytLink;
  const YT_id_time = getId(curYTLink);
  const YTid = YT_id_time.videoId;
  if (YTid === "error") {
    return;
  }

  if (YT_id_time.timeVideo) ytLink = "//www.youtube.com/embed/" + YTid + "?t=" + YT_id_time.timeVideo;
  else ytLink = "//www.youtube.com/embed/" + YTid;
  return ytLink;
}

// Get youtube video's id
function getId(url) {
  try {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    let timeVideo;

    if (match && match[2].length === 11 && match[0].indexOf("t=") !== -1) {
      timeVideo = match[0].split("t=")[1];
      return {
        videoId: match[2],
        timeVideo,
      };
    } else if (match && match[2].length === 11) {
      return {
        videoId: match[2],
        timeVideo: null,
      };
    } else {
      return "error";
    }
  } catch (err) {
    return "error";
  }
}
