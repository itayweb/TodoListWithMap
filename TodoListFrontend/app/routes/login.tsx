import { Box, Typography, Card, TextField, Button, Alert, Link, CircularProgress } from "@mui/material";
import { useSetAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router";
import { loginAction, registerAction, userAtom, authLoadingAtom } from "~/atoms";
import type { User } from "~/types";
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function Login() {
    const { control, handleSubmit, reset } = useForm<User>({
        defaultValues: { username: "", password: "" }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const register = useSetAtom(registerAction);
    const login = useSetAtom(loginAction);
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const authLoading = useAtomValue(authLoadingAtom);

    if (authLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center'
            }}>
                <CircularProgress />
            </Box>
        )
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data: User) => {
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                await register(data);
                navigate('/');
            } else {
                await login(data);
                navigate('/');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An error occurred', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
        }}>
            <Card sx={{ width: '100%', maxWidth: 448, p: 3 }}> {/* max-w-md = 448px, p-6 = 24px */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}> {/* space-y-6 */}

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Todo Map
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                            {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
                        </Typography>
                    </Box>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }} onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            name="username"
                            rules={{ required: "Please enter a username" }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="username"
                                    required
                                    variant="outlined"
                                />
                            )} />
                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: "Please enter a password" }}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="••••••••"
                                    required
                                    variant="outlined"
                                />
                            )} />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            fullWidth
                            sx={{ py: 1.2 }}
                        >
                            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                        </Button>
                    </form>

                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }}
                        sx={{ textAlign: 'center', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </Link>
                </Box>
            </Card>
            <ToastContainer />
        </Box>
    )
}
