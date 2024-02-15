import { useState, useEffect } from "react";


const TypeWriter = ({ typeContent }: any) => {
    const [typeLetter, setTypeLetter] = useState<string>("");

    let i = 0;

    const handleTyping = () => {
        setTypeLetter(typeContent.substring(0, i))
        i++;
    }

    useEffect(() => {
        const interval = setInterval(() => handleTyping(), 200);
        return () => clearInterval(interval);
    }, []);

    return (<p>{typeLetter}</p>);
}

export default TypeWriter;