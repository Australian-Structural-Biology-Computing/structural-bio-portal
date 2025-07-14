import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SEQERA_API_URL;
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
const token = process.env.NEXT_PUBLIC_SEQERA_ACCESS_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    const USER_ID = data?.user.id;
      
    res.status(response.status).json({ USER_ID });
  } catch (error) {
    console.log("Error while getting user info: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
