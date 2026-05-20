import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

function getR2Config() {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing Cloudflare R2 configuration in environment variables.");
  }

  return {
    endpoint,
    bucket,
    accessKeyId,
    secretAccessKey,
  };
}

function createR2Client() {
  const { endpoint, accessKeyId, secretAccessKey } = getR2Config();
  return new S3Client({
    endpoint,
    region: "auto",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

export async function uploadBufferToR2(key: string, buffer: Buffer, contentType: string) {
  const { bucket } = getR2Config();
  const s3Client = createR2Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return getR2PublicUrl(key);
}

export async function downloadBufferFromR2(key: string) {
  const { bucket } = getR2Config();
  const s3Client = createR2Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3Client.send(command);
  const body = response.Body as any;
  if (!body) {
    throw new Error(`R2 object not found: ${key}`);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk as Uint8Array));
  }

  return Buffer.concat(chunks as unknown as Uint8Array[]);
}

export function getR2ObjectKeyFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const { endpoint, bucket } = getR2Config();
    const endpointHost = endpoint.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const normalizedBucket = bucket.replace(/\/+$/, "");

    if (parsed.hostname === endpointHost || parsed.hostname === `www.${endpointHost}`) {
      const path = parsed.pathname.replace(/^\//, "");
      if (path.startsWith(`${normalizedBucket}/`)) {
        return path.slice(normalizedBucket.length + 1);
      }
      return path;
    }

    if (parsed.hostname === `${normalizedBucket}.${endpointHost}`) {
      return parsed.pathname.replace(/^\//, "");
    }

    return null;
  } catch {
    return null;
  }
}

export function getR2PublicUrl(key: string) {
  const { endpoint, bucket } = getR2Config();
  const rawEndpoint = endpoint.replace(/\/+$/, "");
  const normalizedBucket = bucket.replace(/\/+$/, "");
  const encodedKey = key.split('/').map((segment) => encodeURIComponent(segment)).join('/');

  const endpointHost = rawEndpoint.replace(/^https?:\/\//, "");
  const isLocal = endpointHost.includes("localhost");

  if (isLocal) {
    return `${rawEndpoint}/${normalizedBucket}/${encodedKey}`;
  }

  return `https://${normalizedBucket}.${endpointHost}/${encodedKey}`;
}
