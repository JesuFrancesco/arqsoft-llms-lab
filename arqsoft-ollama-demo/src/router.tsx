import { createHashRouter } from "react-router-dom";
import ThreeModelComparison from "./pages/ThreeModelComparison";
import TwoMistralComparison from "./pages/TwoMistralComparison";

export const router = createHashRouter([
  {
    path: "/",
    element: <ThreeModelComparison />,
  },
  {
    path: "/two",
    element: <TwoMistralComparison />,
  },
]);
