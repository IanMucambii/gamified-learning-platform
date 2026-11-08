// scripts/backfillPhrases.ts
import mongoose from "mongoose";
import Material from "../models/Material";
import { generatePhrases } from "../services/aiGenerator.service";
import { env } from "../env";

async function run() {
  await mongoose.connect(env.MONGODB_URI); // adjust to match your actual connection setup

  const materials = await Material.find({
    type: "text",
    content: { $exists: true, $ne: "" },
    $or: [{ phrases: { $exists: false } }, { phrases: { $size: 0 } }],
  });

  console.log(`Found ${materials.length} materials to backfill`);

  for (const material of materials) {
    try {
      material.phrases = await generatePhrases(material.content!);
      await material.save();
      console.log(`✓ ${material.title}`);
    } catch (err) {
      console.error(`✗ ${material.title}:`, (err as Error).message);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run();