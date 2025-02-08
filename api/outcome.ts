export enum Outcome {
    Success = 'Success',

    // not enough parameters
    InvalidParameters = 'InvalidParameters',

    // format incorrect
    // eg:
    // {
    //      "age": "kudo" <-- supposed to be int
    // }
    InvalidFormat = 'InvalidFormat',

    // non-admin trying to access admin stuff
    NoPermission = 'NoPermission',
}

export enum UserError {
    AlreadyExist = 'AlreadyExist',
    NoExist = 'NoExist'
}
