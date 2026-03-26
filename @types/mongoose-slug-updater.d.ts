declare module 'mongoose-slug-updater'{
  import mongoose from "mongoose";
  function slug(schema: mongoose.Schema, options: any): void;
  export = slug;
}