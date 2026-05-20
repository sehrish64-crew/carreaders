import { NextRequest, NextResponse } from "next/server";
import { isValidImageType } from "@/utils/validators";
import { validateVehicleFile } from "@/utils/vehicle-validator";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const images = data.getAll("images") as File[];

    if (!images.length) {
      return NextResponse.json({ error: "No images were provided." }, { status: 400 });
    }

    const results = [] as Array<{ name: string; isVehicle: boolean; reason?: string }>;

    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      const name = image?.name || `image-${index + 1}`;

      if (!image || !isValidImageType(image.type)) {
        results.push({ name, isVehicle: false, reason: "Invalid image type." });
        continue;
      }

      try {
        const isVehicle = await validateVehicleFile(image);
        results.push({ name, isVehicle, reason: isVehicle ? undefined : "Not recognized as a vehicle image." });
      } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Vehicle validation failed." }, { status: 502 });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unable to validate vehicle images." }, { status: 500 });
  }
}
