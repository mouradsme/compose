import { useTranslation } from 'next-i18next';
import React, { ChangeEvent, useState } from 'react';

interface CoverUploadProps {
  onImageChange: (file: File) => void;
  image?: string;
}
const CoverUpload = ({ onImageChange, image }: CoverUploadProps) => {
  const { t } = useTranslation('courses');
  const [imageName, setImageName] = useState<string | undefined>(undefined);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageName(file.name);
      onImageChange(file);
    }
  };

  return (
    <div className="w-2/3 flex flex-row border rounded-lg justify-around items-center bg-[#B4B4C124]">
      <p className="font-open-sans font-semibold text-md w-1/4  lg:w-1/6">{t('uploadImage')}</p>
      <label className="flex items-center gap-2 cursor-pointer py-3 px-4 truncate w-3/4  lg:w-5/6">
        <span className="text-[#868692] text-xs">
          {imageName ? imageName : image || t('noFileUploaded')}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </label>
    </div>
  );
};

export default CoverUpload;
