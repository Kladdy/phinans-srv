import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";

import { Types } from "mongoose";
import Holding from "../../models//Holdings/Holding";


const router: Router = Router();

// @route   GET holdings/get-holdings-data
// @desc    Get data for all holdings on account
// @access  Private
router.get(
  "/get-holdings-data",
  auth,
  [],
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const userIdAsObjectId = req.userIdAsObjectId;

    try {
        // Find all holdings for user
        const allHoldings = await Holding.find({userId: userIdAsObjectId}).exec();
        
        res.json(allHoldings);

    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        errors: [
          {
            message: "Server Error",
          },
        ],
      });
    }
  }
);


// @route   POST holdings/add
// @desc    Add holding
// @access  Private
router.post(
  "/add",
  auth,
  [
    check("selectedCategory", "Please specify a category").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { selectedCategory, holdingFields } = req.body;
    const userIdAsObjectId = req.userIdAsObjectId;

    try {
      // Build holding object based on IHolding
      const fields = {
        userId: userIdAsObjectId,
        category: selectedCategory,
        label: holdingFields.label,
        amount: holdingFields.amount,
        lastUpdated: holdingFields.lastUpdated,
        created: new Date(),
        updated: new Date(),
      };

      // Add the holding
      const holding = new Holding(fields);

      await holding.save();

      res.json(holding);


    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        errors: [
          {
            message: "Server Error",
          },
        ],
      });
    }
  }
);

export default router;
