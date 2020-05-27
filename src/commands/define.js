import axios from "axios";
import getLogger from "../logger";

const log = getLogger();
const urbanDictApi = searchTerm =>
  `http://api.urbandictionary.com/v0/define?term=${searchTerm}`;

const define = async input => {
  try {
    const path = urbanDictApi(input.replace(/\s/g, "+"));
    const res = await axios.get(path);
    if (res.data.list && res.data.list.length) {
      let { definition } = res.data.list[0];
      definition = definition.replace(/\[/g, "").replace(/]/g, "");
      return definition;
    }
    return "No.";
  } catch (e) {
    log(`ERR UrbanDict API with input "${input}" -- ${e}`);
    return "Dictionary API Error";
  }
};

export default define;
