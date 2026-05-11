import mongoose from "mongoose"

mongoose.connect("mongodb+srv://admin:admin123@cluster0.bb5q8lo.mongodb.net/livraria?appName=Cluster0");

let db = mongoose.connection;

export default db;