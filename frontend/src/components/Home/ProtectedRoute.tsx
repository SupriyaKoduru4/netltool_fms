import { Navigate, Outlet } from "react-router-dom";

import { useAppData } from "../../context/AppDate";

function ProtectedRoute() {
    const { isLoggedIn, appLoading } = useAppData();

    console.log('ProtectedRoute - isLoggedIn:', isLoggedIn, 'appLoading:', appLoading);

    if (appLoading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Outlet/>: <Navigate to="/login" />;


}

export default ProtectedRoute;