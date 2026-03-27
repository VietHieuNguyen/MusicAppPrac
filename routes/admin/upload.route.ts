import { Router } from "express";
import multer from "multer";
const router: Router = Router();

const upload = multer();

import * as controller from "../../controllers/admin/upload.controller"
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware"
router.post("/", upload.single("file"), uploadCloud.uploadSingle, controller.index)

export const uploadRoutes: Router = router;