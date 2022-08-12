import axios from "axios";

export const searchYTB = async (text) => {
  const { data } = await axios.get(
    `https://1yr7i3.sse.codesandbox.io/search/${text}?limit=3`
  );
  return data;
};
