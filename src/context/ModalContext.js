import { createContext } from "react";

const ModalContext = createContext({
  component: null,
  props: {},
  openModal: () => ({}),
  hideModal: () => ({})
});
export default ModalContext;
