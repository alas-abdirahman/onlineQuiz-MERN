import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Icon, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import { getUsers } from '../redux/slices/users.slice';
import { createUser, updateUser } from '../redux/thunk/users.thunk';

function NewUserForm({ handleClose, currentUser = null }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            fullname: currentUser?.fullname || "",
            email: currentUser?.email || "",
            tel: currentUser?.tel || "",
            username: currentUser?.username || "",
            password: currentUser?.password || "",
            status: currentUser?.status || "",
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                if (currentUser === null) {
                    const req = {
                        user: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(createUser(req));
                    if (res.type === "user/create-user/fulfilled") {
                        toast.success("Admin Created");
                        dispatch(getUsers({ page: 0, accessToken }));
                        handleClose();
                        navigate("/dashboard/user");
                    } else if (res.type === "user/create-user/rejected") {
                        toast.error(`${res.error.message}`);
                    }
                    setLoading(false);
                }
                else {
                    const req = {
                        _id: currentUser._id,
                        user: values,
                        accessToken,
                    };
                    setLoading(true);
                    const res = await dispatch(updateUser(req));
                    if (res.type === "user/update-user/fulfilled") {
                        toast.success("Admin Updated");
                        dispatch(getUsers({ page: 0, accessToken }));
                        handleClose();
                        navigate("/dashboard/user");
                    } else if (res.type === "user/update-user/rejected") {
                        toast.error(`${res.error.message}`);
                    }
                    setLoading(false);
                    ;
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
                                {currentUser === null ? "Create New Admin" : "Update Admin"}
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
                                    label="Full Name"
                                    {...getFieldProps("fullname")}
                                    error={Boolean(touched.fullname && errors.fullname)}
                                    helperText={touched.fullname && errors.fullname}
                                />

                                <TextField
                                    fullWidth
                                    size="large"
                                    label="Email Address"
                                    {...getFieldProps("email")}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
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
                                    label="Username"
                                    {...getFieldProps("username")}
                                    error={Boolean(touched.username && errors.username)}
                                    helperText={touched.username && errors.username}
                                />
                                {(
                                    <TextField
                                        fullWidth
                                        size="large"
                                        label="Password"
                                        {...getFieldProps("password")}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton edge="end">
                                                        <Icon
                                                            icon={
                                                                showPassword
                                                                    ? "eva:eye-fill"
                                                                    : "eva:eye-off-fill"
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={Boolean(touched.password && errors.password)}
                                        helperText={touched.password && errors.password}
                                    />
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Status"
                                        {...getFieldProps("status")}
                                        error={Boolean(touched.status && errors.status)}
                                        helperText={touched.status && errors.status}
                                    >
                                        {["active", "blocked"].map((option, i) => (
                                            <MenuItem key={i} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Box>
                        </Card>
                        <Grid
                            item
                            xs={12}
                            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                        >
                            <Button sx={{ mr: "4%", backgroundColor: "grey" }} fullWidth variant="contained" onClick={handleClose}>Close</Button>
                            <LoadingButton
                                loading={loading}
                                size="large"
                                fullWidth
                                type="submit"
                                variant="contained"
                            >
                                {currentUser === null ? "Submit" : "Save"}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
const ValidationSchema = yup.object().shape({
    fullname: yup.string()
    .min(3, "fulname must be at least 3 chars.")
    .required("Full Name is Required"),
    email: yup
        .string()
        .email("Email Is Invalid")
        .required("Email Address is Required"),
    tel: yup
        .number()
        .min(9, "Must be 9 or longer")
        .required("Phone Number is Required"),
    password:
        yup
            .string()
            .min(6, "Must be longer than six")
            .required("Password is Required"),
    status: yup.string().required("Status is Required"),
    username: yup
        .string()
        .min(3, "Must be longer than 3")
        .required("Username is Required"),
});
export default NewUserForm