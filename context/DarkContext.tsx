import { createContext, useState } from 'react';


const DarkContext = createContext({});

const DarkProvider = (props: any) => {

    const [darkMode, setDarkMode] = useState<boolean>(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        console.log(darkMode)
    }

    return (
        <DarkContext.Provider value={{ darkMode, toggleDarkMode }}>
            {props.children}
        </DarkContext.Provider>
    )
}

export { DarkContext, DarkProvider };