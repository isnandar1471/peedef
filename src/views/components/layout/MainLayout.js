import MainHeader from '../header/MainHeader.js';
import MainContent from '../content/MainContent.js';
import MainFooter from '../footer/MainFooter.js';
import {Link} from "react-router-dom";
import rule from "../../../configs/rule";
import {Document, Thumbnail} from "react-pdf";
import {ThemeContext} from "../../../contexts/ThemeContext";
import {useContext} from "react";
import {toast, ToastContainer, Bounce} from 'react-toastify'

export default function MainLayout({ children }) {
  const { theme } = useContext(ThemeContext)

  return <>
    <div data-theme={theme} className="flex flex-col min-h-screen items-center transition-all">
      <div className="flex-grow self-stretch">
        <MainHeader/>
        { children }
      </div>
      <MainFooter/>
    </div>
  </>;
}

