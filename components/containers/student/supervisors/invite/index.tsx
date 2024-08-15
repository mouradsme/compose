import { useState } from 'react';
import Image from 'next/image';
import parent_and_son_small_svg from '@/public/images/parent_and_son_small.svg';
import parent_and_son_svg from '@/public/images/parent_and_son.svg';
import { inviteSupervisor } from '@/lib/supevisors';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

const ParentSection = () => {
  const { t } = useTranslation('supervisors');
  const { showMessage } = useMessage();
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmit = async () => {
    if (!email || !phone || !parentName) {
      showMessage(t('fillAllDataError') as string, 'error');
      return;
    }
    try {
      await inviteSupervisor(parentName, email, phone);
    } catch (err: any) {
      showMessage(err.response?.data.errors[0].message || err.message, 'error');
      return;
    }
    showMessage(t('supervisorInvitedSuccess') as string, 'success');
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col 2xl:w-2/5 px-1">
          <div className="flex gap-5">
            <Image
              width={22}
              height={22}
              src={parent_and_son_small_svg.src}
              alt={parent_and_son_small_svg.src}
            />
            <div className="font-semibold font-[Poppins] text-[#080940] 2xl:text-xl ">
              {t('setupAccount')}
            </div>
          </div>
          <div className="mt-6 lg:pl-10 2xl:w-4/5 ">
            <div className=" p-6 bg-[#EEEFF45C] rounded-xl lg:rounded  ">
              <ul className="flex flex-col gap-4 text-[0.55rem] 2xl:text-sm font-medium list-disc text-[#131B2B] font-[Roboto] ">
                <li>{t('listItem1')}</li>
                <li>{t('listItem2')}</li>
                <li>{t('listItem3')}</li>
              </ul>
            </div>

            <div>
              <div className="hidden lg:flex items-center gap-2 w-full mt-6">
                <div className="w-full  bg-[#707070] h-px"></div>
                <div className=" whitespace-nowrap text-xs 2xl:text-base font-bold">
                  {t('requiredInformation')}
                </div>
                <div className="w-full bg-[#707070] h-px"></div>
              </div>

              <div className="flex flex-col justify-center items-center  gap-4 mt-8 w-full">
                <div className="w-3/4 lg:w-full">
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={t('parentName') as string}
                    className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-4 rounded-lg text-xs 2xl:text-base w-full"
                  />
                </div>
                <div className="w-3/4 lg:w-full">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phoneNumber') as string}
                    className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-4 rounded-lg text-xs 2xl:text-base w-full"
                  />
                </div>
                <div className="w-3/4 lg:w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email') as string}
                    className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-4 rounded-lg text-xs 2xl:text-base w-full"
                  />
                </div>
                <div className="w-3/4 lg:w-full">
                  <button
                    className="cursor-pointer bg-[#273B54] hover:bg-[#374B54] text-white text-xs 2xl:text-base rounded-lg py-3 px-2"
                    onClick={onSubmit}
                  >
                    {t('createAccount')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-1/2 ">
          <div className="w-full flex justify-end items-end h-full ">
            <Image
              width={400}
              height={400}
              src={parent_and_son_svg.src}
              alt={parent_and_son_svg.src}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ParentSection;
