import { useCallback, useEffect, useRef, useState } from "react";
import { searchYTB } from "./api/searchYtb";
import { MusicBox } from "./MusicBox";
import { MusicSlicer } from "./MusicSlicer";
import "./styles.css";

export default function App() {
  const [music, setMusic] = useState([]);
  const [data, setdata] = useState({});
  const ref = useRef();
  const [currentPlaying, setcurrentPlaying] = useState(null);
  const [isPlaying, setisPlaying] = useState(false);
  const handleChange = (e) =>
    setdata({
      ...data,
      [e.target.name]: e.target.value
    });
  const handleAddMusic = useCallback(
    ({ id }) => {
      if (music.find((e) => e === id)) return;
      setMusic([...music, id]);
    },
    [music]
  );
  const deleteFromList = (i) =>
    setMusic(music.filter((_, index) => index !== i));
  useEffect(() => {
    if (!ref.current) return;
    if (!isPlaying) ref.current?.pause();
  }, [isPlaying]);
  return (
    <div>
      <h2>MUSIC LIST</h2>
      <div className="App">
        {music.map((e, i) => (
          <MusicBox
            key={i}
            setisPlaying={setisPlaying}
            isPlaying={isPlaying}
            currentPlaying={currentPlaying}
            setcurrentPlaying={setcurrentPlaying}
            ref={ref}
            deleteCb={() => deleteFromList(i)}
            id={e}
          />
        ))}
        {music.length > 0 && currentPlaying ? (
          <audio ref={ref} style={{ display: "none" }} controls>
            <source
              src={`https://1yr7i3.sse.codesandbox.io/stream/${currentPlaying}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio tag.
          </audio>
        ) : null}
      </div>
      <div>
        <h1>SEARCH MUSIC</h1>
        <div>
          <input
            name="search"
            onChange={handleChange}
            style={{ display: "block" }}
            type="text"
            placeholder="Text"
          />
          <button
            onClick={async () => {
              const _data = await searchYTB(data.search);
              setMusic(_data.map((e) => e.id));
            }}
          >
            SEARCH
          </button>
        </div>
      </div>
      <div>
        <h1>ADD MUSIC (max 20s)</h1>
        <div>
          <input
            name="id"
            onChange={handleChange}
            style={{ display: "block" }}
            type="text"
            placeholder="id"
          />
          <button onClick={() => handleAddMusic(data)}>ADD</button>
        </div>
      </div>
      <MusicSlicer id={"CRYldxA0AvI"} meta={{ length: 552 }} />
    </div>
  );
}
