import logger from "../helpers/logger.helper.js";
 
export const ErrorHandlerMiddleware = (err, req, res, next) => {
    logger.error(err.message || "Unknown error", { stack: err.stack });
 
    if (err.isException) {
        return res.status(err.status || 500).send({
            success: false,
            message: err.message,
        });
    }
 
    if (err.name === "ValidationError") {
        return res.status(400).send({
            success: false,
            message: Object.values(err.errors).map(e => e.message).join(", "),
        });
    }
 
    if (err.name === "CastError") {
        return res.status(400).send({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }
 
    res.status(500).send({
        success: false,
        message: "Internal Server Error",
    });
};
 