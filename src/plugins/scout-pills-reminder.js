import axios from "axios";
import cron from "node-cron";

const getUsers = async token => {
  const res = await axios.get(
    `https://slack.com/api/users.list?token=${token}`
  );
  return res.data;
};

const getIms = async token => {
  const res = await axios.get(`https://slack.com/api/im.list?token=${token}`);
  return res.data;
};

export default {
  async install({ rtm, log, token }) {
    try {
      const userList = await getUsers(token);
      const imList = await getIms(token);

      const me = userList.members.find(
        member => member.real_name === "Justin Peck"
      );
      const convoWithMe = imList.ims.find(im => im.user === me.id);

      cron.schedule("0 0 1 * *", () => {
        rtm.sendMessage("Give Scout his meds", convoWithMe.id);
      });
      log(`Plugin "scout-pills-reminder" Installed`);
    } catch (e) {
      log(`ERR installing scout-pills-reminder plugin -- ${e}`);
    }
  }
};
