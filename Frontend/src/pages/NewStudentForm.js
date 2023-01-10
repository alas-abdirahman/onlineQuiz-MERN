import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Icon, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import * as yup from "yup";
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStudent, updateStudent } from '../redux/thunk/studentThunk';
import { getStudents } from '../redux/slices/studentSlice';

function NewStudentForm({ handleClose, currentStudent = null }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            id: currentStudent?.id || "",
            fullname: currentStudent?.fullname || "",
            tel: currentStudent?.tel || "",
            Class: currentStudent?.Class || "",
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                if (currentStudent === null) {
                    const req = {
                        student: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(createStudent(req));
                    if (res.type === "student/create-student/fulfilled") {
                        handleClose();
                        toast.success("Student Created");
                        dispatch(getStudents({ accessToken }));
                        navigate("/dashboard/students");
                    } else if (res.type === "student/create-student/rejected") {
                        toast.error(`${res.error.message}`);
                    }
                    setLoading(false);;
                } else {
                    const req = {
                        _id: currentStudent?._id,
                        student: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(updateStudent(req));
                    if (res.type === "student/update-student/fulfilled") {
                        handleClose();
                        toast.success("Student Updated");
                        dispatch(getStudents({ accessToken }));
                        navigate("/dashboard/students");
                    } else if (res.type === "student/update-student/rejected") {
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
                                {currentStudent === null ? "Create New Student" : "Update student"}
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
                                    label="ID"
                                    {...getFieldProps("id")}
                                    error={Boolean(touched.id && errors.id)}
                                    helperText={touched.id && errors.id}
                                />

                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Full Name"
                                    {...getFieldProps("fullname")}
                                    error={Boolean(touched.fullname && errors.fullname)}
                                    helperText={touched.fullname && errors.fullname}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    type="number"
                                    label="Phone Number"
                                    {...getFieldProps("tel")}
                                    error={Boolean(touched.tel && errors.tel)}
                                    helperText={touched.tel && errors.tel}
                                />
                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Student Class"
                                    {...getFieldProps("Class")}
                                    error={Boolean(touched.Class && errors.Class)}
                                    helperText={touched.Class && errors.Class}
                                />
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
                                {currentStudent === null ? "Submit" : "Save"}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
const ValidationSchema = yup.object().shape({
    id: yup.string()
        .min(7, "ID must be equal to 7 chars")
        .max(7, "ID must be less than 7 chars")
        .required("Student ID is Required"),
    fullname: yup
        .string()
        .min(3, "fulname must be at least 3 chars.")
        .required("Full Name is Required"),
    tel: yup
        .number()
        .min(9, "Must be 9 or longer")
        .required("Phone Number is Required"),
    Class: yup
        .string()
        .required("Student Class is Required"),
});
export default NewStudentForm