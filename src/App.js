import {HashRouter, Route, Routes,} from 'react-router-dom';
import Home from './views/pages/Home';

import {ThemeProvider} from "./contexts/ThemeContext";
import Merge from "./views/pages/Merge";
import MainLayout from "./views/components/layout/MainLayout";
import Split from "./views/pages/Split";
import {ToastContainer, Slide} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import NotFound from "./views/pages/errors/NotFound";

export const routePaths = {
    split: '/split',
    merge: '/merge',
}

export default function App() {
    return (
        <>
            <ThemeProvider>
                <HashRouter>
                    <Routes>
                        <Route path={'/'} element={<MainLayout><Home/></MainLayout>}/>
                        <Route path={routePaths.split} element={<MainLayout><Split/></MainLayout>}/>
                        <Route path={routePaths.merge} element={<MainLayout><Merge/></MainLayout>}/>
                        <Route path={"*"} element={<MainLayout><NotFound/></MainLayout> }/>
                    </Routes>
                </HashRouter>
            </ThemeProvider>
            <ToastContainer
                hideProgressBar={true}
                transition={Slide}
                draggable={false}
            />
        </>
    );
}
