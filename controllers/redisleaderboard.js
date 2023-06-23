// require('dotenv').config()
// // const redis = require('redis')
// const Redis = require('redis')
// const SortedSet = Redis.SortedSet
// const User = require('../models/signupmodel')
// const connectionString = process.env.CONNECTIONSTRING

// const client = Redis.createClient(connectionString)

// client.on('connect', () => {
//   console.log('Connected to Azure Redis Cache')
// })

// client.connect()

// const updateLeaderboards = async () => {
//   try {
//     const users = await User.findAll()
//     const leaderboardData = []

//     users.forEach((user) => {
//       leaderboardData.push({
//         score: user.totalAmount !== undefined ? user.totalAmount.toString() : '0',
//         value: user.username
//       })
//     })
//     console.log('&&&&&&&&&&&&&&&&&&&', leaderboardData)
//     await client.zAdd('key', leaderboardData.map(({ score, value }) => ({ score, value })));
//     console.log('Leaderboard updated successfully in Redis.');

    
//   } catch (error) {
//     console.error('An error occurred while updating leaderboard data:', error)
//   }
// }
// // Call the updateLeaderboard function initially to update the leaderboard data in Redis
// updateLeaderboards()

// exports.showLeaderboard = async (req, res, next) => {
//   try {
//     // Fetch the leaderboard data from Redis as a sorted set
//     client.ZREVRANGEBYSCORE('key', 0, -1, 'withscores', (err, leaderboard) => {
//       if (err) {
//         console.error('An error occurred while fetching leaderboard data:', err);
//         res.status(500).json({ error: 'An error occurred while fetching leaderboard data' });
//       } else {
//         // Convert the retrieved data into an array of objects [{ value, score }]
//         const leaderboardData = [];
//         for (let i = 0; i < leaderboard.length; i += 2) {
//           leaderboardData.push({ value: leaderboard[i], score: leaderboard[i + 1] });
//         }

//         console.log('Leaderboard data:', leaderboardData);
//         res.status(200).json({ leaderboardResponse: leaderboardData });
//       }
//     });
//   } catch (error) {
//     console.error('An error occurred while fetching leaderboard data:', error);
//     res.status(500).json({ error: 'An error occurred while fetching leaderboard data' });
//   }
// };



