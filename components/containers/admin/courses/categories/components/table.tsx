import UnfoldIcon from '@/public/images/unfold-more.svg';
import Image from 'next/image';
import React from 'react';
import { Tag } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';

interface AdminCategoriesTableProps {
  categories: Tag[];
  onDelete: (category: Tag) => void;
  onUpdate: (category: Tag) => void;
}
const AdminCategoriesTable = ({ categories, onDelete, onUpdate }: AdminCategoriesTableProps) => {
  const { t } = useTranslation('courses');
  const headers = [t('name'), t('descriptionTitle'), t('type'), t('actions')];
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
            {categories?.map(
              (category, index) =>
                category.id && (
                  <tr className={index % 2 === 0 ? 'bg-[#F5F7F9] ' : 'bg-white '} key={index}>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3 ">
                      {category.translations.find((tr) => tr.language === 'EN')?.name}
                    </td>
                    <td className="text-gray-600 font-Poppins text-sm  text-center">
                      {category.translations.find((tr) => tr.language === 'EN')?.description}
                    </td>
                    <td className="text-gray-600 font-Poppins text-sm  text-center">
                      {category.tagType}
                    </td>
                    <td className="text-gray-600 font-Poppins flex flex-row gap-3 justify-center">
                      <Button onClick={() => onDelete(category)} type="danger">
                        {t('delete')}
                      </Button>
                      <Button onClick={() => onUpdate(category)} type="info">
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

export default AdminCategoriesTable;
