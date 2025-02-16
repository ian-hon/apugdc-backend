import { createClient } from "@supabase/supabase-js";
import { BACKEND_ADDRESS } from "./constants";
import express from 'express';
import 'dotenv/config';
import { validateAction } from "./admin";
import { Outcome } from "./outcome";
import { handleResponse } from "./utils";
import { Event } from "./event";
import { User } from "./user";
import { Battlepass } from "./battlepass";
import { Attendance } from "./attendance";

const app = express();
app.use(express.urlencoded());
app.use(express.json());

const db = createClient(BACKEND_ADDRESS, process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY : '');

// #region helper functions
// for normal stuff
const route = async (req, res, func) => {
    res.send(handleResponse(await func(req, res, db)))
}

// For admin. Validates whether request has proper credentials (password)
const adminRoute = async (req, res, func) => {
    res.send(handleResponse(
        validateAction(req.body) ?
        await func(req, res, db) :
        Outcome.NoPermission
    ));
}

const checkAdminLogin = async (req, res) => {
    res.send(handleResponse(
        validateAction(req.body) ? Outcome.Success : Outcome.NoPermission
    ));
}
// #endregion

// ---- [PUBLIC ROUTE] ----
app.get('/event/fetch', (q, r) => route(q, r, Event.fetchHandler))

app.get('/user/fetch/:tp_number', (q, r) => route(q, r, User.fetchHandler))

app.get('/battlepass/fetch/:season', (q, r) => route(q, r, Battlepass.fetchLeaderboardHandler))
app.get('/battlepass/fetchuserseason', (q, r) => route(q, r, Battlepass.fetchByUserSeason))
app.get('/battlepass/fetchuser', (q, r) => adminRoute(q, r, Battlepass.fetchBattlepassUser))

app.get('/attendance/fetch', (q, r) => adminRoute(q, r, Attendance.fetchHandler))
app.get('/attendance/fetchuserseason', (q, r) => adminRoute(q, r, Attendance.fetchByUserSeason))
app.get('/attendance/fetchuser', (q, r) => adminRoute(q, r, Attendance.fetchByUser))

// ---- [ADMIN ROUTE] ----
app.post('/admin/login', (q, r) => checkAdminLogin(q, r))

app.post('/event/create', (q, r) => adminRoute(q, r, Event.createHandler))
app.post('/event/edit', (q, r) => adminRoute(q, r, Event.editHandler))
app.post('/event/delete/:id', (q, r) => adminRoute(q, r, Event.deleteHandler))

app.post('/user/create', (q, r) => adminRoute(q, r, User.createHandler))
app.post('/user/edit', (q, r) => adminRoute(q, r, User.editHandler))
app.post('/user/delete/:tp_number', (q, r) => adminRoute(q, r, User.deleteHandler))

app.post('/battlepass/upsert', (q, r) => adminRoute(q, r, Battlepass.upsertHandler))

app.post('/attendance/upsert', (q, r) => adminRoute(q, r, Attendance.upsertHandler))


// -----------------------

app.get('/', (request, response) => { response.send('apugdc-backend at your service'); })
app.listen(process.env.PORT, () => {
    console.log('apugdc-backend is awake.');
})

module.exports = app;
