import * as dotenv from "dotenv";
dotenv.config();

import { LokaliseApi, LokaliseApiOAuth } from "@lokalise/node-api";

const _apiKey = process.env.LOKALISE_API_TOKEN as string;

async function main() {
	// // const lokaliseApi = new LokaliseApi({ apiKey });

	// // const project = await lokaliseApi.projects().get('');
	// // console.log(project);

	// const lokaliseApiOauth = new LokaliseApiOAuth({ apiKey: "" });

	// const projects = await lokaliseApiOauth.projects().list();
	// console.log(projects);
}

// Run the script
main().catch((err) => {
	console.error("Unexpected error:", err);
});
