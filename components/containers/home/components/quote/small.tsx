const QuoteBoxPhone = ({ text }: any) => {
  return (
    <div className="relative bg-[#F4F7FE] px-4 py-6 rounded-2xl ">
      <p className=" text-[0.5rem]  min-[500px]:text-xs font-semibold   text-[#87969B]  ">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
};

export default QuoteBoxPhone;
