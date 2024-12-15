import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import type { UploadFileParams } from "@lokalise/node-api";
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
		},
		{
			projectId, // Your Lokalise project ID
		},
	);

	// Define upload-specific parameters
	const uploadFileParams: Partial<UploadFileParams> = {
		replace_modified: true, // Replace modified files on Lokalise
	};

	// Define file collection parameters
	const collectFileParams: CollectFileParams = {
		inputDirs: ["./locales"], // Directories to collect files from
		extensions: [".json"], // Collect only JSON files
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
			console.error(errors);
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
