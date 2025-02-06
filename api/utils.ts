import { Outcome } from "./outcome"

export const handleResponse = (o) => {
    // converts Outcome type to a string
    return (Object.values(Outcome).includes(o as Outcome)) ? o.toString() : o
}