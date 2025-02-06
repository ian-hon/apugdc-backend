import { SupabaseClient } from "@supabase/supabase-js";
import { Outcome } from "./outcome";

type Event = {
    id: number,
    name: string,
    start_time: number, // in epoch unix
    end_time: number, // in epoch unix
    host: string,
    location: string
}

async function getAllEvents(db: SupabaseClient): Promise<Event[]> {
    const { data } = await db
        .schema('apugdc')
        .from('event')
        .select();
    
    return data ? data : [];
}


// #region endpoints
export async function getEvents(request, response, db: SupabaseClient) {
    return await getAllEvents(db);
}

// admin
export async function createEvent(request, response, db: SupabaseClient) {
    let event = request.body.event;

    await db
        .schema('apugdc')
        .from('event')
        .insert({
            name: event.name,
            start_time: event.start_time,
            end_time: event.end_time,
            host: event.host,
            location: event.location
        });

    return Outcome.Success;
}

export async function editEvent(request, response, db: SupabaseClient) {
    let event = request.body.event;

    await db
        .schema('apugdc')
        .from('event')
        .update({
            name: event.name,
            start_time: event.start_time,
            end_time: event.end_time,
            host: event.host,
            location: event.location
        })
        .eq('id', event.id);

    return Outcome.Success;
}

export async function deleteEvent(request, response, db: SupabaseClient) {
    let eventID = request.body.eventID;

    await db
        .schema('apugdc')
        .from('event')
        .delete()
        .eq('id', eventID);

    return Outcome.Success;
}
//
// #endregion