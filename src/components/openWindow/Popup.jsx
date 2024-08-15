import OpenWindow from "./OpenWindow";

export default function Popup({children, visible, ...props}){
    if(!visible) return null;

    return (
        <OpenWindow
            {...props}
            showMaximize={false}
            showMinimize={false}
            popup={true}    
        >
            {children}
        </OpenWindow>
    )
} 