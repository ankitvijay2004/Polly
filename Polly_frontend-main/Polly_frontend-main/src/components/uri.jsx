import { useParams } from "react-router-dom";
import { useState } from "react";

const Uri = () => {
  const { pollId } = useParams();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `https://polly-ccc.netlify.app/vote/${pollId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="bg-[url(/vote_bg.svg)] w-screen h-screen flex items-center justify-center p-4">
      <div className="bg-[var(--retro_bg_dark)] rounded-2xl w-full max-w-md">
        <div className="bg-[var(--retro_blue)] rounded-t-2xl p-5 text-xl md:text-2xl text-[var(--retro_bg_light)] font-black text-center">
          Poll Created Successfully
        </div>
        <div className="flex flex-col md:flex-row w-full p-3">
          <div className="bg-[var(--retro_bg_light)] border-[var(--retro_bg_med)] border-2 mb-2 md:mb-0 md:mr-3 w-full md:w-[70%] p-3 rounded-lg text-[var(--retro_red)] overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {`https://polly-ccc.netlify.app/vote/${pollId}`}
          </div>
          <button
            onClick={handleCopy}
            className="w-full md:w-[30%] bg-[var(--retro_blue)] rounded-lg text-[var(--retro_bg_light)] cursor-pointer p-2"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uri;
