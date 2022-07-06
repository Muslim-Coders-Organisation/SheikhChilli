class MissingStartupRequisiteException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default MissingStartupRequisiteException;