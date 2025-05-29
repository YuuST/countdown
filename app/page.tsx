


import { promises as fs } from "fs";
import path from "path";
import { Countdown } from "./Countdown";

interface Config {
  message: string;
  countdownTo: string;
}

// Server component: fetch config and pass to client
export default async function Page() {
  const configPath = path.join(process.cwd(), "config.json");
  const configRaw = await fs.readFile(configPath, "utf-8");
  const config: Config = JSON.parse(configRaw);
  return <Countdown config={config} />;
}
