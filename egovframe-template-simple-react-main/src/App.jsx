import RootRoutes from "@/routes";
import { BrowserRouter as Router } from "react-router-dom";

import "krds-react/dist/index.css";
import "krds-uiux/resources/css/token/krds_tokens.css";
import "krds-uiux/resources/css/common/common.css";

import "@/css/base.css";
import "@/css/layout.css";
import "@/css/component.css";
import "@/css/page.css";
import "@/css/response.css";

function App() {
  return (
    <div className="wrap">
      <Router>
        <RootRoutes />
      </Router>
    </div>
  );
}

export default App;
