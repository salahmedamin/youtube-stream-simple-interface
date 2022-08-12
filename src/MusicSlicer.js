import { useCallback, useEffect, useMemo, useState } from "react";
import AudioGraph from "./AudioGaph";
export const MusicSlicer = ({ id, meta: { length } }) => {
  const [bufferData, setBufferData] = useState(null);
  const streamLink = useMemo(
    () => `https://1yr7i3.sse.codesandbox.io/stream/${id}`,
    [id]
  );
  const getFile = useCallback(() => {
    const context = getContext();
    getAudioBuffer(streamLink, context).then((buffer) => setBufferData(buffer));
  }, [streamLink]);
  const getAudioBuffer = (path, context) => {
    return fetch(path)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((audioData) => {
        return new Promise((resolve, reject) => {
          context.decodeAudioData(audioData, (buffer) => {
            return resolve(buffer);
          });
        });
      });
  };
  const getContext = () => {
    window.AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext;
    const context = new AudioContext();
    return context;
  };
  useEffect(() => {
    (async () => await getFile())();
  }, [id, getFile]);
  return (
    <div className="SlicerHolder">
      <div className="slicer">
        {!bufferData ? null : <AudioGraph buffer={bufferData} startTime={0} />}
      </div>
      <audio style={{ display: "none" }} controls>
        <source src={streamLink} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};
