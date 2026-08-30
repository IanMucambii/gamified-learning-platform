import fetch from "node-fetch";
import { IQuestion} from "../models/Quiz";
import { IPuzzleAttempt } from "../models/PuzzleAttempt";

//To connect with some ai API

interface iaContentBlock {
  type: string;
  text?: string;
}