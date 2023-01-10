import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Icon, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";

import { getQuizes } from '../redux/slices/quizSlice';
import { createQuiz, updateQuiz } from '../redux/thunk/quizThunk';

function NewQuizForm({ handleClose, currentQuiz }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            quizID: currentQuiz?.quizID || "",
            subject: currentQuiz?.subject || "",
            totalQuestion: currentQuiz?.totalQuestion || "",
            totalMarks: currentQuiz?.totalMarks || "",
            status: currentQuiz?.status || "",
            duration: currentQuiz?.duration || "",
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                if (currentQuiz === null) {
                    const req = {
                        quiz: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(createQuiz(req));
                    if (res.type === "quiz/create-quiz/fulfilled") {
                        handleClose();
                        toast.success("Quiz Created");
                        dispatch(getQuizes({ accessToken }));
                        navigate("/dashboard/quiz");
                    } else if (res.type === "quiz/create-quiz/rejected") {
                        toast.error(`${res.error.message}`);
                    }
                    setLoading(false);
                } else {
                    const req = {
                        _id: currentQuiz?._id,
                        quiz: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(updateQuiz(req));
                    if (res.type === "quiz/update-quiz/fulfilled") {
                        handleClose();
                        toast.success("Quiz Updated");
                        dispatch(getQuizes({ accessToken }));
                        navigate("/dashboard/quiz");
                    } else if (res.type === "quiz/update-quiz/rejected") {
                        toast.error(`${res.error.message}`);
                    }
                    setLoading(false);;
                }
            } catch (error) {
                setSubmitting(false);
                setErrors(error);
            }
        },
    });
    const {
        handleSubmit,
        getFieldProps,
        touched,
        errors,
        values,
        setFieldValue,
    } = formik;
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3} mt={5}>
                    <Grid item xs={12} md={12} xl={8}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" my={2} gutterBottom>
                                {currentQuiz === null ? "Create New Quiz" : "Update quiz"}
                            </Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    columnGap: 2,
                                    rowGap: 3,
                                    gridTemplateColumns: {
                                        xs: "repeat(1, 1fr)",
                                        sm: "repeat(2, 1fr)",
                                    },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Quiz ID"
                                    {...getFieldProps("quizID")}
                                    error={Boolean(touched.quizID && errors.quizID)}
                                    helperText={touched.quizID && errors.quizID}
                                />

                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Subject"
                                    {...getFieldProps("subject")}
                                    error={Boolean(touched.subject && errors.subject)}
                                    helperText={touched.subject && errors.subject}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    type="number"
                                    label="Total Question"
                                    {...getFieldProps("totalQuestion")}
                                    error={Boolean(touched.totalQuestion && errors.totalQuestion)}
                                    helperText={touched.totalQuestion && errors.totalQuestion}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    type="number"
                                    label="Total Marks"
                                    {...getFieldProps("totalMarks")}
                                    error={Boolean(touched.totalMarks && errors.totalMarks)}
                                    helperText={touched.totalMarks && errors.totalMarks}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    type="number"
                                    label="Duration"
                                    {...getFieldProps("duration")}
                                    error={Boolean(touched.duration && errors.duration)}
                                    helperText={touched.duration && errors.duration}
                                />
                                <TextField
                                    select
                                    fullWidth
                                    size="large"
                                    label="Status"
                                    {...getFieldProps("status")}
                                    error={Boolean(touched.status && errors.status)}
                                    helperText={touched.status && errors.status}
                                >
                                    <MenuItem value={"active"}>Active</MenuItem>
                                    <MenuItem value={"inactive"}>Inactive</MenuItem>
                                </TextField>
                            </Box>
                        </Card>
                        <Grid
                            item
                            xs={12}
                            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                        >
                            <Button variant='contained'
                                fullWidth onClick={handleClose}
                                sx={{ backgroundColor: "grey", mr: "4%" }}
                            >Close</Button>
                            <LoadingButton
                                loading={loading}
                                size="large"
                                fullWidth
                                type="submit"
                                variant="contained"
                            >
                                {currentQuiz === null ? "Submit" : "Save"}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
const ValidationSchema = yup.object().shape({
    quizID: yup.string().required("Quiz ID is Required"),
    subject: yup
        .string()
        .required("Subject is Required"),
    totalQuestion: yup
        .number()
        .required("Total questions is Required"),
    totalMarks: yup
        .number()
        .required("Total marks is Required"),
    duration: yup
        .number()
        .required("Quiz duration is Required"),
    status: yup
        .string()
        .required("Status is Required"),
});
export default NewQuizForm