import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;