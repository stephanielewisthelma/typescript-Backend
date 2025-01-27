import fetch, { HeadersInit } from "node-fetch";
import { INFOBIP_API_KEY } from "../config/config";

interface TwoFactorConfig {
  pinAttempts: number;
  allowMultiplePinVerifications: boolean;
  pinTimeToLive: string;
  verifyPinLimit: string;
  sendPinPerApplicationLimit: string;
  sendPinPerPhoneNumberLimit: string;
}

interface TwoFactorRequestBody {
  name: string;
  enabled: boolean;
  configuration: TwoFactorConfig;
}

export const create2FAApplication = async (): Promise<any> => {
  const headers: HeadersInit = {
    Authorization: `App ${INFOBIP_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const body: TwoFactorRequestBody = {
    name: "2fa test application",
    enabled: true,
    configuration: {
      pinAttempts: 10,
      allowMultiplePinVerifications: true,
      pinTimeToLive: "15m",
      verifyPinLimit: "1/3s",
      sendPinPerApplicationLimit: "100/1d",
      sendPinPerPhoneNumberLimit: "10/1d",
    },
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch("https://9kdn5y.api.infobip.com/2fa/2/applications", requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating 2FA application:", error);
    throw error;
  }
};
