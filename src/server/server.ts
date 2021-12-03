import * as express from "express";
require("dotenv").config();

import config from "./config";
import apiRouter from "./routes";

const app = express();

app.use(express.static("public"));
app.use(apiRouter);

const port = config.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
