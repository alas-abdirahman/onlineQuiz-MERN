import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Stack } from '@mui/system';
import { sentenceCase } from 'change-case';
import { Grid, Container, Typography, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox } from '@mui/material';
// components
import Iconify from '../components/iconify';
import Label from '../components/label';
// sections
import {
  AppTasks,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../sections/@dashboard/app';
import { getQuizes } from '../redux/slices/quizSlice';
import Scrollbar from '../components/scrollbar/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import { getUsers } from '../redux/slices/users.slice';
import { getStudents } from '../redux/slices/studentSlice';
import { getQuestions } from '../redux/slices/questionSlice';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'quizID', label: 'Quiz ID', alignRight: false },
  { id: 'subject', label: 'Subject', alignRight: false },
  { id: 'totalQuestions', label: 'Total Question', alignRight: false },
  { id: 'totalMarks', label: 'Total Marks', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: '' },
];
export default function DashboardAppPage() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const { quizes } = useSelector((state) => state.quiz);
  const { users } = useSelector((state) => state.user);
  const { students } = useSelector((state) => state.student);
  const { questions } = useSelector((state) => state.question);

  useEffect(()=>{
    dispatch(getUsers({accessToken}));
    dispatch(getStudents({accessToken}));
    dispatch(getQuestions({accessToken}));
    dispatch(getQuizes({accessToken}));
  }, [dispatch, accessToken]);
  return (
    <>
      <Helmet>
        <title> Dashboard | CA195 </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Users" total={users.admins.length} icon={'mdi:users-group'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Students" total={students.students.length} color="info" icon={'mdi:account-student'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Quizes" total={quizes.quizes.length} color="warning" icon={'arcticons:quizlet'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Questions" total={questions.questions.length} color="error" icon={'material-symbols:question-mark'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={"asc"}
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {quizes.quizes.map((row) => {
                    const { _id, quizID, subject, totalQuestion, totalMarks, duration, status } = row;

                    return (
                      <TableRow hover key={quizID} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {quizID}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{subject}</TableCell>
                        <TableCell align="left">{totalQuestion}</TableCell>
                        <TableCell align="left">{totalMarks}</TableCell>
                        <TableCell align="left">
                          <Label color={(status === 'inactive' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell>
                        <TableCell align="left"> {duration} </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
