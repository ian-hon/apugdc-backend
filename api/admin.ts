import { SupabaseClient } from "@supabase/supabase-js";
import { bodyParser } from 'body-parser';
import 'dotenv/config';

// I thought we were jz gonna do
// if (password == "admin123") 
//     LOL
//
// - kudo 2025
//
// i was making a session token system but ig .env password is the way to go
// to anyone reading this, pls know i was gonna make a full fledged security system; i am not a loser 🙏🏻

// rate limiting (?)
export function validateAction(body) {
    return (body.password == process.env.PASSWORD);
}
