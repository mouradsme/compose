import { useState } from 'react';

const Accordion = ({ title, content, index }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const xIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      className="bi bi-x"
      viewBox="0 0 16 16"
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      className="bi bi-plus"
      viewBox="0 0 16 16"
    >
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
  );

  return (
    <>
      <div className="bg-gray-300 w-full h-1 "></div>
      <div
        key={index}
        className={`flex ${
          isOpen ? 'bg-[#F7F7FD] transition-all duration-1000  rounded-md px-4 py-2' : ''
        } `}
        onClick={toggleAccordion}
      >
        <div
          className={` transition-max-height duration-1000 ${
            isOpen ? 'max-h-screen p-0.5 mx-2' : 'max-h-0'
          } bg-[#006FFF]`}
        ></div>

        <div className=" text-[#080940] mt-2 font-[Montserrat] transition-all duration-1000 ">
          <div className=" flex justify-center ">
            <div className="flex mx-2 w-full justify-between transition-all duration-1000 text-xl lg:text-base 2xl:text-lg font-bold ">
              <div>{title}</div>
              <div>{!isOpen ? plusIcon : xIcon}</div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-max-height duration-1000 text-base mt-3 ${
              isOpen ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default Accordion;
