class InvalidConfigurationFileException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default InvalidConfigurationFileException;