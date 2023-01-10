import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-hot-toast';
// @mui
import { Link as RouterLink, Link, Stack, IconButton, InputAdornment, TextField, Checkbox, duration, Alert, FormControlLabel, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup";
// components
import Iconify from '../../../components/iconify';
import { loginUser } from "../../../redux/thunk/auth.thunk";
import { getQuizes } from '../../../redux/slices/quizSlice';
import { getStudents } from '../../../redux/slices/studentSlice';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);
  const { quizes } = useSelector((state) => state.quiz);
  const { students } = useSelector((state) => state.student);

  const LoginSchema = Yup.object().shape({
    role: Yup.string().required("please select your role."),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      role: "",
      username: "",
      password: "",
      remember: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        if (values.role === "Student") {
          const quiz = quizes.quizes.find((quiz) => quiz.quizID === values.username);
          if (!quiz)
            toast.error(`404, quiz with ID (${values.username}) not found.`);
          else if (quiz.status === "inactive")
            toast.error("sorry! quiz not available.")
          else {
            const std = students.students.find((std) => std.id === values.password);
            if (!std)
              toast.error(`404, student with ID (${values.password}) not exist.`)
            else {
              localStorage.setItem("stdName", std.fullname);
              localStorage.setItem("stdClass", std.Class);
              localStorage.setItem("subjectName", quiz.subject);
              localStorage.setItem("quizID", quiz._id);
              navigate("/quizPanel");
            }
          }
        } else {
          const res = await dispatch(loginUser(values));
          if (res.type === "auth/login-user/fulfilled") {
            toast.success("Login successfully");
            navigate("/dashboard", { replace: true });
          }
          else if (res.type === "auth/login-user/rejected") {
            toast.error(
              `${res
                ? res.payload.error
                : "Failed to connect due to network or server error"
              }`
            );
          }
        }
      } catch (error) {
        toast.error(error);
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  useEffect(() => {
    dispatch(getQuizes({ accessToken }));
    dispatch(getStudents({ accessToken }));
  }, [dispatch, accessToken]);
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {err && <Alert severity="error">{err}</Alert>}
          <TextField
            select
            fullWidth
            autoComplete="role"
            label="Select your role"
            {...getFieldProps("role")}
            error={Boolean(touched.role && errors.role)}
            helperText={touched.role && errors.role}
          >
            <MenuItem value={"Admin"}>Admin</MenuItem>
            <MenuItem value={"Student"}>Student</MenuItem>
          </TextField>
          <TextField
            fullWidth
            // autoComplete="username"
            label="Username or quizID"
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            fullWidth
            // autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Password or studentID"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label="Remember me"
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            to={"/auth/forget-password"}
            underline="hover"
          >
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
