import { Field, RecordFromFields } from '@/common/types/common';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Button from '@/components/common/buttons';

interface AddContentProps {
  type: string;
  fields: Field[];
  onSubmit: (content: RecordFromFields) => Promise<void>;
}

const AddContent = ({ type, fields, onSubmit }: AddContentProps) => {
  const { t } = useTranslation('common');
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<RecordFromFields | undefined>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleAddContent = async () => {
    if (!formData) {
      return;
    }
    await onSubmit(formData);
  };

  return (
    <div className={`w-full mt-2 ${isExpanded ? 'border p-4' : ''} transition-all duration-300`}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex flex-row justify-between"
      >
        <p className="font-Poppins text-[#080940] text-md font-semibold">{`${t('add')} ${type}`}</p>
        <span>{isExpanded ? '⬆' : '⬇'}</span>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4">
            {fields.map((field, index) => (
              <div key={index} className="mt-2">
                {field.type === 'checkbox' ? (
                  <label>
                    <input
                      className="mx-2"
                      type="checkbox"
                      name={field.name}
                      defaultChecked={field.value === 'true'}
                      onChange={handleInputChange}
                    />
                    {field.placeholder}
                  </label>
                ) : (
                  <input
                    className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2"
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    name={field.name}
                    defaultValue={field.value}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}
          </div>
          <Button type="info" onClick={handleAddContent}>
            {t('save')}
          </Button>
        </>
      )}
    </div>
  );
};

export default AddContent;
