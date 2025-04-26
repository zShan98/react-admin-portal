const dotenv = require('dotenv');
const { db } = require('../models/User');
const { ObjectId } = require('mongodb');
dotenv.config();

module.exports.allRegistrations = async (req, res, next) => {
    const registrations = await db.collection('competitions').aggregate([
        {
            $lookup: {
                from: "users",
                let: { collectedBy: "$registeredTeams.collectedBy" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: [
                                    { $toString: "$_id" },
                                    "$$collectedBy"
                                ]
                            }
                        }
                    }
                ],
                as: "collectors"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "registeredTeams.approvedBy",
                foreignField: "_id",
                as: "approvers"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                department: 1,
                fee: 1,
                "registeredTeams.Registration_time": 1,
                "registeredTeams.isApproved": 1,
                "registeredTeams.payment_URL": 1,
                "registeredTeams.team_id": 1,
                "registeredTeams.team_name": 1,
                "registeredTeams.approvedBy": 1,
                "registeredTeams.collectedBy": 1,
                approvers: 1,
                collectors: 1
            }
        }
    ]).toArray();

    // Transform the data to replace IDs with names
    const transformedRegistrations = registrations.map(reg => {
        const approverMap = new Map(reg.approvers.map(a => [a._id.toString(), a.name]));
        const collectorMap = new Map(reg.collectors.map(c => [c._id.toString(), c.name]));
        
        return {
            ...reg,
            registeredTeams: reg.registeredTeams.map(team => {
                let collectedByValue = "online";
                
                // Only try to map if collectedBy is not "online" and not undefined
                if (team.collectedBy && team.collectedBy !== "online") {
                    const mappedValue = collectorMap.get(team.collectedBy);
                    collectedByValue = mappedValue || "online";
                }

                return {
                    ...team,
                    approvedBy: team.approvedBy ? approverMap.get(team.approvedBy.toString()) || null : null,
                    collectedBy: collectedByValue
                };
            })
        };
    });

    res.status(200).json({
        success: true,
        message: 'Registrations fetched successfully',
        data: transformedRegistrations
    });
}

module.exports.totalRegistration = async (req, res, next) => {

    const status = req.query.status
    const pipeline = [{ $unwind: "$registeredTeams" }];

    if(typeof status !== 'undefined'){
        pipeline.push({ $match: { "registeredTeams.isApproved": status } });
    }
    pipeline.push({ $count: "totalRegistrations" });

    const [regCount] = await db.collection('competitions').aggregate(pipeline).toArray();



    res.status(200).json({
        success: true,
        message: 'Registration Count fetched successfully',
        data: regCount
    });
}


module.exports.StatusRegistration = async (req, res, next) => {

    const pipeline = [{ $unwind: "$registeredTeams" },{ $group: {_id: "$registeredTeams.isApproved",totalRegistrations: { $sum: 1 }}}]

    const regStatus = await db.collection('competitions').aggregate(pipeline).toArray();
    
    res.status(200).json({
        success: true,
        message: 'Registration Status fetched successfully',
        data: regStatus
    });
}



module.exports.CompetitionsRegistrationCount = async (req, res, next) => {

    const regCount = await db.collection('competitions').aggregate([
        {
            $project: {
                _id: 0,
                title: 1,
                registrations: { $size: { $ifNull: ["$registeredTeams", []] } }
            }
        }
    ]).toArray();



    res.status(200).json({
        success: true,
        message: 'Registration Count fetched successfully',
        data: regCount
    });
}