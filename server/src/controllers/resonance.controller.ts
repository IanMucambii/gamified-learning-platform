import { Request, Response, NextFunction } from 'express';
import ResonanceGame, { IResonanceImage } from '../models/ResonanceGame';
import ResonanceAttempt from '../models/ResonanceAttempt';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Professor: manual creation. Accepts either uploaded files (req.files) with
// labels in req.body.labels (JSON string array) OR direct URLs in req.body.images.
export async function createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, material, displayDurationSec, distractors } = req.body as {
      title: string;
      material?: string;
      displayDurationSec?: number;
      distractors?: string; // JSON string: [{url, label}]
    };

    let images: IResonanceImage[] = [];

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      const labels: string[] = req.body.labels ? JSON.parse(req.body.labels) : [];
      images = files.map((f, i) => ({
        url: `/${f.path}`,
        label: labels[i] || f.originalname,
      }));
    } else if (req.body.images) {
      images = JSON.parse(req.body.images); // [{url, label}]
    }

    if (images.length === 0) {
      res.status(400).json({ message: 'At least one target image is required' });
      return;
    }

    const game = await ResonanceGame.create({
      title,
      material,
      createdBy: req.user!._id,
      images,
      distractors: distractors ? JSON.parse(distractors) : [],
      displayDurationSec: displayDurationSec || 4,
      generatedByAI: false,
    });

    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
}

export async function getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const games = await ResonanceGame.find().populate('material', 'title');
    res.json(games);
  } catch (err) {
    next(err);
  }
}

export async function updateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await ResonanceGame.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(game);
  } catch (err) {
    next(err);
  }
}

export async function deleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await ResonanceGame.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

// Student: fetch the play package — memorize sequence + shuffled recall pool,
// WITHOUT revealing which pool items are targets vs distractors.
export async function getGameForPlay(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await ResonanceGame.findById(req.params.id);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    const memorize = game.images.map((img) => ({
      id: img._id,
      url: img.url,
      label: img.label,
    }));

    const pool = shuffle(
      [...game.images, ...game.distractors].map((img) => ({
        id: img._id,
        url: img.url,
        label: img.label,
      }))
    );

    res.json({
      gameId: game._id,
      title: game.title,
      displayDurationSec: game.displayDurationSec,
      memorize,
      recallPool: pool,
    });
  } catch (err) {
    next(err);
  }
}

interface AttemptBody {
  selectedIds: string[];
  timeTakenSec?: number;
}

export async function submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await ResonanceGame.findById(req.params.id);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    const { selectedIds, timeTakenSec } = req.body as AttemptBody;
    const targetIds = new Set(game.images.map((img) => String(img._id)));

    let correctSelections = 0;
    let incorrectSelections = 0;

    selectedIds.forEach((id) => {
      if (targetIds.has(id)) correctSelections++;
      else incorrectSelections++;
    });

    const attempt = await ResonanceAttempt.create({
      game: game._id,
      student: req.user!._id,
      correctSelections,
      incorrectSelections,
      totalTargets: game.images.length,
      timeTakenSec,
    });

    res.status(201).json(attempt);
  } catch (err) {
    next(err);
  }
}

export async function getMyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const attempts = await ResonanceAttempt.find({ student: req.user!._id }).populate(
      'game',
      'title'
    );
    res.json(attempts);
  } catch (err) {
    next(err);
  }
}

export async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const board = await ResonanceAttempt.aggregate([
      {
        $group: {
          _id: '$student',
          totalCorrect: { $sum: '$correctSelections' },
          totalIncorrect: { $sum: '$incorrectSelections' },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { totalCorrect: -1 } },
      { $limit: 10 },
    ]);
    res.json(board);
  } catch (err) {
    next(err);
  }
}