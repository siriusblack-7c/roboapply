// import AppRouter from "./router";
// import "./App.css";
// function App() {
//   return (
//     <>
//       <AppRouter />
//     </>
//   );
// }

// export default App;

import React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import AppRouter from "./router"
import "./App.css"
import { ConfigProvider } from "antd"
import { theme } from "antd"
import { StyleProvider } from "@ant-design/cssinjs"

const googleClientId =
  "637508697495-nvbnuf0rsqt9ver41b2rgh40ft07q6ra.apps.googleusercontent.com" // Your client ID

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Input: {
              colorBgContainer: "rgba(69, 69, 69, 1)"
            },
            Select: {
              colorBgContainer: "rgba(69, 69, 69, 1)"
            }
          },
          token: {
            colorBgContainer: "rgba(26, 26, 26, 1)"
          }
        }}>
        <StyleProvider hashPriority="low">
          <AppRouter />
        </StyleProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  )
}

export default App
