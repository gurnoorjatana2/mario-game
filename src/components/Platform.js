import React from 'react';

const Platform = ({ x, y }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: '100px',
                height: '20px',
                backgroundColor: 'brown',
            }}
        ></div>
    );
};

export default Platform;
