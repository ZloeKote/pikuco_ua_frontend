export function YtLinkToValid(ytLink) {
  const curYTLink = ytLink;
  const YT_id_time = getYtId(curYTLink);
  const YTid = YT_id_time.videoId;
  if (YTid === "error") {
    return;
  }

  if (YT_id_time.timeVideo) ytLink = "//www.youtube.com/embed/" + YTid + "?t=" + YT_id_time.timeVideo;
  else ytLink = "//www.youtube.com/embed/" + YTid;
  return ytLink;
}

export function getYtThumbnail(url, quality) {
  const ytId = getYtId(url).videoId;
  return `https://img.youtube.com/vi/${ytId}/${quality}.jpg`;
}

export function getYtId(url) {
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
  // Get youtube video's id
}
