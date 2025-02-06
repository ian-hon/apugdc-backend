import { createClient } from "@supabase/supabase-js";
import { BACKEND_ADDRESS } from "./constants";
import express from 'express';
import 'dotenv/config';
import { validateAction } from "./admin";
import { createEvent, deleteEvent, editEvent, getEvents } from "./event";
import { Outcome } from "./outcome";
import { handleResponse } from "./utils";

const app = express();
app.use(express.urlencoded());
app.use(express.json());

const db = createClient(BACKEND_ADDRESS, process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY : '');

// #region helper functions
// for normal stuff
const route = async (req, res, func) => {
    res.send(handleResponse(await func(req, res, db)))
}

// for admin stuff
const adminRoute = async (req, res, func) => {
    res.send(handleResponse(
        validateAction(req.body) ?
        await func(req, res, db) :
        Outcome.NoPermission
    ));
}
// #endregion


app.get('/event/fetch', (q, r) => route(q, r, getEvents))

// admin
app.post('/event/create', (q, r) => adminRoute(q, r, createEvent))
app.post('/event/edit', (q, r) => adminRoute(q, r, editEvent))
app.post('/event/delete', (q, r) => adminRoute(q, r, deleteEvent))
//


app.get('/', (request, response) => { response.send('apugdc-backend at your service'); })
app.listen(process.env.PORT, () => {
    console.log('apugdc-backend is awake.');
})

module.exports = app;
