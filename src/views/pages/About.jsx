import {Link} from "react-router-dom";

export default function About() {
    return (

        <div className="mx-12">
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </div>
        </div>
    );
}