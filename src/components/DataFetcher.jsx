// src/components/DataFetcher.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);//remaing data points in a page

  useEffect(() => {

    const handleScroll = () => {

        //condition to check if document is ended or not
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading)  
      {
        return;
      }

    //   if loading above is true then it won't load more
      loadMore();
    };

    window.addEventListener('scroll', handleScroll);

    // One scroll event has to end
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
      if (response.data.length < 10) {
        setHasMore(false);
      }
      setData(prevData => [...prevData, ...response.data]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);//icreases the page number which in turn runs the useEffect
    }
  };

  return (
    <div>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!loading && !hasMore && <p>No more data</p>}
    </div>
  );
};

export default DataFetcher;
