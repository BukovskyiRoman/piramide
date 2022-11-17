export const errorHandler = async (error, req, res, next) => {
    console.log('error handler');
    console.error(error);
    if (error.statusCode) {
        res.statusCode = error.statusCode;
    } else {
        res.statusCode = 404;
    }
}
