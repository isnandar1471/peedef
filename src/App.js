import {HashRouter, Route, Routes,} from 'react-router-dom';
import Home from './views/pages/Home';
import About from "./views/pages/About";

import {ThemeProvider} from "./contexts/ThemeContext";
import Merge from "./views/pages/Merge";
import MainLayout from "./views/components/layout/MainLayout";
import Split from "./views/pages/Split";
import {ToastContainer, Slide} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    return (
        <>
            <ThemeProvider>
                <HashRouter>
                    <Routes>
                        <Route path={'/'} element={<MainLayout><Home/></MainLayout>}/>
                        <Route path={'/split'} element={<MainLayout><Split/></MainLayout>}/>
                        <Route path={'/merge'} element={<MainLayout><Merge/></MainLayout>}/>
                        <Route path={"/about"} element={<About/>}></Route>
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
