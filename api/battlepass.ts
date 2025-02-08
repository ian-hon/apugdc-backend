import { SupabaseClient } from "@supabase/supabase-js";

export class Battlepass {
    public static async fetchLeaderboardHandler(request, response, db: SupabaseClient) {
        const { data } = await db
            .schema('apugdc')
            .from('battlepass')
            .select('tp_number, points, user(name)');
        
        return data;
    }
}