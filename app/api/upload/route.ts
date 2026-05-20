import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitRealtimeEvent } from "@/lib/socket";
import { rateLimit } from "@/utils/rate-limit";
import { getImageExtension, isValidImageType } from "@/utils/validators";
import { validateVehicleFile } from "@/utils/vehicle-validator";
import { uploadBufferToR2 } from "@/lib/r2";
import { query, createId } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const guestUserId = "guest-user";
    const userId = user?.id || guestUserId;

    if (!user?.id) {
      await query(
        "INSERT INTO `user` (`id`,`email`,`password`,`role`,`createdAt`) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE `id` = `id`",
        [guestUserId, "guest@motorpulse.local", "guest-password", "GUEST"],
      );
    }

    const ip = request.headers.get("x-forwarded-for") || userId;

    const limit = rateLimit(ip, 12, 60);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: limit.resetAt },
        { status: 429 }
      );
    }

    const data = await request.formData();
    const vehicleName = String(data.get("vehicleName") ?? "Untitled Vehicle");
    const uploadId = createId();
    const vehicleId = createId();

    emitRealtimeEvent("upload_started", { userId, vehicleName });

    const images = data.getAll("images") as File[];

    if (!images.length) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    await query(
    "INSERT INTO `vehicle` (`id`,`userId`,`vehicleName`,`analysisStatus`,`createdAt`) VALUES (?, ?, ?, ?, NOW())",
    [vehicleId, userId, vehicleName, "Pending"],
  );

  const uploadedImages: { imageUrl: string }[] = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];

    if (!file || !isValidImageType(file.type)) {
      return NextResponse.json(
        { error: `Invalid image file at index ${i}` },
        { status: 400 }
      );
    }

    const isVehicle = await validateVehicleFile(file);
    if (!isVehicle) {
      return NextResponse.json(
        { error: `Image at index ${i} was not recognized as a vehicle image.` },
        { status: 400 }
      );
    }

    const extension = getImageExtension(file.type);

    const key = `uploads/${userId}/${uploadId}/image_${i + 1}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const imageUrl = await uploadBufferToR2(key, buffer, file.type);

    await query(
      "INSERT INTO `vehicleimage` (`id`,`vehicleId`,`imageType`,`imageUrl`,`createdAt`) VALUES (?, ?, ?, ?, NOW())",
      [createId(), vehicleId, extension, imageUrl],
    );

    uploadedImages.push({ imageUrl });
  }

  emitRealtimeEvent("upload_completed", {
    uploadId,
    imageCount: uploadedImages.length,
  });

  return NextResponse.json({
    uploadId,
    vehicleId,
    vehicleName,
    imageUrls: uploadedImages.map((img) => img.imageUrl),
  });
  } catch (error: any) {
    console.error("/api/upload error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown upload error." },
      { status: 500 }
    );
  }
}