import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../../proto/image.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const imagePackage = grpcObj.image;

function classifyImage(imageData: Buffer) {
  console.log("🖼 AI Worker received image of size:", imageData.length);
  // Dummy classifier
  return { label: "cat", confidence: 0.92 };
}

function uploadImage(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  console.log("➡️ AI Worker RPC called");
  const result = classifyImage(call.request.imageData);
  callback(null, result);
}

const server = new grpc.Server();
server.addService(imagePackage.ImageClassifier.service, { UploadImage: uploadImage });

const PORT = "0.0.0.0:50052"; // Worker port
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) return console.error(err);
  console.log(`✅ AI Worker running at ${PORT}`);
});
