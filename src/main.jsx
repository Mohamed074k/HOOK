
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Router from "./Router";
 
createRoot(document.getElementById("root")).render(
  <>
    <Router />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid #A02625",
        },
      }}
    />
  </>
);