import { CheerioAPI } from "cheerio";
import path from "path";
import axios from "axios";
import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import env from "../configs/environments";

export const saveImage = async (
  imageUrl: string,
  publicDir: string,
  $: CheerioAPI,
  isFirstImage: boolean = false
): Promise<string | null> => {
  let fileName: string;
  let filePath: string;
  let newSrc: string | null = null;

  // Bỏ qua lưu ảnh nếu URL bắt đầu bằng env.url_api
  if (imageUrl.startsWith(env.url_api)) {
    if (isFirstImage) {
      // Trả về tên ảnh nếu đây là ảnh đầu tiên
      fileName = path.basename(imageUrl.split("?")[0].split("/").pop() || "");
      newSrc = `${env.url_api}/${fileName}`;
      $(`img[src="${imageUrl}"]`).attr("src", newSrc); // Update src in HTML
      return newSrc;
    }
    return null;
  }

  if (imageUrl.startsWith("http")) {
    fileName = path.basename(imageUrl.split("?")[0].split("/").pop() || "");
    filePath = path.join(publicDir, fileName);
    newSrc = `${env.url_api}/${fileName}`;
    console.log(`Saving file from URL as: ${filePath}`);

    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url: imageUrl,
      responseType: "stream",
    });
    response.data.pipe(writer);
    await new Promise<void>((resolve, reject) => {
      writer.on("finish", () => {
        $(`img[src="${imageUrl}"]`).attr("src", newSrc); // Update src in HTML
        resolve();
      });
      writer.on("error", reject);
    });
  } else if (/^data:image\/|^unsafe:data:image\//.test(imageUrl)) {
    const base64Data = imageUrl.split(",")[1];
    console.log(`Base64 data length: `, base64Data.length);
    if (base64Data.trim().length === 0) {
      console.log(`Skipping empty Base64 data for URL:`);
      return null;
    }
    fileName = `${uuidv4()}.png`;
    filePath = path.join(publicDir, fileName);
    newSrc = `${env.url_api}/${fileName}`;
    console.log(`Saving Base64 data as file: ${filePath}`);
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(filePath, buffer);
    $(`img[src="${imageUrl}"]`).attr("src", newSrc); // Update src in HTML
  } else {
    console.log(`Skipping invalid URL: `);
    return null;
  }

  return newSrc;
};
