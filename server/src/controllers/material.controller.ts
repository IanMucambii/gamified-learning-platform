import { Request, Response, NextFunction } from "express";
import Material from "../models/Material";
import extractTextFromPDF  from "../services/pdfExtract.service";

export async function createMaterial(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const { title, type, content } = req.body as { title: string, type: "pdf" | "text", content?: string };

    if (type === "pdf") {
      if(!req.file) {
        res.status(400).json({ message: "PDF is required"});
        return;
      }

      const extractedText = await extractTextFromPDF(req.file.path);
      const material = await Material.create({
        title,
        type,
        filePath: req.file.path,
        content: extractedText,
        uploadedBy: req.user!._id
      });
      res.status(201).json(material);
      return;
    }
    
    const material = await Material.create({
      title,
      type,
      content,
      uploadedBy: req.user!._id
    });
    res.status(201).json(material);
  } catch(error) {
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