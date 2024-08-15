import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface ShowContentProps {
  title: string;
  content: string;
  children?: JSX.Element;
}

const ShowContent = ({ title, content, children }: ShowContentProps) => {
  const { t } = useTranslation('common');
  const [isExpanded, setIsExpanded] = useState(false);

  // Split the content to show a preview when collapsed
  const contentPreview = content.slice(0, 100); // First 100 characters as a preview
  const remainingContent = content.slice(100);

  return (
    <div
      className={`w-full bg-white border p-4 mt-2 rounded-md cursor-pointer transition-all duration-300 ${
        isExpanded ? 'h-auto' : 'h-16'
      }`}
    >
      <div className="flex flex-row justify-between">
        <p className="font-Poppins text-[#080940] text-lg font-semibold">{title}</p>
        <button className="text-blue-600" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('collapse') : t('readMore')}
        </button>
      </div>

      <div
        className={`font-open-sans text-sm overflow-hidden text-warp ${
          isExpanded ? 'h-auto' : 'h-4'
        }`}
      >
        {contentPreview}
        {isExpanded && remainingContent}
      </div>
      {isExpanded ? children : undefined}
    </div>
  );
};

export default ShowContent;
