import { Routes, Route } from "react-router-dom";
import AuthForm from "../PublicComponents/Form";
import Error from "../PrivateComponents/Error"
import { useAuth } from './Context';
const PublicRoute = () => {
    const { isValidTokenAvailable } = useAuth();
    return (
        <>
            <Routes> 
                 <Route path="/" element={<AuthForm />} />
                 {!isValidTokenAvailable() && <Route path="*" element={<Error/>}/>}
                 
            </Routes>
        </>

    );
};

export default PublicRoute;
