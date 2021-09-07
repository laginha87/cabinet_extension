import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ROOT_PATH } from "../env";
import { selectFavorite } from "../locationSlice";
import { getAbsolutePath } from "./getAbsolutePath";

export const useFileLocation = () => {
  const { pathname } = useLocation();
  const favorite = useSelector(selectFavorite);
  let filepath = pathname.slice("/cabinet".length);
  filepath = filepath == '/' ? favorite : filepath;
  const absolutePath = getAbsolutePath(ROOT_PATH + filepath)
  return { filepath, absolutePath };
}
