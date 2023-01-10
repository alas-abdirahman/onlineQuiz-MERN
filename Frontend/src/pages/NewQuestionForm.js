import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Icon, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { getQuestions } from '../redux/slices/questionSlice';
import { createQuestion, updateQuestion } from '../redux/thunk/questionThunk';

function NewQuestionForm({ handleClose, currentQuestion }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);
    const { quizes } = useSelector((state) => state.quiz);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            quizID: currentQuestion?.quizID || "",
            question: currentQuestion?.question || "",
            option1: currentQuestion?.option1 || "",
            option2: currentQuestion?.option2 || "",
            option3: currentQuestion?.option3 || "",
            option4: currentQuestion?.option4 || "",
            marks: currentQuestion?.marks || "",
            answer: currentQuestion?.answer || "",
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                if (currentQuestion === null) {
                    const req = {
                        question: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(createQuestion(req));
                    if (res.type === "question/create-question/fulfilled") {
                        handleClose();
                        toast.success("Question Added");
                        dispatch(getQuestions({ accessToken }));
                        navigate("/dashboard/questions");
                    } else if (res.type === "question/create-question/rejected") {
                        toast.error(`${res.error.message}`);
                    }
                    setLoading(false);
                } else {
                    const req = {
                        _id: currentQuestion?._id,
                        question: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(updateQuestion(req));
                    if (res.type === "question/update-question/fulfilled") {
                        handleClose();
                        toast.success("Question Updated");
                        dispatch(getQuestions({ accessToken }));
                        navigate("/dashboard/questions");
                    } else if (res.type === "question/update-question/rejected") {
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
                                {currentQuestion === null ? "Add New Question" : "Update question"}
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
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Quiz ID"
                                        {...getFieldProps("quizID")}
                                        error={Boolean(touched.quizID && errors.quizID)}
                                        helperText={touched.quizID && errors.quizID}
                                    >
                                        {(
                                            quizes &&
                                            quizes.quizes.map((option) => (
                                                <MenuItem key={option._id} value={option._id}>
                                                    {option.quizID}
                                                </MenuItem>
                                            ))
                                        )}
                                    </TextField>
                                </Grid>

                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Question"
                                    {...getFieldProps("question")}
                                    error={Boolean(touched.question && errors.question)}
                                    helperText={touched.question && errors.question}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Option 1"
                                    {...getFieldProps("option1")}
                                    error={Boolean(touched.option1 && errors.option1)}
                                    helperText={touched.option1 && errors.option1}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Option 2"
                                    {...getFieldProps("option2")}
                                    error={Boolean(touched.option2 && errors.option2)}
                                    helperText={touched.option2 && errors.option2}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Option 3"
                                    {...getFieldProps("option3")}
                                    error={Boolean(touched.option3 && errors.option3)}
                                    helperText={touched.option3 && errors.option3}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Option 4"
                                    {...getFieldProps("option4")}
                                    error={Boolean(touched.option4 && errors.option4)}
                                    helperText={touched.option4 && errors.option4}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    type="number"
                                    label="Marks"
                                    {...getFieldProps("marks")}
                                    error={Boolean(touched.marks && errors.marks)}
                                    helperText={touched.marks && errors.marks}
                                />
                                <TextField
                                    select
                                    fullWidth
                                    size="large"
                                    label="Answer"
                                    {...getFieldProps("answer")}
                                    error={Boolean(touched.answer && errors.answer)}
                                    helperText={touched.answer && errors.answer}
                                >
                                    <MenuItem value={"option1"}>
                                        {"Option 1"}
                                    </MenuItem>
                                    <MenuItem value={"option2"}>
                                        {"Option 2"}
                                    </MenuItem>
                                    <MenuItem value={"option3"}>
                                        {"Option 3"}
                                    </MenuItem>
                                    <MenuItem value={"option4"}>
                                        {"Option 4"}
                                    </MenuItem>
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
                                {currentQuestion === null ? "Submit" : "Save"}
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
    question: yup
        .string()
        .required("Question is Required"),
    option1: yup
        .string()
        .required("Option 1 is Required"),
    option2: yup
        .string()
        .required("Option 2 is Required"),
    option3: yup
        .string()
        .required("Option 3 is Required"),
    option4: yup
        .string()
        .required("Option 4 is Required"),
    answer: yup
        .string()
        .required("Answer is Required"),
    marks: yup
        .string()
        .required("Marks is Required"),
});
export default NewQuestionForm