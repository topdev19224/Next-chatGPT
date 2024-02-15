import { DarkContext } from "@/context/DarkContext";
import { useState, useEffect, useRef, useContext } from "react";

import Image from "next/image";

import TypeWriter from "./typeWriter";

const Container = () => {

    const { darkMode, toggleDarkMode }: any = useContext(DarkContext);

    const scrollContainer = useRef(null);
    const focus = useRef<any>(null);

    const [messageText, setMessageText] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [userChat, setUserChat] = useState<string[]>([]);
    const [botChat, setBotChat] = useState<string[]>([]);


    const botResponse = async () => {
        setIsLoading(true);
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messageText,
            }),
        });
        console.log("Edge function returned.");

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let botReply = "";

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const botMessage = decoder.decode(value);
            botReply += botMessage;
        }
        botReply += "\n";
        setBotChat([...botChat, botReply]);
        setIsLoading(false);
    }

    const handleScroll = (ref: any) => {
        ref.scrollTo({
            top: ref.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    };

    
    
    const sendMessage = () => {
        if (isLoading) return;
        if ((messageText.trim().length !== 0)) {
            botResponse();
        }
        setUserChat((messageText.trim().length === 0) ? userChat : [...userChat, messageText]);
        setMessageText("");
    }

    const handleEnterKey = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
        }
    }

    useEffect(()=> {
        if(isLoading === false){
            focus?.current?.focus();
        }
    }, [isLoading])


    useEffect(() => {
        handleScroll(scrollContainer.current);
    }, [userChat, botChat])



    return (
        <div className={`bg-${darkMode}`}>
            <div className={`flex gap-8 items-center justify-center h-[10vh] relative header-${darkMode}`}>
                <h1 className={`text-${darkMode} py-4 text-2xl  font-bold  text-center py-7`}>ChatGPT</h1>
                <div className="absolute right-4" onClick={toggleDarkMode}>
                    {darkMode ? <Image src="/assets/images/icons/light-sun.svg" alt="tool" width={0} height={0} className="w-12 h-12" /> : <Image src="/assets/images/icons/dark-moon.svg" alt="tool" width={0} height={0} className="w-12 h-12" />}
                </div>
            </div>
            <div className={`container-bg-${darkMode}`}>
                <div className='container mx-auto px-12 max-sm:px-6 py-6 overflow-auto h-[80vh] chat-container' ref={scrollContainer}>
                    {userChat.map((ele, key) => {
                        return (
                            <div key={`blockchat-${key}`}>
                                <div key={`userchat-${key}`} className='chat chat-end flex flex-col my-2 items-end justify-center'>
                                    <div className={`input-user-chat-bg-${darkMode} chat-bubble input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%] max-lg:max-w-full break-words`}>{ele}</div>
                                </div>
                                {botChat[key] && <div key={`botchat-${key}`} className='chat chat-start flex flex-col my-2 items-start justify-center break-words'>
                                    <div className={`chat chat-start input-bot-chat-bg-${darkMode} chat-bubble input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%] max-lg:max-w-full`}>
                                        {botChat[key].split("\n").map((ele: any, indkey: any) => {
                                            return <p key={`indkey-${indkey}`} className="">{ele}</p>
                                        })}</div>
                                </div>}
                            </div>
                        )
                    })}
                    {isLoading && <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
                </div>
            </div>
            <div className='container mx-auto px-12 max-sm:px-2 flex justify-center h-[10vh] relative'>
                {isLoading ? <div className="relative w-1/2 flex items-center max-sm:py-2 max-xl:w-full flex justify-center max-md:flex-col max-md:items-center gap-4">
                    <textarea disabled value={messageText} onChange={e => setMessageText(e.target.value)} onKeyUp={handleEnterKey}
                        className={`input-bg-${darkMode}  rounded-full outline-none  border input-border-${darkMode} input-text-${darkMode} w-full h-14 px-6 py-3 resize-none`}
                        placeholder="PLEASE TYPE YOUR TEXT HERE ..." />
                    <Image src="/assets/images/icons/send-message.png" width={32} height={32} className={`absolute right-4 active:translate-y-1`} onClick={sendMessage} alt="" />
                </div> : <div className="relative w-1/2 flex items-center max-sm:py-2 max-xl:w-full flex justify-center max-md:flex-col max-md:items-center gap-4">
                    <textarea ref={focus} value={messageText} onChange={e => setMessageText(e.target.value)} onKeyUp={handleEnterKey}
                        className={`input-bg-${darkMode}  rounded-full outline-none  border input-border-${darkMode} input-text-${darkMode} w-full h-14 px-6 py-3 resize-none`}
                        placeholder="PLEASE TYPE YOUR TEXT HERE ..." />
                    <Image src="/assets/images/icons/send-message.png" width={32} height={32} className={`absolute right-4 active:translate-y-1`} onClick={sendMessage} alt="" />
                </div>}


            </div>
        </div>
    )
}

export default Container;