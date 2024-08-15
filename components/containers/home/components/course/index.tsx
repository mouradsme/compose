const Course = ({ course, onClick, index, currentIndex }: any) => {
  return (
    <div
      key={index}
      onClick={() => onClick(index)}
      className={`flex justify-center items-center  text-xs md:text-sm text-[#283845] font-semibold 
                  px-1 md:px-3 py-4 md:py-5 
                  rounded-lg cursor-pointer text-black 
                  ${
                    currentIndex === index
                      ? 'text-white font-semibold bg-gradient-to-r from-[#0F54EF] to-[#2686FF]'
                      : 'bg-[#F4F7FE] font-bold'
                  }`}
    >
      {course.header}
    </div>
  );
};

export default Course;
