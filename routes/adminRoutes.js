const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/getAdminList", adminController.getAdminList);
router.get("/getUpcommingInterviewList", adminController.getUpcommingInterviewList);
router.get("/getParticipantList", adminController.getParticipantList);
router.get("/getInterviewDetails", adminController.getInterviewDetails);
router.get("/deleteInterview", adminController.deleteInterview);
router.post("/createInterview", adminController.createInterview);

module.exports = router;