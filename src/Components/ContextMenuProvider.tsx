import {createContext, FC, useContext, useEffect} from "react";
import {ipcRenderer} from "electron";

interface MenuItem {
  label: string;
  type: string;
  cb: () => void;
}

const CONTEXT = createContext<{ actions: MenuItem[] }>({actions: []});

export const ContextMenuProvider: FC = ({children}) => {
  const context = useContext(CONTEXT);
  useEffect(() => {
    const callback = (e: MouseEvent) => {
      e.preventDefault();
      const clicked = (_a : any, selectedType : any) => {
        const action = context.actions.find(({type}) => type === selectedType);
        action.cb();
      };

      ipcRenderer.once('context-menu-click', clicked);
      ipcRenderer.send('show-context-menu', context.actions.map(({label, type}) => ({label, type})))
    };
    window.addEventListener('contextmenu', callback);
    return () => {
      window.removeEventListener('contextmenu', callback);
    }
  }, [context]);

  return <CONTEXT.Provider value={context}>
    {children}
  </CONTEXT.Provider>
}

// TODO - Figure out how to restrict selection to certain dom elements;
//  Figure out how to handle multiple instances
export const useContextMenu = (actions: MenuItem[]) => {
  const context = useContext(CONTEXT);
  useEffect(() => {
    context.actions = actions;
    return () => {
      context.actions = [];
    }
  }, [actions])
}
