import * as dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { LokaliseUpload } from "lokalise-file-exchange";
import type { CollectFileParams, ProcessUploadFileParams } from "lokalise-file-exchange";
import type { UploadFileParams } from "@lokalise/node-api"; 

const apiKey = process.env.LOKALISE_API_TOKEN as string;
const projectId = process.env.LOKALISE_PROJECT_ID as string;
async function main() {
	try {
		const lokaliseUploader = new LokaliseUpload(
			{
				apiKey,
			},
			{
				projectId,
			},
		);

		const uploadFileParams: Partial<UploadFileParams> = {
			replace_modified: true,
		};

		const collectFileParams: CollectFileParams = {
			inputDirs: ["./locales"], // ["./locales", "./extra_i18n"],
			extensions: [".json"],
		};

		const processUploadFileParams: ProcessUploadFileParams = {
			pollStatuses: true,
			languageInferer: (filePath) => {
				try {
					const parentDir = path.dirname(filePath);
					return path.basename(parentDir);
				} catch (_error) {
					return "";
				}
			},
		};

		const { processes, errors } = await lokaliseUploader.uploadTranslations({
			uploadFileParams,
			collectFileParams,
			processUploadFileParams,
		});

		for (const process of processes) {
			console.log(process.created_at)
			console.log(process.status)
			console.log(process.details);
			console.log('===')
		}

		if (errors.length > 0 ) {
			console.log("Errors:");
			console.log(errors);
		}
	} catch (error) {
		console.error(error);
	}
}

(async () => {
	await main();
})();
