import {
  Routes,
  Route,
} from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import { StartGamePage } from "../pages/StartGamePage";
import { GamePage } from "../pages/GamePage";
import { SummaryPage } from "../pages/SummaryPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/start" element={<StartGamePage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/summary" element={<SummaryPage />} />
    </Routes>
  );
}