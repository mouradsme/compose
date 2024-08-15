import { Element, Lesson } from '@/common/types/common';
import Loading from '@/components/common/elements/loading';
import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

interface VideoElementProps {
  lesson: Lesson;
  element: Element;
  handleCompleteVideo: (element: Element) => void;
}

export interface VideoProps {
  src: string;
  onEnded: () => void;
}

const extractVideoID = (url: string) => {
  const regex = /(youtu\.be\/|\/(embed\/|watch\?v=|v\/))([\w\-]+)/;
  const match = url.match(regex);
  return match ? match[3] : undefined;
};

function Video({ src, onEnded }: VideoProps) {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState<
    | {
        [x: string]: any;
      }
    | null
    | undefined
  >(undefined);

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { offsetHeight, offsetWidth } = divRef.current;
        setDimensions({ height: `${offsetHeight}px`, width: `${offsetWidth}px` });
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [src]);

  return (
    <div className="h-full shadow-md" ref={divRef}>
      {dimensions ? (
        <YouTube
          className="w-full"
          videoId={extractVideoID(src) || ''}
          opts={{
            height: dimensions?.height,
            width: dimensions?.width,
          }}
          onEnd={onEnded}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

const VideoElement = ({ element, handleCompleteVideo }: VideoElementProps) => {
  const onEnded = () => {
    handleCompleteVideo(element);
  };

  return (
    <>
      <div className="relative w-full h-64 lg:h-96 xl:h-[40rem] mt-4 ">
        <Video src={element.content} onEnded={onEnded} />
      </div>
      <div className="mt-8 hidden lg:block m-3">
        <div className="text-[0.7rem] 2xl:text-sm text-[#9BA1A6]">{element.description}</div>
      </div>
    </>
  );
};

export default VideoElement;

export { VideoElement, Video };
