import { builtins, CommandModules, Compose } from "@explorablegraph/explorable";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const srcFolder = path.resolve(dirname, "src");
const commands = new CommandModules(srcFolder);

export default new Compose(commands, builtins);
