import * as dotenv from "dotenv";
dotenv.config();

import type { DownloadFileParams } from "@lokalise/node-api";
import { LokaliseDownload } from "lokalise-file-exchange";
import type { ExtractParams } from "lokalise-file-exchange";

// Load Lokalise API token and project ID from environment variables
const apiKey = process.env.LOKALISE_API_TOKEN as string;
const projectId = process.env.LOKALISE_PROJECT_ID as string;

async function main() {
	// Initialize LokaliseDownload client
	const lokaliseDownloader = new LokaliseDownload(
		{
			apiKey, // Your Lokalise API token
		},
		{
			projectId, // Your Lokalise project ID
		},
	);

	// Define the download parameters
	const downloadFileParams: DownloadFileParams = {
		format: "json", // Format of downloaded translations
		original_filenames: true, // Keep original filenames from Lokalise
		indentation: "2sp", // Indentation style
		directory_prefix: "", // Directory structure prefix (optional)
	};

	// Define extraction parameters
	const extractParams: ExtractParams = {
		outputDir: "./", // Target directory for extracted files
	};

	try {
		// Download and extract translations
		console.log("Starting the download...");
		await lokaliseDownloader.downloadTranslations({
			downloadFileParams,
			extractParams,
		});
		console.log("Download completed successfully!");
	} catch (error) {
		// Handle any errors
		console.error("An error occurred during the download:", error);
	}
}

// Run the script
main().catch((err) => {
	console.error("Unexpected error:", err);
});
