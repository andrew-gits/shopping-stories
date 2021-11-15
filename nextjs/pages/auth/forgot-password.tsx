import AuthSkeleton from '@components/AuthSkeleton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as yup from 'yup';

const initiatePassChangeSchema = yup.object({
    username: yup.string().required('Username is required'),
});

const submitPassChangeSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup
        .string()
        .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/,
            'A password must contain at least 1 uppercase character, 1 lowercase character, and at least 1 digit',
        )
        .min(8, 'A password must be at least 8 characters long')
        .required('A password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
    code: yup
        .string()
        .matches(/[\S]+/, 'Please enter a properly formatted code')
        .required('A code is required'),
});

const SignInPage: NextPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openError, setErrorOpen] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>(null);

    const handleErrorClose = (
        _event: React.SyntheticEvent | React.MouseEvent,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const initiatePassChangeForm = useFormik({
        initialValues: {
            username: '',
        },
        validationSchema: initiatePassChangeSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { username } = values;
                await Auth.forgotPassword(username);
                setUser(username);
                setCodeSent(true);
            } catch (error: any) {
                if (error.message !== undefined) {
                    const includesUser = error.message
                        .toLowerCase()
                        .includes('user');
                    if (includesUser) {
                        initiatePassChangeForm.setFieldError(
                            'username',
                            error.message,
                        );
                    } else {
                        console.error(`Error:  ${error.message}`);
                        setError(error.message);
                        setErrorOpen(true);
                    }
                }
            }
            setIsLoading(false);
        },
    });

    const submitPassChangeForm = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            code: '',
        },
        validationSchema: submitPassChangeSchema,
        onSubmit: async (values) => {
            setError('');
            setIsLoading(true);
            try {
                const { username, code, password } = values;
                await Auth.forgotPasswordSubmit(username, code, password);
                router.push('/auth/signin');
            } catch (error: any) {
                if (error.message !== undefined) {
                    const includesUser = error.message
                        .toLowerCase()
                        .includes('user');
                    const includesCode = error.message
                        .toLowerCase()
                        .includes('code');
                    const includesPass = error.message
                        .toLowerCase()
                        .includes('pass');
                    if (includesUser && !includesPass) {
                        submitPassChangeForm.setFieldError(
                            'username',
                            error.message,
                        );
                    } else if (!includesUser && includesPass) {
                        submitPassChangeForm.setFieldError(
                            'password',
                            error.message,
                        );
                    } else if (includesUser && includesPass) {
                        setError(error.message);
                        setErrorOpen(true);
                    } else if (includesCode) {
                        submitPassChangeForm.setFieldError(
                            'code',
                            error.message,
                        );
                    } else {
                        console.error(`Error:  ${error.message}`);
                        setError(error.message);
                        setErrorOpen(true);
                    }
                }
            }
            setIsLoading(false);
        },
    });

    useEffect(() => {
        submitPassChangeForm.setFieldValue('username', user);
    }, [user]);

    const closeSnackBarButton = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleErrorClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    return !codeSent ? (
        <AuthSkeleton formikForm={initiatePassChangeForm}>
            <FormGroup>
                <Typography variant="h2">Forgot Password</Typography>
                {/* <FormHelperText>Please enter your username</FormHelperText> */}
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="username"
                    label="Username"
                    value={initiatePassChangeForm.values.username}
                    onChange={initiatePassChangeForm.handleChange}
                    error={
                        initiatePassChangeForm.touched.username &&
                        Boolean(initiatePassChangeForm.errors.username)
                    }
                    helperText={
                        initiatePassChangeForm.touched.username &&
                        initiatePassChangeForm.errors.username
                    }
                />
                <FormHelperText error={!!error}>{error}</FormHelperText>
                <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleErrorClose}
                    message={error}
                    action={closeSnackBarButton}
                />
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                >
                    Send code
                </LoadingButton>
                <Container>
                    <Link
                        component="button"
                        onClick={() => {
                            setCodeSent(true);
                        }}
                    >
                        Already have a code? Click here!
                    </Link>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    ) : (
        <AuthSkeleton formikForm={submitPassChangeForm}>
            <FormGroup>
                <Typography variant="h2">Change password</Typography>
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="username"
                    label="Username"
                    value={submitPassChangeForm.values.username}
                    onChange={submitPassChangeForm.handleChange}
                    error={
                        submitPassChangeForm.touched.username &&
                        Boolean(submitPassChangeForm.errors.username)
                    }
                    helperText={
                        submitPassChangeForm.touched.username &&
                        submitPassChangeForm.errors.username
                    }
                />
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="password"
                    label="New Password"
                    type="password"
                    value={submitPassChangeForm.values.password}
                    onChange={submitPassChangeForm.handleChange}
                    error={
                        submitPassChangeForm.touched.password &&
                        Boolean(submitPassChangeForm.errors.password)
                    }
                    helperText={
                        submitPassChangeForm.touched.password &&
                        submitPassChangeForm.errors.password
                    }
                />
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={submitPassChangeForm.values.confirmPassword}
                    onChange={submitPassChangeForm.handleChange}
                    error={
                        submitPassChangeForm.touched.confirmPassword &&
                        Boolean(submitPassChangeForm.errors.confirmPassword)
                    }
                    helperText={
                        submitPassChangeForm.touched.confirmPassword &&
                        submitPassChangeForm.errors.confirmPassword
                    }
                />
                <TextField
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="code"
                    label="Confirmation code"
                    type="text"
                    value={submitPassChangeForm.values.code}
                    onChange={submitPassChangeForm.handleChange}
                    error={
                        submitPassChangeForm.touched.code &&
                        Boolean(submitPassChangeForm.errors.code)
                    }
                    helperText={
                        submitPassChangeForm.touched.code &&
                        submitPassChangeForm.errors.code
                    }
                />
                <FormHelperText error={!!error}>{error}</FormHelperText>
                <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleErrorClose}
                    message={error}
                    action={closeSnackBarButton}
                />
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    type="submit"
                >
                    Change Password
                </LoadingButton>
                <Container>
                    <Link
                        component="button"
                        onClick={() => {
                            setCodeSent(false);
                        }}
                    >
                        Don't have a code? Click here!
                    </Link>
                </Container>
            </FormGroup>
        </AuthSkeleton>
    );
};

export default SignInPage;
