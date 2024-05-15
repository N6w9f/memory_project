import { ERROR } from "./standards/status";

const errors = (object) => {
    return {
        status: ERROR,
        message: object.message,
        code: object.code,
        data: null,
    };
};

export default errors;
