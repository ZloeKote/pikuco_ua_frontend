import { useEffect, useState } from "react";
import { getYtThumbnail, createCover } from "../hooks/yt-hooks";
import thumbnailQualities from "../predefined/ytThumbnailQualities";

function TestPage() {
  const [mergedImgs, setMergedImgs] = useState(null);
  const ytThumbnail1 = getYtThumbnail("https://www.youtube.com/watch?v=50KHhMibA6g", thumbnailQualities.high);
  const ytThumbnail2 = getYtThumbnail("https://www.youtube.com/watch?v=pv0cE-3Y3ZI", thumbnailQualities.high);
  useEffect(() => {
    createCover(ytThumbnail1, ytThumbnail2).then((dataUrl) => {
      setMergedImgs(dataUrl);
    });
  }, [ytThumbnail1, ytThumbnail2]);
  return (
    <div className="flex gap-5">
      <img src={ytThumbnail1} alt="yt" />
      <img src={ytThumbnail2} alt="yt" />
      {mergedImgs ? (
          <div className="w-[960px]"><img src={mergedImgs} alt="merged" className="h-[270px] w-[960px]"/></div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}

export default TestPage;


