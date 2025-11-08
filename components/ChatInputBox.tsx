"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Atom,
  Cpu,
  Globe,
  SearchCheckIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIModelsOption } from "@/services/Shared";
import { supabase } from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import SpeechRecognition from "./SpeechRecognition";

function ChatInputBox() {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [searchType, setSearchType] = useState("search");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const emotionInputRef = useRef<HTMLInputElement>(null);

  const onSearchQuery = async () => {
    setIsLoading(true);
    const libid = v4();
    const { data }: any = await supabase
      .from("Library")
      .insert([
        {
          searchInput: userSearchInput,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          searchType: searchType,
          libid: libid,
        },
      ])
      .select();
    // console.log(data);
    // Hi
    setIsLoading(false);
    // console.log(searchType);
    if (searchType == "search") {
      router.push(`/search/${libid}`);
    } else {
      router.push(`/emotion/${libid}`);
    }
  };

  const updateInputText = (text: string) => {
    setUserSearchInput(text);

    if (searchType === "search" && searchInputRef.current) {
      searchInputRef.current.value = text;
    } else if (searchType === "emotion" && emotionInputRef.current) {
      emotionInputRef.current.value = text;
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center w-full gap-5">
      <div className="flex items-center justify-center flex-row gap-4">
        <Image src={"/logo.webp"} alt="Perplexity" width={100} height={100} />
        <h1 className="font-bold text-4xl">Derplexity</h1>
      </div>
      <div className="p-2 w-full max-w-2xl border rounded-2xl">
        <div className="flex flex-row items-end justify-between">
          <Tabs defaultValue="search" className="w-[400px]">
            <TabsContent value="search">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Anything..."
                className="w-full p-4 outline-none"
                onChange={(e) => setUserSearchInput(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="emotion">
              <input
                ref={emotionInputRef}
                type="text"
                placeholder="Chat Anything ..."
                className="w-full p-4 outline-none"
                onChange={(e) => setUserSearchInput(e.target.value)}
              />
            </TabsContent>
            <TabsList>
              <TabsTrigger
                value="search"
                onClick={() => setSearchType("search")}
              >
                <SearchCheckIcon /> Search
              </TabsTrigger>
              <TabsTrigger
                value="emotion"
                onClick={() => setSearchType("emotion")}
              >
                <Atom /> Emotion
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-1 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"ghost"}>
                  <Cpu className="text-gray-400 h-5 w-5 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                {AIModelsOption.map((model, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="flex flex-col">
                      <span className="font-bold">{model.name}</span>
                      <span className="text-sm text-gray-500">
                        {model.desc}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={"ghost"}
              className="hover:cursor-pointer"
              onClick={() => router.push("/discover")}
            >
              <Globe className="text-gray-400 h-5 w-5 " />
            </Button>
            {/* <Button variant={"ghost"}>
              <Paperclip className="text-gray-400 h-5 w-5 " />
            </Button> */}
            <SpeechRecognition
              onTextCapture={(text) => {
                updateInputText(text);
              }}
            />
            <Button
              onClick={() => {
                userSearchInput.trim() ? onSearchQuery() : null;
              }}
              className={`${userSearchInput ? "cursor-pointer" : ""}`}
              disabled={isLoading}
            >
              <ArrowRight className="text-white h-5 w-5 " />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;
