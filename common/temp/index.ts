import machine_learning_model_svg from '@/public/images/machine-learning-model.svg';
import money_svg from '@/public/images/money.svg';
import pedestrian_child_svg from '@/public/images/pedestrian-child.svg';
import CaseIcon from '@/public/images/Path 12043.svg';
import AvatarIcon from '@/public/images/path 12046.svg';
import BillIcon from '@/public/images/Path 12049.svg';
import SettingIcon from '@/public/images/Path 12052.svg';
import { Teacher } from '@/components/Icons';

// header links
const links = [
  { id: 4, label: 'Learning Paths', url: '/learning-paths' },
  { id: 6, label: 'Pricing', url: '/pricing' },
  { id: 6, label: 'Privacy', url: '/privacy' },
];
export { links };

// navside links
const navSide = [
  {
    id: 9,
    label: 'Learning path',
    url: '/dashboard/learning-paths',
    logo: machine_learning_model_svg,
  },
  {
    id: 10,
    label: 'subscrptions',
    url: '/dashboard/subscrptions',
    logo: money_svg,
  },
  {
    id: 11,
    label: 'Profile',
    url: '/dashboard/profile',
    logo: AvatarIcon,
  },
  {
    id: 12,
    label: 'Parent part',
    url: '/dashboard/parent-part',
    logo: pedestrian_child_svg,
  },
];
export { navSide };

const adminNavSide = [
  {
    id: 9,
    label: 'Courses path',
    logo: CaseIcon,
    url: '',
    children: [
      {
        label: 'Courses',
        url: '/admin/dashboard/courses/list',
      },
      {
        label: 'Publish new course',
        url: '/admin/dashboard/courses/new',
      },
      {
        label: 'Categories',
        url: '/admin/dashboard/courses/categories',
      },
    ],
  },
  {
    id: 10,
    label: 'Students',
    url: '/admin/dashboard/students',
    logo: AvatarIcon,
  },
  {
    id: 13,
    label: 'Teachers',
    url: '/admin/dashboard/instructors',
    logo: Teacher,
  },
  {
    id: 11,
    label: 'Payment & check',
    url: '',
    logo: BillIcon,
    children: [
      {
        label: 'Subscribtions',
        url: '/admin/dashboard/subscriptions',
      },
      {
        label: 'Serial numbers',
        url: '/admin/dashboard/subscriptions/serial-numbers',
      },
      {
        label: 'Methods',
        url: '/admin/dashboard/subscriptions/methods',
      },
    ],
  },
  {
    id: 12,
    label: 'Settings',
    logo: SettingIcon,
    url: '',
    children: [
      {
        label: 'Profile manage',
        url: '/admin/dashboard/settings/profile-manage',
      },
      {
        label: 'Add Admin',
        url: '/admin/dashboard/settings/add-admin',
      },
      {
        label: 'Admins list',
        url: '/admin/dashboard/settings/admin-list',
      },
    ],
  },
];
export { adminNavSide };
