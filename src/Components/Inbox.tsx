import {FC, useCallback, useState} from "react";
import {useFileContents} from "./Wrapper";
import {useContextMenu} from "./ContextMenuProvider";
import {writeFile} from "fs";
import {getAbsolutePath} from "./useFileLocation";
import Select from "react-select";
import * as React from "react";
import {useFileOptions} from "./Search";
import * as path from "path";

const removeSelectedText = (contents: string) => {
  const selection = window.getSelection();
  const [start, end] = [selection.anchorOffset, selection.focusOffset].sort();
  return contents.slice(0, start) + contents.slice(end);
}

export const Inbox: FC = () => {
  const fileOptions = useFileOptions('*+(.md)');
  const inboxFile = useFileContents("input.txt");
  const [selectedProject, setSelectedProject] = useState({value: ''});

  const [newFile, setNewFile] = useState(false);
  const [fileName, setFileName] = useState('');

  const removeSelection = useCallback(() => {
    writeFile(getAbsolutePath("input.txt"), removeSelectedText(inboxFile), {flag: 'w'}, () => {
    });
    window.getSelection().empty()
  }, [inboxFile]);

  const moveSelection = useCallback(() => {
    const selectedText = window.getSelection().toString();
    let absolute = getAbsolutePath(selectedProject.value);
    if (newFile) {
      absolute = path.join(path.dirname(absolute), `${fileName}.md`)
    }
    writeFile(absolute, selectedText, {flag: newFile ? 'w+' : 'a+'}, () => {});
    removeSelection();
  }, [selectedProject, newFile, fileName, removeSelection]);


  useContextMenu([{type: 'remove', label: 'Remove', cb: removeSelection}, {
    type: 'move',
    label: 'Move',
    cb: moveSelection
  }]);
  return <>
    <div className={"pb-10"}>
      {inboxFile}
    </div>
    <div className={"fixed bottom-0 w-screen h-10 bg-basedark-700 px-10 -mx-10 py-2 flex"}>
      <Select options={fileOptions} onChange={setSelectedProject} className="w-1/2" menuPlacement={'top'}/>
      <label>New File?<input type="checkbox" onChange={(e) => {
        setNewFile(e.target.checked)
      }} checked={newFile}/></label>
      {newFile && <input value={fileName} onChange={(e) => {
        setFileName(e.target.value);
      }}/>}
    </div>
  </>
}
