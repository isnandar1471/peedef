import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import JSZip from 'jszip'
import {PDFDocument} from 'pdf-lib'
import rule from '../../configs/rule'
import fileSaver from 'file-saver'
import {Document, pdfjs, Thumbnail} from 'react-pdf'
import * as sStat from '../../constants/stateStatus'
import TripleDot from "../icons/TripleDot";
import Delete from "../icons/Delete";
import Plus from "../icons/Plus";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Split() {

    const defaultRange = {
        start: 1,
        end: 1,
        isValid: true,
    }

    const [file, setFile] = useState(null)
    const [fileBuffer, setFileBuffer] = useState(null)


    const [resultFile, setResultFile] = useState(null)

    const [pdfDoc, setPdfDoc] = useState(null)

    const [status, setStatus] = useState(sStat.STATE_0_IDLE)
    // const [isAllValid, setIsAllValid] = useState(null)
    // const [isLoading, setIsLoading] = useState(false)

    const [totalPages, setTotalPages] = useState(null)

    const [ranges, setRanges] = useState([defaultRange])

    useEffect(() => {
        if (!file) {

            setFileBuffer(null)
            setPdfDoc(null)

            setStatus(sStat.STATE_0_IDLE)
            return
        }
        setStatus(sStat.STATE_1_UPLOADING)

        const fR = new FileReader()

        fR.onload = async () => {
            setFileBuffer(fR.result)

            const pdfDocTemp = await PDFDocument.load(fR.result)

            setPdfDoc(pdfDocTemp)

            setTotalPages(pdfDocTemp.getPageCount())

            setStatus(sStat.STATE_2_UPLOADED)
        }

        fR.readAsArrayBuffer(file)


    }, [file])

    const handleFileChange = (event) => {
        setStatus(sStat.STATE_1_UPLOADING)

        const file = event.target.files[0]

        if (file.type !== 'application/pdf') {
            setStatus(sStat.STATE_99_ERROR)
            alert('File harus berformat PDF')
            return
        }
        if (file.size > rule.MAX_FILE_SIZE) {
            setStatus(sStat.STATE_99_ERROR)
            alert('Ukuran file terlalu besar')
            return
        }

        setFile(file);
    }

    const handleClearFile = (event) => {
        event.preventDefault()

        setFile(null)
    }
    const handleSplit = async (event) => {
        event.preventDefault()

        setStatus(sStat.STATE_3_PROCESSING)

        const pdfResults = await Promise.all([
            ...ranges.map(async function ({start, end}) {
                const arrOfNumPages = Array.from({length: end - start + 1}, (_, a) => a + start - 1);
                const newPdfDoc = await PDFDocument.create()

                const copiedPages = await newPdfDoc.copyPages(pdfDoc, arrOfNumPages)

                copiedPages.forEach((page) => newPdfDoc.addPage(page));

                return await newPdfDoc.save()
            })
        ])

        const zip = new JSZip();

        pdfResults.forEach((pdfBuff, index) => {
            const {start, end} = ranges[index]
            zip.file(`${file.name}_${start}-${end}.pdf`, pdfBuff, {})
        })

        setResultFile(await zip.generateAsync({
            type: "blob"
        }))

        setStatus(sStat.STATE_4_PROCESSED)
    }

    const handleDownload = async (event) => {
        event.preventDefault()

        setStatus(sStat.STATE_5_DOWNLOADING)

        // fileSaver.saveAs(resultFile, `${file.name}.zip`)

        setStatus(sStat.STATE_6_DOWNLOADED)
    }

    const handleNewRange = (event) => {
        event.preventDefault()

        const endOfLastRange = ranges[ranges.length - 1].end

        setRanges([...ranges, {
            start: endOfLastRange + 1,
            end: endOfLastRange + 1,
            isValid: true,
        }])
    }

    const makeStartChangeHandler = (idxRange) => {
        return (event) => {
            event.preventDefault()

            const range = ranges[idxRange]
            range.start = isNaN(parseInt(event.target.value)) ? range.start : parseInt(event.target.value)
            range.end = isNaN(parseInt(event.target.value)) ? range.end : parseInt(event.target.value)
            range.isValid = range.start <= range.end

            const newRanges = [...ranges]
            newRanges[idxRange] = range

            setRanges(newRanges)
        }
    }

    const makeEndChangeHandler = (idxRange) => {
        return (event) => {
            event.preventDefault()

            const range = ranges[idxRange]
            range.end = isNaN(parseInt(event.target.value)) ? range.end : parseInt(event.target.value)
            range.isValid = range.start <= range.end

            const newRanges = [...ranges]
            newRanges[idxRange] = range

            setRanges(newRanges)
        }
    }

    const makeDeleteRangeHandler = (idxRange) => {
        return function (event) {
            event.preventDefault()

            const newRanges = [...ranges]
            newRanges.splice(idxRange, 1)

            setRanges(newRanges)
        }
    }

    const getTotalSizeByte = () => {
        return file.size
    }

    return (

        <div className="mx-12">
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/split">Split PDF</Link></li>
                </ul>
            </div>
            <div className="flex justify-center items-center">
                <ul className="steps">
                    {/*📃📰📄📌📏🔄📤📥☑✔💬🔁*/}
                    <li data-content="📤" className={"step " + (status >= sStat.STATE_0_IDLE && "step-error")}>Choose File</li>
                    <li data-content="📏" className={"step " + (status >= sStat.STATE_2_UPLOADED && "step-error")}>Set Ranges</li>
                    <li data-content="🔄" className={"step " + (status >= sStat.STATE_3_PROCESSING && "step-error")}>Processing</li>
                    <li data-content="📥" className={"step " + (status >= sStat.STATE_4_PROCESSED && "step-error")}>Ready to Download</li>
                </ul>
            </div>
            <div className="bg-base-200 min-h-96 my-4 p-4">
                <div className="hero  min-h-96">
                    <div className="hero-content text-center">
                        <div className="flex items-center flex-col">
                            {
                                status !== sStat.STATE_2_UPLOADED &&
                                    <>
                                        <h1 className="text-5xl font-bold">Split PDF</h1>
                                        <p className="py-6">
                                            "Instant PDF Split: Data Safe in Your Browser, 100% Privacy Protected!"
                                        </p>
                                        <button>
                                            <label className="btn btn-wide btn-error" htmlFor='file'>
                                                Select PDF File
                                            </label>
                                        </button>
                                        <input id='file' type="file" className="input" value="" accept=".pdf"
                                               onChange={handleFileChange}
                                               hidden={true}/> {file && file.size > rule.MAX_FILE_SIZE ?
                                        <span>Ukuran file terlau besar, maksimal {rule.MAX_FILE_SIZE}</span> : ''}
                                    </>
                            }
                            {
                                fileBuffer &&
                                    <div>
                                        {file.name}
                                        <span className="m-1">Total Pages: {totalPages}</span>
                                        <span className="m-1">File Size : {getTotalSizeByte()}</span>
                                    </div>
                            }
                            {
                                status === sStat.STATE_2_UPLOADED &&
                                    <>
                                        <Document file={fileBuffer} className="flex w-full m-4">
                                            <div>
                                                <Thumbnail pageNumber={1} width={150}></Thumbnail>
                                                <p>Page 1</p>
                                            </div>
                                            <div className="divider divider-horizontal w-20">
                                                <span className="">
                                                    <TripleDot />
                                                </span>
                                            </div>
                                            <div>
                                                <Thumbnail pageNumber={totalPages} width={150}></Thumbnail>
                                                <p>Page {totalPages}</p>
                                            </div>
                                        </Document>
                                        <button className="btn btn-error" onClick={handleClearFile}>
                                            Bersihkan File
                                        </button>
                                    </>
                            }
                        </div>
                    </div>

                </div>
                {
                    status === sStat.STATE_2_UPLOADED &&
                        <div className="bg-base-100 rounded-xl flex flex-col items-center">
                            <label className='label'>Add Ranges</label>
                            {
                                ranges.map((range, index) =>
                                    <div key={index} className="w-96 flex items-center justify-between">
                                        <input type='number' className={"input w-36 input-bordered m-4 " + ( !range.isValid && "input-error")}
                                               value={range.start}
                                               onChange={makeStartChangeHandler(index)}/>
                                        <input type='number' className={"input w-36 input-bordered m-4 " + ( !range.isValid && "input-error")}
                                               value={range.end}
                                               onChange={makeEndChangeHandler(index)}/>
                                        {
                                            ranges.length > 1 &&
                                                <button className="btn btn-sm btn-circle btn-outline btn-error"
                                                        onClick={makeDeleteRangeHandler(index)}>
                                                    <Delete />
                                                </button>
                                        }

                                        {
                                            !range.isValid &&
                                                <span>Input Tidak Valid</span>
                                        }
                                    </div>
                                )
                            }
                            <div>
                                <button className="btn btn-error btn-outline btn-sm" onClick={handleNewRange}>
                                    <Plus />
                                    Add Range
                                </button>
                            </div>
                            {/*<div>Loading</div>*/}
                            <div>
                                <button className='btn' onClick={handleSplit}>Process Split</button>
                            </div>
                            {
                                status < 4 &&
                                    <div>
                                        <button className="btn" onClick={handleDownload}>Download</button>
                                    </div>
                            }
                        </div>
                }
            </div>
        </div>
    );
}
