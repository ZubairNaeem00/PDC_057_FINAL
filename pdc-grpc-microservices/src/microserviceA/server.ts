import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../../proto/image.proto");

// Load proto
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const imagePackage = grpcObj.image;

// Connect to Microservice B (AI Worker)
const workerClient = new imagePackage.ImageClassifier(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

function forwardToWorker(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  console.log("➡️ API Service received image, forwarding to AI Worker");
  const start = Date.now();
  workerClient.UploadImage({ imageData: call.request.imageData }, (err: any, response: any) => {
    if (err) {
      console.error("❌ Error from worker:", err);
      callback(err, null);
    } else {
      console.log("✅ Response from AI Worker in", Date.now() - start, "ms");
      callback(null, response); // Forward to client
    }
  });
}

const server = new grpc.Server();
server.addService(imagePackage.ImageClassifier.service, { UploadImage: forwardToWorker });

const PORT = "0.0.0.0:50051"; // API port
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) return console.error(err);
  console.log(`✅ API Service running at ${PORT}`);
});
