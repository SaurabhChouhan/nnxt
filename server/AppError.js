export default class AppError extends Error {
    constructor(message, code, status, i18nkey){
        super(message)
        this.code = code
        this.status = status
        this.i18nkey = i18nkey
    }
}