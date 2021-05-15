import {FC, useCallback, useEffect, useState} from 'react';
import Select from 'react-select';
import glob from 'glob';
import {useAppDispatch} from '../hooks';
import {useSelector} from 'react-redux';
import {hide, selectIsOpen} from '../searchSlice';
import * as React from "react";
import {useHistory} from 'react-router-dom';
import {IGNORE_PATH, ROOT_PATH} from "../env";

interface SelectOption {
  label: string,
  value: string
}

export const Search : FC = () => {
  const isOpen = useSelector(selectIsOpen);

  if (!isOpen) {
    return null;
  }
  return <SearchInner />;
}

export const useFileOptions = (globString: string) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  useEffect(() => {
    glob(`${ROOT_PATH}/**/${globString}`, {ignore: IGNORE_PATH || ''},(er, files) => {
      setOptions(files.map((e) => {
          const label = e.slice(ROOT_PATH.length);
          return { label, value: label }
        }

      ))
    })
  }, [])
  return options;
}

const SearchInner = () => {
  const history = useHistory();
  const options = useFileOptions('*+(.md|.csv|.pdf|.png)');
  const dispatch = useAppDispatch();

  const onChange = useCallback(
      ({ value }) => {
        history.push("/cabinet/" + value);
        dispatch(hide());
      },
      [],
  )

  useEffect(() => {
    const callback = (e : KeyboardEvent) => {
      if (e.key == "Escape") {
        dispatch(hide());
      }
    };

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    }}, []);


  return <div className="h-screen w-screen overflow-none  fixed top-0 left-0 z-50">
    <div className="bg-violet-50 opacity-60 w-full h-full absolute top-0 left-0" />
    <div className="flex w-full h-full items-center justify-center">
      <Select options={options} onChange={onChange} className="w-1/2" autoFocus > </Select>
    </div>
  </div>;
}
