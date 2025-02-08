import { SupabaseClient } from "@supabase/supabase-js";
import { Outcome, UserError } from "./outcome";

export class User {
    tp_number: string;
    name: string;
    email: string;
    course: string;
    join_timestamp: number;
    birth_timestamp: number;
    phone_number: string;
    committee: boolean;
    additional: any;

    constructor() {}

    public static async fetchUser(tp_number: string, db: SupabaseClient) {
        const { data } = await db
            .schema('apugdc')
            .from('user')
            .select()
            .eq('tp_number', tp_number)
            .maybeSingle();
        
        return data
    }
    
    // #region endpoints
    public static async fetchHandler(request, _, db: SupabaseClient) {
        // route: tp_number (string)
        return await User.fetchUser(request.params.tp_number, db);
    }

    // admin
    public static async createHandler(request, _, db: SupabaseClient) {
        // body: user (User)

        let user = request.body.user;

        if ((await User.fetchUser(user.tp_number, db)) != undefined) {
            // gotta toString() if not Outcome
            return UserError.AlreadyExist.toString();
        }

        const { error } = await db
            .schema('apugdc')
            .from('user')
            .insert({
                tp_number: user.tp_number,
                name: user.name,
                email: user.email,
                course: user.course,
                join_timestamp: user.join_timestamp,
                birth_timestamp: user.birth_timestamp,
                phone_number: user.phone_number,
                committee: user.committee,
                additional: user.additional,
            });

        return error == undefined ? Outcome.Success : (
            error.code == '22P02' ? Outcome.InvalidFormat : Outcome.InvalidParameters
        )

        // 22P02 types mismatched
        // 23502 parameters wrong
        // not sure if codes are persistent
    }

    public static async editHandler(request, _, db: SupabaseClient) {
        // body: user (User)

        let user = request.body.user;

        if ((await User.fetchUser(user.tp_number, db)) == undefined) {
            return UserError.NoExist.toString();
        }

        console.log(user.course);

        const { data, error} = await db
            .schema('apugdc')
            .from('user')
            .update({
                name: user.name,
                email: user.email,
                course: user.course,
                join_timestamp: user.join_timestamp,
                birth_timestamp: user.birth_timestamp,
                phone_number: user.phone_number,
                committee: user.committee,
                additional: user.additional,
            })
            .eq('tp_number', user.tp_number);
        
        return error == undefined ? Outcome.Success : (
            error.code == '22P02' ? Outcome.InvalidFormat : Outcome.InvalidParameters
        )
    }

    public static async deleteHandler(request, _, db: SupabaseClient) {
        // route: tp_number (string)

        let tp_number = request.params.tp_number;

        if ((await User.fetchUser(tp_number, db)) == undefined) {
            return UserError.NoExist.toString();
        }

        await db
            .schema('apugdc')
            .from('user')
            .delete()
            .eq('tp_number', tp_number);

        return Outcome.Success;
    }
    // 
    // #endregion
}
