const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/getAdminList", adminController.getAdminList);
// router.get("/getUpcommingInterviewList", adminController.getUpcommingInterviewList);
router.get("/getParticipantList", adminController.getParticipantList);
router.post("/createInterview", adminController.createInterview);
// router.post("/editInterview", adminController.editInterview);

module.exports = router;