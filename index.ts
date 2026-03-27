import express, { Express } from "express";
import * as database from "./config/database"
import dotenv from "dotenv"
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";
import path from "node:path";
import bodyParser = require("body-parser");
import methodOverride from "method-override"
dotenv.config()
const app: Express = express();
const port: number | string = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(methodOverride("_method"));

database.connect()
app.use(express.static(`${__dirname}/public`))
app.set("views",`${__dirname}/views`)
app.set("view engine","pug")

clientRoutes(app)
adminRoutes(app)


//TinyMCE
app.use("/tinymce",
  express.static(path.join(__dirname,"node_modules", "tinymce"))
);
//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.listen(port, ()=>{
  console.log(`App listening on port: ${port}`)
})