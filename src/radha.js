import express from "express";
import cors from "cors";
import morgan from "morgan";

import mongoose from "mongoose";

const User = mongoose.model(
	"Users",
	new mongoose.Schema({ name: String, age: Number })
);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
	return res.json({ routes: ["GET: /users", "POST: /user"] });
});

app.post("/user", async (req, res) => {
	const user = req.body;
	if (!user || !user.username || !user.age)
		return res.status(400).json({ msg: "Bad request need username and age" });

	const newUser = await User.create({ name: user.username, age: user.age });

	return res.status(200).json({ user: newUser });
});

app.get("/users", async (_, res) => {
	const users = await User.find();
	return res.json({ users });
});

console.log(process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
	console.log("MONGO_URI is not set in the environment variables");
	process.exit();
}

mongoose
	.connect(process.env.MONGO_URI || "", {
		authSource: "admin",
	})
	.then((conn) => {
		console.log("MONGO_URI: ", process.env.MONGO_URI);
		console.log("Connected to MongoDB on: ", conn.connection.host);
		console.log("On DB: ", conn.connection.db.databaseName);
	})
	.catch((error) => {
		console.error("Error Connecting to Mongo DB ");
		console.log(error);
	});

const server = app.listen(8080, () => {
	console.log("Radhey Shyam");
	console.log();
	console.log(`Server spinning on port 8080`);
});

function gracefulShutdown() {
	console.log("\nGraceful shutdown...\n");
	server.close((err) => {
		if (err) {
			console.error("Error while closing the server:", err);
			process.exit(1);
		} else {
			console.log("Server closed gracefully.");
			process.exit(0);
		}
	});
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("SIGQUIT", gracefulShutdown);
