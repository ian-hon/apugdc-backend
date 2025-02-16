import { SupabaseClient } from "@supabase/supabase-js";
import { Outcome } from "./outcome";

export class Event {
    id: number;
    name: string;
    start_time: number; // in epoch unix
    location: string;
    end_time: number; // in epoch unix
    details: string;
    battlepass_points: number;
    battlepass_season: number;

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
        try{
            return await Event.fetchAll(db);
        }
        catch (error)
        {
            return Outcome.Error;
        }
    }
    
    // admin
    public static async createHandler(request, _, db: SupabaseClient) {
        // body: event (Event)
        let event = request.body.event;
    
        try{
            await db
            .schema('apugdc')
            .from('event')
            .insert({
                name: event.name,
                start_time: event.start_time,
                location: event.location,
                end_time: event.end_time,
                details: event.details,
                battlepass_points: event.battlepass_points,
                battlepass_season: event.battlepass_season

            });

            return Outcome.Success;
        }
        catch(error)
        {
            return Outcome.Error;
        }
        
    }
    
    public static async editHandler(request, _, db: SupabaseClient) {
        // body: event (Event)
        let event = request.body.event;
    
        try
        {
            await db
            .schema('apugdc')
            .from('event')
            .update({
                name: event.name,
                start_time: event.start_time,
                location: event.location,
                end_time: event.end_time,
                details: event.details,
                battlepass_points: event.battlepass_points,
                battlepass_season: event.battlepass_season
            })
            .eq('id', event.id);
    
            return Outcome.Success;
        }
        catch(error)
        {
            return Outcome.Error;
        }
    }
    
    public static async deleteHandler(request, _, db: SupabaseClient) {
        // route: id (number)
        let eventID = request.params.id;
    
        try
        {
            await db
            .schema('apugdc')
            .from('event')
            .delete()
            .eq('id', eventID);
    
            return Outcome.Success;
        }
        catch(error)
        {
            return Outcome.Error;
        }
    }
    //
    // #endregion
}
