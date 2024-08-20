import { useEffect } from "react";
import { useState } from "react";
import './TimeWidget.css';

export function TimeWidget(){

    const [time, setTime] = useState('');

    useEffect(() => {
        const checkTime = (i) => {
            return (i < 10) ? "0" + i : i;
        } 

        const startTime = () => {
            var today = new Date(),
                h = today.getHours(),
                m = checkTime(today.getMinutes()),
                period = "AM";
                
            {/* Convert AM to PM */}
            if (h >= 12) {
                period = "PM";
                if (h > 12) {
                    h -= 12;
                }
            } else if (h === 0) {
                h = 12;
            }
    
            setTime(h + ":" + m + " " + period);
        };

        startTime();  // Start the time on component mount
        const timerId = setInterval(startTime, 1000);  // Update time every second
        return () => clearInterval(timerId);  // Cleanup interval on component unmount
    });

    return (
        <div className="time-widget">
            <img src="/assets/speaker.png" alt="Speaker" width={"20px"} />
            <p id="time">{time}</p>
        </div>
    )
}