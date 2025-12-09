import express from "express";
import { userController } from "./users.controller";
import logger from "../../middlewares/logger";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", logger, auth("admin"), userController.getAllUsers);
router.get("/:userId", auth(), userController.getUserById);
router.put("/:userId", auth(), userController.updateUser);
router.delete("/:userId", auth("admin"), userController.deleteUser);

export const userRoutes = router;
