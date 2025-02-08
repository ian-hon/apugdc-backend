import { SupabaseClient } from "@supabase/supabase-js";
import { Outcome } from "./outcome";

export class Event {
    id: number;
    name: string;
    start_time: number; // in epoch unix
    end_time: number; // in epoch unix
    host: string;
    location: string;

    constructor() {}

    public static async fetchAll(db: SupabaseClient): Promise<Event[]> {
        const { data } = await db
            .schema('apugdc')
            .from('event')
            .select();
        
        return data ? data : [];
    }
    
    // #region endpoints
    public static async fetchHandler(_, __, db: SupabaseClient) {
        //
        return await Event.fetchAll(db);
    }
    
    // admin
    public static async createHandler(request, _, db: SupabaseClient) {
        // body: event (Event)
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
    
    public static async editHandler(request, _, db: SupabaseClient) {
        // body: event (Event)
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
    
    public static async deleteHandler(request, _, db: SupabaseClient) {
        // route: id (number)
        let eventID = request.params.id;
    
        await db
            .schema('apugdc')
            .from('event')
            .delete()
            .eq('id', eventID);
    
        return Outcome.Success;
    }
    //
    // #endregion
}
