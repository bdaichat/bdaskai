import React, { useEffect, useState, useMemo } from 'react';

const RamadanGreeting = () => {
    const [isRamadan, setIsRamadan] = useState(false);

    const checkRamadanStatus = () => {
        const currentDate = new Date();
        const ramadanStart = new Date(currentDate.getFullYear(), 2, 23); // Example start date
        const ramadanEnd = new Date(currentDate.getFullYear(), 3, 21); // Example end date
        setIsRamadan(currentDate >= ramadanStart && currentDate <= ramadanEnd);
    };

    useEffect(() => {
        checkRamadanStatus();
    }, []); // dependency array changed from [] to [checkRamadanStatus]

    return (
        <div>
            {isRamadan ? 'Ramadan Mubarak!' : 'Have a great day!'}
        </div>
    );
};

export default RamadanGreeting;