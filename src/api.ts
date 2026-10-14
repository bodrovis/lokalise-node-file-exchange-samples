import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import { LokaliseApi } from "@lokalise/node-api";

if (existsSync(".env")) {
	loadEnvFile();
}

const apiKey = process.env.LOKALISE_API_TOKEN as string;

async function main() {
	const lokaliseApi = new LokaliseApi({ apiKey });
	const project = await lokaliseApi
		.projects()
		.get("7565202469c53c30428ce0.33693563");
	console.log(project);
	// const lokaliseApiOauth = new LokaliseApiOAuth({ apiKey: "" });
	// const projects = await lokaliseApiOauth.projects().list();
	// console.log(projects);
}

// Run the script
main().catch((err) => {
	console.error("Unexpected error:", err);
});
