import fetch from "node-fetch";
import WeathermanDAO from "../../server/dao.js";

const urbanDictApi = (searchTerm) =>
  `http://api.urbandictionary.com/v0/define?term=${searchTerm}`;

const define = async (input) => {
  try {
    const path = urbanDictApi(input.replace(/\s/g, "+"));
    const res = await fetch(path);
    const json = await res.json();
    if (json.list && json.list.length) {
      let { definition } = json.list[0];
      definition = definition.replace(/\[/g, "").replace(/]/g, "");
      return definition;
    }
    return "No.";
  } catch (e) {
    WeathermanDAO.log(
      `ERR: UrbanDict API with input "${input}" -- ${JSON.stringify(e)}`
    );
    return "Dictionary API Error";
  }
};

export default define;
