import React from 'react';
import { useRouter } from 'next/router';

export default function Glass({ glass }) {

    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <div>
                {id}
            </div>
            {/* <h1>{glass.namn}</h1>
            <img src={`${glass.url}`}/> */}
        </>
    )
}

// export async function getStaticProps({ params }) {
//     const req = await fetch(`https://swedishicecream.herokuapp.com/pinnar/${(params.id.replace(/-/g, " "))}`);
//     const data = await req.json();

//     return {
//         props: {
//             glass: data
//         }
//     }
// }

// export async function getStaticPaths() {
//     const req = await fetch('https://swedishicecream.herokuapp.com/pinnar');
//     const data = await req.json();

//     const paths = data.map(glass => {
//         return { params: {id: glass.namn}}
//     });

//     return {
//         paths,
//         fallback: false
//     };
// }