import { TagCreate, Tag, TagUpdate, TagTypes } from '@/common/types/common';
import AdminCategoriesTable from '@/components/containers/admin/courses/categories/components/table';
import { useEffect, useState } from 'react';
import CaseIcon from '@/public/images/Path 12043.svg';
import Image from 'next/image';
import AddSquareIcon from '@/public/images/Add.svg';
import Modal from '@/components/common/elements/modal';
import AddCategory from '@/components/containers/admin/courses/categories/components/add';
import { createTags, deleteTag, fetchTags, getTag, updateTag } from '@/lib/tags';
import UpdateCategory from '@/components/containers/admin/courses/categories/components/update';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { tagCreateSchema, tagUpdateSchema } from '@/common/schemas';
import { ValidationError } from 'yup';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';
import Pagination from '@/components/common/pagination';
import { getUserInfoClient } from '@/lib/common';
import { ITEMS_PER_PAGE } from '@/common/config';
import Loading from '@/components/common/elements/loading';

const fetchCategories = async (offset = 0, limit = ITEMS_PER_PAGE) => {
  const user = getUserInfoClient();
  const res = await fetchTags(
    [TagTypes.STUDY_YEAR, TagTypes.LEVEL, TagTypes.PATH, TagTypes.SUBJECT],
    undefined,
    user.accessToken,
    offset,
    limit
  );

  if (res.data?.items) {
    const categories: Tag[] = res.data?.items;
    const totalRecords = res.data?.totalRecords;
    return { totalRecords, categories };
  }

  return { totalRecords: undefined, categories: undefined };
};

const CoursesCategories = () => {
  const { t } = useTranslation('courses');
  const { showMessage } = useMessage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [categoryToUpdate, setCategoryUpdate] = useState<Tag | undefined>(undefined);
  const [parentTag, setParentTag] = useState<Tag | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Tag[] | undefined>(undefined);
  const [totalRecords, setTotalRecords] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onPageChange = (offset: number, _: boolean) => {
    setOffset(offset);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const reset = () => {
    setTimeout(() => {
      setIsLoading(true);
      fetchCategories(offset).then((data) => {
        const { categories } = data;
        setCategories(categories);
      });
      handleDialogClose();
      setIsLoading(false);
    }, 2000);
  };

  const handleAddCategory = async (category: TagCreate) => {
    try {
      await tagCreateSchema.validate(category);
      await createTags(category);
      showMessage(t('tagCreatedSuccessfully') as string, 'success');
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      } else {
        showMessage(t('somethingWentWrongCategoryCouldNotBeCreated') as string, 'error');
      }
      return;
    }
    reset();
  };

  const handleUpdateCategory = async (category: TagUpdate) => {
    try {
      await tagUpdateSchema.validate(category);
      await updateTag(category);
      showMessage(t('tagUpdatedSuccessfully') as string, 'success');
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongCategoryCouldNotBeUpdated') as string, 'error');
      }
      return;
    }
    reset();
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }
    try {
      await deleteTag(deleteId);
      showMessage(t('tagDeletedSuccessfully') as string, 'success');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongCategoryCouldNotBeDeleted') as string, 'error');
      }
    }
    reset();
  };

  const handleUpdateModal = async (category: Tag) => {
    if (category.parentTagId) {
      const res = await getTag(category.parentTagId);
      setParentTag(res.data);
    }
    setIsUpdateDialogOpen(true);
    setCategoryUpdate(category);
  };

  const handleDeleteModal = async (category: Tag) => {
    if (!category) {
      return;
    }
    setDeleteId(category.id);
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCategories(offset).then((data) => {
      const { categories, totalRecords } = data;
      setCategories(categories);
      setTotalRecords(totalRecords);
    });
    setIsLoading(false);
  }, [offset]);

  if (isLoading && categories && categories?.length > 0) {
    return (
      <div className="max-h-3">
        <Loading height="" />
      </div>
    );
  }

  return (
    <>
      {isDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('addNewCategory')}</p>
            <AddCategory
              onSubmit={handleAddCategory}
              onCancel={handleDialogClose}
              fetchCategories={fetchCategories}
            />
          </div>
        </Modal>
      )}

      {isUpdateDialogOpen && categoryToUpdate && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4  ">
            <p className="text-lg font-bold font-Poppins">{t('categoryDetails')}</p>
            <UpdateCategory
              onSubmit={handleUpdateCategory}
              onCancel={handleDialogClose}
              category={categoryToUpdate}
              parentTag={parentTag}
              fetchCategories={fetchCategories}
            />
          </div>
        </Modal>
      )}

      {isDeleteDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('category') })}
            </p>
            <div className="flex flex-raw gap-5">
              <Button type="danger" onClick={handleDelete}>
                {t('delete')}
              </Button>
              <Button type="neutral" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex flex-row justify-between mb-3">
        <div className="flex flex-row gap-3 align-center">
          <div>
            <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
          </div>

          <p className="font-Poppins text-[#080940] text-2xl font-semibold align-middle">
            {t('courseCategories')}
          </p>
        </div>
        <Button
          onClick={handleDialogOpen}
          type="info"
          iconSrc={AddSquareIcon.src}
          iconAlt="over-view_icon"
        >
          {t('addCategory')}
        </Button>
      </div>
      <div className="border border-r-2 border-gray-300 w-full ml-6 "></div>
      <div className="pl-7 pr-5">
        <Pagination totalRecords={totalRecords} onChange={onPageChange} />
      </div>
      <AdminCategoriesTable
        categories={categories as Tag[]}
        onDelete={handleDeleteModal}
        onUpdate={handleUpdateModal}
      />
    </>
  );
};

export default CoursesCategories;
