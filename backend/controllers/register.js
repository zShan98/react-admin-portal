const dotenv = require('dotenv');
const { db } = require('../models/User');
const { ObjectId } = require("mongodb");
const {sendEmail} = require('../emailService');
dotenv.config();


module.exports.competitions = async (req, res) => {

    const competitions = await db.collection('competitions').aggregate([
        {
          $group: {
            _id: { department: "$department"},
            competitions: {
              $push: {
                title: "$title",
                min_team_size: "$min_team_size",
                max_team_size: "$max_team_size",
                fee: "$fee"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            department: "$_id.department",
            fee: "$_id.fee",
            competitions: 1
          }
        }
      ]).toArray();



    res.status(200).json({
        success: true,
        message: 'Competitions sent successfully',
        data: competitions
    });
};


module.exports.registeration = async (req, res) => {

    const data = req.body;
    const ID = data.competition;
    delete data.competition;

    
      const leaderEmail = data.member.find(member => member.isLeader).email;
      const teamName = data.team_name;

      db.collection('competitions').updateOne(
        { title: ID },
        { $push: { registeredTeams: data }}
    )
    .then(async () => {
      try {
          await sendEmail( leaderEmail, teamName);
          console.log('Email sent successfully to '+ leaderEmail + ' from team ' + teamName);
        } catch (error) {
          console.error('Error in email function:', error);
        }
        res.status(200).json({
          success: true,
          message: 'Registration done successfully',
      });
      })
      .catch((err) => {
          res.status(500).json({ error: "Could not register the team, err:" + err });
      });
    

    
    // res.status(200).json({
    //     success: true,
    //     message: 'Registration done successfully',
    // });
};


module.exports.delete_registeration = async (req, res) => {
 
  const {team_ID,comp_name} = req.body;

  const competition = await db.collection('competitions').findOne({title: comp_name})

    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
  }

  const team = competition.registeredTeams.find(team => team.team_id === team_ID);

  if (!team) {
    return res.status(404).json({ message: 'Team not found in the competition' });
  }

 const isSaved = await db.collection('Trash').insertOne(team)

 if(isSaved.acknowledged){

  await db.collection('competitions').updateOne(
    {title: comp_name, "registeredTeams.team_id":team_ID},
    {$pull: { registeredTeams: { team_id: team_ID } }}
  )
  }

  else{
    return res.status(401).json({ message: 'Failed to move the team data to trash' });
  }


  res.status(200).json({
      success: true,
      message: 'Specified team deleted successfully',
      data: team
  });
};