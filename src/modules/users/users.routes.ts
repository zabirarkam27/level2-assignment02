import express from "express";
import { userController } from "./users.controller";
import logger from "../../middlewares/logger";
import auth from "../../middlewares/auth";

const router = express.Router();


router.post("/", userController.createUser);
router.get("/", logger, auth(), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
