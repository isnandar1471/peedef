import {Link} from "react-router-dom";
import * as sStat from "../../constants/stateStatus";
import {useEffect, useRef, useState} from "react";
import rule from "../../configs/rule";
import {toast} from "react-toastify";
import {Document, Thumbnail} from "react-pdf";
import {PDFDocument} from "pdf-lib";
import fileSaver from 'file-saver';

export default function Merge() {

    const [files, setFiles] = useState([])
    const [fileBuffers, setFileBuffers] = useState([])
    const [pdfDocs, setPdfDocs] = useState([])
    const [resultFile, setResultFile] = useState(null)

    const [status, setStatus] = useState(sStat.STATE_0_IDLE)

    const formRef = useRef(<form></form>);

    const check = () => {
        console.log('files', files);
        console.log('fileBuffers', fileBuffers);
        console.log('pdfDocs', pdfDocs);
        console.log('resultFile', resultFile);
    }

    const setFileBuffersAndPdfDocs = async () => {
        if (files.length === 0) {

            setFileBuffers([])
            setPdfDocs([])

            setStatus(sStat.STATE_0_IDLE)
            return
        }

        setStatus(sStat.STATE_1_UPLOADING)

        const promiseOperations = files.map(file => {
            return new Promise((resolve, reject) => {
                const fR = new FileReader()
                fR.onload = () => resolve(fR.result)
                fR.onerror = () => reject(fR.error)
                fR.readAsArrayBuffer(file)
            });
        })

        try {
            const newFileBuffers = await Promise.all(promiseOperations)
            setFileBuffers([
                ...fileBuffers,
                ...newFileBuffers,
            ])

            const newPdfDocs = await Promise.all(newFileBuffers.map(async newFileBuffer => await PDFDocument.load(newFileBuffer)))
            setPdfDocs([
                ...pdfDocs,
                ...newPdfDocs,
            ])
            setStatus(sStat.STATE_2_UPLOADED)
        } catch (error) {
            toast(<>
                <p className="font-bold">Terjadi Error!</p>
                <p>{error.message}</p>
            </>)
            setStatus(sStat.STATE_99_ERROR)
        }

        check()

    }

    useEffect(() => {
        console.log(pdfDocs)
    }, [pdfDocs])

    useEffect(() => {
        setFileBuffersAndPdfDocs()
    }, [files])


    const handleFilesInput = (event) => {
        event.preventDefault()

        const newFiles = []

        for (const file of event.target.files) {
            if (file.type !== 'application/pdf') {
                toast(<>
                    <p className="font-bold">File harus berformat PDF!</p>
                    <p>{file.name}</p>
                </>, {type: "error"})
                continue
            }
            if (file.size > rule.MAX_FILE_SIZE) {
                toast(<>
                    <p className="font-bold">File tidak boleh melebihi {rule.MAX_FILE_SIZE} bytes!</p>
                    <p>{file.name}</p>
                </>, {type: "error"})
                continue
            }

            newFiles.push(file)
        }

        formRef.current.reset()

        setFiles(newFiles);

    }


    const handleClearFiles = (event) => {
        event.preventDefault()

        formRef.current.reset()

        setFiles([])

        setStatus(sStat.STATE_0_IDLE)
    }

    const handleMerge = async (event) => {
        event.preventDefault()

        setStatus(sStat.STATE_3_PROCESSING)

        const newPdfDoc = await PDFDocument.create()

        pdfDocs.forEach(async (pdfDoc) => {
            const arrOfCopiedPages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices())

            arrOfCopiedPages.forEach((page) => newPdfDoc.addPage(page))
        })

        setResultFile(await newPdfDoc.saveAsBase64({dataUri: true, addDefaultPage: false}))

        setStatus(sStat.STATE_4_PROCESSED)
    }

    const handleDownload = (event) => {
        event.preventDefault()

        setStatus(sStat.STATE_5_DOWNLOADING)

        // console.log('resultFile', resultFile)
        fileSaver.saveAs(resultFile, `merge.pdf`)

        setStatus(sStat.STATE_6_DOWNLOADED)
    }

    return (
        <div className="mx-12">
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/merge">Merge PDF</Link></li>
                </ul>
            </div>
            <button className="btn btn-primary" onClick={check}>CHECK</button>

            <div className="flex justify-center items-center">
                <ul className="steps">
                    {/*📃📰📄📌📏🔄📤📥☑✔💬🔁*/}
                    <li data-content="📤" className={"step " + (status >= sStat.STATE_0_IDLE && "step-error")}>Choose
                        File
                    </li>
                    <li data-content="🔄"
                        className={"step " + (status >= sStat.STATE_3_PROCESSING && "step-error")}>Processing
                    </li>
                    <li data-content="📥"
                        className={"step " + (status >= sStat.STATE_4_PROCESSED && "step-error")}>Ready
                        to Download
                    </li>
                </ul>
            </div>
            <div className="bg-base-200 min-h-96 my-4 p-4">
                <div className="hero  min-h-96">
                    <div className="hero-content text-center">
                        <div className="flex items-center flex-col">
                            {
                                [sStat.STATE_0_IDLE, sStat.STATE_1_UPLOADING].includes(status) &&
                                <>
                                    <h1 className="text-5xl font-bold">Merge PDF</h1>
                                    <p className="py-6">
                                        "Merge PDFs Securely: Directly in Your Browser, Privacy Preserved!"
                                    </p>
                                </>
                            }
                            <label className="btn btn-wide btn-error" htmlFor='file'>
                                Select PDF Files
                            </label>
                            <form ref={formRef} >
                            <input id='file' type="file" className="input"
                                // accept=".pdf"
                                   onInput={handleFilesInput}
                                   multiple={true}
                                   hidden={true}/>
                            </form>
                            {
                                [sStat.STATE_2_UPLOADED, sStat.STATE_3_PROCESSING, sStat.STATE_4_PROCESSED, sStat.STATE_5_DOWNLOADING, sStat.STATE_6_DOWNLOADED].includes(status) &&
                                <>
                                    {
                                        structuredClone(fileBuffers).map((fileBuffer, idx) =>
                                            <Document key={idx} file={fileBuffer} className="flex w-full m-4">
                                                <>
                                                    <Thumbnail pageNumber={1} width={150}></Thumbnail>
                                                    <p>Page 1</p>
                                                </>
                                                <div className="divider divider-horizontal w-20">
                                                    <span className="">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            className="inline-block h-5 w-5 stroke-current">
                                                            <path
                                                                strokeLinecap={"round"}
                                                                strokeLinejoin={"round"}
                                                                strokeWidth={2}
                                                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                                        </svg>
                                                    </span>
                                                </div>
                                                {/*<div>*/}
                                                {/*    <Thumbnail pageNumber={totalPages} width={150}></Thumbnail>*/}
                                                {/*    <p>Page {totalPages}</p>*/}
                                                {/*</div>*/}
                                            </Document>
                                        )
                                    }
                                    {/*<Document file={fileBuffer} className="flex w-full m-4">*/}
                                    {/*    <div>*/}
                                    {/*        <Thumbnail pageNumber={1} width={150}></Thumbnail>*/}
                                    {/*        <p>Page 1</p>*/}
                                    {/*    </div>*/}
                                    {/*    /!*<div className="divider divider-horizontal w-20">*!/*/}
                                    {/*    /!*    <span className="">*!/*/}
                                    {/*    /!*        <svg*!/*/}
                                    {/*    /!*            xmlns="http://www.w3.org/2000/svg"*!/*/}
                                    {/*    /!*            fill="none"*!/*/}
                                    {/*    /!*            viewBox="0 0 24 24"*!/*/}
                                    {/*    /!*            className="inline-block h-5 w-5 stroke-current">*!/*/}
                                    {/*    /!*            <path*!/*/}
                                    {/*                    strokeLinecap={"round"}*/}
                                    {/*                    strokeLinejoin={"round"}*/}
                                    {/*                    strokeWidth={2}*/}
                                    {/*    /!*                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>*!/*/}
                                    {/*    /!*        </svg>*!/*/}
                                    {/*    /!*    </span>*!/*/}
                                    {/*    /!*</div>*!/*/}
                                    {/*    /!*<div>*!/*/}
                                    {/*    /!*    <Thumbnail pageNumber={totalPages} width={150}></Thumbnail>*!/*/}
                                    {/*    /!*    <p>Page {totalPages}</p>*!/*/}
                                    {/*    /!*</div>*!/*/}
                                    {/*</Document>*/}
                                    <button className="btn btn-error" onClick={handleClearFiles}>
                                        Bersihkan Files
                                    </button>
                                    <button className="btn btn-error" onClick={handleMerge}>
                                        Process Merge
                                    </button>
                                    <button className="btn btn-error" onClick={handleDownload}>
                                        Download
                                    </button>
                                </>
                            }
                            {/*{file && file.size > rule.MAX_FILE_SIZE ?*/}
                            {/*<span>Ukuran file terlau besar, maksimal {rule.MAX_FILE_SIZE}</span> : ''}*/}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

}