import milliseconds from "milliseconds";

export const queueConfig = async () => {
    return {
        // rate limiter
        limiter: {
            max: 1,
            duration: 1000 * 30
        },
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        },
        repeat: {
            every: milliseconds.minutes(5)
        }
    }
}
