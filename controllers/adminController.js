const db = require('../config/db');

exports.getAdminList = (req, res) => {
    var query="select name, email from admin";
    db.query(query, (err, results) => {
        if(err){
            console.log(err);
            res.json({status: "error", data: null, message: null});
        }
        else{
            res.json({ status: "success", data:results, message: null});
        }
    });
}

exports.getParticipantList = (req, res) => {
    var query="select name, email from participant";
    db.query(query, (err, results) => {
        if(err){
            console.log(err);
            res.json({status: "error", data: null, message: null});
        }
        else{
            res.json({ status: "success", data:results, message: null});
        }
    });
}

exports.createInterview = (req, res) => {
    if(req.body["participants"].length < 2) {
        res.json({ status: "error", data:{errorcode: 2}, message: "No of participants are less than 2"});
    }
    else {
        console.log("Debug");
    }

    // var query="insert into interview (adminId, participantId, date, startTime, endTime) values(?, ?, ?, ?, ?, ?)";
    // db.query(query, (err, results) => {
    //     if(err){
    //         console.log(err);
    //         res.json({status: "error", data: null, message: null});
    //     }
    //     else{
    //         res.json({ status: "success", data:results, message: null});
    //     }
    // });
}