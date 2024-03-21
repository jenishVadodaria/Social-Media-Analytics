const axios = require('axios');
const express = require('express');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

const users = ['leomessi', 'cristiano', 'robertdowneyjr', 'tomcruise'];

app.get('/analytics', async (req, res) => {
    try {
        const config = {
            headers: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        };
        const results = {};
        for (const user of users) {
            const url = `https://api.cloudsuper.link/sosmed/v1/analytics?username=${user}&mediaType=INSTAGRAM`;
            const response = await axios.get(url, config);
            results[user] = response.data
        }


        res.json(results);

        // Writing data to CSV
        const csvWriter = createCsvWriter({
            path: 'analytics.csv',
            header: [
                { id: 'username', title: 'Username' },
                { id: 'follower', title: 'Follower' },
                { id: 'totalContent', title: 'Total Content' },
                { id: 'totalLikes', title: 'Total Likes' },
                { id: 'totalComment', title: 'Total Comment' }
            ]
        });
        const csvData = [];
        for (const user of users) {
            const userData = results[user].data;
            csvData.push({
                username: userData.username,
                follower: userData.follower,
                totalContent: userData.totalContent,
                totalLikes: userData.totalLikes,
                totalComment: userData.totalComment
            });
        }
        await csvWriter.writeRecords(csvData);
        console.log('CSV file written successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(9000, () => console.log('Server started on port 9000'));