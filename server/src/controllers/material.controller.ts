import { Request, Response, NextFunction } from "express";
import Material from "../models/Material";
import extractTextFromPDF  from "../services/pdfExtract.service";
import { generatePhrases } from "../services/aiGenerator.service";

export async function createMaterial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, type, content } = req.body as { title: string, type: "pdf" | "text", content?: string };

    let filePath: string | undefined;
    let materialContent: string | undefined;

    if (type === "pdf") {
      if (!req.file) {
        res.status(400).json({ message: "PDF is required" });
        return;
      }
      filePath = req.file.path;
      materialContent = await extractTextFromPDF(req.file.path);
    } else {
      materialContent = content;
    }

    // Phrases are AI-generated from text content only (PDFs not supported yet)
    let phrases: string[] = [];
    if (type === "text" && materialContent) {
      try {
        phrases = await generatePhrases(materialContent);
      } catch (err) {
        console.error("Phrase generation failed, continuing without phrases:", err);
      }
    }

    const material = await Material.create({
      title,
      type,
      content: materialContent,
      filePath,
      phrases,
      uploadedBy: req.user!._id,
    });
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
}
export async function getMaterial(req:Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const materials = await Material.find().populate("uploadedBy", "name role");
    res.json(materials);
  } catch(error) {
    next(error);
  }
}

export async function getMaterialById(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const material = await Material.findById(req.params.id).populate("uploadedBy", "name role");
    if (!material) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    res.json(material);
  } catch(error) {
    next(error);
  }
}

export async function updateMaterial(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(material);
  } catch(error) {
    next(error);
  }
}

export async function deleteMaterial(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch(error) {
    next(error);
  }
}

export async function regeneratePhrases(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    if (material.type !== "text" || !material.content) {
      res.status(400).json({ message: "Phrases can only be generated for text materials with content" });
      return;
    }

    material.phrases = await generatePhrases(material.content);
    await material.save();

    res.json(material);
  } catch (error) {
    next(error);
  }
}