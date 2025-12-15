import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import fs from "fs";

const PROTO_PATH = path.join(__dirname, "../proto/image.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const imagePackage = grpcObj.image;

const client = new imagePackage.ImageClassifier(
  "localhost:50051", // Call API Service
  grpc.credentials.createInsecure()
);

const imageBuffer = fs.existsSync(path.join(__dirname, "test.jpg"))
  ? fs.readFileSync(path.join(__dirname, "test.jpg"))
  : Buffer.from("dummy image data");

const start = Date.now();
client.UploadImage({ imageData: imageBuffer }, (err: any, response: any) => {
  if (err) console.error("❌ Client error:", err);
  else {
    console.log("Response:", response);
    console.log("End-to-end latency (ms):", Date.now() - start);
    console.log("Payload size (bytes):", imageBuffer.length);
  }
});
