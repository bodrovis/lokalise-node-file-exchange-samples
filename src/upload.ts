// Uploading samples
// Learn more at https://github.com/bodrovis/lokalise-node-file-exchange?tab=readme-ov-file#performing-translation-file-uploads
import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import type { PartialUploadFileParams } from "lokalise-file-exchange";
import { LokaliseUpload } from "lokalise-file-exchange";
import type {
	CollectFileParams,
	ProcessUploadFileParams,
} from "lokalise-file-exchange";

// Load Lokalise API token and project ID from environment variables
const apiKey = process.env.LOKALISE_API_TOKEN as string;
const projectId = process.env.LOKALISE_PROJECT_ID as string;

async function main() {
	// Initialize LokaliseUpload client
	const lokaliseUploader = new LokaliseUpload(
		{
			apiKey, // Your Lokalise API token
			enableCompression: true,
		},
		{
			projectId, // Your Lokalise project ID
		},
	);

	// Define upload-specific parameters
	const uploadFileParams: PartialUploadFileParams = {
		replace_modified: true, // Replace modified files on Lokalise
	};

	// Define file collection parameters, various approaches:

	// Example: Collecting JSON and XML files under the locales directory (including nested folders)
	// const collectFileParams: CollectFileParams = {
	// 	inputDirs: ["./locales"], // Directories to collect files from
	// 	extensions: [".json", "xml"], // Collect JSON and XML files
	// 	recursive: true, // Collect files in all nested folders
	// };

	// Example: Collecting JSON files directly under locales directory (while providing absolute path)
	// const localesPath = path.resolve("locales");
	// const collectFileParams: CollectFileParams = {
	// 	inputDirs: [localesPath], // Absolute path to the "locales" directory
	// 	extensions: [".json"], // Collect only JSON files
	// 	recursive: false, // Only collect files in the root directory
	// };

	// Example: Collecting only the file named "en.json"
	const collectFileParams: CollectFileParams = {
		inputDirs: ["./locales"],
		extensions: [".json"],
		fileNamePattern: "^en\\.json$", // Regex to match only "en.json"
		recursive: false, // Only collect files in the root directory
	};

	// Define advanced processing parameters
	const processUploadFileParams: ProcessUploadFileParams = {
		pollStatuses: true, // Wait for file processing to complete on Lokalise
		languageInferer: (filePath) => {
			// Custom logic to infer language ISO from directory structure
			try {
				const parentDir = path.dirname(filePath);
				const baseName = path.basename(parentDir);
				return baseName !== "locales" ? baseName : "";
			} catch (_error) {
				return "";
			}
		},
		filenameInferer: (filePath) => {
			// Custom logic to infer the filename
			return path.basename(filePath);
		},
	};

	try {
		// Upload translations to Lokalise
		const { processes, errors } = await lokaliseUploader.uploadTranslations({
			uploadFileParams,
			collectFileParams,
			processUploadFileParams,
		});

		// Log process details
		for (const process of processes) {
			console.log("Created At:", process.created_at);
			console.log("Status:", process.status);
			console.log("Details:", process.details);
			console.log("===");
		}

		// Handle and log any errors
		if (errors.length > 0) {
			console.error("Errors during upload:");
			for (const error of errors) {
				console.error(error);
			}
		}
	} catch (error) {
		// Handle unexpected errors
		console.error("Unexpected error:", error);
	}
}

// Run the script
main().catch((err) => {
	console.error("Unhandled error:", err);
});
