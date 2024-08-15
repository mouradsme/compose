import Image from 'next/image';

export interface QuoteBoxProps {
  imageSrc: string;
  text: string;
}

const QuoteBox = ({ imageSrc, text }: QuoteBoxProps) => {
  return (
    <div className="relative bg-[#F4F7FE] p-4 flex items-center justify-center rounded-2xl ">
      <div className="absolute rounded-full -left-6 z-2 overflow-hidden ">
        <Image src={imageSrc} alt={text} width={50} height={50} />
      </div>
      <div className="flex flex-col gap-8 ml-4 ">
        <p className="text-xs font-semibold text-center text-[#87969B]  ">&ldquo;{text}&rdquo;</p>
      </div>
    </div>
  );
};

export default QuoteBox;
