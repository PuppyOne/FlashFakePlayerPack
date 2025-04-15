export class UninitializedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UninitializedError";
    }
}

export class SimulatedPlayerNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SimulatedPlayerNotFoundError";
    }
}