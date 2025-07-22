import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.SEQERA_API_URL;
const token = process.env.SEQERA_ACCESS_TOKEN!;

type ResponseData = {
  USER_ID: number;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const request = {
    method: "GET",
    headers: myHeaders
  };

  try {
    const response = await fetch(`${BASE_URL}/user-info`, request);
    const data = await response.json();
    const USER_ID: number = data?.user.id;
    // res.status(response.status);
    res
      .status(response.status)
      .json({ message: "Got the USER_ID", USER_ID: USER_ID });
  } catch (error) {
    console.error("Error while getting user info: ", error);
    res.status(500).json({ message: "Internal server error", USER_ID: 0 });
  }
}
