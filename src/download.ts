import * as dotenv from "dotenv";
dotenv.config();

import { LokaliseDownload } from "lokalise-file-exchange";
import type { ExtractParams } from "lokalise-file-exchange";
import type { DownloadFileParams } from "@lokalise/node-api"; 

const apiKey = process.env.LOKALISE_API_TOKEN as string;
const projectId = process.env.LOKALISE_PROJECT_ID as string;
async function main() {
	try {
    const lokaliseDownloader = new LokaliseDownload({
      apiKey,
    },
    {
      projectId,
    });

    const downloadFileParams: DownloadFileParams = {
      format: "json",
      original_filenames: true,
      indentation: "2sp",
      directory_prefix: "",
    };
    const extractParams: ExtractParams = { outputDir: "./" };

    await lokaliseDownloader.downloadTranslations({downloadFileParams, extractParams});
  } catch (error) {
		console.error(error);
	}
}

(async () => {
	await main();
})();