import "./index.css";
import { StrictMode } from "react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routes/router";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </AuthContextProvider>
  </StrictMode>
);
