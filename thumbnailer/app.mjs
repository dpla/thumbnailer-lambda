import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import sharp from "sharp";

const s3 = new S3Client();
const bucket = "dpla-thumbnails";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const thumbSize = 400;

export const lambdaHandler = async (event, context) => {
  await Promise.all(
    event.Records.map(async (sqsRecord) => {
      const record = JSON.parse(sqsRecord.body);
      const id = record.id;
      const url = record.url;

      try {
        console.log("Processing.", id, url);

        // download image
        const res = await axios
          .get(url, {
            headers: {
              "User-Agent": userAgent,
            },
            responseType: "arraybuffer",
          })
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.log("Unable to download.", id, url, error);
          });

        if (!res || !res.data) {
          console.log("No response for download request.", id, url);
          return;
        } else if (res.status !== 200) {
          console.log(
            "Bad response for download request.",
            res.status,
            id,
            url
          );
          return;
        }

        // convert to thumbnail
        const thumbnail = await sharp(res.data)
          .resize(thumbSize)
          .toFormat("jpeg", { mozjpeg: true })
          .toBuffer();

        // upload image
        const key = `${id[0]}/${id[1]}/${id[2]}/${id[3]}/${id}.jpg`;

        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: thumbnail,
            ACL: "public-read",
          })
        );

        console.log("Processed.", id, url, key);
      } catch (error) {
        console.log("Error processing.", id, url, error);
      }
    })
  );
};
