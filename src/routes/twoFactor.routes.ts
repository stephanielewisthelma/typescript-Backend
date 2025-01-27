import { Router, Request, Response } from "express";
import { create2FAApplication } from "../services/twoFactorService";

const router = Router();

router.post("/create-2fa-app", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await create2FAApplication();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create 2FA application" });
  }
});

export default router;
