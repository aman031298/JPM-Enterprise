import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";

export const leadRouter = Router();

leadRouter.post("/", async (req, res) => {
  const { type, name, email, company, phone, message, jobTitle, companySize } = req.body ?? {};

  if (!type || !name || !email) {
    res.status(400).json({ success: false, message: "type, name, and email are required" });
    return;
  }

  const lead = await prisma.lead.create({
    data: { type, name, email, company, phone, message, jobTitle, companySize }
  });

  res.status(201).json({ success: true, data: serializeRecord(lead) });
});
