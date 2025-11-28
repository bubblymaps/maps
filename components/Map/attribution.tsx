import { useEffect, useState } from "react";

export function Attribution() {

  const [versionNo, setVersionNo] = useState<string>("");

  useEffect(() => {
    fetch("/api/meta")
      .then((res) => res.json())
      .then((data) => {
        if (data.version) setVersionNo(data.version);
      })
      .catch((err) => {
        console.error("Failed to fetch version number:", err);
      });
  }, []);

  return (
    <div className="absolute right-0 bottom-0 z-10 bg-white bg-opacity-50 text-black text-[9px] px-1 py-0 hidden sm:block">
      © {" "}
      <a
        href="https://github.com/linuskang"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Linus Kang
      </a> under {" "}
      <a
        href="/license"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        CC BY-NC 4.0
      </a>
      . {" "}

      Version {versionNo || "loading..."}
    </div>
  );
}
