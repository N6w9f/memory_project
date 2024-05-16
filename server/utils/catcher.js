import { ERROR } from "./standards/status.js";
const catcher = (asyncFn) => (req, res) => {
    asyncFn(req, res).catch((err) => {
        /validation\sfailed/.test(err.message)
            ? res.status(400).json({ title: err.message })
            : res.status(500).json({
                  status: ERROR,
                  message: err,
                  code: 500,
                  data: err.message,
              });
    });
};

export default catcher;
