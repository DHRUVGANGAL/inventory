import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

export default PrivateRoute;