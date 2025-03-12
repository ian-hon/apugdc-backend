export class Outcome
{
    static Success = new Outcome("Success", 200);
    static InvalidParameters = new Outcome("InvalidParameters", 400); // not enough parameters
    static InvalidFormat = new Outcome("InvalidFormat", 422); // format incorrect
    static NoPermission = new Outcome("NoPermission", 401); // non-admin trying to access admin stuff
    static DatabaseError = new Outcome("DatabaseError", 409) // Conflict between request and what happens on database (e.g. user does not exist)
    static Error = new Outcome("Error", 500); // Any general error (e.g. backend crash)

    private constructor(public name: string, public status_code: number, public customMessage?: string) {}

    // Allow custom message
    withMessage(message: string) {
        return new Outcome(this.name, this.status_code, message);
    }

    toJSON() {
        return { status_code: this.status_code, message: this.customMessage ? `${this.name}: ${this.customMessage}` : this.name };
    }
}


// export enum Outcome {
//     Success = 'Success',

//     // not enough parameters
//     InvalidParameters = 'InvalidParameters',

//     // format incorrect
//     // eg:
//     // {
//     //      "age": "kudo" <-- supposed to be int
//     // }
//     InvalidFormat = 'InvalidFormat',

//     // non-admin trying to access admin stuff
//     NoPermission = 'NoPermission',

//     // Item already exist (e.g. userID already exist)
//     AlreadyExist = "AlreadyExist",

//     // Item not exist (e.g. user does not match/can't find)
//     NoExist = "NoExist",

//     // Miscellaneous error from within backend. Not database error
//     Error = 'Error',
// }

// export enum UserError {
//     AlreadyExist = 'AlreadyExist',
//     NoExist = 'NoExist'
// }
