'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([])

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag)
  }

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.HOST}/api/prompt`, {
        cache: 'no-store'
      });

      const data = await res.json();

      setPosts(data);
      setFilteredPosts(data)
    })();
  }, []);

  useEffect(() => {
    const searchFilteredPosts = posts.filter(
      (p) =>
        p.prompt.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
        p.tag.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
        p.creator.email.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
        p.creator.username.toLowerCase().includes(debouncedSearchText.toLowerCase())
    );
    setFilteredPosts(searchFilteredPosts)
    if (debouncedSearchText.length === 0)
      setFilteredPosts(posts)
  }, [debouncedSearchText]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
