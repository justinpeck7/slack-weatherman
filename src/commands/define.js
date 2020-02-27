import axios from "axios";
import getLogger from "../logger";

const log = getLogger();
const urbanDictApi = searchTerm =>
  `http://api.urbandictionary.com/v0/define?term=${searchTerm}`;

const define = async input => {
  try {
    const res = await axios.get(urbanDictApi(input));
    if (res.data.list && res.data.list.length) {
      let { definition } = res.data.list[0];
      definition = definition.replace(/\[/g, "").replace(/]/g, "");
      return definition;
    }
    return "No results.";
  } catch (e) {
    log(`ERR UrbanDict API -- ${e}`);
    return "The dictionary API seems to be down right now";
  }
};

export default define;
