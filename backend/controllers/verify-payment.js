const dotenv = require('dotenv');
const { db } = require('../models/User');
const { ObjectId } = require("mongodb");
dotenv.config();


module.exports.competition_payment = async (req, res) => {
        const { competitionID, teamID } = req.params;
        const {approvalStatus, UserID} = req.body
        const competition = await db.collection('competitions').findOne({ _id: new ObjectId(competitionID) });
        const User = await db.collection('users').findOne({ _id: new ObjectId(UserID) });

        if (!User || User.role !== "admin" ) {
            return res.status(404).json({ error: "Access is restricted" });
        }

        if (!competition) {
            return res.status(404).json({ error: "Competition not found" });
        }

        const team = competition.registeredTeams.find(team => team.team_id === teamID);

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Update the isApproved field of the matched team
        const result = await db.collection('competitions').updateOne(
            { _id: new ObjectId(competitionID), "registeredTeams.team_id": teamID },
            { $set: { "registeredTeams.$.isApproved": approvalStatus,  "registeredTeams.$.approvedBy":UserID }}
        );

        if (result.modifiedCount > 0) {
            console.log({result})
            res.status(200).json({
                success: true,
                message: `Team ${teamID} status converted to ${approvalStatus} successfully.`,
            });
        }
};