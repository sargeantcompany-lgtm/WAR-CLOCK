import { Route, Routes } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { AdminPage } from "@/pages/AdminPage";
import { ConflictDetailPage } from "@/pages/ConflictDetailPage";
import { HomePage } from "@/pages/HomePage";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/conflicts/:slug" element={<ConflictDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Shell>
  );
}
