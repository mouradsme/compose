const Loading = ({ height = 'min-h-screen' }: { height?: string }) => {
  return (
    <div className={`flex items-center ${height} justify-center  bg-gray-100`}>
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
