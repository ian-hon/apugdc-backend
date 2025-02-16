import { SupabaseClient } from "@supabase/supabase-js";
import { Outcome, UserError } from "./outcome";

export class Battlepass {
    id: number;
    tp_number: string;
    season: number;
    points: number;
    category: number;

    constructor() {}

    // #region endpoints
    public static async fetchLeaderboardHandler(request, _, db: SupabaseClient) {
        let season = request.params.season;

        try{
            const { data } = await db
            .schema('apugdc')
            .from('battlepass')
            .select()
            .eq('season', season);
        
            return data ? data : [];
        }
        catch(error)
        {
            return Outcome.Error;
        }
    }

    public static async fetchByUserSeason(request, _,db: SupabaseClient) {
        let battlepass = request.body.battlepass;
        
        try
        {
            const { data } = await db
            .schema('apugdc')
            .from('battlepass')
            .select()
            .eq('tp_number', battlepass.tp_number)
            .eq('season', battlepass.season)
            .maybeSingle();

            return data;
        }
        catch(error)
        {
            return Outcome.Error;
        }
    }

    public static async fetchBattlepassUser(request, _,db: SupabaseClient) {
        let battlepass = request.body.battlepass;
        
        try{
            const { data } = await db
            .schema('apugdc')
            .from('battlepass')
            .select()
            .eq('tp_number', battlepass.tp_number)

            return data ? data : [];
        }
        catch(error)
        {
            return Outcome.Error;
        }
        
    }


    // admin
    public static async upsertHandler(request, _, db: SupabaseClient) {
        // body: battlepass (Battlepass)
        let battlepass = request.body.battlepass;

        try
        {
            const { error } = await db
            .schema('apugdc')
            .from('battlepass')
            .upsert({
                tp_number: battlepass.tp_number,
                season: battlepass.season,
                points: battlepass.points,
                category: battlepass.category
            }, { onConflict: "tp_number,season" }); // Prevents duplicate tp_number + season

            return error == undefined ? Outcome.Success : (
                error.code == '22P02' ? Outcome.InvalidFormat : Outcome.InvalidParameters
            );
        }
        catch(error)
        {
            return Outcome.Error;
        }
    }


    // public static async deleteHandler(request, _, db: SupabaseClient) {
    //     // route: tp_number (string), season (number)

    //     let tp_number = request.params.tp_number;
    //     let season = request.params.season;

    //     if ((await Battlepass.fetchBattlepass(tp_number, season, db)) == undefined) {
    //         return UserError.NoExist.toString();
    //     }

    //     await db
    //         .schema('apugdc')
    //         .from('battlepass')
    //         .delete()
    //         .eq('tp_number', tp_number)
    //         .eq('season', season);

    //     return Outcome.Success;
    // }
    // #endregion
}
