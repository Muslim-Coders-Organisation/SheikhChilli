import { BASE_URL } from "../config";

async function UseQuranAPI(path: string): Promise<Response> {
  return await fetch(BASE_URL + path);
}

export default UseQuranAPI;
