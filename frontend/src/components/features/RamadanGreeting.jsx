import React, { useEffect, useState } from 'react';

const RamadanGreeting = () => {
    const [isRamadan, setIsRamadan] = useState(false);

    useEffect(() => {
        const checkRamadanStatus = () => {
            const today = new Date('2026-02-08'); // Current date
            const ramadanStart = new Date('2026-03-16'); // Hypothetical start date
            const ramadanEnd = new Date('2026-04-14'); // Hypothetical end date

            if (today >= ramadanStart && today <= ramadanEnd) {
                setIsRamadan(true);
            } else {
                setIsRamadan(false);
            }
        };

        checkRamadanStatus();
    }, []); // Empty dependency array

    return <div>{isRamadan ? 'Ramadan Mubarak!' : 'Have a great day!'}</div>;
};

export default RamadanGreeting;