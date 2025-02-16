import { SupabaseClient } from "@supabase/supabase-js";
import { Outcome, UserError } from "./outcome";

export class Attendance{
    id: number;
    tp_number: string;
    battlepass_id: number;
    event_id: number;
    entry_date: number;

    constructor() {}

    // #region endpoints

    public static async fetchHandler(request, _, db: SupabaseClient)
    {
        try
        {
            const { data } = await db
            .schema('apugdc')
            .from('attendance')
            .select()
    
            return data ? data : [];
        }
        catch(error)
        {
            return Outcome.Error;
        }
        
    }

    public static async fetchByUser(request, _, db: SupabaseClient){
        let attendance = request.body.attendance;
        
        try
        {
            const { data } = await db
            .schema('apugdc')
            .from('attendance')
            .select()
            .eq('tp_number', attendance.tp_number)

            return data;
        }
        catch(error)
        {
            return Outcome.Error;
        }
    }

    public static async fetchByUserSeason(request, _, db: SupabaseClient){
        let attendance = request.body.attendance;
        
        try
        {
            const { data } = await db
            .schema('apugdc')
            .from('attendance')
            .select()
            .eq('tp_number', attendance.tp_number)
            .eq('season', attendance.season)

            return data;
        }
        catch(error)
        {
            return Outcome.Error;
        }
        
    }

    // admin
    public static async upsertHandler(request, _, db: SupabaseClient) {
        let attendance = request.body.attendance;
        console.log(attendance)
    
        try{
            const { error } = await db
            .schema('apugdc')
            .from('attendance')
            .upsert({
                tp_number: attendance.tp_number,
                battlepass_id: attendance.battlepass_id,
                event_id: attendance.event_id,
                entry_date: attendance.entry_date,
            }, { onConflict: "tp_number,battlepass_id,event_id" }); // Prevents duplicate tp_number + season
    
            console.log(error)

            return error == undefined ? Outcome.Success : (
                error.code == '23503' ? UserError.NoExist.toString() :  // Foreign key violation
                error.code == '22P02' ? Outcome.InvalidFormat : Outcome.InvalidParameters
            );
        }
        catch(error)
        {
            return Outcome.Error;
        }
        
    }
}