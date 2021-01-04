import getConfig from 'next/config';
import { TypeConfig } from "./types";

const { publicRuntimeConfig } = getConfig();

export default publicRuntimeConfig as TypeConfig;
