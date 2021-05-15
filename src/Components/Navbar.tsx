import {spawn} from 'child_process';
import pathLib from 'path';
import {FC, useCallback} from "react";
import {useAppDispatch} from "../hooks";
import {show} from "../searchSlice";
import {ipcRenderer} from 'electron';
import {Link, useHistory} from 'react-router-dom';
import {useFileLocation} from "./useFileLocation";
import {favorite, selectFavorite} from "../locationSlice";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faHome,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faStar,
  faStarHalf, faInbox
} from '@fortawesome/free-solid-svg-icons';

export const Navbar: FC = () => {
  const {goBack, goForward} = useHistory();
  const {absolutePath, filepath} = useFileLocation();
  const currentFavorite = useSelector(selectFavorite);

  const onclick = useCallback(() => {
    spawn('code', [pathLib.join(process.env.HOME, 'Dropbox/Cabinet')]);
    spawn('code', ['-g', absolutePath]);
  }, [absolutePath])
  const dispatch = useAppDispatch();

  const onSearchClick = useCallback(() => {
    dispatch(show());
  }, []);

  const closeApp = useCallback(() => {
    ipcRenderer.send("hide");
  }, []);

  const onFavClick = useCallback(() => {
    dispatch(favorite(filepath));
  }, [filepath]);

  return <div className="pb-20">
    <div className="w-full fixed top-0 left-0 bg-basedark-900 z-50 flex justify-between items-center">
      <div className="flex items-center">
        <button className="hover:text-orange-50 px-2 py-4" onClick={onclick}><FontAwesomeIcon className={"fill-current"} icon={faEdit} /></button>
        <Link className="hover:text-orange-50 px-2 py-4" to={"/cabinet/"}><FontAwesomeIcon className={"fill-current"} icon={faHome}/></Link>
        <button className="hover:text-orange-50 px-2 py-4" onClick={goBack}><FontAwesomeIcon className={"fill-current"} icon={faChevronLeft}/></button>
        <button className="hover:text-orange-50 px-2 py-4" onClick={goForward}><FontAwesomeIcon className={"fill-current"} icon={faChevronRight}/></button>
        <button className="hover:text-orange-50 px-2 py-4" onClick={onSearchClick}><FontAwesomeIcon className={"fill-current"} icon={faSearch} /></button>
        <button className="hover:text-orange-50 px-2 py-4" onClick={onFavClick}><FontAwesomeIcon className={"fill-current"} icon={currentFavorite === filepath  ? faStar : faStarHalf} /></button>
        <Link to="/inbox" className="px-2 py-4"> <FontAwesomeIcon icon={ faInbox} /> </Link>
      </div>
      <div className="ml-2">{filepath}</div>
      <div>
        <button className="px-2 py-4" onClick={closeApp}><i className="fa fa-times"/></button>
      </div>
    </div>
  </div>
}
