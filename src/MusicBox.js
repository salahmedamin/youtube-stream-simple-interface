import React, { useCallback, useEffect, useState } from "react";
import { getInfo } from "./api/getInfo";
import "./styles.css";
export const MusicBox = React.forwardRef(
  (
    {
      id,
      setisPlaying,
      isPlaying,
      currentPlaying,
      setcurrentPlaying,
      deleteCb = () => undefined
    },
    ref
  ) => {
    const [loading, setloading] = useState(true);
    const [meta, setmeta] = useState({});
    const handleInit = useCallback(async () => {
      setmeta(await getInfo(id));
      setloading(false);
    }, [id]);
    const playHandler = () => {
      if (currentPlaying !== id) {
        setcurrentPlaying(id);
        ref.current.pause();
        ref.current.currentTime = 0;
        ref.current.load();
        ref.current.play();
        setisPlaying(true);
      } else {
        setisPlaying(!isPlaying);
      }
    };
    useEffect(() => {
      (async () => await handleInit())();
    }, [handleInit]);
    useEffect(() => {
      if (!ref.current) return;
      else if (isPlaying) ref.current.play();
    }, [isPlaying, currentPlaying, ref]);
    return (
      <div className={`MusicBox${loading ? " center" : ""}`}>
        {loading ? (
          <div>LOADING...</div>
        ) : (
          <>
            <div
              className="banner"
              style={{
                backgroundImage: `url(${meta.image.url})`,
                marginTop: 30
              }}
            >
              <div
                onClick={playHandler}
                style={{
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: "calc( 100%  )",
                  left: 0,
                  cursor: "pointer"
                }}
              >
                {isPlaying && currentPlaying === id ? "Pause" : "Play"}
              </div>
              <div
                onClick={deleteCb}
                style={{
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: "calc( 100%  )",
                  right: 0,
                  cursor: "pointer"
                }}
              >
                X
              </div>
            </div>
            <div className="text">
              <div>{meta.author}</div>
              <div>{meta.length}s</div>
            </div>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {meta.title}
            </div>
          </>
        )}
      </div>
    );
  }
);
