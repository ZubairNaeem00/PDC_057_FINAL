import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../proto/image.proto");

console.log("🚀 Loading proto from:", PROTO_PATH);

const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const imagePackage = grpcObj.image;

if (!imagePackage) {
  console.error("❌ Proto failed to load!");
  process.exit(1);
}

console.log("✅ Proto loaded:", Object.keys(imagePackage));

function classifyImage(imageData: Buffer) {
  console.log("📷 Received image of size:", imageData.length);
  return { label: "cat", confidence: 0.92 };
}

function uploadImage(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  console.log("➡️ UploadImage RPC called");
  const imageData = call.request.imageData;
  const result = classifyImage(imageData);
  callback(null, result);
}

const server = new grpc.Server();
server.addService(imagePackage.ImageClassifier.service, { UploadImage: uploadImage });

const PORT = "0.0.0.0:50051";
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("❌ Server bind error:", err);
    return;
  }
  console.log(`✅ gRPC server running on port ${port}`);
  server.start();
});

// Keep process alive for Windows
setInterval(() => {}, 1000);
