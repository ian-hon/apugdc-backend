import { createClient } from "@supabase/supabase-js";
import { BACKEND_ADDRESS } from "./constants";
import express from 'express';
import 'dotenv/config';
import { validateAction } from "./admin";
import { Outcome } from "./outcome";
import { handleResponse } from "./utils";
import { Event } from "./event";
import { User } from "./user";

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


app.get('/event/fetch', (q, r) => route(q, r, Event.fetchHandler))

app.get('/user/fetch/:tp_number', (q, r) => route(q, r, User.fetchHandler))

// admin
app.post('/event/create', (q, r) => adminRoute(q, r, Event.createHandler))
app.post('/event/edit', (q, r) => adminRoute(q, r, Event.editHandler))
app.post('/event/delete/:id', (q, r) => adminRoute(q, r, Event.deleteHandler))

app.post('/user/create', (q, r) => adminRoute(q, r, User.createHandler))
app.post('/user/edit', (q, r) => adminRoute(q, r, User.editHandler))
app.post('/user/delete/:tp_number', (q, r) => adminRoute(q, r, User.deleteHandler))
//


app.get('/', (request, response) => { response.send('apugdc-backend at your service'); })
app.listen(process.env.PORT, () => {
    console.log('apugdc-backend is awake.');
})

module.exports = app;
