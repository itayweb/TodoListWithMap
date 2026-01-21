import { CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai"
import { Navigate, Outlet } from "react-router";
import { authLoadingAtom, userAtom } from "~/atoms"

export default function ProtectedRoute() {
    const user = useAtomValue(userAtom);
    const loading = useAtomValue(authLoadingAtom);

    if (loading) {
        return (
            <CircularProgress />
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}
