import { shell } from 'electron';
import { FC, useCallback } from 'react';
import { useAppDispatch } from '../../hooks';
import { useHistory } from 'react-router';

export const Link: FC<{ href: string; children: any; }> = ({ href, children }) => {
  const dispatch = useAppDispatch();
  const {push} = useHistory();
  const onClick = useCallback(() => {

    if(href.startsWith("#")) {
      push(href.slice(1, href.length))
    } else {
      shell.openExternal(href);
    }
  }, [href, dispatch]);
  return <a href="#" className="text-magenta-300 hover:text-magenta-800" onClick={onClick}>{children}</a>;
};
