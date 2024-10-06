import { ServeStaticModuleOptions } from "@nestjs/serve-static";
import { join } from "path";

const clientDist = join(process.cwd(), "..", "apps", "client", "dist");

export const serveStaticConfig: ServeStaticModuleOptions = {
  rootPath: clientDist,
};
