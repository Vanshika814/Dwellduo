import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";

export default function LocationSearch({ onSelect, placeholder, value }) {
  const autoRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handlePlaceChanged = () => {
    const place = autoRef.current.getPlace();

    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    setInputValue(address);
    onSelect({ lat, lng, address });
  };

  return (
    <Autocomplete
      onLoad={(auto) => (autoRef.current = auto)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || "Search location..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
      />
    </Autocomplete>
  );
}
