import Loader from '@/components/organs/loader';
import React from 'react';

const Loading: React.FC = () => {
    return (
        <Loader forceLoading={true} />
    );
};

export default Loading;