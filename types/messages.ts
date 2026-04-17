export interface Message<T> {
    success: boolean,
    error?: string,
    msg?: string,
    data?: T
}