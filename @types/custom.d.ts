declare module "*.svg"
declare module "*.png"
declare module "*.jsx" {
  import { ReactElement } from "react"
  const component: () => ReactElement
  export default component
}
