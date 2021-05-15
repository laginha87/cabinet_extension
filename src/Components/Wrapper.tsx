import {readFile, watch} from "fs";
import * as path from 'path';
import {FC, useEffect, useMemo, useRef, useState} from "react";
import {Preview} from "./Preview";
import {getAbsolutePath, useFileLocation} from "./useFileLocation";


export const useFileContents = (filePath: string) => {

  const [fileData, setFileData] = useState("");
  useEffect(() => {
    const absolutePath = getAbsolutePath(filePath);
    readFile(absolutePath, (err, data) => {
      setFileData(data.toString());
    })
    watch(absolutePath, (e, filename) => {
      readFile(absolutePath, (err, data) => {
        setFileData(data.toString());
      })
    })

  }, [filePath]);

  return fileData;
}

type FileType = '.md' | '.csv' | '.pdf' | '.png';

export const Wrapper: FC = () => {
  const {filepath} = useFileLocation();

  const type: FileType = useMemo(() => path.extname(filepath) as FileType, [filepath]);

  switch (type) {
    case ".md":
      return <Preview filepath={filepath}/>;
    case ".csv":
      return <Table filepath={filepath}/>;
    case ".png":
      return <img src={`cabinet://${filepath}`}/>
    case ".pdf":
      return <PdfRender filepath={filepath}/>
  }
}

const PdfRender: FC<{ filepath: string }> = ({filepath}) => {
  const ref = useRef();

  /*useEffect(() => {
    (async () => {
      const pdf = await pdfjsLib.getDocument('cabinet://' + filepath).promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale: scale, });
      const canvas = ref.current as HTMLCanvasElement
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    })()

  })*/

  const pa = `cabinet:/${filepath}`;
  return <object data={pa} type="application/pdf">
    <embed src={pa} type="application/pdf" width="600px" height="800px"/>
  </object>;
}
const Table: FC<{ filepath: string }> = ({filepath}) => {
  const fileData = useFileContents(filepath);
  const [header, ...rows] = fileData.split("\n");

  return <>
    <div className={"text-2xl"}>{path.basename(filepath, ".csv")}</div>
    <table className={"table"}>
      <thead>
      {header.split(",").map((e) => (<th>{e}</th>))}
      </thead>
      <tbody>
      {rows.map(r => <tr>{r.split(",").map((e) => (<td>{e}</td>))}</tr>)}
      </tbody>
    </table>
  </>
}
