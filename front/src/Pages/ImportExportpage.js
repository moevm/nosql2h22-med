import React, { useState, UseState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { importFiles } from "../api/postman";

const ImportExportpage = () => {

    const [drag, setDrag] = useState(false)

    function dragStartHandler(e) {
        e.preventDefault();
        setDrag(true);
    }

    function dragLeaveHandler(e) {
        e.preventDefault();
        setDrag(false);
    }

    function onDropHandler(e) {
        e.preventDefault();
        let files = [...e.dataTransfer.files];
        
        for (const file of files) {
            importFiles(file);
        }

        console.log(files);

        setDrag(false);
    }

    const content = (
        <div className="importexportpage">
            {drag
                ? <div className="container drop-area" id="active"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                    onDrop={e => onDropHandler(e)}
                >
                    <div className="drop-area-content">
                        <AiOutlineFileAdd size={70}/>
                        <p>Отпустите файл, чтобы загрузить его.</p>
                    </div>
                </div>
                : <div className="container drop-area" id="passive"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                >
                    <div className="drop-area-content">
                        <AiOutlineFileAdd size={70}/>
                        <p>Перетащите файл, чтобы загрузить его.</p>
                    </div>
                </div>
            }
        </div>
    );

    return content;
};

export default ImportExportpage;