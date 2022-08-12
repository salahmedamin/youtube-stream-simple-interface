import axios from "axios";

export const getInfo = async (id) => {
  const { data } = await axios.get(
    `https://1yr7i3.sse.codesandbox.io/info/${id}`
  );
  return {
    ...data,
    thumbnails: undefined,
    image: data.thumbnails[data.thumbnails.length - 1]
  };
};
