"use client";

import axios from "axios";
import {
  Cpu,
  DollarSign,
  Globe,
  Palette,
  Star,
  Volleyball,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DisplayDiscover from "./_components/DisplayDiscover";

type LatestNews = {
  title: string;
  contextLink: string;
  thumbnail: string;
  imageurl: string;
};
function Discover() {
  const [selectedOption, setSelectedOption] = useState("Top");
  const [latestNews, setLatestNews] = useState([] as LatestNews[]);
  const options = [
    { title: "Top", icon: Star },
    { title: "Tech & Science", icon: Cpu },
    { title: "Finance", icon: DollarSign },
    { title: "Art & Culture", icon: Palette },
    { title: "Sports", icon: Volleyball },
  ];

  useEffect(() => {
    selectedOption && GetSearchResult();
  }, [selectedOption]);
  const GetSearchResult = async () => {
    const result = await axios.post("/api/search-api", {
      searchInput: selectedOption + " latest news and updates",
      searchType: "Search",
    });
    // console.log(result.data.imageResults);
    setLatestNews(result.data.imageResults);
  };

  return (
    <div className="px-8 md:px-20 lg:px-40 xl:px-60 mt-20">
      <h2 className="font-bold text-2xl flex items-center gap-2">
        <Globe />
        <span>Discover</span>
      </h2>
      <div className="flex mt-4 justify-evenly items-center">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option.title)}
            className={`flex justify-center items-center gap-1 p-1 px-3 hover:text-primary cursor-pointer rounded-full ${
              selectedOption == option.title && "bg-accent text-primary"
            }`}
          >
            <option.icon />
            <h2>{option.title}</h2>
          </div>
        ))}
      </div>
      <DisplayDiscover latestNews={latestNews}/>
    </div>
  );
}

export default Discover;
