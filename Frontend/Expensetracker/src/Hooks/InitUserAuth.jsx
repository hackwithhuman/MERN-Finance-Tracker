// src/InitUserAuth.jsx
import { useUserAuth } from "./useUserAuth";

const InitUserAuth = () => {
  useUserAuth(); // now this runs inside Router context
  return null;
};

export default InitUserAuth;
