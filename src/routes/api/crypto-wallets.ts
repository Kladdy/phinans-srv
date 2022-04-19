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

import getBalances from "../../tools/nh-integration";
import WalletNiceHash, { IWalletNiceHash } from "../../models/CryptoWallets/WalletNiceHash";
import { Types } from "mongoose";


const router: Router = Router();

// @route   POST crypto-wallets/add
// @desc    Add crypto wallet
// @access  Private
router.post(
  "/add",
  auth,
  [
    check("brokerName", "Please specify a broker").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { brokerName, walletFields } = req.body;
    const userIdAsObjectId = req.userIdAsObjectId;

    try {
      if (brokerName == "NiceHash") {

        // Build crypto wallet object based on IWalletNiceHash
        const walletFieldsNiceHash = {
          userId: userIdAsObjectId,
          organizationId: walletFields.organizationId,
          apiKey: walletFields.apiKey,
          apiSecret: walletFields.apiSecret,
          label: walletFields.label,
          created: new Date(),
          updated: new Date(),
        };

        // Check if wallet already exists with the given configuration
        const walletExists = await WalletNiceHash.exists({
          userId: userIdAsObjectId,
          organizationId: walletFields.organizationId,
          apiKey: walletFields.apiKey,
          apiSecret: walletFields.apiSecret
        });

        if (walletExists == true) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            errors: [
              {
                message: "Wallet already exists",
              },
            ],
          });
        }

        // Get balances to test if the configuration is valid
        const balances = await getBalances(walletFieldsNiceHash)
        
        // Check if response contains errors
        if (balances.error_id != null) {
          return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
            error: true,
            errors: balances.errors
          });
        }

        // If no errors, add this wallet
        const wallet = new WalletNiceHash(walletFieldsNiceHash);

        await wallet.save();

        res.json(wallet);
      }
      else {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: true,
          errors: [
            {
              message: "Broker not supported",
            },
          ],
        });
      }

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

// // @route   GET api/user
// // @desc    Get all users
// // @access  Private
// router.get(
//   "/all",
//   auth,
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ errors: errors.array() });
//     }

//     try {
//       let users: IUser[] = await User.find({ });

//       if (users) {
//         res.json({users})
//       }

//     } catch (err) {
//       console.error(err.message);
//       res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//     }

//     console.log("LOOOOOOOOOL NICE ONE")

 
//     getBalances()
//   }
// );

export default router;
