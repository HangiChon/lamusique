import { useState, useEffect } from "react";

const useFetch = (endPoint, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [refetchRequired, setRefetchRequired] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endPoint, options);
        const formattedData = await response.json();
        const { data, message } = formattedData;
        setData(data);
        setMsg(message);
        data && setIsLoaded(true);
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, [refetchRequired]);

  return [data, isLoaded, msg, error, refetchRequired, setRefetchRequired];
};
export default useFetch;
