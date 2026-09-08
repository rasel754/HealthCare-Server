import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

/**
 * Route: POST /
 * Description: Creates a new medical specialty record.
 */
router.post('/',
    multerUpload.any(),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialtyController.createSpecialty);


router.get('/', SpecialtyController.getAllSpecialty);


router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);

/**
 * Route: PATCH /:id
 * Description: Updates a medical specialty record by ID.
 */
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.any(), SpecialtyController.updateSpecialty);

export const SpecialtyRouter = router;
