// import { VideoProps } from '@/common/types/props';
import { useState } from 'react';

function Video({ src, poster, rounded, setCompleteVideo }: any) {
  const [showVideo, setShowVideo] = useState(false);

  const handleEndVideo = () => {
    setCompleteVideo?.(true);
  };
  return (
    <div className=" h-full shadow-md">
      {showVideo ? (
        <video
          autoPlay
          controls
          onEnded={handleEndVideo}
          className={`w-full h-full absolute inset-0 z-10 ${rounded ? 'rounded-lg' : ''}`}
          src={src}
        />
      ) : (
        <div
          className={`absolute inset-0 z-0 filter flex items-center justify-center ${
            rounded ? 'rounded-lg' : ''
          }`}
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
          }}
        >
          <button
            className="text-white z-10 bg-blue-500 rounded-full p-6 shadow-inner"
            onClick={() => setShowVideo(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-play-fill"
              viewBox="0 0 16 16"
            >
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
export default Video;
