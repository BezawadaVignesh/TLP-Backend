import { Router } from "express";

import {
  getStdDetails,
  editStdDetails,
  addStdDetails,
  deleteStdDetails,
  addUser,
  deleteUser,
  updateUser,
  getSubName,
  getUsers,
} from "./controller";

const router: Router = Router();

// Registering all the Manage Users routes

// Getting Users
router.get("/users", getUsers);
// Adding a User
router.post("/user", addUser);
// Deleting a User
router.delete("/user", deleteUser);
// Updating the username
router.patch("/user", updateUser);

export default router;