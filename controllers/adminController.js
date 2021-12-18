const db = require('../config/db');
var moment = require('moment');
moment().format(); 

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
    let query="select name, email from participant";
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

exports.getUpcommingInterviewList = (req, res) => {
    var query="select interview.interviewId, participant.name, participant.email, DATE_FORMAT(convert_tz(interview.date, @@session.time_zone, '+05:30'), '%Y-%m-%d') as date, interview.startTime, interview.endTime from participant inner join interview on participant.id = interview.participantId where interview.adminId = ?";
    db.query(query, [req.query.id], (err, results) => {
        if(err){
            console.log(err);
            res.json({status: "error", data: null, message: null});
        }
        else{
            res.json({ status: "success", data:results, message: null});
        }
    });
}

exports.getInterviewDetails = (req, res) => {
    let query="select participantId, DATE_FORMAT(convert_tz(interview.date, @@session.time_zone, '+05:30'), '%Y-%m-%d') as date, startTime, endTime from interview where interviewId = ?";
    db.query(query, [req.query.id], (err, results) => {
        if(err){
            console.log(err);
            res.json({status: "error", data: null, message: null});
        }
        else{
            res.json({ status: "success", data:results, message: null});
        }
    });
}

exports.deleteInterview = (req, res) => {
    let query="delete from interview where interviewId = ?";
    db.query(query, [req.query.id], (err, results) => {
        if(err){
            console.log(err);
            res.json({status: "error", data: null, message: null});
        }
        else{
            res.json({ status: "success", data:null, message: "Interview deleted successfully"});
        }
    });
}

function validateSchedule(s1, e1, s2, e2) {
    if(s1<e1) {
        if(s2<=e2 && (e1<=s2 || e2<=s1)) {
            return true;
        }
        else if(s2>e2 && e1<=s2) {
            return true;
        }
    }
    else if(s1==e1) {
        if(s2<e2 && (e1<=s2 || e2<=s1)) {
            return true;
        }
        else if(s2==e2) {
            return true;
        }
        else if(s2>e2 && e1<=s2) {
            return true;
        }
    }
    else {
        if(s2<=e2 && e2<=s1) {
            return true;
        }
        else {
            return false;
        }
    }
}

exports.createInterview = (req, res) => {
    if(req.body["participants"].length < 2) {
        res.json({ status: "error", data:{errorcode: 2}, message: "No of participants are less than 2"});
    }
    else {
        let query="select admin.name as adminName, admin.email as adminEmail, participant.name as participantName, participant.email as participantEmail, DATE_FORMAT(convert_tz(interview.date, @@session.time_zone, '+05:30'), '%Y-%m-%d') as date, interview.startTime, interview.endTime from admin join interview on admin.id = interview.adminId join participant on participant.id = interview.participantId where interview.participantId in (?) and interview.date = ?";
        let conflicts = [];
        db.query(query, [req.body.participants, req.body.date], (err, results) => {
            if(err){
                console.log(err);
                res.json({status: "error", data: null, message: null});
            }
            else{
                for(var i=0; i<results.length; i++) {
                    if(!validateSchedule(req.body.startTime, req.body.endTime, results[i]["startTime"], results[i]["endTime"])) {
                        conflicts.push(results[i]);
                    }
                }
                if(conflicts.length==0) {
                    var interviewId;
                    let query = "select interviewId from interview order by interviewId desc limit 1"
                    db.query(query, (err, results) => {
                        if(err){
                            console.log(err);
                            res.json({status: "error", data: null, message: null});
                        }
                        else{
                            interviewId = results[0].interviewId + 1;
                            let participants = [];
                            for(var i=0; i<req.body.participants.length; i++) {
                                participants.push([req.body.adminId, req.body.participants[i], req.body.date, req.body.startTime, req.body.endTime, interviewId]);
                            }
                            query="insert into interview (adminId, participantId, date, startTime, endTime, interviewId) values ?";
                            db.query(query, [participants], (err, rows) => {
                                if(err){
                                    console.log(err);
                                    res.json({status: "error", data: null, message: null});
                                }
                                else{
                                    res.json({ status: "success", data:rows, message: "Interview scheduled successfully"});
                                }
                            });
                        }
                    });
                }
                else {
                    res.json({status: "error", data: {errorcode: 1, conflicts: conflicts}, message: "Some of the participants have another interview scheduled"});
                }
            }
        });
    }

    
}