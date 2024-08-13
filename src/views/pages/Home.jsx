import {Link} from "react-router-dom";
import {routePaths} from "../../App";

export default function Home() {

    const features = [
        {
            title: "Split PDF",
            description: "Separate a PDF file into multiple files.",
            routePath: routePaths.split,
        },
        {
            title: "Merge PDF",
            description: "Combine multiple PDF files into one file.",
            routePath: routePaths.merge,
        },
    ];

    const faqs = [
        {
            question: <>What is Peedef?</>,
            answer: <>Peedef is a free and open-source application used for manipulating PDF files. It is browser-based, meaning all processes are done on your browser, ensuring data security and privacy.</>,
        },
        {
            question: <>What features does Peedef offer?</>,
            answer: <>
                <p>Currently, Peedef provides two main features:</p>
                <ul className="list-disc">
                    <li>Split PDF: Separate a PDF file into multiple files.</li>
                    <li>Merge PDF: Combine multiple PDF files into one file.</li>
                </ul>
                <p>Other features are under development and will be added in the future.</p>
            </>,
        },
        {
            question: <>Is Peedef free to use?</>,
            answer: <>Yes, Peedef is completely free to use.</>,
        },
        {
            question: <>Is Peedef secure?</>,
            answer: <>Since Peedef is a browser-based application, all PDF manipulations are done locally in your browser. Your PDF files are not sent to any server, ensuring your data remains private and secure.</>
        },
        {
            question: <>Do I need to install any additional software to use Peedef?</>,
            answer: <>No, you do not need to install any additional software. Peedef works entirely within your web browser.</>
        },
        {
            question: <>How does Peedef protect user privacy?</>,
            answer: <p>Peedef does not upload your PDF files to any server. All manipulations are done locally in your browser, ensuring your data remains secure and private.</p>,
        },
    ];

    const advanceds = [
        [ <></>, <>Peedef</>, <>Other Online PDF Manipulation</> ],
        [ <>Pricing</>, <>100% free</>, <ul><li>Free</li><li>Paid</li></ul> ],
        [ <>Open Source</>, <>Yes</>, <>No</> ],
        [ <>File only in browser</>, <>Yes</>, <>No</> ],
        [ <>Data saved in server</>, <>No</>, <>Usually 1 hour</> ],
    ];

    return (<>
        <div className="container flex mx-20">
            <div className="flex-1">
                <h1 className={"text-4xl"}>Secure PDF edits, directly in your browser!</h1>
                <p>Peedef is an open-source tool for manipulate PDFs directly in your browser,
                    ensuring your data stays secure. Future features will be added
                    according to our roadmap. Enjoy maximum privacy
                    with client-side processing.</p>
                <div className={"flex justify-center gap-x-4"}>
                    <button className="btn btn-error text-white">Lets explore</button>
                    <button className="btn btn-neutral">Read the code</button>
                </div>
            </div>
            <div className="flex-1">
                <img src="https://via.placeholder.com/300" alt="placeholder"/>
            </div>
        </div>

        <section className={"mx-20"}>
            <h2 id={"background"} className="text-3xl">The Background</h2>
            <div>
                <p>I often found myself needing to edit PDF files but didn't always have a device with a PDF editor installed. While I could install one, it took up a lot of time and data. Using online PDF editors was another option, but I was worried about the security of my files and data. So, I decided to create Peedef, a free, browser-based PDF tool that doesn’t need any extra software. It’s simple, secure, and does everything right in your browser.</p>
            </div>
        </section>
        <section className={"mx-20"}>
            <h2 className="text-3xl">Features</h2>
            <div className="flex flex-wrap justify-center gap-5">
                {
                    features.map(({title, description, routePath}, idx) => {
                        return (<Link key={idx} to={routePath}>
                                <div className="card bg-base-100 w-96 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">{title}</h2>
                                        <p>{description}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>

        </section>
        <section className={"mx-20"}>
            <h2 className="text-3xl">Keunggulan</h2>
            <div>
                <table className={"table"}>
                    <thead>
                        <tr>
                            <th>{advanceds[0][0]}</th>
                            <th>{advanceds[0][1]}</th>
                            <th>{advanceds[0][2]}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        advanceds.slice(1).map(advanced =>
                            <tr>
                                <td>{ advanced[0] }</td>
                                <td>{ advanced[1] }</td>
                                <td>{ advanced[2] }</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </section>
        <section className={"mx-20"}>
            <h2 className="text-3xl">FAQ</h2>
            <div>
                {
                    faqs.map(({question, answer}, index) => {
                        return <div key={index} className="collapse collapse-arrow">
                            <input type="radio" name="faq-accordion" defaultChecked={index === 0}/>
                            <div className="collapse-title text-xl font-medium">{question}
                            </div>
                            <div className="collapse-content">
                                {answer}
                            </div>
                        </div>
                    })
                }
            </div>
        </section>
        <section id={"contribution-section"} className={"mx-20"}>
            <Link><h2 className={"text-3xl"}>Want to contribute?</h2></Link>
            <div>
                <p>If you memiliki ide-ide hebat yang ingin kamu kembangkan di projek ini, dengan senang hati kami menyambut kontribusi mu di sini.</p>
                <Link to={"https://github.com/isnandar1471/peedef"} className={"btn "}>Go To Repository
                </Link>
            </div>
        </section>
    </>
    );
    }
