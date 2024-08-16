import sharp from "sharp";
import env from "../configs/environments";

const addWatermark = async (
  mainImagePath: string,
  outputImagePath: string
): Promise<void> => {
  try {
    const mainMeta = await sharp(mainImagePath).metadata();
    const overlayMeta = await sharp(env.overlayImagePath).metadata();
    if (overlayMeta.width === undefined || overlayMeta.height === undefined) {
      throw new Error("Overlay image metadata is missing width or height.");
    }
    let resizedOverlayBuffer: Buffer;
    if (
      overlayMeta.width <= (mainMeta.width ?? 0) &&
      overlayMeta.height <= (mainMeta.height ?? 0)
    ) {
      resizedOverlayBuffer = await sharp(env.overlayImagePath).toBuffer();
    } else {
      resizedOverlayBuffer = await sharp(env.overlayImagePath)
        .resize(mainMeta.width ?? 0, mainMeta.height ?? 0, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
    }
    await sharp(mainImagePath)
      .composite([{ input: resizedOverlayBuffer, gravity: "center" }])
      .toFile(outputImagePath);
    console.log("Image composite created successfully.");
  } catch (error) {
    console.error("Error during compositing:", error);
  }
};

export default addWatermark;
