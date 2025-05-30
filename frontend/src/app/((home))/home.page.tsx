/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Prata, Courgette, Yantramanav } from "next/font/google";

import SvgIcon from "@/component/icons/svg-icon";
import Label from "@/component/atom/label.component";
import Appbar from "./((component))/appbar.component";
import SearchBar from "./((component))/search-bar.component";
import { streamChat } from "@/api/openai";
import { validateUserPrompt } from "./utils";


const yantramanav = Yantramanav({
    subsets: ["devanagari"],
    display: "swap",
    weight: "400",
});

const spaceMono = Courgette({
    subsets: ["latin"],
    display: "swap",
    weight: "400",
});

const prata = Prata({
    subsets: ["latin"],
    display: "swap",
    weight: "400",
});

export default function HomePage() {
    const [keyword, setKeyword] = React.useState<string>("");
    const [status, setStatus] = React.useState<
        "idle" | "loading" | "failed" | "success"
    >("idle");

    const [data, setData] = React.useState<any>(null);
    const [message, setMessage] = React.useState<string>('');
    const [error, setError] = React.useState<any>(null);

    function extractEquivalentWord(text: string): string | null {
        const match1 = text.match(/equivalent:\s*(\w+)\.*$/);
        const match2 = text.match(/word:\s*(\w+)\.*$/);
        const match3 = text.match(/refers to\s*(\w+)\s*/);
        let match: RegExpMatchArray | null = null;
        if (match1 && match1[1])
            match = match1;
        else if (match2 && match2[1])
            match = match2;
        else if (match3 && match3[1])
            match = match3;
        return match ? match[1] : null;
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        let streamedMessage: string = '';
        if (!validateUserPrompt(keyword)) {
            setData(null);
            setError({
                message: "Invalid search! You cannot search for more than 5 words",
                resolution: "Consider only querying for Hindi words, cause I don't have infinite money"
            });
            setStatus("failed");
            return
        }
        const textStream = await searchQuery(keyword);
        // ReadableStream Version (Supported on Safari!)
        if (textStream) {
            const reader = textStream.getReader();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const textPart = value;
                
                if (done) break;

                setMessage(message => `${message}${textPart}`);
                streamedMessage = `${streamedMessage}${textPart}`; // because message won't update until next render.
            }
            const equivalentWord = extractEquivalentWord(streamedMessage);
            console.log(equivalentWord);
            let data = null;
            if (equivalentWord != null) {
                // process the message, extract the english word, then make an api call to get dictionary data.
                const dynamicData = await fetch(
                    `https://api.dictionaryapi.dev/api/v2/entries/en/${equivalentWord}`
                );
                data = await dynamicData.json();
            }
            setData(data);
            setError(data);
            setStatus("success");
            return
        }
        // AsyncIterable Version (Not supported on Safari!)
        // if (textStream != undefined || textStream != null) {
        //     for await (const textPart of textStream) {
        //         setMessage(message => `${message}${textPart}`);
        //         streamedMessage = `${streamedMessage}${textPart}`; // because message won't update until next render.
        //     }
        //     const equivalentWord = extractEquivalentWord(streamedMessage);
        //     console.log(equivalentWord);
        //     let data = null;
        //     if (equivalentWord != null) {
        //         // process the message, extract the english word, then make an api call to get dictionary data.
        //         const dynamicData = await fetch(
        //             `https://api.dictionaryapi.dev/api/v2/entries/en/${equivalentWord}`
        //         );
        //         data = await dynamicData.json();
        //     }
        //     setData(data);
        //     setError(data);
        //     setStatus("success");
        //     return
        // }

        // const response = await searchQueryLocal(keyword);
        // if (response != undefined && response.status === 200) {
        //     const reader = response.body.getReader();
        //     const decoder = new TextDecoder();

        //     while (true) {
        //         const { value, done } = await reader.read();
        //         if (done) break;
        //         const chunk = decoder.decode(value, { stream: true });
        //         // console.log(chunk);
        //         // let chunk = decoder.decode(value, { stream: true });
        //         // Replace newline characters with HTML <br> tags
        //         // chunk = chunk.replace(/\n/g, '<br>');
        //         setMessage(message => `${message}${chunk}`);
        //         streamedMessage = `${streamedMessage}${chunk}`; // because message won't update until next render.
        //     }
        //     console.log(streamedMessage);
        //     const equivalentWord = extractEquivalentWord(streamedMessage);
        //     console.log(equivalentWord);
        //     let data = null;
        //     if (equivalentWord != null) {
        //         // process the message, extract the english word, then make an api call to get dictionary data.
        //         const dynamicData = await fetch(
        //             `https://api.dictionaryapi.dev/api/v2/entries/en/${equivalentWord}`
        //         );
        //         data = await dynamicData.json();
        //     }
        //     setData(data);
        //     setError(data);
        //     setStatus("success");
        //     return
        // } 
        else {
            setStatus("failed");
            setError(data);
            setData(undefined);
        }
    }
    async function searchQuery(query: string) {
        try {
            if (query === "") return;
            if (query !== keyword) {
                setKeyword(query);
            }
            setStatus("loading");
            setData(undefined);
            // Local Server call (Flask, Ollama)
            // const dynamicData = await fetch(
            //     `http://127.0.0.1:5005/stream?word=${query}`
            // );
            // OpenAI API call
            const dynamicData = await streamChat(query);
            return dynamicData;
        } catch (error) {
            console.log(error);
            setStatus("failed");
        }
    }
    function handlePressHome(): void {
        setKeyword("");
        setStatus("idle");
        setError(null);
        setData(null);
        setMessage('');
    }
    return (
        <main className="max-w-3xl mx-auto px-4 sm:px-0">
            <Appbar pressHome={handlePressHome} />
            <SearchBar
                status={status}
                keyword={keyword}
                setKeyword={setKeyword}
                search={handleSearch}
            />
            {message && message.length > 0 && (
                <section className=" flex flex-col my-11 gap-2">
                    <Label
                        size="h1"
                        variant="t1"
                        className={`text-4xl first-letter:uppercase ${prata.className}`}
                    >
                        {keyword}
                    </Label>
                    <div className="flex-1 border-b h-1 " />
                    <Label size="h3" variant="t3">
                        {message}
                    </Label>
                </section>
            )}
            {data && data.length > 0 && (
                <WordLLM
                    word={data[0]}
                    setKeyword={setKeyword}
                    searchQuery={searchQuery}
                />
            )}
            {error && Object.keys(error).length > 0 && (
                <>
                    <div className="flex flex-col my-32 text-center">
                        <Label size="h3" variant="t1">
                            {error.message}
                        </Label>
                        <Label variant="s1">{error.resolution}</Label>
                    </div>
                </>
            )}
        </main>
    );
}

