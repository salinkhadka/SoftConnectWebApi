import React from "react"
import ReactDOM from "react-dom/client"
import AppRouter from './routers/AppRouter.jsx'
// import App from "./App.jsx"

import "./index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthContextProvider } from "./auth/AuthProvider.jsx"
import { ToastProvider } from "./contexts/ToastContext.jsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ToastProvider>
          < AppRouter/>
        </ToastProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
