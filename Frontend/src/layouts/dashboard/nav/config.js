import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <Icon icon = 'ri:dashboard-3-line' fontSize={25}/>,
  },
  {
    title: 'admins',
    path: '/dashboard/user',
    icon: <Icon icon='ri:admin-line' fontSize={25}/>,
  },
  {
    title: 'students',
    path: '/dashboard/students',
    icon: <Icon icon='ph:student' fontSize={25}/>,
  },
  {
    title: 'quiz',
    path: '/dashboard/quiz',
    icon: <Icon icon='arcticons:quizlet' fontSize={25}/>,
  },
  {
    title: 'questions',
    path: '/dashboard/questions',
    icon: <Icon icon='mdi:paper-check-outline' fontSize={25}/>,
  },
  {
    title: 'logout',
    path: '/logout',
    icon: <Icon icon='mdi:login' fontSize={25}/>,
  },
];

export default navConfig;
