import mongoose from "mongoose";

const mongooseConnection = (uri) => {
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) return console.log(err);
      console.log("MongoDB Connected !");
    }
  );
};

export default mongooseConnection;
