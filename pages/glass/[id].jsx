import React from 'react';
import { useRouter } from 'next/router';

function Glass() {

    const router = useRouter();
    const { id } = router.query;
    return (
        <div>
            {id}
        </div>
    )
}

export default Glass;