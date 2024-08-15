import { useState } from 'react';
import Link from 'next/link';
import {
  Commune,
  StudentSignup,
  Tag,
  Tag as TagType,
  TagTypes,
  Wilaya,
} from '@/common/types/common';
import AutoCompleteInput from '@/components/common/inputs/autoComplete';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import useRequest from '@/hooks/request';
import { useMessage } from '@/contexts/message';
import LoadingOverlay from '@/components/common/elements/loadingOverlay';

interface SignupProps {
  handleSignup: (student: StudentSignup) => Promise<any>;
  wilayas: Wilaya[];
  levels: TagType[];
}

const SignUp = ({ handleSignup, wilayas }: SignupProps) => {
  const { t } = useTranslation('signup');
  const { showMessage } = useMessage();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setWilaya] = useState('');
  const [communes, setCommunes] = useState<Commune[] | undefined>(undefined);
  const [commune, setCommune] = useState<number | undefined>(undefined);
  const [selectedLevel, setSelecetedLevel] = useState<TagType | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<TagType | undefined>(undefined);
  const [selectedPath, setSelectedPath] = useState<TagType | undefined>(undefined);

  const { data: levels } = useRequest({
    url: `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.LEVEL}`,
  });

  const { data: years } = useRequest({
    url: selectedLevel
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.STUDY_YEAR}&parentTagId=${selectedLevel.id}`
      : undefined,
  });

  const { data: paths } = useRequest({
    url: selectedYear
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.PATH}&parentTagId=${selectedYear.id}`
      : undefined,
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const student: StudentSignup = {
      fullName: fullName,
      email: email,
      password: password,
      phoneNumber: undefined,
      birthday: birthDay,
      communeId: commune,
      tagIds: [selectedLevel?.id as string, selectedYear?.id as string, selectedPath?.id as string],
    };
    const signup = await handleSignup(student);
    const { errors, message } = signup;
    if (errors) {
      showMessage(errors[0].message, 'error');
    } else if (message) {
      showMessage(message, 'success');
      router.push('/login');
    }
    setIsLoading(false);
  };

  const handleWilayaChange = (wilaya: Wilaya) => {
    if (!wilaya) {
      return;
    }
    setWilaya(wilaya.code);
    setCommunes(wilaya.communes);
  };

  const handleCommunChange = (commune: Commune) => {
    if (!commune) {
      return;
    }
    setCommune(commune.id);
  };

  const handleYearChange = (year: TagType) => {
    setSelectedYear(year);
  };

  const handlePathChange = (path: TagType) => {
    setSelectedPath(path);
  };

  const handleLevelChange = (level: TagType) => {
    setSelecetedLevel(level);
  };

  return (
    <div className="flex flex-col mt-24 gap-4 items-center">
      {isLoading && <LoadingOverlay />}
      <div className="text-4xl font-medium text-[#131B2B] ">{t('bePartOfUs')}</div>
      <div className="text-[#9B99AF] text-sm font-[roboto]">{t('signUpSteps')}</div>
      <div className="flex flex-col lg:flex-row justify-around w-2/3 lg:w-1/2 gap-8 mt-6">
        <div className="w-full  ">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('fullNamePlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  
                        rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
          />
        </div>
        <div className="w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder') as string}
            className=" border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  
                        rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-around w-2/3 lg:w-1/2 gap-8 mt-6">
        <div className="w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
          />
        </div>
        <div className="w-full">
          <input
            type="date"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            placeholder={t('birthdayPlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-around w-2/3 lg:w-1/2 gap-8 mt-6">
        <div className="w-full">
          <AutoCompleteInput
            onChange={handleWilayaChange}
            data={wilayas}
            valueKey="wilayaNameFr"
            valueId="code"
            placeholder={t('wilayaPlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
            type="text"
            name="Wilaya"
            disabled={!wilayas}
          />
        </div>
        <div className="w-full">
          <AutoCompleteInput
            onChange={handleCommunChange}
            data={communes ?? []}
            valueKey="communeNameFr"
            valueId="id"
            placeholder={t('communePlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
            type="text"
            name="Wilaya"
            disabled={!communes}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-around w-2/3 lg:w-1/2 gap-8 mt-6">
        <div className="w-full">
          <AutoCompleteInput
            onChange={handleLevelChange}
            data={levels?.items || []}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
            valueKey={'name'}
            valueId={'id'}
            placeholder={t('studyLevel')}
            type={'text'}
            name={'level'}
            disabled={false}
            defaultValue={selectedLevel}
            getDisplayValue={(tag: Tag) =>
              tag?.translations?.find((t) => t.language.toLowerCase() === 'ar')?.name || ''
            }
          />
        </div>
        <div className="w-full">
          <AutoCompleteInput
            onChange={handleYearChange}
            data={years?.items || []}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
            valueKey={'name'}
            valueId={'id'}
            placeholder={t('studyYear')}
            type={'text'}
            name={'year'}
            disabled={!selectedLevel}
            defaultValue={selectedYear}
            getDisplayValue={(tag: Tag) =>
              tag?.translations?.find((t) => t.language.toLowerCase() === 'ar')?.name || ''
            }
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-around w-2/3 lg:w-1/2 gap-8 mt-6">
        <div className="w-full">
          <AutoCompleteInput
            onChange={handlePathChange}
            data={paths?.items || []}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
            valueKey={'name'}
            valueId={'id'}
            placeholder={t('studyPath')}
            type={'text'}
            name={'path'}
            disabled={!selectedYear}
            defaultValue={selectedPath}
            getDisplayValue={(tag: Tag) =>
              tag?.translations?.find((t) => t.language.toLowerCase() === 'ar')?.name || ''
            }
          />
        </div>
      </div>
      <div
        className="flex flex-col mt-8 gap-6 lg:gap-4 w-full justify-center items-center 
                      text-white text-xs 2xl:text-base  font-[roboto]  "
      >
        <button
          onClick={onSubmit}
          className="cursor-pointer flex justify-center items-center bg-[#273B54] 
                      text-white rounded-lg 2xl:rounded-xl py-4 lg:py-3 2xl:py-4  w-2/3 lg:w-1/3 hover:bg-[#273B50]"
        >
          <div>{t('createAccount')}</div>
        </button>
      </div>
      <div className=" lg:flex  justify-center items-center w-3/5 text-[#9B99AF] text-sm 2xl:text-base mb-5">
        {t('terms')}&nbsp;
        <Link className="text-[#0F54EF]" href={'/terms'}>
          {t('termsLink')}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
