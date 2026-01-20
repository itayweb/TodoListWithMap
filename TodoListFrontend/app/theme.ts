import { createTheme } from '@mui/material/styles';

export const customLightTheme = createTheme({
    cssVariables: true,
    palette: {
        mode: 'light',
        primary: {
            main: '#0F172A',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
        divider: 'rgba(0, 0, 0, 0.06)',
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
});