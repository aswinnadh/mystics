import { Router } from "express";
import { fetchUser } from "../../controllers/admin/user.js";
const router = Router();

router.get('/', fetchUser)


export default router
