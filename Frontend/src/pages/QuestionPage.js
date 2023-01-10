import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
    Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow, MenuItem, TableBody,
    TableCell, Container, Typography, IconButton, TableContainer, TablePagination, Backdrop, Box, Modal,
    Fade,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import NewQuestionForm from './NewQuestionForm';
import { getQuestions } from '../redux/slices/questionSlice';
import { deleteQuestion } from '../redux/thunk/questionThunk';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'quizID', label: 'Quiz ID', alignRight: false },
    { id: 'question', label: 'Question', alignRight: false },
    { id: 'option1', label: 'Option 1', alignRight: false },
    { id: 'option2', label: 'Option 2', alignRight: false },
    { id: 'option3', label: 'Option 3', alignRight: false },
    { id: 'option4', label: 'Option 4', alignRight: false },
    { id: 'answer', label: 'Answer', alignRight: false },
    { id: 'marks', label: 'Marks', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function QuestionPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedID, setSelectedID] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const { questions } = useSelector((state) => state.question);
    const { quizes } = useSelector((state) => state.quiz);

    const getQuizName = (id) => {
        const quiz = quizes.quizes.find((quiz) => quiz._id === id);
        return quiz.quizID.toString();
    }
    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpen(null);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };
    const handleDeleteQuestion = async () => {
        const res = await dispatch(deleteQuestion({ _id: selectedID, accessToken }));
        if (res.type === "question/delete-question/fulfilled") {
            setOpen(null);
            toast.success("Quiz Deleted");
            dispatch(getQuestions({ accessToken }));
            navigate("/dashboard/questions");
        } else if (res.type === "question/delete-question/rejected") {
            setOpen(null);
            toast.error(`${res.error.message}`);
        }
    };
    const handleEditQuestion = async () => {
        setCurrentQuestion(questions.questions.find((question) => question._id === selectedID));
        setOpen(null);
        setNewAdminModal(true);
    };
    const [openNewAdminModal, setNewAdminModal] = useState(false);
    const handleOpen = () => { setNewAdminModal(true); setCurrentQuestion(null) };
    const handleClose = () => setNewAdminModal(false);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
    const isNotFound = !filteredUsers.length && !!filterName;

    useEffect(() => {
        dispatch(getQuestions({ accessToken }));
    }, [dispatch, accessToken]);
    return (
        <>
            <Helmet>
                <title> Questions | CA195 </title>
            </Helmet>

            <Container>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openNewAdminModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openNewAdminModal}>
                        <Box sx={style}>
                            <NewQuestionForm handleClose={handleClose} currentQuestion={currentQuestion} />
                        </Box>
                    </Fade>
                </Modal>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Questions
                    </Typography>
                    <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Question
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={USERLIST.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {questions.questions.map((row) => {
                                        const { _id, quizID, question, option1, option2, option3, option4, answer, marks } = row;
                                        const selectedUser = selected.indexOf(quizID) !== -1;

                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, quizID)} />
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {getQuizName(quizID)}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{question}</TableCell>
                                                <TableCell align="left">{option1}</TableCell>
                                                <TableCell align="left">{option2} </TableCell>
                                                <TableCell align="left">{option3} </TableCell>
                                                <TableCell align="left">{option4} </TableCell>
                                                <TableCell align="left">{answer} </TableCell>
                                                <TableCell align="left">{marks} </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'} onClick={() => setSelectedID(_id)} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={USERLIST.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleEditQuestion}>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteQuestion}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
