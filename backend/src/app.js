import express from "express";
import cors from "cors";

// ⬇️ import routes
import projectRoutes from "./routes/project.routes.js";
import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/member.routes.js";
import dashboardRoutes from "./routes/dashbord.routes.js";
import partnerRoutes from "./routes/partner.routes.js";
import actualiteRoutes from "./routes/actualite.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import mediaRoutes from "./routes/media.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ⬇️ ROUTE BINDING 
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/actualites", actualiteRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/medias", mediaRoutes);

// test
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

export default app;
