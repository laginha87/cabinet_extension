import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectFavorite} from "../locationSlice";
import {ROOT_PATH} from "../env";

export const getAbsolutePath = (filepath: string) => ROOT_PATH + filepath;

export const useFileLocation = () => {
  const {pathname} = useLocation();
  const favorite = useSelector(selectFavorite);
  let filepath = pathname.slice("/cabinet".length);
  filepath = filepath == '/' ? favorite : filepath;
  const absolutePath = getAbsolutePath(ROOT_PATH + filepath)
  return {filepath, absolutePath};
}
