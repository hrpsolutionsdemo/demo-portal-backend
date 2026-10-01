import cors from "cors";
import path from "path";
import express, { Application } from "express";
import { AdminRoutes, AuthBcRoutes, UserRoutes } from "../routes";

export default async (app: Application) => {
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: [
        "https://demo-portal-60q4.onrender.com",
        "https://demo-portal-frontend-k9cv.onrender.com",
        "https://demo-portal-backend-h13a.onrender.com",
        "https://demo-portal-backend-9k81.onrender.com",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8080",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );
  // Add error handling for JSON parsing
  app.use((err: any, req: any, res: any, next: any) => {
    console.log("Error details:", {
      message: err.message,
      status: (err as any).status,
      type: err.constructor.name,
      body: req.body,
      headers: req.headers["content-type"],
    });

    if (
      err instanceof SyntaxError &&
      (err as any).status === 400 &&
      "body" in err
    ) {
      return res.status(400).json({
        error: "Invalid JSON format",
        details: err.message,
        receivedBody: req.body,
      });
    }
    next();
  });
  const imagePath = path.join(__dirname, "../images");
  console.log(imagePath);

  app.use("/images", express.static("../images"));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/user", UserRoutes);
  app.use("/api", AuthBcRoutes);
  // app.use("/api/bc", AuthBcRoutes)
  app.use("/api/admin", AdminRoutes);
};
