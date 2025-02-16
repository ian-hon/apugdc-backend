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

    // Miscellaneous error from within backend. Not database error
    Error = 'Error',
}

export enum UserError {
    AlreadyExist = 'AlreadyExist',
    NoExist = 'NoExist'
}
