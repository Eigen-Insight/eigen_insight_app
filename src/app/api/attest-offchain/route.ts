// attestOffchain.tsx
import { NextResponse, NextRequest } from "next/server";
import {
  SchemaEncoder,
  EAS,
  createOffchainURL,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { stringToBytes, bytesToHex } from "viem";
import axios from "axios";

interface AttestOffchainRequestBody {
  recipient: string;
  meetingId: string;
  meetingType: number;
  startTime: number;
  endTime: number;
}
interface MyError {
  message: string;
  code?: number; // Optionally, you can include a code for specific error types
}

const allowedOrigin = "http://localhost:3000";

const url =
  "https://opt-sepolia.g.alchemy.com/v2/A6sb4y_yoUVTlWMtBAPR7S7aJWmKit8r";
// Set up your ethers provider and signer
const provider = new ethers.JsonRpcProvider(url, undefined, {
  staticNetwork: true,
});
const privateKey = process.env.PVT_KEY ?? "";
const signer = new ethers.Wallet(privateKey, provider);
const eas = new EAS("0x4200000000000000000000000000000000000021");
eas.connect(signer);

export async function POST(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("Origin");
  if (origin !== allowedOrigin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 403 }
    );
  }
  console.log("log1");
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const requestData = (await req.json()) as AttestOffchainRequestBody;
  // Your validation logic here

  try {
    console.log("log2");
    // Your initialization code remains the same
    const offchain = await eas.getOffchain();
    console.log(offchain);
    const schemaEncoder = new SchemaEncoder(
      "bytes16 MeetingId,uint8 MeetingType,uint32 StartTime,uint32 EndTime"
    );

    console.log(schemaEncoder);

    const encodedData = schemaEncoder.encodeData([
      {
        name: "MeetingId",
        value: bytesToHex(stringToBytes(requestData.meetingId), { size: 16 }),
        type: "bytes16",
      },
      { name: "MeetingType", value: requestData.meetingType, type: "uint8" },
      { name: "StartTime", value: requestData.startTime, type: "uint32" },
      { name: "EndTime", value: requestData.endTime, type: "uint32" },
    ]);

    console.log(encodedData);

    const expirationTime = BigInt(0);
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    console.log(expirationTime);
    console.log(currentTime);

    console.log("---------");
    console.log(typeof currentTime);
    console.log("---------");

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        schema:
          "0x2d76910b8e40f8a4c63bed0c179df62335b11831669efec456ade30ca034b65f",
        recipient: requestData.recipient,
        time: currentTime,
        expirationTime: expirationTime,
        revocable: false,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      signer
    );

    const pkg = {
      sig: offchainAttestation,
      signer: await signer.getAddress(),
    };

    const baseUrl = "https://optimism-sepolia.easscan.org";
    const url = baseUrl + createOffchainURL(pkg);

    const data = {
      filename: `eas.txt`,
      textJson: JSON.stringify(pkg),
    };

    let uploadstatus = false;
    try {
      const response = await axios.post(`${baseUrl}/offchain/store`, data);
      if (response.data) {
        uploadstatus = true;
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting signed attestation: ", error);

      return NextResponse.json(
        { success: true, offchainAttestation, url, uploadstatus },
        { status: 200 }
      );
    }

    // Rest of your code remains the same

    return NextResponse.json(
      { success: true, offchainAttestation, url, uploadstatus },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as MyError; // Cast error to your custom error interface

    console.error("Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
