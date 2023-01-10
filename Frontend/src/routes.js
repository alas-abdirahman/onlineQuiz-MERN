import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import StudentPage from './pages/Students';
import QuizPage from './pages/QuizPage';
import QuestionPage from './pages/QuestionPage';

import { reset } from "./redux/slices/auth.slice";
import QuizPanel from './pages/QuizPanel';

// ----------------------------------------------------------------------
function LogOutDialog() {
  const [openDialog, setOpenDialog] = useState(true);
  const [onClose, setOnClose] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await dispatch(reset());
    setOnClose(true);
    navigate("/login", { replace: true });
  };
  const handleCancelDialog = () => {
    setOnClose(true);
    setOpenDialog(false);
    navigate(-1);
  };

  return (
    <Dialog open={openDialog} onClose={onClose}>
      <DialogTitle>Are you sure you want to logout?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          You will be logged out of your account.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => handleCancelDialog()}>Cancel</Button>
        <Button onClick={handleLogout} color="error">
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'students', element: <StudentPage /> },
        { path: 'quiz', element: <QuizPage /> },
        { path: 'questions', element: <QuestionPage /> },

      ],
    },
    { path: 'quizPanel', element: <QuizPanel /> },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'logout',
      element: <LogOutDialog />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
