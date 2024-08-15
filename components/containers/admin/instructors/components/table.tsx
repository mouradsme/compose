import UnfoldIcon from '@/public/images/unfold-more.svg';
import Image from 'next/image';
import React from 'react';
import { Instructor } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';

interface AdminInstructorsTableProps {
  instructors: Instructor[];
  onDelete: (instructor: Instructor) => void;
  onUpdate: (instructor: Instructor) => void;
}

const AdminInstructorsTable = ({ instructors, onDelete, onUpdate }: AdminInstructorsTableProps) => {
  const { t } = useTranslation('supervisors');
  const headers = [t('fullName'), t('emailLabel'), t('phoneLabel'), t('actions')];
  return (
    <div className="w-full pt-3 py-10">
      <div className="bg-white shadow-md ">
        <table className=" w-full ">
          <thead className="bg-[#F5F7F9] ">
            <tr>
              {headers.map((header, index) => (
                <th
                  className="font-[open sans] text-[#767676] text-sm font-semibold py-3"
                  key={index}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Image width={7} height={7} src={UnfoldIcon.src} alt="unfold_icon" />
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {instructors.map(
              (instructor, index) =>
                instructor.id && (
                  <tr
                    className={index % 2 === 0 ? 'bg-[#F5F7F9] ' : 'bg-white '}
                    key={instructor.id}
                  >
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {instructor.firstName} {instructor.lastName}
                    </td>
                    <td className="text-gray-600 font-Poppins text-sm  text-center">
                      {instructor.email}
                    </td>
                    <td className="text-gray-600 font-Poppins text-sm  text-center">
                      {instructor.phone}
                    </td>
                    <td className="text-gray-600 font-Poppins flex flex-row gap-3 justify-center">
                      <Button onClick={() => onDelete(instructor)} type="danger">
                        {t('delete')}
                      </Button>
                      <Button onClick={() => onUpdate(instructor)} type="info">
                        {t('details')}
                      </Button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInstructorsTable;