function WordLLM({ word, setKeyword, searchQuery }: any) {
    return (
        <section className=" flex flex-col my-11">
            <div className="flex place-content-between items-center">
                <div className="flex flex-col gap-1">
                    <Label
                        size="h1"
                        variant="t1"
                        className={`text-4xl ${yantramanav.className}`}
                    >
                        {word.devanagari}
                    </Label>
                    <Label
                        size="h1"
                        variant="t1"
                        className={`text-4xl first-letter:uppercase ${prata.className}`}
                    >
                        {word.word}
                    </Label>

                    <Label className="theme-text-primary">{word.phonetic}</Label>
                </div>
                <button
                    className="flex items-center place-content-center p-2 theme-bg-primary rounded-full hover:shadow-lg hover:scale-110 transition-all duration-200"
                    onClick={() => {
                        const wordToSay = word.word ?? word.phonetic;
                        const utterance = new SpeechSynthesisUtterance(wordToSay);
                        speechSynthesis.speak(utterance);
                    }}
                >
                    <SvgIcon icon={"Play"} className="theme-text-on-primary" size={10} />
                </button>
            </div>
            <div className="flex flex-col">
                <Meanings
                    meanings={word.meanings}
                    setQuery={(query: string) => {
                        setKeyword(query);
                        searchQuery(query);
                    }}
                />
            </div>
            <div>
                <div className="flex flex-col my-4 border-t py-2">
                    <Label size="body" variant="s1">
                        Origin{" "}
                    </Label>
                    <a href={word.sourceUrls}>
                        <Label size="caption" variant="s1" className="underline">
                            {word.sourceUrls}
                        </Label>
                    </a>
                </div>
            </div>
        </section>
    );
}

function Meanings({ meanings, setQuery = () => { } }: any) {
    return (
        <div key="meanings">
            {meanings.map((meaning: any, index: number) => {
                const { partOfSpeech, synonyms, antonyms } = meaning;
                return (
                    <div key={index}>
                        <div className="flex gap-4 items-center my-4">
                            <Label size="h3" variant="t2" className={spaceMono.className}>
                                {partOfSpeech}
                            </Label>
                            <div className="flex-1 border-b h-1 " />
                        </div>
                        <Definition definitions={meaning.definitions} />
                        <div className="flex flex-col gap-2 mt-4">
                            <Nonyms
                                nonyms={synonyms}
                                label={"Synonyms "}
                                setQuery={setQuery}
                            />
                            <Nonyms
                                nonyms={antonyms}
                                label={"Antonyms "}
                                setQuery={setQuery}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Definition({ definitions }: any) {
    return (
        <div className="flex flex-col gap-2">
            <Label variant="s1">Meaning </Label>
            <div className="flex flex-col gap-1">
                {definitions.map((item: any, index: number) => (
                    <ul
                        key={index}
                        className="flex flex-col  list-disc list-outside pl-4"
                    >
                        <li key={index} className="marker:text-black marker:dark:text-white">
                            <Label size="h3" variant="t3">
                                {item.definition}
                            </Label>

                            {item.example && (
                                <div className="ml-4">
                                    <Label size="body" variant="s2">
                                        Example:{" "}
                                    </Label>
                                    <Label size="body" variant="s2" className="italic">
                                        {item.example}
                                    </Label>
                                </div>
                            )}
                        </li>
                    </ul>
                ))}
            </div>
        </div>
    );
}

function Nonyms({ nonyms, label, setQuery = () => { } }: any) {
    return (
        nonyms &&
        nonyms.length > 0 && (
            <div className="flex items-start gap-2">
                <Label size="body" variant="s2">
                    {label}
                </Label>
                <div className="flex flex-wrap gap-2 ">
                    {nonyms.map((item: any, index: number) => (
                        <Label
                            key={index}
                            size="body"
                            onClick={() => {
                                setQuery(item);
                            }}
                            className={`cursor-pointer theme-text-primary ${prata.className}`}
                        >
                            {item}
                        </Label>
                    ))}
                </div>
            </div>
        )
    );
}
