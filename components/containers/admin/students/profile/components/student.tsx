import Image from 'next/image';
import admin_image from '@/public/images/Ellipse 196.png';
import { Student as StudentType, Tag as TagType } from '@/common/types/common';
import { Tag } from '@/components/common/elements/tag';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface StudentProps {
  student: StudentType;
}

const Student = ({ student }: StudentProps) => {
  const { t } = useTranslation('students');
  const [tags, setTags] = useState<TagType[] | undefined>(undefined);

  useEffect(() => {
    setTags(student.tags);
  }, [student]);
  return (
    <div className="flex flex-col justify-center items-center h-64 w-3/12 gap-3  bg-[#F7F8FA] rounded-lg">
      <div className="px-5 py-5 flex flex-col justify-center items-center gap-y-2">
        <div className="w-12 h-12 bg-[#f2f4f8] flex justify-center items-center rounded-full">
          <Image width={80} height={80} src={admin_image.src} alt={'student'} />
        </div>
        <p className="font-Poppins font-normal text-[#273B54] text-md">{student.fullName}</p>
        <div className="font-Poppins font-normal text-[#273B54] text-sm">
          {tags?.map((tag) => (
            <div key={tag.id} className="mb-1">
              <Tag
                tag={tag}
                onClick={() => console.log(tag.translations[0]?.name)}
                selected={false}
              />
            </div>
          ))}
        </div>
        <div className="pt-3 flex flex-col justify-center items-center gap-y-1 ">
          <p className="font-Poppins font-normal text-[#273B54] text-sm">
            {t('contactInformation')}
          </p>
          <p className="font-Poppins font-normal text-[#7C8DA6] text-xs">{student.email}</p>
          <p className="font-Poppins font-normal text-[#7C8DA6] text-xs">{student.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Student;
