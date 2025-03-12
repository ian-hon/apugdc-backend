import { Outcome } from "./outcome"

export const handleResponse = (o) => {
    if (Object.values(Outcome).includes(o as Outcome)) {
        return { status_code: mapOutcomeToStatusCode(o), message: o.toString() };
    }
    return o;
};

// Function to map Outcome values to HTTP status codes
const mapOutcomeToStatusCode = (outcome) => {
    switch (outcome) {
        case Outcome.Success:
            return 200;
        case Outcome.InvalidParameters:
            return 400;
        case Outcome.InvalidFormat:
            return 422;
        case Outcome.NoPermission:
            return 403;
        case Outcome.Error:
            return 500;
        default:
            return 400;
    }
};
