import { useEffect } from "react";
import initPage from "@/js/ui";

function EgovMain() {

  useEffect(() => {
    initPage();
  }, []);

 
  return (
    <div></div>
  );
}

export default EgovMain;
