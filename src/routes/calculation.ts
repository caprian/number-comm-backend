import express, { Request, Response } from 'express';
import Calculation from '../models/Calculation';
import { authMiddleware, AuthenticatedRequest } from '../utils/authMiddleware';

const calcRouter = express.Router();

type Operation = (a: number, b: number) => number;

const operations: Record<string, Operation> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
};

// GET /calc - Fetch all calculations
calcRouter.get('/', async (req: Request, res: Response) => {
  try {
    const calculations = await Calculation.find().populate('userId', 'username');
    res.status(200).json(calculations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching calculations');
  }
});

// POST /calc/start - Start a new calculation
calcRouter.post('/start', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { startingNumber } = req.body;
  const userId = (req.user as any).id;
  const calculation = new Calculation({
    parent: null,
    left: startingNumber,
    operator: '+',
    right: 0,
    result: startingNumber,
    initialResult: startingNumber,
    userId: userId,
  });

  try {
    await calculation.save();
    const populatedCalculation = await calculation.populate('userId', 'username');
    res.status(201).json(populatedCalculation);
  } catch (err) {
    console.error(err);
    res.status(400).send('Error starting calculation');
  }
});

// POST /calc/comment - Add a comment (operation) to an existing calculation
calcRouter.post('/comment', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { parentId, operator, right } = req.body;

  try {
    const parentCalculation = await Calculation.findById(parentId);
    if (!parentCalculation) {
      return res.status(404).send('Parent calculation not found');
    }

    const newResult = operations[operator](parentCalculation.result, right);
    const userId = (req.user as any).id;

    const comment = new Calculation({
      parent: parentId,
      left: parentCalculation.result,
      operator,
      right,
      result: newResult,
      initialResult: newResult,
      userId: userId,
    });

    parentCalculation.result = newResult;
    await parentCalculation.save();
    await comment.save();
    const populatedComment = await comment.populate('userId', 'username');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(400).send('Error adding comment');
  }
});

export { calcRouter };
