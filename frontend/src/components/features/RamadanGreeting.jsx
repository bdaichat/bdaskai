import React, { useEffect, useState } from 'react';

const RamadanGreeting = () => {
    const [isRamadan, setIsRamadan] = useState(false);

    useEffect(() => {
        const checkRamadanStatus = () => {
            const today = new Date();
            const startRamadan = new Date(today.getFullYear(), 3, 13); // Example Ramadan start date
            const endRamadan = new Date(today.getFullYear(), 4, 12); // Example Ramadan end date
            setIsRamadan(today >= startRamadan && today <= endRamadan);
        };
        checkRamadanStatus();
    }, []);

    return (
        <div>
            {isRamadan ? <h1>Ramadan Mubarak!</h1> : <h1>Welcome!</h1>}
        </div>
    );
};

export default RamadanGreeting;