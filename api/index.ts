const express = require('express');
const app = express();

app.get('/', (request, response) => {
    response.send('apugdc-backend at your service');
})

app.listen(3000, () => {
    console.log('apugdc-backend is awake.');
})

module.exports = app;
