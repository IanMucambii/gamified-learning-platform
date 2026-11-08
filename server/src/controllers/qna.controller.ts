import { Request, Response, NextFunction } from "express";
import QnA from "../models/QnA";

export async function createQuestion(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const { question, material } = await req.body as { question: string, material?: string };
    const qna = await QnA.create({ question, material, askedBy: req.user?._id});
    res.status(201).json(qna);
  } catch(error) {

  }
}

export async function answerQuestion(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const { answer } = req.body as {answer: string};
    const qna = await QnA.findByIdAndUpdate(
      req.params.id,
      { answer, answeredById: req.user!._id},
      { new: true }
    );
    if (!qna) {
      res.status(404).json({ message: "Not Found"});
      return;
    }
    res.json(qna);
  } catch(error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const qnas = await QnA.find().populate("askedBy", "name role").populate("answeredBy", "name role");
    res.json(qnas)
  } catch(error) {
    next(error);
  }
}

export async function updateQuestion(req: Request, res: Response, next: Function): Promise <void> {
  try {
    const qna = await QnA.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(qna)
  } catch(error) {
    next(error);
  }
}

export async function deleteQuestion(req: Request, res: Response, next: Function): Promise <void> {
  try {
    await QnA.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted"});
  } catch(error) {
    next(error)
  }
}